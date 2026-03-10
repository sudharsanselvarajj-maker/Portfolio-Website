const { Engine, Runner, Bodies, Composite, Constraint } = Matter;

// Configuration — matches CSS dimensions
const config = {
    cardWidth: 260,
    cardHeight: 380,
    ropeLength: 100,
    anchorY: -10,
};

// Create engine with high precision
const engine = Engine.create({
    enableSleeping: false,
    positionIterations: 12,
    velocityIterations: 8,
});
engine.gravity.y = 0.8;

// Fixed timestep runner for consistent physics
const runner = Runner.create({
    delta: 1000 / 120,
    isFixed: true,
});
Runner.run(runner, engine);

// Elements
const wrapper = document.getElementById('hanging-id-wrapper');
const cardElement = document.getElementById('id-card');
const canvas = document.getElementById('physics-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to match wrapper
function resize() {
    const rect = wrapper.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}
window.addEventListener('resize', resize);
resize();

// Anchor at the top-center of the wrapper
function getAnchorX() {
    return wrapper.getBoundingClientRect().width / 2;
}

let anchorX = getAnchorX();
const anchor = { x: anchorX, y: config.anchorY };

// Create card body
const cardBody = Bodies.rectangle(
    anchor.x,
    anchor.y + config.ropeLength + config.cardHeight / 2,
    config.cardWidth,
    config.cardHeight,
    {
        chamfer: { radius: 18 },
        frictionAir: 0.015,
        restitution: 0.15,
        density: 0.001,
        friction: 0.1,
        slop: 0.01,
    }
);

// Create rope constraint
const rope = Constraint.create({
    pointA: anchor,
    bodyB: cardBody,
    pointB: { x: 0, y: -config.cardHeight / 2 },
    stiffness: 0.06,
    damping: 0.02,
    length: config.ropeLength,
});

// Add to world
Composite.add(engine.world, [cardBody, rope]);

// Interaction state
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let lastDragPos = { x: 0, y: 0 };
let dragVelocity = { x: 0, y: 0 };
let lastDragTime = 0;

function getLocalCoords(clientX, clientY) {
    const rect = wrapper.getBoundingClientRect();
    return {
        x: clientX - rect.left,
        y: clientY - rect.top,
    };
}

function startDrag(clientX, clientY) {
    isDragging = true;
    const local = getLocalCoords(clientX, clientY);
    dragOffset.x = local.x - cardBody.position.x;
    dragOffset.y = local.y - cardBody.position.y;
    lastDragPos = { x: local.x, y: local.y };
    dragVelocity = { x: 0, y: 0 };
    lastDragTime = performance.now();
}

function handleDrag(clientX, clientY) {
    if (!isDragging) return;

    const local = getLocalCoords(clientX, clientY);
    const now = performance.now();
    const dt = Math.max(now - lastDragTime, 1) / 1000;

    dragVelocity.x = (local.x - lastDragPos.x) / dt * 0.015;
    dragVelocity.y = (local.y - lastDragPos.y) / dt * 0.015;

    lastDragPos = { x: local.x, y: local.y };
    lastDragTime = now;

    const targetX = local.x - dragOffset.x;
    const targetY = local.y - dragOffset.y;

    const currentX = cardBody.position.x;
    const currentY = cardBody.position.y;
    const lerpFactor = 0.6;

    Matter.Body.setPosition(cardBody, {
        x: currentX + (targetX - currentX) * lerpFactor,
        y: currentY + (targetY - currentY) * lerpFactor,
    });

    Matter.Body.setVelocity(cardBody, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(cardBody, 0);
}

function endDrag() {
    if (!isDragging) return;
    isDragging = false;

    const clampedVx = Math.max(-15, Math.min(15, dragVelocity.x));
    const clampedVy = Math.max(-15, Math.min(15, dragVelocity.y));
    Matter.Body.setVelocity(cardBody, { x: clampedVx, y: clampedVy });
}

// Event Listeners
cardElement.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
});
window.addEventListener('mousemove', (e) => handleDrag(e.clientX, e.clientY));
window.addEventListener('mouseup', endDrag);

cardElement.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
    e.preventDefault();
}, { passive: false });

window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    handleDrag(touch.clientX, touch.clientY);
    e.preventDefault();
}, { passive: false });

window.addEventListener('touchend', endDrag);

// GPU hint
cardElement.style.willChange = 'transform';

// Animation loop
function update() {
    // Update anchor on resize
    anchorX = getAnchorX();
    rope.pointA.x = anchorX;

    // Resize canvas if needed
    const rect = wrapper.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    // Sync card DOM element with physics body
    const { x, y } = cardBody.position;
    const angle = cardBody.angle;

    cardElement.style.transform = `translate3d(${x - config.cardWidth / 2}px, ${y - config.cardHeight / 2}px, 0) rotate(${angle}rad)`;

    // --- Draw rope on canvas ---
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate attachment point on card (top-center, rotated)
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const attachX = x + (0 * cos - (-config.cardHeight / 2) * sin);
    const attachY = y + (0 * sin + (-config.cardHeight / 2) * cos);

    // Draw the rope/lanyard
    ctx.beginPath();
    ctx.moveTo(anchor.x, Math.max(anchor.y, 0));

    const dist = Math.hypot(attachX - anchor.x, attachY - anchor.y);
    if (dist < config.ropeLength) {
        const sag = (config.ropeLength - dist) * 0.4;
        const midX = (anchor.x + attachX) / 2;
        const midY = (anchor.y + attachY) / 2 + sag;
        ctx.quadraticCurveTo(midX, midY, attachX, attachY);
    } else {
        ctx.lineTo(attachX, attachY);
    }

    // Visible rope style — bright enough against dark bg
    ctx.strokeStyle = 'rgba(0, 242, 234, 0.5)';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Glow effect on rope
    ctx.beginPath();
    ctx.moveTo(anchor.x, Math.max(anchor.y, 0));
    if (dist < config.ropeLength) {
        const sag = (config.ropeLength - dist) * 0.4;
        const midX = (anchor.x + attachX) / 2;
        const midY = (anchor.y + attachY) / 2 + sag;
        ctx.quadraticCurveTo(midX, midY, attachX, attachY);
    } else {
        ctx.lineTo(attachX, attachY);
    }
    ctx.strokeStyle = 'rgba(0, 242, 234, 0.12)';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw clip at card attachment point
    ctx.beginPath();
    ctx.arc(attachX, attachY, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 242, 234, 0.6)';
    ctx.fill();

    // Draw anchor pin at top
    ctx.beginPath();
    ctx.arc(anchor.x, Math.max(anchor.y, 2), 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 242, 234, 0.7)';
    ctx.fill();

    // Anchor glow
    ctx.beginPath();
    ctx.arc(anchor.x, Math.max(anchor.y, 2), 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 242, 234, 0.1)';
    ctx.fill();

    requestAnimationFrame(update);
}

update();

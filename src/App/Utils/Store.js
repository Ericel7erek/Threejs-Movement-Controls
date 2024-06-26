import { createStore } from "zustand/vanilla";

export const sizesStore = createStore(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
}));

export const appStateStore = createStore(() => ({
    physicsReady: false,
    appReady: false,
}));
export const movingStore = createStore(() => ({
        moving:false
}));
export const playerMovements = createStore(() => ({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    super: false,
    descending: false,
    dance: false
}));
import { createStore } from "zustand/vanilla";

const assetsToLoad = [
  {
    id: "avatar",
    path: "/model/avatar.glb",
    type: "model"
  },
  { 
    type: 'cubeTexture', 
    path: '/Standard-Cube-Map (2)/', 
    id: 'backgroundTexture', 
    faces: ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'] 
  },
  {
    id: "planet",
    path: "/2k_mercury.jpg",
    type: "texture"
  },
];

const assetStore = createStore((set) => ({
  assetsToLoad,
  loadedAssets: {},
  addLoadedAsset: (asset, id) =>
    set((state) => ({
      loadedAssets: {
        ...state.loadedAssets,
        [id]: asset,
      },
    })),
}));

export default assetStore;

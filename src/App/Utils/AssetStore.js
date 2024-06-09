import { createStore } from "zustand/vanilla";

const assetsToLoad = [
  {
    id: "avatar",
    path: "/model/Avatarism.glb",
    type: "model"
  },
  { 
    type: 'cubeTexture', 
    path: '/Standard-Cube-Map (2)/', 
    id: 'backgroundTexture', 
    faces: ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'] 
  },
  { 
    type: 'texture', 
    path: '/broken_down_concrete2_bl/broken_down_concrete2_albedo.png', 
    id: 'texture', 
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

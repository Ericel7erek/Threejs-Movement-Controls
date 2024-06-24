import { createStore } from "zustand/vanilla";

const assetsToLoad = [
  {
    id: "avatar",
    path: "/model/Avatarism.glb",
    type: "model"
  },
  { 
    id: 'backgroundTexture', 
    path: '/Standard-Cube-Map (2)/', 
    type: 'cubeTexture', 
    faces: ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'] 
  },
  {
    id: "station",
    path: "/space_station_3/scene.gltf",
    type: "model"
  },
  {
    id: "Cinema",
    path: "/model/Cinema.glb",
    type: "model"
  }

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

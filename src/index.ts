import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/loaders/glTF";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true);

const loadingScreen = document.getElementById("loadingScreen") as HTMLElement;
const progressFill = document.getElementById("progressFill") as HTMLElement;
const progressText = document.getElementById("progressText") as HTMLElement;

const hideLoadingScreen = () => {
    loadingScreen.classList.add("hidden");
    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 500);
};

const updateProgress = (progress: number) => {
    const percentage = Math.round(progress * 100);
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;
};

const createScene = () => {
    const scene = new Scene(engine);

    const camera = new UniversalCamera("camera1", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    camera.keysUp = [87]; // W
    camera.keysDown = [83]; // S
    camera.keysLeft = [65]; // A
    camera.keysRight = [68]; // D

    camera.speed = 0.5;
    camera.angularSensibility = 2000;

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    
    SceneLoader.ImportMesh("", "assets/radford_model/", "radford.gltf", scene, 
        (meshes) => {
            hideLoadingScreen();
        }, 
        (progress) => {
            if (progress.lengthComputable) {
                const loadedPercent = progress.loaded / progress.total;
                updateProgress(loadedPercent);
            }
        },
        (error) => {
            console.error("Detailed error:", error);
            hideLoadingScreen();
        }
    );

    return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});
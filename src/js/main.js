import * as THREE from "three";
import Texture from "../assets/img/ponyo2.jpg";
// import Texture from "../assets/img/ponyo1.jpg";
import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";
import gsap from "gsap";

const canvas = document.querySelector("#canvas");
if (!canvas) {
  throw new Error("canvas not found");
}
const windowSize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspect = width / height;
  return { width, height, aspect };
};
// const getShader = (type) => {
//   const script = document.querySelector(`#${type}`);
//   if (!script) {
//     throw new Error(`script not found: ${type}`);
//   }
//   return script.innerText;
// };
const app = (texture) => {
  const { width, height, aspect } = windowSize();
  // rendererの作成
  const renderer = new THREE.WebGLRenderer({
    canvas,
  });
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  // sceneの作成
  const scene = new THREE.Scene();

  // cameraの作成
  const camera = new THREE.OrthographicCamera();
  camera.matrixAutoUpdate = false;

  // textureのアスペクト比を取得
  const textureImg = texture.image;
  const textureAspect = textureImg.width / textureImg.height;
  let targetSpeed = 0;
  let speed = 0;
  let followMouse = new THREE.Vector2();
  let prevMouse = new THREE.Vector2();
  let getmouse = new THREE.Vector2();
  //
  // geometryの作成
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: {
        value: texture,
      },
      uScreenAspect: {
        value: aspect,
      },
      uTextureAspect: {
        value: textureAspect,
      },
      uValue: {
        value: 0,
      },
      uTime: {
        value: 0,
      },
      uMouse: {
        value: new THREE.Vector2(0.5, 0.5),
      },
      uVelo: {
        value: 0,
      },
      resolution: { value: new THREE.Vector2(1, window.innerHeight / window.innerWidth) },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
  });
  function mouse() {
    window.addEventListener("mousemove", (e) => {
      getmouse.x = e.clientX / window.innerWidth;
      getmouse.y = 1 - e.clientY / window.innerHeight;
      material.uniforms.uMouse.value = new THREE.Vector2(getmouse.x, getmouse.y);
    });
  }
  mouse();
  function getSpeed() {
    speed = Math.sqrt((prevMouse.x - getmouse.x) ** 2 + (prevMouse.y - getmouse.y) ** 2);
    targetSpeed -= 0.1 * (targetSpeed - speed);
    followMouse.x -= 0.1 * (followMouse.x - getmouse.x);
    followMouse.y -= 0.1 * (followMouse.y - getmouse.y);
    prevMouse.x = getmouse.x;
    prevMouse.y = getmouse.y;
  }

  let isFlag = false;
  window.addEventListener("click", (event) => {
    if (isFlag == false) {
      gsap.to(material.uniforms.uValue, {
        value: 1,
        duration: 2,
        ease: "power3.out",
      });
      isFlag = true;
    } else {
      gsap.to(material.uniforms.uValue, {
        value: 0,
        duration: 2,
        ease: "power3.in",
      });
      isFlag = false;
    }
  });
  // meshの作成
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  const clock = new THREE.Clock();
  const animate = () => {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;
    getSpeed();
    material.uniforms.uVelo.value = Math.min(targetSpeed, 0.05);
    targetSpeed *= 0.999;
    console.log(material.uniforms.uVelo.value);
    renderer.render(scene, camera);
  };
  animate();
  const onResize = () => {
    const { width, height, aspect } = windowSize();
    // uniformで渡しているwindowのアスペクト比を更新
    material.uniforms.uScreenAspect.value = aspect;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    console.log(material.uniforms.uScreenAspect.value);
  };
  window.addEventListener("resize", onResize);
};
const init = async () => {
  const texture = await new THREE.TextureLoader().loadAsync(Texture);
  app(texture);
};
init();

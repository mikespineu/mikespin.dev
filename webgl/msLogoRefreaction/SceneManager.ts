import {
    Color,
    DirectionalLight,
    IcosahedronGeometry,
    Mesh,
    MeshNormalMaterial,
    MeshPhysicalMaterial,
    PlaneGeometry,
    Scene,
    ShaderMaterial,
    Vector2
} from "three";

// @ts-ignore
import fragmentShader from "./fragmentShader.glsl";
// @ts-ignore
import vertexShader from "./vertexShader.glsl";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export default class SceneManager extends Scene{
    private readonly gltfLoader = new GLTFLoader();
    private plane = {} as Mesh;
    private logo = {} as Mesh;
    palette: Color[]
    constructor({ palette } : { palette: Color[] }) {
        super();
        this.palette = palette;
    }

    async initialize() {
        this.createBackground()
        await this.createLogo();
        this.createLight();
    }

    createBackground() {
        const geometry = new PlaneGeometry( 10, 8, 100, 100 )
        const material = new ShaderMaterial( {
            uniforms: {
                time: { value: 1.0 },
                resolution: { value: new Vector2() },
                uColor: { value: this.palette },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        } );
        this.plane = new Mesh( geometry, material );
        this.add(this.plane);
    }

    async createLogo() {
        this.loadModel();;
        // this.add(logo);
        const geometry = new IcosahedronGeometry(0.3, 0);
        // const material = new MeshNormalMaterial();
        const material = new MeshPhysicalMaterial({
            // metalness: 0,
            roughness: 0.7,
            transmission: 1,
            // @ts-ignore
            thickness: 1
        });
        const mesh = new Mesh(geometry, material)
        this.add(mesh);
    }

    createLight() {
        const light = new DirectionalLight(new Color(0xfff0dd), 1);
        light.position.set(0, 5, 10);
        this.add(light);
    }

    loadModel() {
         this.gltfLoader.load(
            '/ms3-modifer.glb',
            (gltf) => {
                const logo = gltf.scene.children.find((mesh) => mesh.name === 'Curve') as Mesh;
                this.add(logo);
                const geometry = logo.geometry.clone()


                // geometry.rotateX(Math.PI / 2);

                const material = new MeshPhysicalMaterial({
                    // metalness: 0,
                    roughness: 0.7,
                    transmission: 1,
                    // @ts-ignore
                    thickness: 1
                });

                const mesh = new Mesh(geometry, material);
                mesh.name = 'logo';
                console.log('mesh', mesh, this);
                this.add(mesh);
            },
        ); }


    update() {
        // @ts-ignore
        this.plane.material.uniforms.time.value += 0.0002;
    }
}

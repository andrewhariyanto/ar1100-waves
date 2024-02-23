// import our three.js reference
import * as THREE from 'https://unpkg.com/three/build/three.module.js'
import { Pane } from 'https://unpkg.com/tweakpane'

const app = {
  init() {
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
    this.camera.position.z = 50

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(this.renderer.domElement)

    this.createLights()
    this.knot = this.createKnot()

    // ...the rare and elusive hard binding appears! but why?
    this.render = this.render.bind(this)
    this.render()

    // create a new tweakpane instance
    this.pane = new Pane()
    // setup our pane to control the know rotation on the y axis
    this.pane.addBinding(this.knot.rotation, 'y')
  },

  createLights() {
    const pointLight = new THREE.DirectionalLight(0xcccccc, 2)
    this.scene.add(pointLight)
  },
  createKnot() {
    const knotgeo = new THREE.TorusKnotGeometry(10, .5, 128, 16, 5, 21)
    const mat = new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 2000 })
    const knot = new THREE.Mesh(knotgeo, mat)

    this.scene.add(knot)
    return knot
  },
  render() {
    this.knot.rotation.x += .025
    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(this.render)
  }
}

window.onload = () => app.init()
AFRAME.registerComponent("destroy-at-extreme-distances", {
  schema: {
    xMin: { default: -1000 },
    xMax: { default: 1000 },
    yMin: { default: -1000 },
    yMax: { default: 1000 },
    zMin: { default: -1000 },
    zMax: { default: 1000 }
  },

  tick: (function() {
    const pos = new THREE.Vector3();
    return function() {
      const { xMin, xMax, yMin, yMax, zMin, zMax } = this.data;
      this.el.object3D.getWorldPosition(pos);
      this.el.parentNode === this.el.sceneEl
        ? pos.copy(this.el.object3D.position)
        : this.el.object3D.getWorldPosition(pos);
      if (pos.x < xMin || pos.x > xMax || pos.y < yMin || pos.y > yMax || pos.z < zMin || pos.z > zMax) {
        this.el.parentNode.removeChild(this.el);
      }
    };
  })()
});

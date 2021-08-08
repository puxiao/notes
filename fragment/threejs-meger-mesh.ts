import {
  BufferGeometry,
  BufferGeometryUtils,
  DoubleSide,
  Mesh,
  MeshLambertMaterial,
  Scene,
} from "three";

const scene = new Scene(); // Suppose we have a scene

// Get the objects.
const importedObjects = scene.getObjectByName("Part_Group");

// Check we have found the Objects.
if (importedObjects !== undefined) {
  // Create an empty Object to hold the Geometry.
  let geometryArray: BufferGeometry[] = [];

  // Create a material.
  const objectMaterial = new MeshLambertMaterial({
    color: 0xffff00,
    side: DoubleSide,
  });

  // Iterate through the children
  importedObjects.children.forEach((child) => {
    if (child instanceof Mesh) {
      // Create a clone of the current child Mesh's geometry.
      const geometryClone = child.geometry.clone();

      // Bake the current child's world transform matrix into the new clone.
      geometryClone.applyMatrix4(child.matrixWorld);

      // Add the cloned geometry into the array.
      geometryArray.push(geometryClone);
    }
  });

  let mergedGeom = new BufferGeometry();
  mergedGeom = BufferGeometryUtils.mergeBufferGeometries(geometryArray);

  // Create a Mesh from the Geometry.
  const mergedMesh = new Mesh(mergedGeom, objectMaterial);

  // As the object is not moving, prevent THREE from calculating the object's position.
  mergedMesh.matrixAutoUpdate = false;

  // Add the Mesh to the scene.
  scene.add(mergedMesh);
  
}

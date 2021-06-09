import { OptionMap } from './utility/optionalmap';
import { mapToOptionMap, ifblock, block, mapNotNone } from './utility/functional';
import * as BABYLON from 'babylonjs';
import { IVertex, IPoint, IModel } from '../tool/services/projectload.service';
import { flatten } from 'fp-ts/lib/Array';

export const inflateModel = (model: IModel) => {

  const vertexMap = mapToOptionMap<IVertex, string, IPoint>(
    model.data.model.vertices, (vertex: IVertex) => [vertex.id, vertex.point]);

  const displacementMap = block<Array<{ id: string, point: { x: number, y: number } }>, OptionMap<string, BABYLON.Vector2>>(
    mapNotNone(model.data.model.ground, vertexid => {
      return vertexMap.get(vertexid).map(point => {
        return { id: vertexid, point: { x: point.x, y: point.z } };
      });
    })).let((points: Array<{ id: string, point: { x: number, y: number } }>) => {
      const outerSign = Math.sign(points.map((node: { id: string, point: { x: number, y: number } }, index: number) => {
        const point = node.point;
        const previousPoint = points[(index - 1 + points.length) % points.length].point;
        const nextPoint = points[(index + 1 + points.length) % points.length].point;
        const v1 = (new BABYLON.Vector2(point.x - previousPoint.x, point.y - previousPoint.y)).normalize();
        const v2 = (new BABYLON.Vector2(nextPoint.x - point.x, nextPoint.y - point.y)).normalize();
        return v1.x * v2.y - v1.y * v2.x;
      }).reduce((a, b) => a + b, 0));
      return mapToOptionMap(points.map((node: { id: string, point: { x: number, y: number } }, index: number) => {
        const point = node.point;
        const previousPoint = points[(index - 1 + points.length) % points.length].point;
        const nextPoint = points[(index + 1 + points.length) % points.length].point;
        const v1 = (new BABYLON.Vector2(point.x - previousPoint.x, point.y - previousPoint.y)).normalize();
        const v2 = (new BABYLON.Vector2(nextPoint.x - point.x, nextPoint.y - point.y)).normalize();
        return ifblock<[string, BABYLON.Vector2]>(((v1.x === v2.x) && (v1.y === v2.y))).let(
          () => {
            return [node.id, new BABYLON.Vector2(v1.y, -v1.x).scale(0.15 * outerSign)];
          },
          () => {
            const v3 = (v1.subtract(v2)).normalize();
            const scale = 0.15 / Math.abs(v3.x * v2.y - v3.y * v2.x);
            return [node.id, v3.scale(scale * outerSign * Math.sign(v1.x * v2.y - v1.y * v2.x))];
          }
        );
      }), x => x);
    });

  return mapNotNone(model.data.model.faces, face => {
    const [node1, node2, node3, node4] = face.vertices as [string, string, string, string];
    return displacementMap.get(node1).chain((displacement1: BABYLON.Vector2) => {
      return displacementMap.get(node2).chain((displacement2: BABYLON.Vector2) => {
        return vertexMap.get(node1).chain(point1 => {
          return vertexMap.get(node2).chain(point2 => {
            return vertexMap.get(node3).chain(point3 => {
              return vertexMap.get(node4).map(point4 => {

                const windows = face.windows.map((window: Array<string>) => mapNotNone(window, (vertexid: string) => {
                  return vertexMap.get(vertexid);
                }));

                const doors = face.doors.map((door: Array<string>) => mapNotNone(door, (vertexid: string) => {
                  return vertexMap.get(vertexid);
                }));

                // tslint:disable-next-line:no-shadowed-variable
                const getNormalDisplacement = (point1: IPoint, point2: IPoint, displacement: BABYLON.Vector2): BABYLON.Vector2 => {
                  const retVector = new BABYLON.Vector2(point2.z - point1.z, point1.x - point2.x);
                  retVector.normalize();
                  return retVector.scale(BABYLON.Vector2.Dot(retVector, displacement));
                };

                const [displacement1b3, displacement2b3, displacement3b3] =
                  [displacement1, displacement2, getNormalDisplacement(point1, point2, displacement1)].
                    map(displacement => new BABYLON.Vector3(displacement.x, 0, displacement.y)) as
                  [BABYLON.Vector3, BABYLON.Vector3, BABYLON.Vector3];

                // tslint:disable-next-line:max-line-length
                const [point1b3, point2b3, point3b3, point4b3] = ([point1, point2, point3, point4].map(point => new BABYLON.Vector3(point.x, point.y, point.z))) as
                  [BABYLON.Vector3, BABYLON.Vector3, BABYLON.Vector3, BABYLON.Vector3];
                const point5b3 = point1b3.add(displacement1b3);
                const point6b3 = point2b3.add(displacement2b3);
                const point7b3 = point3b3.add(displacement2b3);
                const point8b3 = point4b3.add(displacement1b3);
                const flip = BABYLON.Vector3.Dot(BABYLON.Vector3.Cross(point1b3.subtract(point4b3), point2b3.subtract(point1b3)),
                  displacement3b3) > 0;
                return {
                  face: flip ? [point4b3, point3b3, point2b3, point1b3, point8b3, point7b3, point6b3, point5b3] :
                  [point1b3, point2b3, point3b3, point4b3, point5b3, point6b3, point7b3, point8b3],
                  windows: windows.map(hole => hole.map(vector => new BABYLON.Vector3(vector.x, vector.y, vector.z))),
                  doors: doors.map(hole => hole.map(vector => new BABYLON.Vector3(vector.x, vector.y, vector.z)))
                };
              });
            });
          });
        });
      });
    });
  });
};


export const inflateFloorplan = (model: IModel): {sections: Array<Array<{x: number, y: number}>>,
    windows: Array<Array<{x: number, y: number}>>,
    doors: Array<Array<{x: number, y: number}>>} => {

  if (model.data.floorplan === null || model.data.floorplan === undefined) {
    return {sections: [], doors: [], windows: []};
  }

  const vertexMap = mapToOptionMap<{id: string, point: {x: number, y: number}}, string, {x: number, y: number}>(
    model.data.floorplan.vertices, vertex => [vertex.id, vertex.point]);

  const displacementMap = mapToOptionMap<{id: string, vector: {x: number, y: number}}, string, {x: number, y: number}>(
    model.data.floorplan.displacements, vertex => [vertex.id, vertex.vector]);

  const outerSign = block<Array<{ id: string, point: { x: number, y: number } }>, any>(
      mapNotNone(model.data.model.ground, vertexid => {
        return vertexMap.get(vertexid).map(point => {
          return { id: vertexid, point: { x: point.x, y: point.y } };
        });
      })).let((points: Array<{ id: string, point: { x: number, y: number } }>) => {
        return Math.sign(points.map((node: { id: string, point: { x: number, y: number } }, index: number) => {
          const point = node.point;
          const previousPoint = points[(index - 1 + points.length) % points.length].point;
          const nextPoint = points[(index + 1 + points.length) % points.length].point;
          const v1 = (new BABYLON.Vector2(point.x - previousPoint.x, point.y - previousPoint.y)).normalize();
          const v2 = (new BABYLON.Vector2(nextPoint.x - point.x, nextPoint.y - point.y)).normalize();
          return v1.x * v2.y - v1.y * v2.x;
        }).reduce((a, b) => a + b, 0));
      });

  const sections = flatten(model.data.floorplan.walls.map( wall => mapNotNone(wall.sections, (section: [string, string]) => {
    return vertexMap.get(section[0]).chain(p1 => {
      return vertexMap.get(section[1]).chain(p2 => {
        return displacementMap.get(section[0]).chain(p4 => {
          return displacementMap.get(section[1]).map(p3 => {
            return outerSign > 0 ? [p1, p2, {x: p2.x + p3.x, y: p2.y + p3.y}, {x: p1.x + p4.x, y: p1.y + p4.y}] :
              [p2, p1, {x: p1.x + p4.x, y: p1.y + p4.y}, {x: p2.x + p3.x, y: p2.y + p3.y}];
          });
        });
      });
    });
  })));

  const windows = flatten(model.data.floorplan.walls.map( wall => mapNotNone(wall.windows, (section: [string, string]) => {
    return vertexMap.get(section[0]).chain(p1 => {
      return vertexMap.get(section[1]).chain(p2 => {
        return displacementMap.get(section[0]).chain(p4 => {
          return displacementMap.get(section[1]).map(p3 => {
            return outerSign > 0 ? [p1, p2, {x: p2.x + p3.x, y: p2.y + p3.y}, {x: p1.x + p4.x, y: p1.y + p4.y}] :
              [p2, p1, {x: p1.x + p4.x, y: p1.y + p4.y}, {x: p2.x + p3.x, y: p2.y + p3.y}];
          });
        });
      });
    });
  })));

  const doors = flatten(model.data.floorplan.walls.map( wall => mapNotNone(wall.doors, (section: [string, string]) => {
    return vertexMap.get(section[0]).chain(p1 => {
      return vertexMap.get(section[1]).chain(p2 => {
        return displacementMap.get(section[0]).chain(p4 => {
          return displacementMap.get(section[1]).map(p3 => {
            return outerSign > 0 ? [p1, p2, {x: p2.x + p3.x, y: p2.y + p3.y}, {x: p1.x + p4.x, y: p1.y + p4.y}] :
              [p2, p1, {x: p1.x + p4.x, y: p1.y + p4.y}, {x: p2.x + p3.x, y: p2.y + p3.y}];
          });
        });
      });
    });
  })));

  return {sections, doors, windows};

};

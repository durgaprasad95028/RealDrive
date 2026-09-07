import * as THREE from 'three';
import { NavigationInstruction, RoadSegment, Waypoint } from '../types';

export class NavigationSystem {
  private waypoints: Waypoint[];
  private roadSegments: RoadSegment[];
  private destination: Waypoint;
  private currentWaypointIndex = 0;

  constructor(waypoints: Waypoint[], roadSegments: RoadSegment[]) {
    this.waypoints = waypoints;
    this.roadSegments = roadSegments;
    this.destination = waypoints[waypoints.length - 1];
  }

  public update(playerPos: THREE.Vector3): {
    instruction: NavigationInstruction;
    currentStreet: string;
    distanceToDestination: number;
    isDestinationReached: boolean;
  } {
    const distToDest = playerPos.distanceTo(this.destination.position);

    // 1. Destination Check (< 12m radius)
    if (distToDest < 14) {
      return {
        instruction: {
          action: 'destination',
          text: 'DESTINATION REACHED',
          streetName: this.destination.name,
          distance: Math.round(distToDest),
        },
        currentStreet: this.destination.name,
        distanceToDestination: Math.round(distToDest),
        isDestinationReached: true,
      };
    }

    // 2. Identify Current Street
    let currentStreet = 'Metro Parkway';
    if (playerPos.z > 770 && playerPos.z < 830 && playerPos.x > 50) {
      currentStreet = 'Airport Highway';
    } else if (playerPos.x > 250 && playerPos.z > 820) {
      currentStreet = 'Terminal Way';
    } else if (playerPos.z > 270 && playerPos.z < 330) {
      currentStreet = 'Grand Avenue';
    }

    // 3. Navigation Step Logic
    let instruction: NavigationInstruction;

    if (playerPos.z < 700) {
      const distToTurn = 800 - playerPos.z;
      if (distToTurn > 120) {
        instruction = {
          action: 'straight',
          text: 'CONTINUE STRAIGHT ON METRO PKWY',
          streetName: 'Metro Parkway',
          distance: Math.round(distToTurn),
        };
      } else {
        instruction = {
          action: 'right',
          text: 'TURN RIGHT ONTO AIRPORT HIGHWAY',
          streetName: 'Airport Highway',
          distance: Math.round(distToTurn),
        };
      }
    } else if (playerPos.z >= 700 && playerPos.x < 250) {
      const distToTurn = 300 - playerPos.x;
      if (distToTurn > 60) {
        instruction = {
          action: 'straight',
          text: 'CONTINUE ON AIRPORT HIGHWAY',
          streetName: 'Airport Highway',
          distance: Math.round(distToTurn),
        };
      } else {
        instruction = {
          action: 'left',
          text: 'TURN LEFT ONTO TERMINAL WAY',
          streetName: 'Terminal Way',
          distance: Math.round(distToTurn),
        };
      }
    } else {
      instruction = {
        action: 'straight',
        text: 'APPROACHING PASSENGER TERMINAL',
        streetName: 'Terminal Way',
        distance: Math.round(distToDest),
      };
    }

    return {
      instruction,
      currentStreet,
      distanceToDestination: Math.round(distToDest),
      isDestinationReached: false,
    };
  }
}

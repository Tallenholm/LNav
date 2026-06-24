import { useEffect, useRef, useState } from 'react';
import { useMap, useMapsLibrary, Map } from '@vis.gl/react-google-maps';
import type { Waypoint, TruckProfile, RoutingOptions } from '../types';

interface Props {
  waypoints: Waypoint[] | null;
  truckProfile: TruckProfile;
  routingOptions: RoutingOptions;
}

function RoutePolyline({ waypoints, truckProfile, routingOptions }: { waypoints: Waypoint[], truckProfile: TruckProfile, routingOptions: RoutingOptions }) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !waypoints || waypoints.length < 2) return;

    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    const validWaypoints = waypoints.filter(w => w.address.trim().length > 0);
    if (validWaypoints.length < 2) return;

    const origin = validWaypoints[0].address;
    const destination = validWaypoints[validWaypoints.length - 1].address;
    
    // intermediates max is 25 for standard computeRoutes request
    const intermediates = validWaypoints.slice(1, -1).slice(0, 23).map(w => ({
      address: w.address
    }));

    routesLib.Route.computeRoutes({
      origin,
      destination,
      intermediates: intermediates.length > 0 ? intermediates : undefined,
      travelMode: 'DRIVING',
      routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
      routeModifiers: {
        avoidTolls: routingOptions.avoidTolls,
        avoidHighways: routingOptions.avoidHighways
      },
      optimizeWaypointOrder: routingOptions.optimizeRoute && intermediates.length > 0,
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport', 'speedPaths'],
    }).then(({ routes }) => {
      if (routes?.[0]) {
        // Since fields includes 'speedPaths', createPolylines might generate traffic-colored segments
        const newPolylines = routes[0].createPolylines();
        newPolylines.forEach(p => p.setMap(map));
        polylinesRef.current = newPolylines;
        if (routes[0].viewport) map.fitBounds(routes[0].viewport);
      }
    }).catch(err => {
      console.warn("Map routing failed (AI analysis continues):", err);
    });

    return () => polylinesRef.current.forEach(p => p.setMap(null));
  }, [routesLib, map, waypoints, truckProfile, routingOptions]);

  return null;
}

export default function RouteMap({ waypoints, truckProfile, routingOptions }: Props) {
  return (
    <Map
      defaultCenter={{ lat: 39.8283, lng: -98.5795 }} // Center of US
      defaultZoom={4}
      mapId="TRUCK_ROUTING_MAP_ID"
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      style={{ width: '100%', height: '100%' }}
      disableDefaultUI={true}
      gestureHandling="greedy"
      colorScheme="DARK"
    >
      <RoutePolyline waypoints={waypoints || []} truckProfile={truckProfile} routingOptions={routingOptions} />
    </Map>
  );
}

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import tw from "twrnc";
import { selectDestination, selectOrigin, setTravelTimeInformation } from './slices/navSlice';
import { useDispatch, useSelector } from 'react-redux';
import MapViewDirections from 'react-native-maps-directions';

const Map= () =>{
    const origin= useSelector(selectOrigin);
    const destination= useSelector(selectDestination)
    const mapRef= useRef(null);
    const dispatch=useDispatch();


    useEffect (()=>{
       if (!origin || !destination ) return;

      mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
        edgePadding:{top:50, right:50, bottom:50, left:50},
        animated: true,
      });
    }, [origin, destination])

    useEffect(()=>{

        if(!origin || !destination ) return;
        const getTravelTime = async() =>{
            fetch(
                `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destination.description}&origins=${origin.description}&units=imperial&key=${'AIzaSyDD3YDR3dpGM9H6k_D-a0jpQWOT3m1lD_A'}`

                
            )
                .then(res=>res.json())
                .then(data=>{
                    dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
            });
            
        };

        getTravelTime();
    }, [origin, destination, apikey='AIzaSyDD3YDR3dpGM9H6k_D-a0jpQWOT3m1lD_A'])

    return(
        <MapView
        ref={mapRef}
            style={tw `flex-1`}
            mapType= "mutedStandard"
            initialRegion={{
                latitude: origin.location.lat,
                longitude: origin.location.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }}
        >

            {origin && destination &&(
                <MapViewDirections
                    origin={origin.description}
                    destination={destination.description}
                    apikey='AIzaSyDD3YDR3dpGM9H6k_D-a0jpQWOT3m1lD_A'
                    strokeWidth={3}
                    strokeColor='black'
                />
            )}       
            {origin?.location &&(
                <Marker
                    coordinate={{
                        latitude: origin.location.lat,
                        longitude: origin.location.lng,
                    }}
                    title="Origin"
                    description={origin.description}
                    identifier="origin"
                />
            )}
            {destination?.location &&(
                <Marker
                    coordinate={{
                        latitude: destination.location.lat,
                        longitude: destination.location.lng,
                    }}
                    title="Destination"
                    description={destination.description}
                    identifier="destination"
                />
            )}



        </MapView>
    );
};

export default Map;


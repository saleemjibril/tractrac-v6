import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
    apiKey: 'AIzaSyBWo_tQ4rjQkZz1kN5WXfnemHCaF0gQ8BU',
    version: 'weekly',
    libraries: ['places', 'geometry', 'marker'],
  });
  
export default loader;
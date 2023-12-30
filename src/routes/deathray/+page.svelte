<script>
    let orbitalAltitude = 2000; // meters
    let mirrorDiameter = 2.5; // meters
    let focalPointSize = 0.05; // meters
  
    const SUN_INTENSITY = 1361; // Solar constant (W/m^2)
    const MIRROR_EFFICIENCY = 0.85; // Mirror's reflection efficiency
    const SPECIFIC_HEAT_CAPACITY = 550; // J/kg K for regolith
    const REGOLITH_DENSITY = 1500; // kg/m3 for regolith
    const BASE_TEMPERATURE = 250; // Average lunar surface temperature in Kelvin
  
    let heatFlux = 0;
    let temperature = 0;
  
    function calculateMirrorDiameter(focalPointSize, orbitalAltitude) {
      return focalPointSize * Math.sqrt(orbitalAltitude);
    }
  
    function calculateHeatFlux(mirrorDiameter, focalPointSize) {
      const mirrorArea = Math.PI * (mirrorDiameter / 2) ** 2;
      const totalSolarPower = SUN_INTENSITY * mirrorArea * MIRROR_EFFICIENCY;
      return totalSolarPower / (Math.PI * (focalPointSize / 2) ** 2);
    }
  
    function calculateTemperature(heatFlux) {
      const focalPointArea = Math.PI * (focalPointSize / 2) ** 2;
      const affectedVolume = focalPointArea * 0.01; // Assuming 1 cm depth
      const regolithMass = affectedVolume * REGOLITH_DENSITY;
      const energyAbsorbed = heatFlux * focalPointArea * 3600; // Exposure time = 3600 seconds
      return BASE_TEMPERATURE + energyAbsorbed / (regolithMass * SPECIFIC_HEAT_CAPACITY);
    }
  
    function updateCalculations() {
      mirrorDiameter = calculateMirrorDiameter(focalPointSize, orbitalAltitude);
      heatFlux = calculateHeatFlux(mirrorDiameter, focalPointSize);
      temperature = calculateTemperature(heatFlux);
    }
  </script>
    
  <!-- <div class="bg-gray-800 p-8 m-32 rounded-3xl text-white"> -->


  <div class="bg-gray-800 p-8 m-32 rounded-3xl text-white">
    <h1 class="text-2xl font-bold mb-4">Lunar Death Ray Orbiter Model</h1>
    
    <div class="mb-3">
      <label for="orbitalAltitude" class="block text-lg mb-2">Orbital Altitude (meters):</label>
      <input id="orbitalAltitude" type="number" bind:value={orbitalAltitude} on:input={updateCalculations}
             class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
    </div>
    
    <div class="mb-3">
      <label for="mirrorDiameter" class="block text-lg mb-2">Mirror Diameter (meters):</label>
      <input id="mirrorDiameter" type="number" bind:value={mirrorDiameter} on:input={updateCalculations}
             class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
    </div>
    
    <div class="mb-3">
      <label for="focalPointSize" class="block text-lg mb-2">Focal Point Size (meters):</label>
      <input id="focalPointSize" type="number" bind:value={focalPointSize} on:input={updateCalculations}
             class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
    </div>
    
    <div class="mt-4">
      <p class="text-lg">Heat Flux at Lunar Surface: {heatFlux.toFixed(2)} W/m^2</p>
      <p class="text-lg">Calculated Temperature at Focal Point: {temperature.toFixed(2)} K</p>
    </div>
  </div>
  
  <style>
    /* Add your styling here */
  </style>
  
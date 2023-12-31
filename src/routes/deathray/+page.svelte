<script>
    import { writable } from 'svelte/store';

    // Writable stores for variable values
    const orbitalAltitude = writable(2000);
    const mirrorDiameter = writable(2.5);
    const focalPointSize = writable(0.05);
    const temperature = writable(1000);

    // Constants for calculations
    const SUN_INTENSITY = 1361; // Solar constant (W/m^2)
    const MIRROR_EFFICIENCY = 0.85; // Mirror's reflection efficiency
    const SPECIFIC_HEAT_CAPACITY = 550; // J/kg K for regolith
    const REGOLITH_DENSITY = 1500; // kg/m3 for regolith
    const BASE_TEMPERATURE = 250; // Average lunar surface temperature in Kelvin

    let activeVariables = ['orbitalAltitude', 'mirrorDiameter'];

    // Active variables array
    const pairs = [
        { name: 'Orbital Altitude & Mirror Diameter', variables: ['orbitalAltitude', 'mirrorDiameter'] },
        { name: 'Mirror Diameter & Focal Point Size', variables: ['mirrorDiameter', 'focalPointSize'] },
        { name: 'Focal Point Size & Orbital Altitude', variables: ['focalPointSize', 'orbitalAltitude'] }
    ];

    let selectedPair = pairs[0]; // Default to the first pair

    // Function to toggle active status of variables
    function selectPair(pair) {
        selectedPair = pair;
        activeVariables = pair.variables;
        performCalculations();
    }

    // Function to perform calculations
    function performCalculations() {
        orbitalMechanics();
        calculateTemperature();
        calculateMirrorDiameter();
        heatFluxCalculation();
    }

    // Calculation function for Temperature
// Orbital Mechanics (Placeholder Function)
function orbitalMechanics(orbitalAltitude, exposureTime) {
    return { orbitalAltitude, exposureTime };
}

// Mirror Diameter Calculation
function calculateMirrorDiameter(focalPointSize, orbitalAltitude) {
    const mirrorDiameter = focalPointSize * Math.sqrt(orbitalAltitude);
    return mirrorDiameter;
}

// Heat Flux Calculation
function heatFluxCalculation(mirrorDiameter, focalPointSize) {
    const mirrorArea = Math.PI * (mirrorDiameter / 2) ** 2;
    const totalSolarPower = SUN_INTENSITY * mirrorArea * MIRROR_EFFICIENCY;
    const heatFlux = totalSolarPower / (Math.PI * (focalPointSize / 2) ** 2);
    return heatFlux;
}

// Temperature Calculation
function calculateTemperature(heatFlux, focalPointSize, exposureTime) {
    const affectedDepth = 0.5;  // Assuming a fixed depth of 0.5 meters
    const focalPointArea = Math.PI * (focalPointSize / 2) ** 2;
    const affectedVolume = focalPointArea * affectedDepth;
    const regolithMass = affectedVolume * REGOLITH_DENSITY;
    const energyAbsorbed = heatFlux * focalPointArea * exposureTime;
    const temperatureIncrease = energyAbsorbed / (regolithMass * SPECIFIC_HEAT_CAPACITY);
    const baseTemperature = 250; // Average lunar surface temperature in Kelvin
    const finalTemperature = baseTemperature + temperatureIncrease;

    return finalTemperature;
}
</script>

<div class="bg-gray-900 p-6 m-32 rounded-xl text-white">
    <h1 class="text-3xl font-bold mb-6">Lunar Death Ray Orbiter Model</h1>

    <!-- Tab Selector for Pre-Made Pairs -->
    <div class="flex border-b border-gray-700">
        {#each pairs as pair}
            <button
                class="py-2 px-4 text-sm font-medium text-gray-500 border-b-2 
                       {selectedPair === pair ? 'border-blue-500 text-blue-500' : 'border-transparent hover:text-gray-300 hover:border-gray-300'}"
                on:click={() => selectPair(pair)}>
                {pair.name}
            </button>
        {/each}
    </div>
    
    <!-- Orbit Section -->
    <div class="bg-gray-800 p-4 rounded-lg mb-6">
        <label for="orbitalAltitudeSlider" class="block text-lg mb-2">Orbital Altitude (meters):</label>
        <input id="orbitalAltitudeSlider" type="range" min="0" max="300000" bind:value={$orbitalAltitude}
               on:input={performCalculations} class="slider w-full" />
        <p class="text-lg mt-2">Current Altitude: {$orbitalAltitude} meters</p>
    </div>
    
    <!-- Mirror Section -->
    <div class="bg-gray-800 p-4 rounded-lg mb-6">
        <label for="mirrorDiameter" class="block text-lg mb-2">Mirror Diameter (meters):</label>
        <input id="mirrorDiameter" type="number" bind:value={$mirrorDiameter}
               on:input={performCalculations} class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500" />
        <p class="text-lg mt-2">Current Diameter: {$mirrorDiameter} meters</p>
    </div>

    <!-- Focal Point Section -->
    <div class="bg-gray-800 p-4 rounded-lg mb-6">
        <label for="focalPointSize" class="block text-lg mb-2">Focal Point Size (meters):</label>
        <input id="focalPointSize" type="number" bind:value={$focalPointSize}
               on:input={performCalculations} class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500" />
        <p class="text-lg mt-2">Current Focal Point Size: {$focalPointSize} meters</p>
    </div>

    <!-- Temperature Section -->
    <div class="bg-gray-800 p-4 rounded-lg mb-6">
        <label for="temperature" class="block text-lg mb-2">Temperature at Focal Point (K):</label>
        <input id="temperature" type="number" bind:value={$temperature}
               class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500" readonly />
    </div>
</div>

<script>
    import { writable } from 'svelte/store';

    // Creating writable stores
    const orbitalAltitude = writable(2000); // meters
    const mirrorDiameter = writable(2.5); // meters
    const focalPointSize = writable(0.05); // meters
    const desiredTemperature = writable(1000); // Kelvin
    const heatFlux = writable(0);
    const temperature = writable(0);

    // Lock states
    const lockOrbitalAltitude = writable(false);
    const lockMirrorDiameter = writable(false);
    const lockFocalPointSize = writable(false);
    const lockTemperature = writable(false);

    // Constants
    const SUN_INTENSITY = 1361; // Solar constant (W/m^2)
    const MIRROR_EFFICIENCY = 0.85; // Mirror's reflection efficiency
    const SPECIFIC_HEAT_CAPACITY = 550; // J/kg K for regolith
    const REGOLITH_DENSITY = 1500; // kg/m3 for regolith
    const BASE_TEMPERATURE = 250; // Average lunar surface temperature in Kelvin

    // Helper function to capitalize the first letter of a string
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Dependency map
    const dependencies = {
        orbitalAltitude: {
            affects: ['heatFlux', 'temperature'],
            calculate: () => {
                heatFlux.set(calculateHeatFlux($mirrorDiameter, $focalPointSize));
                temperature.set(calculateTemperature($heatFlux, $focalPointSize));
            }
        },
        mirrorDiameter: {
            affects: ['heatFlux', 'temperature'],
            calculate: () => {
                heatFlux.set(calculateHeatFlux($mirrorDiameter, $focalPointSize));
                temperature.set(calculateTemperature($heatFlux, $focalPointSize));
            }
        },
        focalPointSize: {
            affects: ['heatFlux', 'temperature'],
            calculate: () => {
                heatFlux.set(calculateHeatFlux($mirrorDiameter, $focalPointSize));
                temperature.set(calculateTemperature($heatFlux, $focalPointSize));
            }
        },
        // Additional variables can be added here in the future
    };

        // Calculation functions
        function calculateMirrorDiameter(focalSize, orbitalAlt) {
        // Example calculation, adjust as needed
        return focalSize * Math.sqrt(orbitalAlt);
    }

    function calculateHeatFlux(mirrorDia, focalSize) {
        const mirrorArea = Math.PI * (mirrorDia / 2) ** 2;
        const totalSolarPower = SUN_INTENSITY * mirrorArea * MIRROR_EFFICIENCY;
        return totalSolarPower / (Math.PI * (focalSize / 2) ** 2);
    }

    function calculateTemperature(heatFlux, focalSize) {
        const focalPointArea = Math.PI * (focalSize / 2) ** 2;
        const affectedVolume = focalPointArea * 0.01; // Assuming 1 cm depth
        const regolithMass = affectedVolume * REGOLITH_DENSITY;
        const energyAbsorbed = heatFlux * focalPointArea * 3600; // Exposure time = 3600 seconds
        return BASE_TEMPERATURE + energyAbsorbed / (regolithMass * SPECIFIC_HEAT_CAPACITY);
    }

    // Generalized update function
    function updateCalculations() {
        Object.keys(dependencies).forEach(key => {
            if (!eval(`$lock${capitalizeFirstLetter(key)}`)) {
                dependencies[key].calculate();
            }
        });
    }

    // Function to toggle lock and trigger recalculations
    function toggleLock(lockState, callback) {
        lockState.update(n => !n);
        if (callback) callback();
    }
</script>



<div class="bg-gray-900 p-6 m-32 rounded-xl text-white">
    <h1 class="text-3xl font-bold mb-6">Lunar Death Ray Orbiter Model</h1>

    <!-- Orbit Section -->
    <div class="bg-gray-800 p-4 rounded-lg mb-6">
        <div class="flex justify-between items-center" class:opacity-60={$lockOrbitalAltitude}>
            <label for="orbitalAltitudeSlider" class="block text-lg mb-2">Orbital Altitude:</label>
            <button on:click={() => toggleLock(lockOrbitalAltitude, updateCalculations)}>
                {@html $lockOrbitalAltitude ? '🔒' : '🔓'}
            </button>
        </div>
        <input id="orbitalAltitudeSlider" type="range" min="0" max="300000" bind:value={$orbitalAltitude}
               class:opacity-60={$lockOrbitalAltitude} disabled={$lockOrbitalAltitude}
               on:input={updateCalculations} class="slider w-full">
        <p class="text-lg mt-2">Current Altitude: {$orbitalAltitude} meters</p>
    </div>
    
<!-- Mirror Section -->
    <!-- Mirror Section -->
    <div class="bg-gray-800 p-4 rounded-lg mb-6">
        <div class="flex mb-3">
            <div class="w-1/2 pr-2" class:opacity-60={$lockMirrorDiameter}>
                <label for="mirrorDiameter" class="block text-lg mb-2 flex justify-between items-center">
                    Mirror Diameter (meters):
                    <button on:click={() => toggleLock(lockMirrorDiameter, updateCalculations)}>
                        {@html $lockMirrorDiameter ? '🔒' : '🔓'}
                    </button>
                </label>
                <input id="mirrorDiameter" type="number" bind:value={$mirrorDiameter}
                       class:opacity-60={$lockMirrorDiameter} disabled={$lockMirrorDiameter}
                       on:input={updateCalculations} class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
            </div>
            <div class="w-1/2 pl-2" class:opacity-60={$lockFocalPointSize}>
                <label for="focalPointSize" class="block text-lg mb-2 flex justify-between items-center">
                    Focal Point Size (meters):
                    <button on:click={() => toggleLock(lockFocalPointSize, updateCalculations)}>
                        {@html $lockFocalPointSize ? '🔒' : '🔓'}
                    </button>
                </label>
                <input id="focalPointSize" type="number" bind:value={$focalPointSize}
                       class:opacity-60={$lockFocalPointSize} disabled={$lockFocalPointSize}
                       on:input={updateCalculations} class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
            </div>
        </div>        
    </div>

<!-- Power Section -->
<div class="bg-gray-800 p-4 rounded-lg">
    <p class="text-lg">Heat Flux at Lunar Surface: {$heatFlux.toFixed(2)} W/m^2</p>
    <p class="text-lg">Calculated Temperature at Focal Point: {$temperature.toFixed(2)} K</p>
</div>

</div>

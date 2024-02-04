<script>
    import { writable, derived } from 'svelte/store';

    export const diameter = writable(2); // Example default value
    export const curvature = writable(1.0); // Example default value
    export const focalPointSize = writable(0.05); // Example default value
    export const altitude = writable(100); // Example default value

    // Derived store to calculate mirror area
    export const mirrorArea = derived(diameter, $diameter => Math.PI * ($diameter / 2) ** 2);

    // Derived store to calculate focal point size
    export const calculatedFocalPointSize = derived([diameter, curvature, altitude], ([$diameter, $curvature, $altitude]) => $diameter * $curvature / $altitude);

    // Derived store to calculate mirror diameter
    export const calculatedMirrorDiameter = derived([focalPointSize, curvature, altitude], ([$focalPointSize, $curvature, $altitude]) => $focalPointSize * $altitude / $curvature);

</script>


<!-- Simple UI for testing -->
<div class="bg-gray-800 p-4 rounded-lg mb-6">
    <h2 class="text-lg font-bold mb-2">Mirror Specifications</h2>

    <label for="diameter" class="block text-sm mb-2">Mirror Diameter (m):</label>
    <input id="diameter" type="number" bind:value={$diameter} min="0" 
        class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-4" />

    <label for="curvature" class="block text-sm mb-2">Mirror Curvature:</label>
    <input id="curvature" type="number" bind:value={$curvature} min="0" 
        class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-4" />

    <label for="altitude" class="block text-sm mb-2">Orbital Altitude (m):</label>
    <input id="altitude" type="number" bind:value={$altitude} min="0" 
        class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-4" />

    <p class="text-lg mt-2">Mirror Area: {$mirrorArea.toFixed(2)} square meters</p>
    <p class="text-lg mt-2">Focal Point Size: {$focalPointSize.toFixed(2)} meters</p>
</div>
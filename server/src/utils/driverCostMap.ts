export const driverCostMap: Record<number, number> = {
    1: 32.0,   // Max Verstappen - Premium tier
    4: 28.5,   // Lando Norris - High tier
    5: 8.5,    // Gabriel Bortoleto - Rookie tier
    6: 9.0,    // Isack Hadjar - Rookie tier
    10: 15.5,  // Pierre Gasly - Mid tier
    12: 12.0,  // Kimi Antonelli - Rising star
    14: 22.0,  // Fernando Alonso - Veteran tier
    16: 26.5,  // Charles Leclerc - High tier
    18: 13.5,  // Lance Stroll - Mid tier
    22: 16.0,  // Yuki Tsunoda - Mid tier
    23: 14.5,  // Alexander Albon - Mid tier
    27: 11.5,  // Nico Hulkenberg - Budget tier
    30: 10.5,  // Liam Lawson - Rising star
    31: 13.0,  // Esteban Ocon - Mid tier
    43: 9.5,   // Franco Colapinto - Rookie tier
    44: 30.0,  // Lewis Hamilton - Premium tier
    55: 24.5,  // Carlos Sainz - High tier
    63: 25.0,  // George Russell - High tier
    81: 26.0,  // Oscar Piastri - High tier
    87: 8.0,   // Oliver Bearman - Rookie tier
};

export const getDriverCost = (driverNumber: number): number => {
    return driverCostMap[driverNumber] || 10.0; // Default cost if not found
};
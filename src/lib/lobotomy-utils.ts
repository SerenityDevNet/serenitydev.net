// Shared constants 
export const DEPARTMENTS = [
  { name: "CONTROL", color: "#D8D556" },
  { name: "INFO", color: "#81339C" },
  { name: "TRAINING", color: "#DA7F2F" },
  { name: "SECURITY", color: "#69A448" },
  { name: "CENTRAL", color: "#FFC50B" },
  { name: "DISCIPLINE", color: "#FF0000" },
  { name: "WELFARE", color: "#456FFF" },
  { name: "EXTRACTION", color: "#2E2E2E" },
  { name: "RECORD", color: "#606060" },
  { name: "ARCHITECTURE", color: "#FFFFFF" },
  { name: "RABBIT", color: "#FD3C00" },
];

export const getRandomInt = (max: number) => Math.floor(Math.random() * max);
export const getRandomItem = <T>(arr: T[]): T => arr[getRandomInt(arr.length)];

export const generateNewAgent = (username: string) => {
  const dept = getRandomItem(DEPARTMENTS);
  
  const r = getRandomInt(119);
  const g = getRandomInt(119);
  const b = getRandomInt(119);
  
  return {
    username: username.toLowerCase(),
    department: dept.name,
    userColor: dept.color,
    hairIndex: getRandomInt(12), 
    backHairIndex: getRandomInt(10), 
    suitIndex: getRandomInt(9),  
    eyeIndex: getRandomInt(5),   
    mouthIndex: getRandomInt(4), 
    hairColor: `rgb(${r},${g},${b})`
  };
};
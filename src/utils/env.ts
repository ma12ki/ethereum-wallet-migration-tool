type ReturnTypeParam = 'string' | 'number' | 'boolean';
type ReturnType = string | number | boolean;

export function env(key: string, type: 'string', defaultVal?: string): string;
export function env(key: string, type: 'number', defaultVal?: number): number;
export function env(key: string, type: 'boolean', defaultVal?: number): boolean;
export function env(key: string, type: ReturnTypeParam, defaultVal?: ReturnType): ReturnType {
  let val: ReturnType = process.env[key] as any;
  val = validateRequiredOrApplyDefault(key, val, defaultVal as any);
  return convertType(key, val, type);
}

function validateRequiredOrApplyDefault(key: string, val: ReturnType, defaultVal: ReturnType): ReturnType {
  if (defaultVal === undefined && !val) {
    throw new Error(`Missing required env var ${key}`);
  }

  return val;
}

function convertType(key: string, val: ReturnType, type: ReturnTypeParam): ReturnType {
  switch (type) {
    case 'number': {
      return convertToNumber(key, val);
    }
    case 'boolean': {
      return convertToBoolean(key, val);
    }
    default: {
      return val;
    }
  }
}

function convertToNumber(key: string, val: ReturnType): number {
  const num = Number(val);

  if (isNaN(num)) {
    throw new Error(`Env var ${key} is not a number`);
  }

  return num;
}

function convertToBoolean(key: string, val: ReturnType): boolean {
  const valLower = ('' + val).toLowerCase();
  const truthyVals = ['true', '1'];
  const falsyVals = ['false', '0'];
  const acceptedVals = [...truthyVals, ...falsyVals];

  if (!acceptedVals.includes(valLower)) {
    throw new Error(`Env var ${key} is not a boolean`);
  }

  return truthyVals.includes(valLower);
}

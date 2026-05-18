// Ports to skip (duplicates/unused)
// export const SKIP_PORTS = ['250608', '250609', '240207', '231002', '230103'];
export const SKIP_PORTS = ['240207', '231002', '230103'];
// export const SKIP_PORTS: string[] = [];

// US port name → mexican origin city
export const MEXICO_ORIGIN_CITY_MAP: Record<string, string> = {
  'San Ysidro': 'Tijuana',
  'Otay Mesa': 'Tijuana',
  'Otay Mesa Port of Entry': 'Tijuana',
  Tecate: 'Tecate',
  Calexico: 'Mexicali',
  Andrade: 'Los Algodones',
  'San Luis': 'San Luis Río Colorado',
  Lukeville: 'Sonoyta',
  Naco: 'Naco',
  'Douglas (Raul Hector Castro)': 'Agua Prieta',
  Nogales: 'Nogales',
  Columbus: 'Palomas',
  'Santa Teresa': 'San Jerónimo',
  'El Paso': 'Ciudad Juárez',
  'Bridge of the Americas Port of Entry': 'Ciudad Juárez',
  'Marcelino Serna': 'Guadalupe',
  'Fort Hancock': 'El Porvenir',
  Presidio: 'Ojinaga',
  'Del Rio': 'Ciudad Acuña',
  'Eagle Pass': 'Piedras Negras',
  Laredo: 'Nuevo Laredo',
  'Rio Grande City': 'Camargo',
  Roma: 'Miguel Alemán',
  'ROMA TEXAS': 'Miguel Alemán',
  Progreso: 'Nuevo Progreso',
  'Hidalgo/Pharr': 'Reynosa',
  Brownsville: 'Matamoros',
  Gateway: 'Matamoros',
  'BOTA CARGO FACILITY': 'Ciudad Juárez',
};

// US port name → canadian origin city
export const CANADA_ORIGIN_CITY_MAP: Record<string, string> = {
  Blaine: 'Surrey',
  Sumas: 'Abbotsford',
  Lynden: 'Aldergrove',
  Detroit: 'Windsor',
  'Port Huron': 'Sarnia',
  'Buffalo/Niagara Falls': 'Niagara Falls',
  'Alexandria Bay': 'Lansdowne',
  Ogdensburg: 'Johnstown',
  Massena: 'Cornwall',
  Champlain: 'Lacolle',
  'Derby Line': 'Stanstead',
  Norton: 'Stanhope',
  'Highgate Springs': 'Saint-Armand',
  Calais: 'St. Stephen',
  Houlton: 'Woodstock',
  Madawaska: 'Edmundston',
  Jackman: 'Jackman',
  'Sault Ste. Marie': 'Sault Ste. Marie',
  'International Falls': 'Fort Frances',
  Pembina: 'Emerson',
  Sweetgrass: 'Coutts',
};

// takes a port name & country code
// uses appropriate map to return an origin city
export function getOriginCity(portName: string, country: 'MX' | 'CA'): string {
  const map =
    country === 'MX' ? MEXICO_ORIGIN_CITY_MAP : CANADA_ORIGIN_CITY_MAP;

  return map[portName] || portName;
}

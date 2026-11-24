export interface GoogleReview {
  rating?: number;
  text?: string;
  originalText?: string;
  originalTextLanguageCode?: string;
  textLanguageCode?: string;
  publishTime?: Date;
  authorAttribution?: { displayName?: string; uri?: string };
  googleMapsURI?: string;
  flagContentURI?: string;
  visitDateMonth?: number;
  visitDateYear?: number;
}
interface AddressComponent {
  types: string[];
  longText?: string;
  shortText?: string;
}
interface Place {
  reviews?: GoogleReview[];
  attributions?: { provider: string; providerURI: string }[];
  addressComponents?: AddressComponent[];
  formattedAddress?: string;
  fetchFields(options: { fields: string[] }): Promise<unknown>;
}
export interface Prediction {
  text: { toString(): string };
  toPlace(): Place;
}
export interface PlacesLibrary {
  Place: new (options: { id: string; requestedLanguage?: string }) => Place;
  AutocompleteSessionToken: new () => object;
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions(request: {
      input: string;
      sessionToken: object;
      language: string;
      region: string;
    }): Promise<{ suggestions: { placePrediction?: Prediction }[] }>;
  };
}
type MapsWindow = Window & {
  google?: { maps: { importLibrary(name: string): Promise<PlacesLibrary> } };
  mazatMapsReady?: () => void;
};
const mapsWindow = window as MapsWindow;
let libraryPromise: Promise<PlacesLibrary> | undefined;

export function loadPlaces(key: string): Promise<PlacesLibrary> {
  if (libraryPromise) return libraryPromise;
  libraryPromise = new Promise<void>((resolve, reject) => {
    if (mapsWindow.google?.maps.importLibrary) return resolve();
    const script = document.createElement('script');
    const timer = window.setTimeout(
      () => reject(new Error('Maps timeout')),
      15000,
    );
    mapsWindow.mazatMapsReady = () => {
      clearTimeout(timer);
      resolve();
    };
    script.onerror = () => {
      clearTimeout(timer);
      reject(new Error('Maps unavailable'));
    };
    const params = new URLSearchParams({
      key,
      loading: 'async',
      callback: 'mazatMapsReady',
      v: 'weekly',
      language: 'fr',
      region: 'FR',
    });
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    script.async = true;
    document.head.append(script);
  }).then(() => mapsWindow.google!.maps.importLibrary('places'));
  return libraryPromise;
}

declare module 'tz-lookup' {
  function tzlookup(lat: number, lng: number): string;
  let x: typeof tzlookup;

  export = x;
}

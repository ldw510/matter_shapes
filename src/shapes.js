import * as SVGs from "./svg";
import * as PNGs from "./png";

// Convert svg string to Document
const svgStringToDocument = (string) =>
  new window.DOMParser().parseFromString(string, "image/svg+xml");

// Extract SVG Element from a Document
const getSvg = (svg) => svg.querySelector("svg");

// Extract paths from an SVG Element
const getPaths = (svg) => Array.from(svg.querySelectorAll("path"));

// Create data for each SVG
const makeShape = (name) => {
  const svg = SVGs.default[name];
  const png = PNGs.default[name];
  const svgDocument = svgStringToDocument(svg);
  const svgElement = getSvg(svgDocument);
  return {
    name,
    texture: png,
    paths: getPaths(svgElement)
  };
};

const shapes = [
  makeShape("one"),
  makeShape("two"),
  makeShape("three"),
  makeShape("four"),
  makeShape("five"),
  makeShape("six"),
  makeShape("seven"),
  makeShape("eight"),
  makeShape("nine"),
  makeShape("ten"),
  makeShape("eleven"),
  makeShape("twelve"),
  makeShape("thirteen"),
  makeShape("fourteen"),
  makeShape("fifteen")
];

export default shapes;

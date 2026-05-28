const canvas = document.querySelector("#editorCanvas");
const ctx = canvas.getContext("2d");
const stage = document.querySelector(".canvas-shell");
const fileInput = document.querySelector("#fileInput");
const placeInput = document.querySelector("#placeInput");

const dom = {
  app: document.querySelector(".app"),
  documentArea: document.querySelector(".document-area"),
  rulerTop: document.querySelector(".ruler-top"),
  rulerLeft: document.querySelector(".ruler-left"),
  fileMeta: document.querySelector("#fileMeta"),
  zoomStatus: document.querySelector("#zoomStatus"),
  docStatus: document.querySelector("#docStatus"),
  toolStatus: document.querySelector("#toolStatus"),
  activeToolName: document.querySelector("#activeToolName"),
  activeToolKey: document.querySelector("#activeToolKey"),
  layerList: document.querySelector("#layerList"),
  historyList: document.querySelector("#historyList"),
  historySnapshotList: document.querySelector("#historySnapshotList"),
  colorValue: document.querySelector("#colorValue"),
  brushPresetName: document.querySelector("#brushPresetName"),
  alphaChannelList: document.querySelector("#alphaChannelList"),
  navigatorCanvas: document.querySelector("#navigatorCanvas"),
  navigatorZoom: document.querySelector("#navigatorZoom"),
  histogramCanvas: document.querySelector("#histogramCanvas"),
  histogramStatus: document.querySelector("#histogramStatus"),
  infoX: document.querySelector("#infoX"),
  infoY: document.querySelector("#infoY"),
  infoR: document.querySelector("#infoR"),
  infoG: document.querySelector("#infoG"),
  infoB: document.querySelector("#infoB"),
  infoHex: document.querySelector("#infoHex"),
  infoSwatch: document.querySelector("#infoSwatch"),
  selectionStatus: document.querySelector("#selectionStatus"),
  maskStatus: document.querySelector("#maskStatus"),
  styleStatus: document.querySelector("#styleStatus"),
  channelStatus: document.querySelector("#channelStatus"),
  pathStatus: document.querySelector("#pathStatus"),
  aiChatThread: document.querySelector("#aiChatThread"),
};

const navigatorCtx = dom.navigatorCanvas.getContext("2d");
const histogramCtx = dom.histogramCanvas.getContext("2d");
let lastComposite = null;
let infoSampleCanvas = null;
let infoSampleCtx = null;
let navigatorDragging = false;
let temporaryHandTool = null;
let restoreHandAfterDrag = false;

const controls = {
  brushSize: document.querySelector("#brushSize"),
  brushOpacity: document.querySelector("#brushOpacity"),
  brushColor: document.querySelector("#brushColor"),
  panelBrushColor: document.querySelector("#panelBrushColor"),
  backgroundColor: document.querySelector("#backgroundColor"),
  panelBackgroundColor: document.querySelector("#panelBackgroundColor"),
  brushHardness: document.querySelector("#brushHardness"),
  brushSpacing: document.querySelector("#brushSpacing"),
  brushFlow: document.querySelector("#brushFlow"),
  moveAutoSelect: document.querySelector("#moveAutoSelect"),
  healStrength: document.querySelector("#healStrength"),
  textContent: document.querySelector("#textContent"),
  textFont: document.querySelector("#textFont"),
  textSize: document.querySelector("#textSize"),
  layerOpacity: document.querySelector("#layerOpacity"),
  layerFill: document.querySelector("#layerFill"),
  blendIfBlack: document.querySelector("#blendIfBlack"),
  blendIfWhite: document.querySelector("#blendIfWhite"),
  blendMode: document.querySelector("#blendMode"),
  paintTarget: document.querySelector("#paintTarget"),
  shadowEnabled: document.querySelector("#shadowEnabled"),
  shadowDistance: document.querySelector("#shadowDistance"),
  shadowSize: document.querySelector("#shadowSize"),
  shadowColor: document.querySelector("#shadowColor"),
  strokeEnabled: document.querySelector("#strokeEnabled"),
  strokeSize: document.querySelector("#strokeSize"),
  strokeColor: document.querySelector("#strokeColor"),
  glowEnabled: document.querySelector("#glowEnabled"),
  glowSize: document.querySelector("#glowSize"),
  glowColor: document.querySelector("#glowColor"),
  brightness: document.querySelector("#brightness"),
  contrast: document.querySelector("#contrast"),
  saturation: document.querySelector("#saturation"),
  hue: document.querySelector("#hue"),
  grayscale: document.querySelector("#grayscale"),
  blur: document.querySelector("#blur"),
  selectionFeather: document.querySelector("#selectionFeather"),
  selectionMode: document.querySelector("#selectionMode"),
  wandTolerance: document.querySelector("#wandTolerance"),
  wandContiguous: document.querySelector("#wandContiguous"),
  wandSampleAll: document.querySelector("#wandSampleAll"),
  gradientMode: document.querySelector("#gradientMode"),
  gradientReverse: document.querySelector("#gradientReverse"),
  shapeMode: document.querySelector("#shapeMode"),
  shapeFillColor: document.querySelector("#shapeFillColor"),
  shapeStrokeEnabled: document.querySelector("#shapeStrokeEnabled"),
  shapeStrokeColor: document.querySelector("#shapeStrokeColor"),
  shapeStrokeSize: document.querySelector("#shapeStrokeSize"),
  smudgeStrength: document.querySelector("#smudgeStrength"),
  toneMode: document.querySelector("#toneMode"),
  toneExposure: document.querySelector("#toneExposure"),
  channelRed: document.querySelector("#channelRed"),
  channelGreen: document.querySelector("#channelGreen"),
  channelBlue: document.querySelector("#channelBlue"),
  navigatorZoomSlider: document.querySelector("#navigatorZoomSlider"),
  aiChatInput: document.querySelector("#aiChatInput"),
};

const values = {
  brushSize: document.querySelector("#brushSizeValue"),
  brushOpacity: document.querySelector("#brushOpacityValue"),
  brushHardness: document.querySelector("#brushHardnessValue"),
  brushSpacing: document.querySelector("#brushSpacingValue"),
  brushFlow: document.querySelector("#brushFlowValue"),
  healStrength: document.querySelector("#healStrengthValue"),
  brightness: document.querySelector("#brightnessValue"),
  contrast: document.querySelector("#contrastValue"),
  saturation: document.querySelector("#saturationValue"),
  hue: document.querySelector("#hueValue"),
  grayscale: document.querySelector("#grayscaleValue"),
  blur: document.querySelector("#blurValue"),
  shadowDistance: document.querySelector("#shadowDistanceValue"),
  shadowSize: document.querySelector("#shadowSizeValue"),
  strokeSize: document.querySelector("#strokeSizeValue"),
  glowSize: document.querySelector("#glowSizeValue"),
  selectionFeather: document.querySelector("#selectionFeatherValue"),
  wandTolerance: document.querySelector("#wandToleranceValue"),
  blendIfBlack: document.querySelector("#blendIfBlackValue"),
  blendIfWhite: document.querySelector("#blendIfWhiteValue"),
  shapeStrokeSize: document.querySelector("#shapeStrokeSizeValue"),
  smudgeStrength: document.querySelector("#smudgeStrengthValue"),
  toneExposure: document.querySelector("#toneExposureValue"),
};

const buttons = {
  open: document.querySelector("#openButton"),
  savePng: document.querySelector("#savePngButton"),
  saveJpg: document.querySelector("#saveJpgButton"),
  savePsd: document.querySelector("#savePsdButton"),
  resetAdjust: document.querySelector("#resetAdjustButton"),
  newAdjustmentLayer: document.querySelector("#newAdjustmentLayerButton"),
  newHistorySnapshot: document.querySelector("#newHistorySnapshotButton"),
  navigatorZoomOut: document.querySelector("#navigatorZoomOutButton"),
  navigatorZoomIn: document.querySelector("#navigatorZoomInButton"),
  filterBlur: document.querySelector("#filterBlurButton"),
  filterBoxBlur: document.querySelector("#filterBoxBlurButton"),
  filterAverage: document.querySelector("#filterAverageButton"),
  filterSurfaceBlur: document.querySelector("#filterSurfaceBlurButton"),
  filterSmartBlur: document.querySelector("#filterSmartBlurButton"),
  filterRadialBlur: document.querySelector("#filterRadialBlurButton"),
  filterTwirl: document.querySelector("#filterTwirlButton"),
  filterPinch: document.querySelector("#filterPinchButton"),
  filterRipple: document.querySelector("#filterRippleButton"),
  filterSpherize: document.querySelector("#filterSpherizeButton"),
  filterZigZag: document.querySelector("#filterZigZagButton"),
  filterWave: document.querySelector("#filterWaveButton"),
  filterPolar: document.querySelector("#filterPolarButton"),
  filterShear: document.querySelector("#filterShearButton"),
  filterMotionBlur: document.querySelector("#filterMotionBlurButton"),
  filterSharpen: document.querySelector("#filterSharpenButton"),
  filterUnsharp: document.querySelector("#filterUnsharpButton"),
  filterSmartSharpen: document.querySelector("#filterSmartSharpenButton"),
  filterHighPass: document.querySelector("#filterHighPassButton"),
  filterFindEdges: document.querySelector("#filterFindEdgesButton"),
  filterOilPaint: document.querySelector("#filterOilPaintButton"),
  filterGlowingEdges: document.querySelector("#filterGlowingEdgesButton"),
  filterEmboss: document.querySelector("#filterEmbossButton"),
  filterDiffuse: document.querySelector("#filterDiffuseButton"),
  filterWind: document.querySelector("#filterWindButton"),
  filterTraceContour: document.querySelector("#filterTraceContourButton"),
  filterExtrude: document.querySelector("#filterExtrudeButton"),
  filterTiles: document.querySelector("#filterTilesButton"),
  filterSolarize: document.querySelector("#filterSolarizeButton"),
  filterClouds: document.querySelector("#filterCloudsButton"),
  filterDifferenceClouds: document.querySelector("#filterDifferenceCloudsButton"),
  filterLensFlare: document.querySelector("#filterLensFlareButton"),
  filterFibers: document.querySelector("#filterFibersButton"),
  filterLightingEffects: document.querySelector("#filterLightingEffectsButton"),
  filterNoise: document.querySelector("#filterNoiseButton"),
  filterReduceNoise: document.querySelector("#filterReduceNoiseButton"),
  filterDespeckle: document.querySelector("#filterDespeckleButton"),
  filterDustScratches: document.querySelector("#filterDustScratchesButton"),
  filterMedian: document.querySelector("#filterMedianButton"),
  filterColorHalftone: document.querySelector("#filterColorHalftoneButton"),
  filterCrystallize: document.querySelector("#filterCrystallizeButton"),
  filterPointillize: document.querySelector("#filterPointillizeButton"),
  filterFragment: document.querySelector("#filterFragmentButton"),
  filterFacet: document.querySelector("#filterFacetButton"),
  filterMezzotint: document.querySelector("#filterMezzotintButton"),
  filterMosaic: document.querySelector("#filterMosaicButton"),
  filterOffset: document.querySelector("#filterOffsetButton"),
  filterMaximum: document.querySelector("#filterMaximumButton"),
  filterMinimum: document.querySelector("#filterMinimumButton"),
  applyCrop: document.querySelector("#applyCropButton"),
  cancelCrop: document.querySelector("#cancelCropButton"),
  clearSelection: document.querySelector("#clearSelectionButton"),
  freeTransform: document.querySelector("#freeTransformButton"),
  rotateLeft: document.querySelector("#rotateLeftButton"),
  rotateRight: document.querySelector("#rotateRightButton"),
  flipHorizontal: document.querySelector("#flipHorizontalButton"),
  flipVertical: document.querySelector("#flipVerticalButton"),
  alignLeft: document.querySelector("#alignLeftButton"),
  alignHorizontal: document.querySelector("#alignHorizontalButton"),
  alignRight: document.querySelector("#alignRightButton"),
  alignTop: document.querySelector("#alignTopButton"),
  alignVertical: document.querySelector("#alignVerticalButton"),
  alignBottom: document.querySelector("#alignBottomButton"),
  addLayer: document.querySelector("#addLayerButton"),
  duplicateLayer: document.querySelector("#duplicateLayerButton"),
  layerUp: document.querySelector("#layerUpButton"),
  layerDown: document.querySelector("#layerDownButton"),
  clipLayer: document.querySelector("#clipLayerButton"),
  lockTransparency: document.querySelector("#lockTransparencyButton"),
  lockPixels: document.querySelector("#lockPixelsButton"),
  lockPosition: document.querySelector("#lockPositionButton"),
  lockAll: document.querySelector("#lockAllButton"),
  deleteLayer: document.querySelector("#deleteLayerButton"),
  rasterizeLayerStyle: document.querySelector("#rasterizeLayerStyleButton"),
  mergeVisible: document.querySelector("#mergeVisibleButton"),
  addRevealMask: document.querySelector("#addRevealMaskButton"),
  addHideMask: document.querySelector("#addHideMaskButton"),
  toggleMask: document.querySelector("#toggleMaskButton"),
  applyMask: document.querySelector("#applyMaskButton"),
  invertMask: document.querySelector("#invertMaskButton"),
  deleteMask: document.querySelector("#deleteMaskButton"),
  selectAll: document.querySelector("#selectAllButton"),
  deselect: document.querySelector("#deselectButton"),
  reselect: document.querySelector("#reselectButton"),
  invertSelection: document.querySelector("#invertSelectionButton"),
  quickMask: document.querySelector("#quickMaskButton"),
  selectSubject: document.querySelector("#selectSubjectButton"),
  colorRange: document.querySelector("#colorRangeButton"),
  selectSimilar: document.querySelector("#selectSimilarButton"),
  growSelection: document.querySelector("#growSelectionButton"),
  smoothSelection: document.querySelector("#smoothSelectionButton"),
  expandSelection: document.querySelector("#expandSelectionButton"),
  contractSelection: document.querySelector("#contractSelectionButton"),
  borderSelection: document.querySelector("#borderSelectionButton"),
  fillSelection: document.querySelector("#fillSelectionButton"),
  fillBackground: document.querySelector("#fillBackgroundButton"),
  contentAwareFill: document.querySelector("#contentAwareFillButton"),
  deleteSelection: document.querySelector("#deleteSelectionButton"),
  cut: document.querySelector("#cutButton"),
  copyMerged: document.querySelector("#copyMergedButton"),
  swapColors: document.querySelector("#swapColorsButton"),
  defaultColors: document.querySelector("#defaultColorsButton"),
  saveSelectionChannel: document.querySelector("#saveSelectionChannelButton"),
  loadAlphaChannel: document.querySelector("#loadAlphaChannelButton"),
  makePathSelection: document.querySelector("#makePathSelectionButton"),
  strokePath: document.querySelector("#strokePathButton"),
  clearPath: document.querySelector("#clearPathButton"),
  aiChatSend: document.querySelector("#aiChatSendButton"),
};

const toolInfo = {
  move: { name: "Move Tool", key: "V" },
  marquee: { name: "Rectangular Marquee", key: "M" },
  magic: { name: "Magic Wand", key: "W" },
  lasso: { name: "Lasso Tool", key: "L" },
  pen: { name: "Pen Tool", key: "P" },
  heal: { name: "Spot Healing Brush", key: "J" },
  clone: { name: "Clone Stamp", key: "S" },
  historyBrush: { name: "History Brush", key: "Y" },
  gradient: { name: "Gradient Tool", key: "G" },
  shape: { name: "Shape Tool", key: "U" },
  smudge: { name: "Smudge Tool", key: "R" },
  tone: { name: "Dodge/Burn Tool", key: "O" },
  crop: { name: "Crop Tool", key: "C" },
  brush: { name: "Brush Tool", key: "B" },
  eraser: { name: "Eraser Tool", key: "E" },
  text: { name: "Type Tool", key: "T" },
  eyedropper: { name: "Eyedropper Tool", key: "I" },
  hand: { name: "Hand Tool", key: "H" },
  zoom: { name: "Zoom Tool", key: "Z" },
};

const state = {
  fileName: "Untitled.psd",
  initialSnapshot: null,
  historySnapshots: [],
  historySnapshotCounter: 1,
  historyBrushSourceIndex: null,
  doc: { width: 1600, height: 1000 },
  layers: [],
  activeLayerId: null,
  visibilitySoloRestore: null,
  activeTool: "move",
  freeTransform: false,
  moveAutoSelect: true,
  showExtras: true,
  showGrid: false,
  showRulers: true,
  showGuides: true,
  guides: [],
  snapEnabled: true,
  snapToGrid: true,
  snapToGuides: true,
  visibleChannels: {
    red: true,
    green: true,
    blue: true,
  },
  alphaChannels: [],
  alphaChannelCounter: 1,
  zoom: 1,
  pan: { x: 0, y: 0 },
  view: { x: 0, y: 0, w: 0, h: 0, scale: 1 },
  drag: null,
  brushPreviewDoc: null,
  lastPaintDoc: null,
  dockGroup: "ai",
  panelsHidden: false,
  chromeHidden: false,
  cropRect: null,
  selectionRect: null,
  selectionMaskCanvas: null,
  selectionPath: null,
  lastSelection: null,
  workPath: [],
  selectionKind: "rect",
  selectionInverse: false,
  selectionFeather: 0,
  selectionMode: "new",
  quickMaskMode: false,
  quickMaskCanvas: null,
  wandTolerance: 36,
  wandContiguous: true,
  wandSampleAll: true,
  gradientMode: "linear",
  gradientReverse: false,
  shapeMode: "rectangle",
  shapeFillColor: "#f3d36b",
  shapeStrokeEnabled: false,
  shapeStrokeColor: "#f7f7f2",
  shapeStrokeSize: 6,
  healStrength: 0.72,
  smudgeStrength: 0.55,
  toneMode: "dodge",
  toneExposure: 0.32,
  cloneSource: null,
  clipboard: null,
  paintTarget: "pixels",
  adjustments: {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    grayscale: 0,
    blur: 0,
  },
  brush: {
    preset: "hard-round",
    shape: "round",
    size: 28,
    opacity: 1,
    hardness: 100,
    spacing: 18,
    flow: 1,
    angle: 0,
    color: "#f3d36b",
  },
  backgroundColor: "#101114",
  text: {
    content: "New text",
    fontFamily: "Georgia",
    size: 72,
  },
  history: [],
  historyIndex: -1,
  layerCounter: 1,
  adjustmentCounter: 0,
  layerStyleClipboard: null,
  numericOpacityShortcut: { target: null, key: "", at: 0, historyIndex: -1 },
};

const MEZZOTINT_TYPES = [
  { key: "fine-dots", label: "Fine Dots", mode: "dots", cell: 1 },
  { key: "medium-dots", label: "Medium Dots", mode: "dots", cell: 2 },
  { key: "grainy-dots", label: "Grainy Dots", mode: "grainy", cell: 1 },
  { key: "coarse-dots", label: "Coarse Dots", mode: "dots", cell: 4 },
  { key: "short-lines", label: "Short Lines", mode: "lines", length: 3, width: 1 },
  { key: "medium-lines", label: "Medium Lines", mode: "lines", length: 6, width: 1 },
  { key: "long-lines", label: "Long Lines", mode: "lines", length: 12, width: 2 },
  { key: "short-strokes", label: "Short Strokes", mode: "strokes", length: 3, width: 1 },
  { key: "medium-strokes", label: "Medium Strokes", mode: "strokes", length: 6, width: 1 },
  { key: "long-strokes", label: "Long Strokes", mode: "strokes", length: 12, width: 2 },
];

const LENS_FLARE_TYPES = [
  { key: "zoom", label: "50-300mm Zoom", aliases: ["50-300", "50-300mm"], tint: [255, 236, 188], core: 0.085, streak: 1.15, ghost: 1.1 },
  { key: "35mm", label: "35mm Prime", aliases: ["35", "prime"], tint: [255, 224, 170], core: 0.065, streak: 0.72, ghost: 0.82 },
  { key: "105mm", label: "105mm Prime", aliases: ["105", "telephoto"], tint: [255, 242, 214], core: 0.11, streak: 0.55, ghost: 0.95 },
  { key: "movie", label: "Movie Prime", aliases: ["movie-prime", "cinema"], tint: [205, 226, 255], core: 0.075, streak: 1.45, ghost: 1 },
];

const defaultAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  grayscale: 0,
  blur: 0,
};

const defaultStyles = {
  shadow: {
    enabled: false,
    color: "#000000",
    distance: 22,
    size: 18,
    opacity: 0.45,
  },
  stroke: {
    enabled: false,
    color: "#f3d36b",
    size: 6,
    opacity: 1,
  },
  glow: {
    enabled: false,
    color: "#5ea1ff",
    size: 20,
    opacity: 0.55,
  },
};

const brushPresets = {
  "hard-round": {
    name: "Hard Round",
    shape: "round",
    hardness: 100,
    spacing: 18,
    flow: 1,
    angle: 0,
  },
  "soft-round": {
    name: "Soft Round",
    shape: "round",
    hardness: 18,
    spacing: 14,
    flow: 0.8,
    angle: 0,
  },
  airbrush: {
    name: "Airbrush",
    shape: "round",
    hardness: 0,
    spacing: 8,
    flow: 0.24,
    angle: 0,
  },
  square: {
    name: "Square",
    shape: "square",
    hardness: 100,
    spacing: 24,
    flow: 1,
    angle: 0,
  },
  calligraphy: {
    name: "Calligraphy",
    shape: "ellipse",
    hardness: 88,
    spacing: 16,
    flow: 1,
    angle: -24,
  },
};

const TEXT_LAYER_PADDING = 8;
const TEXT_FONT_FALLBACKS = {
  Georgia: "Cambria, serif",
  Bahnschrift: "Aptos, Segoe UI, sans-serif",
  Aptos: "Segoe UI, sans-serif",
  "Segoe UI": "Aptos, sans-serif",
  Meiryo: '"Yu Gothic", sans-serif',
  "Yu Gothic": "Meiryo, sans-serif",
  Arial: "Helvetica, sans-serif",
  "Times New Roman": "Georgia, serif",
  "Courier New": "Consolas, monospace",
};
const PSD_FONT_NAMES = {
  Georgia: "Georgia",
  Bahnschrift: "Bahnschrift",
  Aptos: "Aptos",
  "Segoe UI": "SegoeUI",
  Meiryo: "Meiryo",
  "Yu Gothic": "YuGothic-Regular",
  Arial: "ArialMT",
  "Times New Roman": "TimesNewRomanPSMT",
  "Courier New": "CourierNewPSMT",
};

function makeCanvas(width, height) {
  const nextCanvas = document.createElement("canvas");
  nextCanvas.width = Math.max(1, Math.round(width));
  nextCanvas.height = Math.max(1, Math.round(height));
  return nextCanvas;
}

function cloneCanvas(source) {
  const copy = makeCanvas(source.width, source.height);
  copy.getContext("2d").drawImage(source, 0, 0);
  return copy;
}

function cloneStyles(styles = defaultStyles) {
  return {
    shadow: { ...defaultStyles.shadow, ...(styles.shadow || {}) },
    stroke: { ...defaultStyles.stroke, ...(styles.stroke || {}) },
    glow: { ...defaultStyles.glow, ...(styles.glow || {}) },
  };
}

function cloneTextOptions(text) {
  if (!text) return null;
  return { ...text };
}

function hexToRgb(color) {
  const normalized = color.replace("#", "");
  const value = Number.parseInt(normalized.length === 3 ? normalized.split("").map((char) => char + char).join("") : normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbaString(color, alpha) {
  const { r, g, b } = hexToRgb(color);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function cssFontFamily(fontFamily) {
  const family = fontFamily || state.text.fontFamily;
  const quoted = /[\s,]/.test(family) ? `"${family.replace(/"/g, '\\"')}"` : family;
  return `${quoted}, ${TEXT_FONT_FALLBACKS[family] || "serif"}`;
}

function textCanvasFont(text) {
  return `800 ${Math.max(1, Number(text.size) || state.text.size)}px ${cssFontFamily(text.fontFamily)}`;
}

function textLayerMetrics(text) {
  const measureCanvas = makeCanvas(1, 1);
  const measureCtx = measureCanvas.getContext("2d");
  const content = text.content || "Text";
  const lines = content.split(/\r?\n/);
  const size = Math.max(1, Number(text.size) || state.text.size);
  const lineHeight = Math.ceil(size * 1.18);
  measureCtx.font = textCanvasFont(text);
  const measurements = lines.map((line) => measureCtx.measureText(line || " "));
  const width = Math.max(1, ...measurements.map((metrics) => Math.ceil(metrics.width)));
  const ascent = Math.ceil(Math.max(...measurements.map((metrics) => metrics.actualBoundingBoxAscent || size * 0.78)));
  const descent = Math.ceil(Math.max(...measurements.map((metrics) => metrics.actualBoundingBoxDescent || size * 0.22)));
  return {
    lines,
    width: Math.ceil(width + TEXT_LAYER_PADDING * 2),
    height: Math.ceil(ascent + descent + lineHeight * (lines.length - 1) + TEXT_LAYER_PADDING * 2),
    baselineOffset: TEXT_LAYER_PADDING + ascent,
    lineHeight,
    leftOffset: TEXT_LAYER_PADDING,
  };
}

function renderTextLayer(layer, anchorDoc = null) {
  if (!layer?.text) return;
  const previousLeftOffset = layer.text.leftOffset ?? TEXT_LAYER_PADDING;
  const previousBaseline = layer.text.baselineOffset ?? Math.round((Number(layer.text.size) || state.text.size) * 0.8) + TEXT_LAYER_PADDING;
  const anchor = anchorDoc || {
    x: layer.x + previousLeftOffset,
    y: layer.y + previousBaseline,
  };
  const metrics = textLayerMetrics(layer.text);
  const nextCanvas = makeCanvas(metrics.width, metrics.height);
  const nextCtx = nextCanvas.getContext("2d");
  nextCtx.save();
  nextCtx.fillStyle = layer.text.color || state.brush.color;
  nextCtx.font = textCanvasFont(layer.text);
  nextCtx.textBaseline = "alphabetic";
  metrics.lines.forEach((line, index) => {
    nextCtx.fillText(line || " ", metrics.leftOffset, metrics.baselineOffset + metrics.lineHeight * index);
  });
  nextCtx.restore();
  layer.canvas = nextCanvas;
  layer.x = anchor.x - metrics.leftOffset;
  layer.y = anchor.y - metrics.baselineOffset;
  layer.text.leftOffset = metrics.leftOffset;
  layer.text.baselineOffset = metrics.baselineOffset;
  layer.text.lineHeight = metrics.lineHeight;
}

function activeStyleCount(styles) {
  return ["shadow", "stroke", "glow"].filter((key) => styles?.[key]?.enabled).length;
}

function createMask(width, height, revealed) {
  const mask = makeCanvas(width, height);
  if (revealed) {
    const maskCtx = mask.getContext("2d");
    maskCtx.fillStyle = "#ffffff";
    maskCtx.fillRect(0, 0, mask.width, mask.height);
  }
  return mask;
}

function transformCanvas(source, transform) {
  const rotated = transform === "rotate-left" || transform === "rotate-right";
  const next = makeCanvas(rotated ? source.height : source.width, rotated ? source.width : source.height);
  const nextCtx = next.getContext("2d");
  nextCtx.translate(next.width / 2, next.height / 2);
  if (transform === "rotate-left") nextCtx.rotate(-Math.PI / 2);
  if (transform === "rotate-right") nextCtx.rotate(Math.PI / 2);
  if (transform === "rotate-180") nextCtx.rotate(Math.PI);
  if (transform === "flip-x") nextCtx.scale(-1, 1);
  if (transform === "flip-y") nextCtx.scale(1, -1);
  nextCtx.drawImage(source, -source.width / 2, -source.height / 2);
  return next;
}

function rotateCanvas(source, angle) {
  const sin = Math.abs(Math.sin(angle));
  const cos = Math.abs(Math.cos(angle));
  const width = Math.max(1, Math.ceil(source.width * cos + source.height * sin));
  const height = Math.max(1, Math.ceil(source.width * sin + source.height * cos));
  const next = makeCanvas(width, height);
  const nextCtx = next.getContext("2d");
  nextCtx.imageSmoothingEnabled = true;
  nextCtx.imageSmoothingQuality = "high";
  nextCtx.translate(width / 2, height / 2);
  nextCtx.rotate(angle);
  nextCtx.drawImage(source, -source.width / 2, -source.height / 2);
  return next;
}

function scaleCanvas(source, width, height) {
  const next = makeCanvas(width, height);
  const nextCtx = next.getContext("2d");
  nextCtx.imageSmoothingEnabled = true;
  nextCtx.imageSmoothingQuality = "high";
  nextCtx.drawImage(source, 0, 0, next.width, next.height);
  return next;
}

function offsetCanvas(source, width, height, offsetX, offsetY) {
  const next = makeCanvas(width, height);
  next.getContext("2d").drawImage(source, offsetX, offsetY);
  return next;
}

function drawCheckerboard(targetCtx, width, height, cellSize) {
  targetCtx.fillStyle = "#171a20";
  targetCtx.fillRect(0, 0, width, height);
  targetCtx.fillStyle = "#252b35";
  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      if ((x / cellSize + y / cellSize) % 2 === 0) {
        targetCtx.fillRect(x, y, cellSize, cellSize);
      }
    }
  }
}

function createLayer(name, source, options = {}) {
  const sourceCanvas = source ? cloneCanvas(source) : makeCanvas(state.doc.width, state.doc.height);
  return {
    id: `layer-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    type: options.type || "pixel",
    canvas: sourceCanvas,
    mask: options.mask ? cloneCanvas(options.mask) : null,
    maskDisabled: Boolean(options.maskDisabled),
    adjustments: options.adjustments ? { ...options.adjustments } : null,
    styles: cloneStyles(options.styles),
    text: cloneTextOptions(options.text),
    x: options.x || 0,
    y: options.y || 0,
    visible: options.visible !== false,
    opacity: options.opacity ?? 1,
    fillOpacity: options.fillOpacity ?? 1,
    blendIfBlack: options.blendIfBlack ?? 0,
    blendIfWhite: options.blendIfWhite ?? 255,
    blendMode: options.blendMode || "source-over",
    clipped: options.clipped || false,
    lockTransparency: options.lockTransparency || false,
    lockPixels: options.lockPixels || false,
    lockPosition: options.lockPosition || false,
  };
}

function createBackgroundLayer(source) {
  return createLayer("Background", source, {
    lockTransparency: true,
    lockPosition: true,
  });
}

function isBackgroundLayer(layer, index = activeLayerIndex()) {
  return Boolean(layer && index === 0 && layer.name === "Background" && layer.lockTransparency && layer.lockPosition);
}

function activeLayerIsBackground() {
  const index = activeLayerIndex();
  return isBackgroundLayer(state.layers[index], index);
}

function activeLayer() {
  return state.layers.find((layer) => layer.id === state.activeLayerId) || state.layers[0];
}

function activeLayerIndex() {
  return state.layers.findIndex((layer) => layer.id === state.activeLayerId);
}

function normalizeClippingMasks() {
  if (state.layers[0]) {
    state.layers[0].clipped = false;
  }
}

function pixelEditingLocked(layer, editsPixels = state.paintTarget !== "mask") {
  return Boolean((layer?.lockPixels || layer?.type === "text") && editsPixels);
}

function guardPixelEditing(layer, editsPixels = state.paintTarget !== "mask") {
  if (!pixelEditingLocked(layer, editsPixels)) return false;
  updateStatus(layer?.type === "text" && editsPixels ? "Text layer remains editable; edit text settings instead" : "Layer pixels are locked");
  return true;
}

function guardPositionEditing(layer) {
  if (!layer?.lockPosition) return false;
  updateStatus("Layer position is locked");
  return true;
}

function targetLocksTransparency(layer, target) {
  return Boolean(layer?.lockTransparency && target === layer.canvas);
}

function guardTransparencyEditing(layer, target) {
  if (!targetLocksTransparency(layer, target)) return false;
  updateStatus("Transparent pixels are locked");
  return true;
}

function restoreCanvasAlpha(target, alphaSource) {
  const targetCtx = target.getContext("2d");
  const targetImage = targetCtx.getImageData(0, 0, target.width, target.height);
  const alphaData = alphaSource.getContext("2d").getImageData(0, 0, alphaSource.width, alphaSource.height).data;
  for (let i = 3; i < targetImage.data.length; i += 4) {
    targetImage.data[i] = alphaData[i];
  }
  targetCtx.putImageData(targetImage, 0, 0);
}

function preserveLockedTransparency(layer, target, edit) {
  const alphaSource = targetLocksTransparency(layer, target) ? cloneCanvas(target) : null;
  const result = edit();
  if (alphaSource) restoreCanvasAlpha(target, alphaSource);
  return result;
}

function resetAdjustments() {
  Object.keys(state.adjustments).forEach((key) => {
    state.adjustments[key] = 0;
    controls[key].value = "0";
    values[key].textContent = "0";
  });
}

function adjustmentFilterValue(adjustments) {
  const { brightness, contrast, saturation, hue, grayscale, blur } = adjustments;
  return [
    `brightness(${100 + brightness}%)`,
    `contrast(${100 + contrast}%)`,
    `saturate(${100 + saturation}%)`,
    `hue-rotate(${hue}deg)`,
    `grayscale(${grayscale}%)`,
    `blur(${blur}px)`,
  ].join(" ");
}

function filterValue() {
  return adjustmentFilterValue(state.adjustments);
}

function isFilterActive() {
  return isAdjustmentActive(state.adjustments);
}

function isAdjustmentActive(adjustments) {
  return Object.values(adjustments).some((value) => value !== 0);
}

function createSampleLayers() {
  state.doc = { width: 1600, height: 1000 };

  const background = makeCanvas(state.doc.width, state.doc.height);
  const bg = background.getContext("2d");
  const gradient = bg.createLinearGradient(0, 0, state.doc.width, state.doc.height);
  gradient.addColorStop(0, "#eff2f5");
  gradient.addColorStop(0.45, "#cbbd9e");
  gradient.addColorStop(1, "#2e5b63");
  bg.fillStyle = gradient;
  bg.fillRect(0, 0, state.doc.width, state.doc.height);
  bg.fillStyle = "#151719";
  bg.fillRect(0, 685, state.doc.width, 315);
  bg.fillStyle = "rgba(0, 0, 0, 0.28)";
  bg.beginPath();
  bg.ellipse(840, 700, 560, 58, 0, 0, Math.PI * 2);
  bg.fill();

  const shapes = makeCanvas(state.doc.width, state.doc.height);
  const shapeCtx = shapes.getContext("2d");
  shapeCtx.fillStyle = "#33b7a6";
  shapeCtx.fillRect(170, 225, 360, 420);
  shapeCtx.fillStyle = "#f3b746";
  shapeCtx.fillRect(590, 155, 265, 600);
  shapeCtx.fillStyle = "#e8645f";
  shapeCtx.fillRect(905, 255, 510, 335);
  shapeCtx.globalAlpha = 0.35;
  shapeCtx.fillStyle = "#ffffff";
  for (let i = 0; i < 11; i += 1) {
    shapeCtx.fillRect(240 + i * 86, 285 + (i % 3) * 54, 42, 42);
  }
  shapeCtx.globalAlpha = 1;

  const titleLayer = createLayer("Type", makeCanvas(1, 1), {
    type: "text",
    text: { content: "IL DESIGNER", fontFamily: "Georgia", size: 88, color: "#f7f7f2" },
  });
  renderTextLayer(titleLayer, { x: 170, y: 840 });

  state.layers = [
    createBackgroundLayer(background),
    createLayer("Color blocks", shapes),
    titleLayer,
  ];
  state.activeLayerId = titleLayer.id;
  state.fileName = "Untitled.psd";
  state.moveAutoSelect = true;
  state.showExtras = true;
  state.showGrid = false;
  state.showRulers = true;
  state.showGuides = true;
  state.guides = [];
  state.snapEnabled = true;
  state.snapToGrid = true;
  state.snapToGuides = true;
  state.visibleChannels = { red: true, green: true, blue: true };
  state.alphaChannels = [];
  state.alphaChannelCounter = 1;
  state.visibilitySoloRestore = null;
  state.backgroundColor = "#101114";
  state.lastSelection = null;
  state.workPath = [];
  state.lastPaintDoc = null;
  state.quickMaskMode = false;
  state.quickMaskCanvas = null;
}

function cloneAlphaChannels(channels) {
  return channels.map((channel) => ({
    ...channel,
    mask: cloneCanvas(channel.mask),
  }));
}

function snapshot() {
  return {
    fileName: state.fileName,
    doc: { ...state.doc },
    activeLayerId: state.activeLayerId,
    layerCounter: state.layerCounter,
    adjustmentCounter: state.adjustmentCounter,
    paintTarget: state.paintTarget,
    freeTransform: state.freeTransform,
    moveAutoSelect: state.moveAutoSelect,
    showExtras: state.showExtras,
    showGrid: state.showGrid,
    showRulers: state.showRulers,
    showGuides: state.showGuides,
    guides: state.guides.map((guide) => ({ ...guide })),
    snapEnabled: state.snapEnabled,
    snapToGrid: state.snapToGrid,
    snapToGuides: state.snapToGuides,
    visibleChannels: { ...state.visibleChannels },
    alphaChannels: cloneAlphaChannels(state.alphaChannels),
    alphaChannelCounter: state.alphaChannelCounter,
    selectionRect: state.selectionRect ? { ...state.selectionRect } : null,
    selectionMaskCanvas: state.selectionMaskCanvas ? cloneCanvas(state.selectionMaskCanvas) : null,
    selectionPath: state.selectionPath ? state.selectionPath.map((point) => ({ ...point })) : null,
    lastSelection: cloneSelectionState(state.lastSelection),
    workPath: state.workPath.map((point) => ({ ...point })),
    selectionKind: state.selectionKind,
    selectionInverse: state.selectionInverse,
    selectionFeather: state.selectionFeather,
    selectionMode: state.selectionMode,
    quickMaskMode: state.quickMaskMode,
    quickMaskCanvas: state.quickMaskCanvas ? cloneCanvas(state.quickMaskCanvas) : null,
    wandTolerance: state.wandTolerance,
    wandContiguous: state.wandContiguous,
    wandSampleAll: state.wandSampleAll,
    gradientMode: state.gradientMode,
    gradientReverse: state.gradientReverse,
    shapeMode: state.shapeMode,
    shapeFillColor: state.shapeFillColor,
    shapeStrokeEnabled: state.shapeStrokeEnabled,
    shapeStrokeColor: state.shapeStrokeColor,
    shapeStrokeSize: state.shapeStrokeSize,
    backgroundColor: state.backgroundColor,
    healStrength: state.healStrength,
    smudgeStrength: state.smudgeStrength,
    toneMode: state.toneMode,
    toneExposure: state.toneExposure,
    text: { ...state.text },
    cloneSource: state.cloneSource ? { ...state.cloneSource } : null,
    adjustments: { ...state.adjustments },
    layers: state.layers.map((layer) => ({
      ...layer,
      canvas: cloneCanvas(layer.canvas),
      mask: layer.mask ? cloneCanvas(layer.mask) : null,
      maskDisabled: Boolean(layer.maskDisabled),
      adjustments: layer.adjustments ? { ...layer.adjustments } : null,
      styles: cloneStyles(layer.styles),
      text: cloneTextOptions(layer.text),
      blendIfBlack: layer.blendIfBlack ?? 0,
      blendIfWhite: layer.blendIfWhite ?? 255,
    })),
  };
}

function restoreSnapshot(nextSnapshot) {
  state.fileName = nextSnapshot.fileName;
  state.doc = { ...nextSnapshot.doc };
  state.activeLayerId = nextSnapshot.activeLayerId;
  state.visibilitySoloRestore = null;
  state.lastPaintDoc = null;
  state.layerCounter = nextSnapshot.layerCounter;
  state.adjustmentCounter = nextSnapshot.adjustmentCounter || 0;
  state.paintTarget = nextSnapshot.paintTarget || "pixels";
  state.freeTransform = nextSnapshot.freeTransform || false;
  state.moveAutoSelect = nextSnapshot.moveAutoSelect !== false;
  state.showExtras = nextSnapshot.showExtras !== false;
  state.showGrid = Boolean(nextSnapshot.showGrid);
  state.showRulers = nextSnapshot.showRulers !== false;
  state.showGuides = nextSnapshot.showGuides !== false;
  state.guides = nextSnapshot.guides ? nextSnapshot.guides.map((guide) => ({ ...guide })) : [];
  state.snapEnabled = nextSnapshot.snapEnabled !== false;
  state.snapToGrid = nextSnapshot.snapToGrid !== false;
  state.snapToGuides = nextSnapshot.snapToGuides !== false;
  state.visibleChannels = nextSnapshot.visibleChannels ? { ...nextSnapshot.visibleChannels } : { red: true, green: true, blue: true };
  state.alphaChannels = nextSnapshot.alphaChannels ? cloneAlphaChannels(nextSnapshot.alphaChannels) : [];
  state.alphaChannelCounter = nextSnapshot.alphaChannelCounter || state.alphaChannels.length + 1;
  state.selectionRect = nextSnapshot.selectionRect ? { ...nextSnapshot.selectionRect } : null;
  state.selectionMaskCanvas = nextSnapshot.selectionMaskCanvas ? cloneCanvas(nextSnapshot.selectionMaskCanvas) : null;
  state.selectionPath = nextSnapshot.selectionPath ? nextSnapshot.selectionPath.map((point) => ({ ...point })) : null;
  state.lastSelection = cloneSelectionState(nextSnapshot.lastSelection);
  state.workPath = nextSnapshot.workPath ? nextSnapshot.workPath.map((point) => ({ ...point })) : [];
  state.selectionKind = nextSnapshot.selectionKind || "rect";
  state.selectionInverse = nextSnapshot.selectionInverse || false;
  state.selectionFeather = nextSnapshot.selectionFeather || 0;
  state.selectionMode = nextSnapshot.selectionMode || "new";
  state.quickMaskMode = Boolean(nextSnapshot.quickMaskMode);
  state.quickMaskCanvas = nextSnapshot.quickMaskCanvas ? cloneCanvas(nextSnapshot.quickMaskCanvas) : null;
  state.wandTolerance = nextSnapshot.wandTolerance ?? 36;
  state.wandContiguous = nextSnapshot.wandContiguous !== false;
  state.wandSampleAll = nextSnapshot.wandSampleAll !== false;
  state.gradientMode = nextSnapshot.gradientMode || "linear";
  state.gradientReverse = nextSnapshot.gradientReverse || false;
  state.shapeMode = nextSnapshot.shapeMode || "rectangle";
  state.shapeFillColor = nextSnapshot.shapeFillColor || "#f3d36b";
  state.shapeStrokeEnabled = nextSnapshot.shapeStrokeEnabled || false;
  state.shapeStrokeColor = nextSnapshot.shapeStrokeColor || "#f7f7f2";
  state.shapeStrokeSize = nextSnapshot.shapeStrokeSize ?? 6;
  state.backgroundColor = nextSnapshot.backgroundColor || "#101114";
  state.healStrength = nextSnapshot.healStrength ?? 0.72;
  state.smudgeStrength = nextSnapshot.smudgeStrength ?? 0.55;
  state.toneMode = nextSnapshot.toneMode || "dodge";
  state.toneExposure = nextSnapshot.toneExposure ?? 0.32;
  state.text = { content: "New text", fontFamily: "Georgia", size: 72, ...(nextSnapshot.text || {}) };
  state.cloneSource = nextSnapshot.cloneSource ? { ...nextSnapshot.cloneSource } : null;
  state.adjustments = { ...nextSnapshot.adjustments };
  state.layers = nextSnapshot.layers.map((layer) => ({
    ...layer,
    canvas: cloneCanvas(layer.canvas),
    mask: layer.mask ? cloneCanvas(layer.mask) : null,
    maskDisabled: Boolean(layer.maskDisabled),
    adjustments: layer.adjustments ? { ...layer.adjustments } : null,
    styles: cloneStyles(layer.styles),
    text: cloneTextOptions(layer.text),
    blendIfBlack: layer.blendIfBlack ?? 0,
    blendIfWhite: layer.blendIfWhite ?? 255,
  }));
  normalizeClippingMasks();
  state.cropRect = null;
  syncControlsFromState();
  renderAll();
}

function commitHistory(label) {
  const entry = { label, data: snapshot() };
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push(entry);
  if (state.history.length > 40) {
    state.history.shift();
  }
  state.historyIndex = state.history.length - 1;
  renderHistory();
  updateActionStates();
}

function replaceCurrentHistory(label) {
  if (state.historyIndex < 0) return;
  state.history[state.historyIndex] = { label, data: snapshot() };
  renderHistory();
  updateActionStates();
}

function undo() {
  if (state.historyIndex <= 0) return;
  state.historyIndex -= 1;
  restoreSnapshot(state.history[state.historyIndex].data);
}

function redo() {
  if (state.historyIndex >= state.history.length - 1) return;
  state.historyIndex += 1;
  restoreSnapshot(state.history[state.historyIndex].data);
}

function layerSourceWithMask(layer) {
  if (!layer.mask || layer.maskDisabled) return layer.canvas;
  const sourceCanvas = cloneCanvas(layer.canvas);
  const sourceCtx = sourceCanvas.getContext("2d");
  sourceCtx.globalCompositeOperation = "destination-in";
  sourceCtx.drawImage(layer.mask, 0, 0, sourceCanvas.width, sourceCanvas.height);
  return sourceCanvas;
}

function layerAlphaMask(layer, width, height, offsetX = 0, offsetY = 0) {
  const mask = makeCanvas(width, height);
  if (!layer || !layer.visible || layer.opacity <= 0) return mask;
  const maskCtx = mask.getContext("2d");
  maskCtx.globalAlpha = layer.opacity;
  maskCtx.drawImage(applyBlendIf(layerSourceWithMask(layer), layer), layer.x - offsetX, layer.y - offsetY);
  return mask;
}

function clipSourceToBase(sourceCanvas, layer, baseLayer) {
  if (!baseLayer) return sourceCanvas;
  const clipped = cloneCanvas(sourceCanvas);
  const clippedCtx = clipped.getContext("2d");
  clippedCtx.globalCompositeOperation = "destination-in";
  clippedCtx.drawImage(layerAlphaMask(baseLayer, sourceCanvas.width, sourceCanvas.height, layer.x, layer.y), 0, 0);
  return clipped;
}

function applyBlendIf(sourceCanvas, layer) {
  const black = layer?.blendIfBlack ?? 0;
  const white = layer?.blendIfWhite ?? 255;
  if (black <= 0 && white >= 255) return sourceCanvas;
  const blended = cloneCanvas(sourceCanvas);
  const blendedCtx = blended.getContext("2d", { willReadFrequently: true });
  const image = blendedCtx.getImageData(0, 0, blended.width, blended.height);
  const pixels = image.data;
  for (let offset = 0; offset < pixels.length; offset += 4) {
    if (pixels[offset + 3] === 0) continue;
    const luminance = pixels[offset] * 0.2126 + pixels[offset + 1] * 0.7152 + pixels[offset + 2] * 0.0722;
    if ((black > 0 && luminance <= black) || (white < 255 && luminance >= white)) {
      pixels[offset + 3] = 0;
    }
  }
  blendedCtx.putImageData(image, 0, 0);
  return blended;
}

function effectiveLayerSource(layer, clipBase = null) {
  return applyBlendIf(clipSourceToBase(layerSourceWithMask(layer), layer, clipBase), layer);
}

function layerHasPixelAt(layer, docPoint, index) {
  if (!layer || !layer.visible || layer.opacity <= 0 || layer.type === "adjustment") return false;
  const x = Math.floor(docPoint.x - layer.x);
  const y = Math.floor(docPoint.y - layer.y);
  if (x < 0 || y < 0 || x >= layer.canvas.width || y >= layer.canvas.height) return false;
  const usesMask = layer.mask && !layer.maskDisabled;
  let source = usesMask || layer.clipped ? layerSourceWithMask(layer) : layer.canvas;
  if (layer.clipped) {
    source = clipSourceToBase(source, layer, state.layers[index - 1]);
  }
  source = applyBlendIf(source, layer);
  return source.getContext("2d", { willReadFrequently: true }).getImageData(x, y, 1, 1).data[3] > 8;
}

function layerAtDocumentPoint(docPoint) {
  for (let index = state.layers.length - 1; index >= 0; index -= 1) {
    const layer = state.layers[index];
    if (layerHasPixelAt(layer, docPoint, index)) return layer;
  }
  return null;
}

function composeDocument(options = {}) {
  const output = makeCanvas(state.doc.width, state.doc.height);
  const outputCtx = output.getContext("2d");
  if (options.fillWhite) {
    outputCtx.fillStyle = "#ffffff";
    outputCtx.fillRect(0, 0, output.width, output.height);
  }

  state.layers.forEach((layer, index) => {
    if (!layer.visible || layer.opacity <= 0) return;
    const clipBase = layer.clipped ? state.layers[index - 1] : null;
    if (layer.type === "adjustment") {
      applyAdjustmentLayer(output, layer, clipBase);
      return;
    }
    const sourceCanvas = effectiveLayerSource(layer, clipBase);
    outputCtx.save();
    outputCtx.globalCompositeOperation = layer.blendMode;
    outputCtx.globalAlpha = layer.opacity;
    drawLayerStyles(outputCtx, sourceCanvas, layer);
    outputCtx.globalAlpha = layer.opacity * (layer.fillOpacity ?? 1);
    outputCtx.drawImage(sourceCanvas, layer.x, layer.y);
    outputCtx.restore();
  });

  if (!options.applyFilters || !isFilterActive()) {
    return output;
  }

  const filtered = makeCanvas(state.doc.width, state.doc.height);
  const filteredCtx = filtered.getContext("2d");
  if (options.fillWhite) {
    filteredCtx.fillStyle = "#ffffff";
    filteredCtx.fillRect(0, 0, filtered.width, filtered.height);
  }
  filteredCtx.filter = filterValue();
  filteredCtx.drawImage(output, 0, 0);
  return filtered;
}

function composeSnapshotDocument(snapshotData, options = {}) {
  const output = makeCanvas(snapshotData.doc.width, snapshotData.doc.height);
  const outputCtx = output.getContext("2d");
  if (options.fillWhite) {
    outputCtx.fillStyle = "#ffffff";
    outputCtx.fillRect(0, 0, output.width, output.height);
  }

  snapshotData.layers.forEach((layer, index) => {
    if (!layer.visible || layer.opacity <= 0) return;
    const clipBase = layer.clipped ? snapshotData.layers[index - 1] : null;
    if (layer.type === "adjustment") {
      applyAdjustmentLayer(output, layer, clipBase);
      return;
    }
    const sourceCanvas = effectiveLayerSource(layer, clipBase);
    outputCtx.save();
    outputCtx.globalCompositeOperation = layer.blendMode;
    outputCtx.globalAlpha = layer.opacity;
    drawLayerStyles(outputCtx, sourceCanvas, layer);
    outputCtx.globalAlpha = layer.opacity * (layer.fillOpacity ?? 1);
    outputCtx.drawImage(sourceCanvas, layer.x, layer.y);
    outputCtx.restore();
  });

  if (!options.applyFilters || !isAdjustmentActive(snapshotData.adjustments)) {
    return output;
  }

  const filtered = makeCanvas(snapshotData.doc.width, snapshotData.doc.height);
  const filteredCtx = filtered.getContext("2d");
  if (options.fillWhite) {
    filteredCtx.fillStyle = "#ffffff";
    filteredCtx.fillRect(0, 0, filtered.width, filtered.height);
  }
  filteredCtx.filter = adjustmentFilterValue(snapshotData.adjustments);
  filteredCtx.drawImage(output, 0, 0);
  return filtered;
}

function tintFromAlpha(source, color, opacity = 1) {
  const tinted = makeCanvas(source.width, source.height);
  const tintedCtx = tinted.getContext("2d");
  tintedCtx.drawImage(source, 0, 0);
  tintedCtx.globalCompositeOperation = "source-in";
  tintedCtx.globalAlpha = opacity;
  tintedCtx.fillStyle = color;
  tintedCtx.fillRect(0, 0, tinted.width, tinted.height);
  return tinted;
}

function drawLayerStyles(outputCtx, sourceCanvas, layer) {
  if (layer.type === "adjustment" || !layer.styles) return;
  const { shadow, stroke, glow } = layer.styles;

  if (shadow.enabled) {
    const shadowCanvas = tintFromAlpha(sourceCanvas, shadow.color, shadow.opacity);
    outputCtx.save();
    outputCtx.filter = `blur(${shadow.size}px)`;
    outputCtx.drawImage(shadowCanvas, layer.x + shadow.distance, layer.y + shadow.distance);
    outputCtx.restore();
  }

  if (glow.enabled) {
    const glowCanvas = tintFromAlpha(sourceCanvas, glow.color, glow.opacity);
    outputCtx.save();
    outputCtx.filter = `blur(${glow.size}px)`;
    outputCtx.drawImage(glowCanvas, layer.x, layer.y);
    outputCtx.restore();
  }

  if (stroke.enabled) {
    const strokeCanvas = tintFromAlpha(sourceCanvas, stroke.color, stroke.opacity);
    const radius = Math.max(1, Math.round(stroke.size));
    outputCtx.save();
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
      outputCtx.drawImage(strokeCanvas, layer.x + Math.cos(angle) * radius, layer.y + Math.sin(angle) * radius);
    }
    outputCtx.restore();
  }
}

function applyAdjustmentLayer(output, layer, clipBase = null) {
  if (!layer.adjustments || !isAdjustmentActive(layer.adjustments)) return;
  const original = cloneCanvas(output);
  const filtered = makeCanvas(output.width, output.height);
  const filteredCtx = filtered.getContext("2d");
  filteredCtx.filter = adjustmentFilterValue(layer.adjustments);
  filteredCtx.drawImage(output, 0, 0);
  const outputCtx = output.getContext("2d");
  outputCtx.clearRect(0, 0, output.width, output.height);
  outputCtx.drawImage(original, 0, 0);

  const hasEnabledMask = layer.mask && !layer.maskDisabled;
  if (!hasEnabledMask && !clipBase) {
    outputCtx.save();
    outputCtx.globalAlpha = layer.opacity;
    outputCtx.drawImage(filtered, 0, 0);
    outputCtx.restore();
    return;
  }

  const masked = cloneCanvas(filtered);
  const maskedCtx = masked.getContext("2d");
  maskedCtx.globalCompositeOperation = "destination-in";
  if (hasEnabledMask) {
    maskedCtx.drawImage(layer.mask, 0, 0, output.width, output.height);
  }
  if (clipBase) {
    maskedCtx.drawImage(layerAlphaMask(clipBase, output.width, output.height), 0, 0);
  }

  outputCtx.save();
  outputCtx.globalAlpha = layer.opacity;
  outputCtx.drawImage(masked, 0, 0);
  outputCtx.restore();
}

function visibleChannelCount() {
  return ["red", "green", "blue"].filter((channel) => state.visibleChannels[channel]).length;
}

function channelStatusText() {
  const alphaSuffix = state.alphaChannels.length ? ` + ${state.alphaChannels.length} alpha` : "";
  if (visibleChannelCount() === 3) return `RGB${alphaSuffix}`;
  const labels = [];
  if (state.visibleChannels.red) labels.push("R");
  if (state.visibleChannels.green) labels.push("G");
  if (state.visibleChannels.blue) labels.push("B");
  return `${labels.join("") || "None"}${alphaSuffix}`;
}

function channelPreviewCanvas(source) {
  if (visibleChannelCount() === 3) return source;
  const preview = cloneCanvas(source);
  const previewCtx = preview.getContext("2d");
  const imageData = previewCtx.getImageData(0, 0, preview.width, preview.height);
  const pixels = imageData.data;
  for (let index = 0; index < pixels.length; index += 4) {
    if (!state.visibleChannels.red) pixels[index] = 0;
    if (!state.visibleChannels.green) pixels[index + 1] = 0;
    if (!state.visibleChannels.blue) pixels[index + 2] = 0;
  }
  previewCtx.putImageData(imageData, 0, 0);
  return preview;
}

function updateCompositeCache(composite) {
  lastComposite = composite;
  if (!infoSampleCanvas || infoSampleCanvas.width !== composite.width || infoSampleCanvas.height !== composite.height) {
    infoSampleCanvas = makeCanvas(composite.width, composite.height);
    infoSampleCtx = infoSampleCanvas.getContext("2d", { willReadFrequently: true });
  }
  infoSampleCtx.clearRect(0, 0, infoSampleCanvas.width, infoSampleCanvas.height);
  infoSampleCtx.drawImage(composite, 0, 0);
}

function resizeDisplayCanvas() {
  const rect = stage.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function syncRulerVisibility() {
  dom.documentArea.classList.toggle("rulers-hidden", !state.showRulers);
}

function fitBaseScale() {
  const rect = stage.getBoundingClientRect();
  const padding = 84;
  return Math.max(0.01, Math.min(
    (rect.width - padding) / state.doc.width,
    (rect.height - padding) / state.doc.height,
  ));
}

function zoomPercentText() {
  return `${Math.round(state.view.scale * 100)}%`;
}

function updateNavigatorZoomSlider() {
  const min = Number(controls.navigatorZoomSlider.min);
  const max = Number(controls.navigatorZoomSlider.max);
  controls.navigatorZoomSlider.value = String(clamp(Math.round(state.view.scale * 100), min, max));
}

function calculateView() {
  const rect = stage.getBoundingClientRect();
  const baseScale = fitBaseScale();
  const scale = Math.max(0.04, baseScale * state.zoom);
  const w = state.doc.width * scale;
  const h = state.doc.height * scale;
  state.view = {
    x: (rect.width - w) / 2 + state.pan.x,
    y: (rect.height - h) / 2 + state.pan.y,
    w,
    h,
    scale,
  };
}

function render() {
  syncRulerVisibility();
  resizeDisplayCanvas();
  calculateView();
  renderRulers();
  const rect = stage.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 22;
  ctx.fillStyle = "#08090b";
  ctx.fillRect(state.view.x, state.view.y, state.view.w, state.view.h);
  ctx.restore();

  ctx.save();
  ctx.translate(state.view.x, state.view.y);
  ctx.scale(state.view.scale, state.view.scale);
  drawCheckerboard(ctx, state.doc.width, state.doc.height, 24);
  ctx.restore();

  const composite = composeDocument({ applyFilters: true });
  updateCompositeCache(composite);
  const preview = channelPreviewCanvas(composite);
  ctx.drawImage(preview, state.view.x, state.view.y, state.view.w, state.view.h);
  renderNavigator(preview);
  renderHistogram(preview);

  if (state.showExtras) {
    drawGridOverlay();
    drawGuidesOverlay();
    drawActiveLayerOutline();
    drawCloneSourceOverlay();
  }
  if (state.quickMaskMode) drawQuickMaskOverlay();
  else if (state.showExtras) drawSelectionOverlay();
  drawLassoPreview();
  drawZoomMarqueeOverlay();
  drawGradientPreview();
  drawShapePreview();
  if (state.showExtras) drawWorkPathOverlay();
  drawCropOverlay();
  drawBrushCursorOverlay();
  updateStatus();
}

function renderAll() {
  updateMeta();
  renderLayerList();
  renderAlphaChannels();
  renderHistorySnapshots();
  renderHistory();
  updateToolUi();
  updateActionStates();
  render();
}

function drawGridOverlay() {
  if (!state.showGrid) return;
  const spacing = 100;
  ctx.save();
  ctx.beginPath();
  ctx.rect(state.view.x, state.view.y, state.view.w, state.view.h);
  ctx.clip();
  ctx.strokeStyle = "rgba(94, 161, 255, 0.22)";
  ctx.lineWidth = 1;
  for (let x = spacing; x < state.doc.width; x += spacing) {
    const viewX = Math.round(state.view.x + x * state.view.scale) + 0.5;
    ctx.beginPath();
    ctx.moveTo(viewX, state.view.y);
    ctx.lineTo(viewX, state.view.y + state.view.h);
    ctx.stroke();
  }
  for (let y = spacing; y < state.doc.height; y += spacing) {
    const viewY = Math.round(state.view.y + y * state.view.scale) + 0.5;
    ctx.beginPath();
    ctx.moveTo(state.view.x, viewY);
    ctx.lineTo(state.view.x + state.view.w, viewY);
    ctx.stroke();
  }
  ctx.restore();
}

function drawGuidesOverlay() {
  if (!state.showGuides || state.guides.length === 0) return;
  ctx.save();
  ctx.beginPath();
  ctx.rect(state.view.x, state.view.y, state.view.w, state.view.h);
  ctx.clip();
  ctx.strokeStyle = "rgba(70, 185, 255, 0.95)";
  ctx.lineWidth = 1;
  state.guides.forEach((guide) => {
    ctx.beginPath();
    if (guide.axis === "vertical") {
      const x = Math.round(state.view.x + guide.position * state.view.scale) + 0.5;
      ctx.moveTo(x, state.view.y);
      ctx.lineTo(x, state.view.y + state.view.h);
    } else {
      const y = Math.round(state.view.y + guide.position * state.view.scale) + 0.5;
      ctx.moveTo(state.view.x, y);
      ctx.lineTo(state.view.x + state.view.w, y);
    }
    ctx.stroke();
  });
  ctx.restore();
}

function hitGuide(viewPoint) {
  if (!state.showGuides) return null;
  let hit = null;
  let nearest = 7;
  state.guides.forEach((guide, index) => {
    if (guide.axis === "vertical") {
      if (viewPoint.y < state.view.y || viewPoint.y > state.view.y + state.view.h) return;
      const x = state.view.x + guide.position * state.view.scale;
      const distance = Math.abs(viewPoint.x - x);
      if (distance <= nearest) {
        hit = { index, axis: guide.axis };
        nearest = distance;
      }
      return;
    }
    if (viewPoint.x < state.view.x || viewPoint.x > state.view.x + state.view.w) return;
    const y = state.view.y + guide.position * state.view.scale;
    const distance = Math.abs(viewPoint.y - y);
    if (distance <= nearest) {
      hit = { index, axis: guide.axis };
      nearest = distance;
    }
  });
  return hit;
}

function guideCursor(axis) {
  return axis === "vertical" ? "col-resize" : "row-resize";
}

function guidePositionFromEvent(event, axis) {
  const rect = canvas.getBoundingClientRect();
  const docPoint = viewToDoc({
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  });
  return Math.round(axis === "vertical" ? docPoint.x : docPoint.y);
}

function guideInDocument(guide) {
  if (guide.axis === "vertical") return guide.position >= 0 && guide.position <= state.doc.width;
  return guide.position >= 0 && guide.position <= state.doc.height;
}

function guideStatus(guide) {
  const label = guide.axis === "vertical" ? "Vertical" : "Horizontal";
  return `${label} guide ${Math.round(guide.position)} px`;
}

function beginGuideDrag(event, index, wasNew = false) {
  const guide = state.guides[index];
  if (!guide) return false;
  state.drag = {
    type: "guide",
    index,
    axis: guide.axis,
    startPosition: guide.position,
    wasNew,
  };
  canvas.style.cursor = guideCursor(guide.axis);
  updateGuideDrag(event);
  return true;
}

function beginRulerGuide(event, axis) {
  if (!state.showRulers) return;
  event.preventDefault();
  state.showGuides = true;
  const position = guidePositionFromEvent(event, axis);
  state.guides.push({ axis, position });
  event.currentTarget.setPointerCapture(event.pointerId);
  beginGuideDrag(event, state.guides.length - 1, true);
}

function updateGuideDrag(event) {
  const guide = state.guides[state.drag.index];
  if (!guide) return;
  guide.position = guidePositionFromEvent(event, state.drag.axis);
  render();
  updateStatus(guideInDocument(guide) ? guideStatus(guide) : "Release outside canvas to remove guide");
}

function finishGuideDrag() {
  const guide = state.guides[state.drag.index];
  if (!guide) return null;
  const moved = Math.round(state.drag.startPosition) !== Math.round(guide.position);
  if (!guideInDocument(guide)) {
    state.guides.splice(state.drag.index, 1);
    if (!state.drag.wasNew) commitHistory("Delete guide");
    return state.drag.wasNew ? "Guide canceled" : "Guide removed";
  }
  guide.position = Math.round(guide.position);
  if (state.drag.wasNew || moved) {
    commitHistory(state.drag.wasNew ? `New ${guide.axis} guide` : "Move guide");
  }
  return guideStatus(guide);
}

function drawActiveLayerOutline() {
  const layer = activeLayer();
  if (!layer || !layer.visible || (state.activeTool !== "move" && !state.freeTransform)) return;
  const layerRect = activeLayerRect();
  if (!layerRect) return;
  const rect = docRectToView(layerRect);
  ctx.save();
  ctx.strokeStyle = "rgba(94, 161, 255, 0.95)";
  ctx.setLineDash(state.freeTransform ? [] : [7, 4]);
  ctx.lineWidth = 1;
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  if (state.freeTransform) {
    ctx.fillStyle = "#f7f9fb";
    ctx.strokeStyle = "#1a6bd8";
    ctx.setLineDash([]);
    const rotate = rotationHandle(rect);
    ctx.beginPath();
    ctx.moveTo(rect.x + rect.w / 2, rect.y);
    ctx.lineTo(rotate.x, rotate.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(rotate.x, rotate.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    cropHandles(rect).forEach((handle) => {
      ctx.fillRect(handle.x - 5, handle.y - 5, 10, 10);
      ctx.strokeRect(handle.x - 5, handle.y - 5, 10, 10);
    });
  }
  ctx.restore();
}

function renderNavigator(composite) {
  const rect = dom.navigatorCanvas.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return;
  const ratio = window.devicePixelRatio || 1;
  dom.navigatorCanvas.width = Math.max(1, Math.floor(rect.width * ratio));
  dom.navigatorCanvas.height = Math.max(1, Math.floor(rect.height * ratio));
  navigatorCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
  drawCheckerboard(navigatorCtx, rect.width, rect.height, 8);

  const metrics = navigatorMetrics();
  navigatorCtx.drawImage(composite, metrics.x, metrics.y, metrics.width, metrics.height);

  const topLeft = viewToDoc({ x: 0, y: 0 });
  const bottomRight = viewToDoc({ x: stage.clientWidth, y: stage.clientHeight });
  const frame = {
    x: clamp(topLeft.x, 0, state.doc.width),
    y: clamp(topLeft.y, 0, state.doc.height),
    w: clamp(bottomRight.x, 0, state.doc.width) - clamp(topLeft.x, 0, state.doc.width),
    h: clamp(bottomRight.y, 0, state.doc.height) - clamp(topLeft.y, 0, state.doc.height),
  };

  navigatorCtx.save();
  navigatorCtx.strokeStyle = "#5ea1ff";
  navigatorCtx.lineWidth = 1.5;
  navigatorCtx.strokeRect(metrics.x + frame.x * metrics.scale, metrics.y + frame.y * metrics.scale, frame.w * metrics.scale, frame.h * metrics.scale);
  navigatorCtx.restore();
  dom.navigatorZoom.textContent = zoomPercentText();
  updateNavigatorZoomSlider();
}

function navigatorMetrics() {
  const rect = dom.navigatorCanvas.getBoundingClientRect();
  const padding = 10;
  const scale = Math.min((rect.width - padding * 2) / state.doc.width, (rect.height - padding * 2) / state.doc.height);
  const width = state.doc.width * scale;
  const height = state.doc.height * scale;
  return {
    scale,
    width,
    height,
    x: (rect.width - width) / 2,
    y: (rect.height - height) / 2,
  };
}

function navigatorDocPointFromEvent(event) {
  const rect = dom.navigatorCanvas.getBoundingClientRect();
  const metrics = navigatorMetrics();
  return {
    x: clamp((event.clientX - rect.left - metrics.x) / metrics.scale, 0, state.doc.width),
    y: clamp((event.clientY - rect.top - metrics.y) / metrics.scale, 0, state.doc.height),
  };
}

function centerViewOnDocumentPoint(docPoint) {
  calculateView();
  const rect = stage.getBoundingClientRect();
  const width = state.doc.width * state.view.scale;
  const height = state.doc.height * state.view.scale;
  state.pan = {
    x: rect.width / 2 - docPoint.x * state.view.scale - (rect.width - width) / 2,
    y: rect.height / 2 - docPoint.y * state.view.scale - (rect.height - height) / 2,
  };
}

function updateNavigatorPan(event) {
  const point = navigatorDocPointFromEvent(event);
  centerViewOnDocumentPoint(point);
  render();
  updateStatus(`Navigator ${Math.round(point.x)}, ${Math.round(point.y)}`);
}

function renderHistogram(source) {
  const rect = dom.histogramCanvas.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return;
  const ratio = window.devicePixelRatio || 1;
  dom.histogramCanvas.width = Math.max(1, Math.floor(rect.width * ratio));
  dom.histogramCanvas.height = Math.max(1, Math.floor(rect.height * ratio));
  histogramCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
  histogramCtx.clearRect(0, 0, rect.width, rect.height);
  histogramCtx.fillStyle = "#111318";
  histogramCtx.fillRect(0, 0, rect.width, rect.height);

  const histograms = {
    red: new Array(256).fill(0),
    green: new Array(256).fill(0),
    blue: new Array(256).fill(0),
  };
  const sampleWidth = 256;
  const sampleHeight = Math.max(1, Math.round((source.height / source.width) * sampleWidth));
  const sample = makeCanvas(sampleWidth, sampleHeight);
  const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
  sampleCtx.drawImage(source, 0, 0, sample.width, sample.height);
  const pixels = sampleCtx.getImageData(0, 0, sample.width, sample.height).data;
  for (let pixel = 0; pixel < sample.width * sample.height; pixel += 1) {
    const index = pixel * 4;
    if (pixels[index + 3] === 0) continue;
    histograms.red[pixels[index]] += 1;
    histograms.green[pixels[index + 1]] += 1;
    histograms.blue[pixels[index + 2]] += 1;
  }

  const activeChannels = ["red", "green", "blue"].filter((channel) => state.visibleChannels[channel]);
  const max = Math.max(1, ...activeChannels.flatMap((channel) => histograms[channel]));
  const colors = {
    red: "rgba(232, 100, 95, 0.7)",
    green: "rgba(51, 183, 106, 0.7)",
    blue: "rgba(75, 123, 236, 0.7)",
  };

  histogramCtx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  histogramCtx.lineWidth = 1;
  for (let x = 0; x <= rect.width; x += rect.width / 4) {
    histogramCtx.beginPath();
    histogramCtx.moveTo(Math.round(x) + 0.5, 0);
    histogramCtx.lineTo(Math.round(x) + 0.5, rect.height);
    histogramCtx.stroke();
  }

  histogramCtx.globalCompositeOperation = "lighter";
  activeChannels.forEach((channel) => {
    histogramCtx.fillStyle = colors[channel];
    histograms[channel].forEach((count, bin) => {
      const x = (bin / 256) * rect.width;
      const height = (count / max) * (rect.height - 8);
      histogramCtx.fillRect(x, rect.height - height, Math.max(1, rect.width / 256), height);
    });
  });
  histogramCtx.globalCompositeOperation = "source-over";
  dom.histogramStatus.textContent = channelStatusText();
}

function drawSelectionOverlay() {
  const selection = selectionBounds();
  if (!selection) return;
  const rect = docRectToView(selection);
  ctx.save();
  const mask = selectionMask();
  if (mask) {
    const overlay = makeCanvas(state.doc.width, state.doc.height);
    const overlayCtx = overlay.getContext("2d");
    overlayCtx.fillStyle = "rgba(94, 161, 255, 0.16)";
    overlayCtx.fillRect(0, 0, overlay.width, overlay.height);
    overlayCtx.globalCompositeOperation = "destination-in";
    overlayCtx.drawImage(mask, 0, 0);
    ctx.drawImage(overlay, state.view.x, state.view.y, state.view.w, state.view.h);
  }

  if (state.selectionFeather > 0) {
    const feather = state.selectionFeather;
    const featherRect = clippedRect({
      x: selection.x - feather,
      y: selection.y - feather,
      w: selection.w + feather * 2,
      h: selection.h + feather * 2,
    });
    if (featherRect) {
      const preview = docRectToView(featherRect);
      ctx.strokeStyle = "rgba(243, 211, 107, 0.7)";
      ctx.setLineDash([2, 5]);
      ctx.lineWidth = 1;
      ctx.strokeRect(preview.x, preview.y, preview.w, preview.h);
    }
  }

  if (state.selectionPath?.length > 1) {
    strokeSelectionPath(state.selectionPath, true);
  } else {
    ctx.strokeStyle = "#ffffff";
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    ctx.strokeStyle = "#101114";
    ctx.lineDashOffset = 5;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  }
  ctx.restore();
}

function drawQuickMaskOverlay() {
  const mask = state.quickMaskCanvas || fullSelectionMask();
  const overlay = makeCanvas(state.doc.width, state.doc.height);
  const overlayCtx = overlay.getContext("2d");
  overlayCtx.fillStyle = "rgba(232, 64, 86, 0.42)";
  overlayCtx.fillRect(0, 0, overlay.width, overlay.height);
  overlayCtx.globalCompositeOperation = "destination-out";
  overlayCtx.drawImage(mask, 0, 0);
  ctx.drawImage(overlay, state.view.x, state.view.y, state.view.w, state.view.h);
}

function drawLassoPreview() {
  if (state.drag?.type !== "lasso" || state.drag.path.length < 2) return;
  ctx.save();
  strokeSelectionPath(state.drag.path, false);
  ctx.restore();
}

function drawZoomMarqueeOverlay() {
  if (state.drag?.type !== "zoom" || state.drag.zoomOut) return;
  const rect = normalizeRect({
    x: state.drag.startView.x,
    y: state.drag.startView.y,
    w: state.drag.currentView.x - state.drag.startView.x,
    h: state.drag.currentView.y - state.drag.startView.y,
  });
  if (rect.w < 8 || rect.h < 8) return;
  ctx.save();
  ctx.fillStyle = "rgba(94, 161, 255, 0.14)";
  ctx.strokeStyle = "rgba(247, 247, 242, 0.96)";
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 4]);
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.w, rect.h);
  ctx.restore();
}

function drawGradientPreview() {
  if (state.drag?.type !== "gradient") return;
  const start = docPointToView(state.drag.startDoc);
  const end = docPointToView(state.drag.currentDoc);
  ctx.save();
  ctx.strokeStyle = "#f3d36b";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([7, 5]);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#f7f7f2";
  ctx.strokeStyle = "#101114";
  [start, end].forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
  if (state.gradientMode === "radial") {
    ctx.strokeStyle = "rgba(243, 211, 107, 0.55)";
    ctx.beginPath();
    ctx.arc(start.x, start.y, Math.hypot(end.x - start.x, end.y - start.y), 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function shapeRectFromPoints(start, end, constrain) {
  let width = end.x - start.x;
  let height = end.y - start.y;
  if (constrain) {
    const size = Math.min(Math.abs(width), Math.abs(height));
    width = Math.sign(width || 1) * size;
    height = Math.sign(height || 1) * size;
  }
  return clippedRect({ x: start.x, y: start.y, w: width, h: height });
}

function drawShapePath(targetCtx, rect, method = "fill") {
  if (state.shapeMode === "ellipse") {
    targetCtx.beginPath();
    targetCtx.ellipse(rect.x + rect.w / 2, rect.y + rect.h / 2, rect.w / 2, rect.h / 2, 0, 0, Math.PI * 2);
    targetCtx.closePath();
    if (method === "stroke") targetCtx.stroke();
    else targetCtx.fill();
    return;
  }
  if (method === "stroke") targetCtx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  else targetCtx.fillRect(rect.x, rect.y, rect.w, rect.h);
}

function drawShapePreview() {
  if (state.drag?.type !== "shape") return;
  const rect = shapeRectFromPoints(state.drag.startDoc, state.drag.currentDoc, state.drag.constrain);
  if (!rect) return;
  const viewRect = docRectToView(rect);
  ctx.save();
  ctx.fillStyle = rgbaString(state.shapeFillColor, 0.24);
  drawShapePath(ctx, viewRect);
  if (state.shapeStrokeEnabled) {
    ctx.strokeStyle = state.shapeStrokeColor;
    ctx.lineWidth = Math.max(1, state.shapeStrokeSize * state.view.scale);
    drawShapePath(ctx, viewRect, "stroke");
  }
  ctx.strokeStyle = "#f7f7f2";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([7, 5]);
  drawShapePath(ctx, viewRect, "stroke");
  ctx.restore();
}

function drawWorkPathOverlay() {
  if (state.workPath.length === 0) return;
  ctx.save();
  ctx.strokeStyle = "rgba(70, 185, 255, 0.95)";
  ctx.fillStyle = "#f7f7f2";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  const first = docPointToView(state.workPath[0]);
  ctx.beginPath();
  ctx.moveTo(first.x, first.y);
  state.workPath.slice(1).forEach((point) => {
    const view = docPointToView(point);
    ctx.lineTo(view.x, view.y);
  });
  ctx.stroke();
  ctx.setLineDash([]);
  state.workPath.forEach((point, index) => {
    const view = docPointToView(point);
    ctx.beginPath();
    ctx.arc(view.x, view.y, index === state.workPath.length - 1 ? 5 : 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
  ctx.restore();
}

function drawCloneSourceOverlay() {
  if (state.activeTool !== "clone" || !state.cloneSource) return;
  const point = docPointToView(state.cloneSource);
  ctx.save();
  ctx.strokeStyle = "#f3d36b";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(point.x, point.y, Math.max(8, state.brush.size * state.view.scale * 0.5), 0, Math.PI * 2);
  ctx.moveTo(point.x - 10, point.y);
  ctx.lineTo(point.x + 10, point.y);
  ctx.moveTo(point.x, point.y - 10);
  ctx.lineTo(point.x, point.y + 10);
  ctx.stroke();
  ctx.restore();
}

function isBrushPreviewTool(tool = state.activeTool) {
  return ["brush", "eraser", "heal", "clone", "historyBrush", "smudge", "tone"].includes(tool);
}

function updateBrushPreview(docPoint, fromCanvas = true) {
  const next = fromCanvas && isBrushPreviewTool() && inDocument(docPoint)
    ? normalizePathPoint(docPoint)
    : null;
  const current = state.brushPreviewDoc;
  const changed = Boolean(next) !== Boolean(current) || (next && current && (Math.abs(next.x - current.x) > 0.5 || Math.abs(next.y - current.y) > 0.5));
  state.brushPreviewDoc = next;
  return changed;
}

function clearBrushPreview() {
  if (!state.brushPreviewDoc) return false;
  state.brushPreviewDoc = null;
  return true;
}

function drawBrushCursorOverlay() {
  if (!state.brushPreviewDoc || !isBrushPreviewTool()) return;
  const point = docPointToView(state.brushPreviewDoc);
  const size = Math.max(2, state.brush.size * state.view.scale);
  const half = size / 2;
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate((state.brush.angle * Math.PI) / 180);
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.78)";
  drawBrushCursorShape(half + 1);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  drawBrushCursorShape(half);
  ctx.stroke();
  if (state.brush.hardness < 100 && state.brush.shape === "round") {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.38)";
    drawBrushCursorShape(Math.max(1, half * (state.brush.hardness / 100)));
    ctx.stroke();
  }
  ctx.restore();
}

function drawBrushCursorShape(half) {
  ctx.beginPath();
  if (state.brush.shape === "square") {
    ctx.rect(-half, -half, half * 2, half * 2);
    return;
  }
  if (state.brush.shape === "ellipse") {
    ctx.ellipse(0, 0, half, Math.max(1, half * 0.46), 0, 0, Math.PI * 2);
    return;
  }
  ctx.arc(0, 0, half, 0, Math.PI * 2);
}

function strokeSelectionPath(path, closed) {
  const start = docPointToView(path[0]);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  path.slice(1).forEach((point) => {
    const view = docPointToView(point);
    ctx.lineTo(view.x, view.y);
  });
  if (closed) ctx.closePath();
  ctx.strokeStyle = "#ffffff";
  ctx.setLineDash([6, 4]);
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.strokeStyle = "#101114";
  ctx.lineDashOffset = 5;
  ctx.stroke();
}

function drawCropOverlay() {
  if (state.activeTool !== "crop" || !state.cropRect) return;
  const crop = docRectToView(state.cropRect);
  const rect = stage.getBoundingClientRect();

  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.56)";
  ctx.fillRect(0, 0, rect.width, crop.y);
  ctx.fillRect(0, crop.y + crop.h, rect.width, rect.height - crop.y - crop.h);
  ctx.fillRect(0, crop.y, crop.x, crop.h);
  ctx.fillRect(crop.x + crop.w, crop.y, rect.width - crop.x - crop.w, crop.h);

  ctx.strokeStyle = "#f3d36b";
  ctx.lineWidth = 2;
  ctx.strokeRect(crop.x, crop.y, crop.w, crop.h);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.56)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(crop.x + (crop.w / 3) * i, crop.y);
    ctx.lineTo(crop.x + (crop.w / 3) * i, crop.y + crop.h);
    ctx.moveTo(crop.x, crop.y + (crop.h / 3) * i);
    ctx.lineTo(crop.x + crop.w, crop.y + (crop.h / 3) * i);
    ctx.stroke();
  }

  ctx.fillStyle = "#f7f7f2";
  cropHandles(crop).forEach((handle) => {
    ctx.fillRect(handle.x - 5, handle.y - 5, 10, 10);
  });
  ctx.restore();
}

function sampleCompositePixel(docPoint) {
  if (!inDocument(docPoint)) return null;
  const source = lastComposite || composeDocument({ applyFilters: true });
  if (!infoSampleCtx) updateCompositeCache(source);
  const x = Math.floor(clamp(docPoint.x, 0, state.doc.width - 1));
  const y = Math.floor(clamp(docPoint.y, 0, state.doc.height - 1));
  const pixel = infoSampleCtx.getImageData(x, y, 1, 1).data;
  const hex = `#${[pixel[0], pixel[1], pixel[2]].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
  return { x, y, r: pixel[0], g: pixel[1], b: pixel[2], hex };
}

function clearInfoPanel() {
  dom.infoX.textContent = "--";
  dom.infoY.textContent = "--";
  dom.infoR.textContent = "--";
  dom.infoG.textContent = "--";
  dom.infoB.textContent = "--";
  dom.infoHex.textContent = "--";
  dom.infoSwatch.style.background = "#101114";
}

function updateInfoPanel(docPoint) {
  const sample = sampleCompositePixel(docPoint);
  if (!sample) {
    clearInfoPanel();
    return;
  }
  dom.infoX.textContent = String(sample.x);
  dom.infoY.textContent = String(sample.y);
  dom.infoR.textContent = String(sample.r);
  dom.infoG.textContent = String(sample.g);
  dom.infoB.textContent = String(sample.b);
  dom.infoHex.textContent = sample.hex;
  dom.infoSwatch.style.background = sample.hex;
}

function docRectToView(rect) {
  return {
    x: state.view.x + rect.x * state.view.scale,
    y: state.view.y + rect.y * state.view.scale,
    w: rect.w * state.view.scale,
    h: rect.h * state.view.scale,
  };
}

function docPointToView(point) {
  return {
    x: state.view.x + point.x * state.view.scale,
    y: state.view.y + point.y * state.view.scale,
  };
}

function normalizeRect(rect) {
  const x = Math.min(rect.x, rect.x + rect.w);
  const y = Math.min(rect.y, rect.y + rect.h);
  return {
    x,
    y,
    w: Math.abs(rect.w),
    h: Math.abs(rect.h),
  };
}

function clippedRect(rect) {
  const normalized = normalizeRect(rect);
  const x = clamp(normalized.x, 0, state.doc.width);
  const y = clamp(normalized.y, 0, state.doc.height);
  const right = clamp(normalized.x + normalized.w, 0, state.doc.width);
  const bottom = clamp(normalized.y + normalized.h, 0, state.doc.height);
  const w = Math.max(0, right - x);
  const h = Math.max(0, bottom - y);
  return w > 0 && h > 0 ? { x, y, w, h } : null;
}

function selectionBounds() {
  return state.selectionRect ? clippedRect(state.selectionRect) : null;
}

function baseSelectionMask() {
  const selection = selectionBounds();
  if (!selection) return null;
  if (state.selectionMaskCanvas) return cloneCanvas(state.selectionMaskCanvas);

  const mask = makeCanvas(state.doc.width, state.doc.height);
  const maskCtx = mask.getContext("2d");
  const rect = pixelRect(selection);
  maskCtx.fillStyle = "#ffffff";
  maskCtx.fillRect(rect.x, rect.y, rect.w, rect.h);
  return mask;
}

function selectionDescription() {
  if (state.quickMaskMode) return "Quick Mask";
  const selection = selectionBounds();
  if (!selection) return "None";
  const feather = state.selectionFeather > 0 ? `, feather ${state.selectionFeather}px` : "";
  const sourceNames = { alpha: "Alpha", color: "Color range", grow: "Grow", lasso: "Lasso", magic: "Magic wand", rect: "Rect", similar: "Similar", subject: "Subject" };
  const source = sourceNames[state.selectionKind] || "Selection";
  if (state.selectionInverse) {
    return `Inverse ${source.toLowerCase()} ${Math.round(selection.w)} x ${Math.round(selection.h)} px${feather}`;
  }
  return `${source} ${Math.round(selection.w)} x ${Math.round(selection.h)} px${feather}`;
}

function pathDescription() {
  const count = state.workPath.length;
  if (count === 0) return "No path";
  return `${count} anchor${count === 1 ? "" : "s"}`;
}

function selectionMask() {
  let mask = baseSelectionMask();
  if (!mask) return null;
  if (state.selectionInverse) {
    const inverted = makeCanvas(state.doc.width, state.doc.height);
    const invertedCtx = inverted.getContext("2d");
    invertedCtx.fillStyle = "#ffffff";
    invertedCtx.fillRect(0, 0, inverted.width, inverted.height);
    invertedCtx.globalCompositeOperation = "destination-out";
    invertedCtx.drawImage(mask, 0, 0);
    mask = inverted;
  }
  if (state.selectionFeather <= 0) return mask;

  const blurred = makeCanvas(state.doc.width, state.doc.height);
  const blurredCtx = blurred.getContext("2d");
  blurredCtx.filter = `blur(${state.selectionFeather}px)`;
  blurredCtx.drawImage(mask, 0, 0);
  blurredCtx.filter = "none";
  return blurred;
}

function fullSelectionMask() {
  const mask = makeCanvas(state.doc.width, state.doc.height);
  const maskCtx = mask.getContext("2d");
  maskCtx.fillStyle = "#ffffff";
  maskCtx.fillRect(0, 0, mask.width, mask.height);
  return mask;
}

function enterQuickMask() {
  state.quickMaskCanvas = selectionMask() || fullSelectionMask();
  state.quickMaskMode = true;
  updateToolUi();
  render();
  updateStatus("Quick Mask mode");
  return true;
}

function exitQuickMask() {
  const mask = state.quickMaskCanvas;
  state.quickMaskMode = false;
  state.quickMaskCanvas = null;
  if (!mask) return false;
  const applied = applySelectionMask(mask, "Quick mask is empty", "Quick mask loaded as selection", "alpha");
  commitHistory("Quick mask selection");
  return applied;
}

function toggleQuickMask() {
  return state.quickMaskMode ? exitQuickMask() : enterQuickMask();
}

function cloneSelectionState(selection) {
  if (!selection?.selectionRect) return null;
  return {
    selectionRect: { ...selection.selectionRect },
    selectionMaskCanvas: selection.selectionMaskCanvas ? cloneCanvas(selection.selectionMaskCanvas) : null,
    selectionPath: selection.selectionPath ? selection.selectionPath.map((point) => ({ ...point })) : null,
    selectionKind: selection.selectionKind || "rect",
    selectionInverse: Boolean(selection.selectionInverse),
    selectionFeather: selection.selectionFeather || 0,
  };
}

function currentSelectionState() {
  if (!state.selectionRect) return null;
  return cloneSelectionState({
    selectionRect: state.selectionRect,
    selectionMaskCanvas: state.selectionMaskCanvas,
    selectionPath: state.selectionPath,
    selectionKind: state.selectionKind,
    selectionInverse: state.selectionInverse,
    selectionFeather: state.selectionFeather,
  });
}

function restoreSelectionState(selection) {
  const restored = cloneSelectionState(selection);
  if (!restored) return false;
  state.selectionRect = restored.selectionRect;
  state.selectionMaskCanvas = restored.selectionMaskCanvas;
  state.selectionPath = restored.selectionPath;
  state.selectionKind = restored.selectionKind;
  state.selectionInverse = restored.selectionInverse;
  state.selectionFeather = restored.selectionFeather;
  return true;
}

function alphaSelectionFromCanvas(source, offsetX = 0, offsetY = 0) {
  const mask = makeCanvas(state.doc.width, state.doc.height);
  const maskCtx = mask.getContext("2d", { willReadFrequently: true });
  maskCtx.drawImage(source, offsetX, offsetY);
  const imageData = maskCtx.getImageData(0, 0, mask.width, mask.height);
  const pixels = imageData.data;
  let minX = mask.width;
  let minY = mask.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < mask.height; y += 1) {
    for (let x = 0; x < mask.width; x += 1) {
      const index = (y * mask.width + x) * 4;
      if (pixels[index + 3] > 0) {
        pixels[index] = 255;
        pixels[index + 1] = 255;
        pixels[index + 2] = 255;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  if (maxX < 0) return null;
  maskCtx.putImageData(imageData, 0, 0);
  return {
    mask,
    rect: { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 },
  };
}

function loadAlphaSelection(source, offsetX, offsetY, label) {
  const selection = alphaSelectionFromCanvas(source, offsetX, offsetY);
  if (!selection) {
    updateStatus(`${label} has no pixels to select`);
    return false;
  }
  state.selectionRect = selection.rect;
  state.selectionMaskCanvas = selection.mask;
  state.selectionPath = null;
  state.selectionKind = "alpha";
  state.selectionInverse = false;
  updateToolUi();
  render();
  updateStatus(`${label} loaded as selection`);
  return true;
}

function loadLayerTransparencySelection(layer) {
  return loadAlphaSelection(layer.canvas, layer.x, layer.y, `${layer.name} transparency`);
}

function loadLayerMaskSelection(layer) {
  if (!layer.mask) return false;
  return loadAlphaSelection(layer.mask, layer.x, layer.y, `${layer.name} mask`);
}

function expandedAlphaMask(source, radius) {
  const output = makeCanvas(state.doc.width, state.doc.height);
  const outputCtx = output.getContext("2d");
  const r = Math.max(1, Math.min(32, Math.round(radius)));
  for (let y = -r; y <= r; y += 1) {
    for (let x = -r; x <= r; x += 1) {
      if (x * x + y * y <= r * r) {
        outputCtx.drawImage(source, x, y);
      }
    }
  }
  return output;
}

function invertedAlphaMask(source) {
  const output = makeCanvas(state.doc.width, state.doc.height);
  const outputCtx = output.getContext("2d");
  outputCtx.fillStyle = "#ffffff";
  outputCtx.fillRect(0, 0, output.width, output.height);
  outputCtx.globalCompositeOperation = "destination-out";
  outputCtx.drawImage(source, 0, 0);
  outputCtx.globalCompositeOperation = "source-over";
  return output;
}

function contractedAlphaMask(source, radius) {
  const output = cloneCanvas(source);
  const outputCtx = output.getContext("2d");
  const r = Math.max(1, Math.min(32, Math.round(radius)));
  outputCtx.globalCompositeOperation = "destination-in";
  for (let y = -r; y <= r; y += 1) {
    for (let x = -r; x <= r; x += 1) {
      if (x * x + y * y <= r * r) {
        outputCtx.drawImage(source, x, y);
      }
    }
  }
  outputCtx.globalCompositeOperation = "source-over";
  return output;
}

function thresholdAlphaMask(source, threshold = 128) {
  const output = cloneCanvas(source);
  const outputCtx = output.getContext("2d", { willReadFrequently: true });
  const imageData = outputCtx.getImageData(0, 0, output.width, output.height);
  const pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
    const alpha = pixels[i + 3] >= threshold ? 255 : 0;
    pixels[i] = 255;
    pixels[i + 1] = 255;
    pixels[i + 2] = 255;
    pixels[i + 3] = alpha;
  }
  outputCtx.putImageData(imageData, 0, 0);
  return output;
}

function smoothedAlphaMask(source, radius) {
  const blurred = makeCanvas(state.doc.width, state.doc.height);
  const blurredCtx = blurred.getContext("2d");
  blurredCtx.filter = `blur(${radius}px)`;
  blurredCtx.drawImage(source, 0, 0);
  blurredCtx.filter = "none";
  return thresholdAlphaMask(blurred);
}

function applySelectionMask(nextMask, emptyStatus, successStatus, selectionKind = "alpha") {
  const nextSelection = alphaSelectionFromCanvas(nextMask);
  if (!nextSelection) {
    state.selectionRect = null;
    state.selectionMaskCanvas = null;
    updateToolUi();
    render();
    updateStatus(emptyStatus);
    return false;
  }
  state.selectionRect = nextSelection.rect;
  state.selectionMaskCanvas = nextSelection.mask;
  state.selectionPath = null;
  state.selectionKind = selectionKind;
  state.selectionInverse = false;
  state.selectionFeather = 0;
  controls.selectionFeather.value = state.selectionFeather;
  values.selectionFeather.textContent = `${state.selectionFeather} px`;
  updateToolUi();
  render();
  updateStatus(successStatus);
  return true;
}

function clearSelectionState() {
  state.selectionRect = null;
  state.selectionMaskCanvas = null;
  state.selectionPath = null;
  state.selectionKind = "rect";
  state.selectionInverse = false;
  state.selectionFeather = 0;
}

function restoreSelectionForCombine(selection) {
  if (selection) {
    restoreSelectionState(selection);
    return;
  }
  clearSelectionState();
}

function selectionModeFromEvent(event) {
  if (event.shiftKey && event.altKey) return "intersect";
  if (event.shiftKey) return "add";
  if (event.altKey) return "subtract";
  return state.selectionMode;
}

function selectionModeAction(mode) {
  return {
    add: "Added",
    subtract: "Subtracted",
    intersect: "Intersected",
  }[mode] || "Selected";
}

function combineSelectionMask(nextMask, mode, selectionKind, newStatus, combinedSubject) {
  const current = selectionMask();
  if (mode === "new" || (mode === "add" && !current)) {
    return applySelectionMask(nextMask, "Selection is empty", newStatus, selectionKind);
  }
  if (!current) {
    updateStatus(`No selection to ${mode}`);
    return false;
  }

  const combined = cloneCanvas(current);
  const combinedCtx = combined.getContext("2d");
  if (mode === "add") {
    combinedCtx.drawImage(nextMask, 0, 0);
  } else if (mode === "subtract") {
    combinedCtx.globalCompositeOperation = "destination-out";
    combinedCtx.drawImage(nextMask, 0, 0);
  } else if (mode === "intersect") {
    combinedCtx.globalCompositeOperation = "destination-in";
    combinedCtx.drawImage(nextMask, 0, 0);
  }
  combinedCtx.globalCompositeOperation = "source-over";
  return applySelectionMask(combined, "Selection is empty", `${selectionModeAction(mode)} ${combinedSubject}`, "alpha");
}

function rectSelectionMask(rect) {
  const clipped = clippedRect(rect);
  if (!clipped) return null;
  const mask = makeCanvas(state.doc.width, state.doc.height);
  const maskCtx = mask.getContext("2d");
  const pixel = pixelRect(clipped);
  maskCtx.fillStyle = "#ffffff";
  maskCtx.fillRect(pixel.x, pixel.y, pixel.w, pixel.h);
  return mask;
}

function modifySelection(amount) {
  const source = selectionMask();
  if (!source) {
    updateStatus("No selection to modify");
    return false;
  }
  const radius = Math.max(1, Math.min(32, Math.round(Math.abs(amount))));
  const nextMask = amount > 0 ? expandedAlphaMask(source, radius) : invertedAlphaMask(expandedAlphaMask(invertedAlphaMask(source), radius));
  return applySelectionMask(nextMask, "Selection is empty", `${amount > 0 ? "Expanded" : "Contracted"} selection by ${radius}px`);
}

function borderSelection(radius) {
  const source = selectionMask();
  if (!source) {
    updateStatus("No selection to border");
    return false;
  }
  const r = Math.max(1, Math.min(32, Math.round(radius)));
  const outer = expandedAlphaMask(source, r);
  const inner = invertedAlphaMask(expandedAlphaMask(invertedAlphaMask(source), r));
  const border = cloneCanvas(outer);
  const borderCtx = border.getContext("2d");
  borderCtx.globalCompositeOperation = "destination-out";
  borderCtx.drawImage(inner, 0, 0);
  borderCtx.globalCompositeOperation = "source-over";

  return applySelectionMask(border, "Selection border is empty", `Bordered selection by ${r}px`);
}

function smoothSelection(radius) {
  const source = selectionMask();
  if (!source) {
    updateStatus("No selection to smooth");
    return false;
  }
  const r = Math.max(1, Math.min(32, Math.round(radius)));
  return applySelectionMask(smoothedAlphaMask(source, r), "Selection is empty", `Smoothed selection by ${r}px`);
}

function promptSelectionModify(direction) {
  const value = window.prompt(`${direction > 0 ? "Expand" : "Contract"} selection by pixels`, "8");
  if (value === null) return;
  const amount = Math.round(Number(value));
  if (!Number.isFinite(amount) || amount <= 0) {
    updateStatus("Enter a positive pixel amount");
    return;
  }
  modifySelection(direction * amount);
}

function promptSelectionBorder() {
  const value = window.prompt("Border selection by pixels", "8");
  if (value === null) return;
  const amount = Math.round(Number(value));
  if (!Number.isFinite(amount) || amount <= 0) {
    updateStatus("Enter a positive pixel amount");
    return;
  }
  borderSelection(amount);
}

function promptSelectionSmooth() {
  const value = window.prompt("Smooth selection by pixels", "8");
  if (value === null) return;
  const amount = Math.round(Number(value));
  if (!Number.isFinite(amount) || amount <= 0) {
    updateStatus("Enter a positive pixel amount");
    return;
  }
  smoothSelection(amount);
}

function promptSelectionFeather() {
  const value = window.prompt("Feather radius in pixels", String(state.selectionFeather || 8));
  if (value === null) return;
  const amount = Math.round(Number(value));
  if (!Number.isFinite(amount) || amount < 0) {
    updateStatus("Enter a non-negative pixel amount");
    return;
  }
  const nextFeather = clamp(amount, Number(controls.selectionFeather.min), Number(controls.selectionFeather.max));
  if (nextFeather === state.selectionFeather) {
    updateStatus(`Feather ${state.selectionFeather}px`);
    return;
  }
  state.selectionFeather = nextFeather;
  controls.selectionFeather.value = state.selectionFeather;
  values.selectionFeather.textContent = `${state.selectionFeather} px`;
  commitHistory("Feather selection");
  updateToolUi();
  render();
  updateStatus(`Feather ${state.selectionFeather}px`);
}

function latestAlphaChannel() {
  return state.alphaChannels[state.alphaChannels.length - 1] || null;
}

function saveSelectionChannel() {
  const mask = selectionMask();
  if (!mask) {
    updateStatus("No selection to save");
    return false;
  }
  const selection = alphaSelectionFromCanvas(mask);
  if (!selection) {
    updateStatus("Selection is empty");
    return false;
  }
  const name = `Alpha ${state.alphaChannelCounter}`;
  state.alphaChannelCounter += 1;
  state.alphaChannels.push({
    id: `alpha-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    mask: selection.mask,
  });
  commitHistory(`Save ${name}`);
  renderAlphaChannels();
  updateActionStates();
  updateStatus(`${name} saved from selection`);
  return true;
}

function loadAlphaChannel(id) {
  const channel = id ? state.alphaChannels.find((item) => item.id === id) : latestAlphaChannel();
  if (!channel) {
    updateStatus("No alpha channel to load");
    return false;
  }
  return applySelectionMask(channel.mask, `${channel.name} is empty`, `${channel.name} loaded as selection`, "alpha");
}

function deleteAlphaChannel(id) {
  const channel = state.alphaChannels.find((item) => item.id === id) || latestAlphaChannel();
  if (!channel) {
    updateStatus("No alpha channel to delete");
    return false;
  }
  state.alphaChannels = state.alphaChannels.filter((item) => item.id !== channel.id);
  commitHistory(`Delete ${channel.name}`);
  renderAlphaChannels();
  updateActionStates();
  updateStatus(`${channel.name} deleted`);
  return true;
}

function layerMaskFromSelection(layer, revealed, selection = selectionMask()) {
  if (!selection) return createMask(layer.canvas.width, layer.canvas.height, revealed);

  const mask = makeCanvas(layer.canvas.width, layer.canvas.height);
  const maskCtx = mask.getContext("2d");
  if (revealed) {
    maskCtx.drawImage(selection, -layer.x, -layer.y);
  } else {
    maskCtx.fillStyle = "#ffffff";
    maskCtx.fillRect(0, 0, mask.width, mask.height);
    maskCtx.globalCompositeOperation = "destination-out";
    maskCtx.drawImage(selection, -layer.x, -layer.y);
    maskCtx.globalCompositeOperation = "source-over";
  }
  return mask;
}

function selectionCopyBounds() {
  const selection = selectionBounds();
  if (!selection) return null;
  if (state.selectionInverse) {
    return { x: 0, y: 0, w: state.doc.width, h: state.doc.height };
  }
  const feather = state.selectionFeather;
  return clippedRect({
    x: selection.x - feather,
    y: selection.y - feather,
    w: selection.w + feather * 2,
    h: selection.h + feather * 2,
  });
}

function activeLayerBounds() {
  const layer = activeLayer();
  if (!layer) return null;
  return clippedRect({
    x: layer.x,
    y: layer.y,
    w: layer.canvas.width,
    h: layer.canvas.height,
  });
}

function activeLayerRect() {
  const layer = activeLayer();
  if (!layer) return null;
  if (state.freeTransform) {
    return layerContentRect(layer);
  }
  return {
    x: layer.x,
    y: layer.y,
    w: layer.canvas.width,
    h: layer.canvas.height,
  };
}

function layerContentRect(layer) {
  const layerCtx = layer.canvas.getContext("2d");
  const pixels = layerCtx.getImageData(0, 0, layer.canvas.width, layer.canvas.height).data;
  let minX = layer.canvas.width;
  let minY = layer.canvas.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < layer.canvas.height; y += 1) {
    for (let x = 0; x < layer.canvas.width; x += 1) {
      if (pixels[(y * layer.canvas.width + x) * 4 + 3] === 0) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < 0 || maxY < 0) {
    return {
      x: layer.x,
      y: layer.y,
      w: layer.canvas.width,
      h: layer.canvas.height,
    };
  }

  return {
    x: layer.x + minX,
    y: layer.y + minY,
    w: maxX - minX + 1,
    h: maxY - minY + 1,
  };
}

function extractLayerArea(source, layer, rect) {
  const next = makeCanvas(rect.w, rect.h);
  next.getContext("2d").drawImage(source, layer.x - rect.x, layer.y - rect.y);
  return next;
}

function resizeLayerCanvas(source, width, height) {
  const next = makeCanvas(width, height);
  const nextCtx = next.getContext("2d");
  nextCtx.imageSmoothingEnabled = true;
  nextCtx.imageSmoothingQuality = "high";
  nextCtx.drawImage(source, 0, 0, next.width, next.height);
  return next;
}

function cropHandles(rect) {
  const midX = rect.x + rect.w / 2;
  const midY = rect.y + rect.h / 2;
  const right = rect.x + rect.w;
  const bottom = rect.y + rect.h;
  return [
    { name: "nw", x: rect.x, y: rect.y },
    { name: "n", x: midX, y: rect.y },
    { name: "ne", x: right, y: rect.y },
    { name: "e", x: right, y: midY },
    { name: "se", x: right, y: bottom },
    { name: "s", x: midX, y: bottom },
    { name: "sw", x: rect.x, y: bottom },
    { name: "w", x: rect.x, y: midY },
  ];
}

function rotationHandle(rect) {
  return {
    name: "rotate",
    x: rect.x + rect.w / 2,
    y: rect.y - 34,
  };
}

function pointFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function viewToDoc(point) {
  return {
    x: (point.x - state.view.x) / state.view.scale,
    y: (point.y - state.view.y) / state.view.scale,
  };
}

function inDocument(point) {
  return point.x >= 0 && point.y >= 0 && point.x <= state.doc.width && point.y <= state.doc.height;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateMeta() {
  dom.fileMeta.textContent = `${state.fileName} - ${state.doc.width} x ${state.doc.height}px`;
  dom.docStatus.textContent = `${state.doc.width} x ${state.doc.height} px`;
}

function updateStatus(message) {
  dom.zoomStatus.textContent = zoomPercentText();
  dom.docStatus.textContent = `${state.doc.width} x ${state.doc.height} px`;
  dom.toolStatus.textContent = message || `${state.freeTransform ? "Free Transform" : toolInfo[state.activeTool].name} on ${activeLayer()?.name || "No layer"}`;
}

function addAiChatMessage(text, className) {
  const message = document.createElement("div");
  message.className = `ai-message ${className}`;

  const body = document.createElement("p");
  body.textContent = text;

  message.append(body);
  dom.aiChatThread.append(message);
  dom.aiChatThread.scrollTop = dom.aiChatThread.scrollHeight;
}

function sendAiChatMessage() {
  const text = controls.aiChatInput.value.trim();
  if (!text) return;
  addAiChatMessage(text, "ai-message-user");
  controls.aiChatInput.value = "";
}

function syncWorkspaceChrome() {
  dom.app.classList.toggle("chrome-hidden", state.chromeHidden);
  dom.app.classList.toggle("panels-hidden", state.panelsHidden && !state.chromeHidden);
}

function toggleWorkspaceChrome(panelsOnly = false) {
  if (panelsOnly) {
    state.chromeHidden = false;
    state.panelsHidden = !state.panelsHidden;
  } else {
    state.chromeHidden = !state.chromeHidden;
    if (state.chromeHidden) state.panelsHidden = false;
  }
  syncWorkspaceChrome();
  render();
  updateStatus(state.chromeHidden ? "Tools and panels hidden" : state.panelsHidden ? "Panels hidden" : "Panels visible");
}

function selectDockGroup(group) {
  state.dockGroup = group;
  document.querySelectorAll("[data-dock-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.dockTab === group);
  });
  document.querySelectorAll("[data-dock-group]").forEach((panel) => {
    panel.hidden = panel.dataset.dockGroup !== group;
  });
}

function updateToolUi() {
  document.querySelectorAll(".tool-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === state.activeTool);
  });
  document.querySelectorAll(".tool-group").forEach((group) => {
    group.classList.toggle("active", Boolean(group.querySelector(`[data-tool="${state.activeTool}"]`)));
  });
  dom.activeToolName.textContent = toolInfo[state.activeTool].name;
  dom.activeToolKey.textContent = toolInfo[state.activeTool].key;
  document.querySelectorAll(".options-bar [data-tools]").forEach((element) => {
    element.hidden = !element.dataset.tools.split(/\s+/).includes(state.activeTool);
  });
  buttons.applyCrop.disabled = !(state.activeTool === "crop" && state.cropRect);
  buttons.cancelCrop.disabled = !(state.activeTool === "crop" && state.cropRect);
  const layer = activeLayer();
  buttons.clearSelection.disabled = !state.selectionRect;
  buttons.deselect.disabled = !state.selectionRect;
  buttons.reselect.disabled = !state.lastSelection;
  buttons.invertSelection.disabled = !state.selectionRect;
  buttons.selectSubject.disabled = !layer || layer.type === "adjustment";
  buttons.selectSimilar.disabled = !state.selectionRect;
  buttons.growSelection.disabled = !state.selectionRect;
  buttons.saveSelectionChannel.disabled = !state.selectionRect;
  buttons.smoothSelection.disabled = !state.selectionRect;
  buttons.expandSelection.disabled = !state.selectionRect;
  buttons.contractSelection.disabled = !state.selectionRect;
  buttons.borderSelection.disabled = !state.selectionRect;
  buttons.contentAwareFill.disabled = !state.selectionRect;
  buttons.invertSelection.classList.toggle("active", Boolean(state.selectionRect && state.selectionInverse));
  buttons.quickMask.classList.toggle("active", state.quickMaskMode);
  buttons.freeTransform.classList.toggle("active", state.freeTransform);
  dom.selectionStatus.textContent = selectionDescription();
  dom.pathStatus.textContent = pathDescription();
}

function updateActionStates() {
  buttons.deleteLayer.disabled = state.layers.length <= 1;
  buttons.loadAlphaChannel.disabled = state.alphaChannels.length === 0;
  buttons.makePathSelection.disabled = state.workPath.length < 3;
  buttons.strokePath.disabled = state.workPath.length < 2;
  buttons.clearPath.disabled = state.workPath.length === 0;
  const layer = activeLayer();
  syncTextControlsFromState();
  if (layer) {
    if (!layer.mask && state.paintTarget === "mask") {
      state.paintTarget = "pixels";
    }
    const index = state.layers.findIndex((item) => item.id === layer.id);
    const backgroundActive = isBackgroundLayer(layer, index);
    const protectedBackground = isBackgroundLayer(state.layers[0], 0);
    controls.layerOpacity.value = Math.round(layer.opacity * 100);
    controls.layerFill.value = Math.round((layer.fillOpacity ?? 1) * 100);
    controls.blendIfBlack.value = layer.blendIfBlack ?? 0;
    controls.blendIfWhite.value = layer.blendIfWhite ?? 255;
    values.blendIfBlack.textContent = String(layer.blendIfBlack ?? 0);
    values.blendIfWhite.textContent = String(layer.blendIfWhite ?? 255);
    controls.blendMode.value = layer.blendMode;
    controls.layerOpacity.disabled = backgroundActive;
    controls.layerFill.disabled = backgroundActive;
    controls.blendIfBlack.disabled = backgroundActive || layer.type === "adjustment";
    controls.blendIfWhite.disabled = backgroundActive || layer.type === "adjustment";
    controls.blendMode.disabled = backgroundActive;
    controls.paintTarget.value = state.paintTarget;
    controls.paintTarget.disabled = !layer.mask;
    buttons.layerUp.disabled = backgroundActive || index === state.layers.length - 1;
    buttons.layerDown.disabled = backgroundActive || index <= 0 || (protectedBackground && index === 1);
    buttons.clipLayer.disabled = backgroundActive || index <= 0;
    buttons.clipLayer.classList.toggle("active", Boolean(layer.clipped));
    buttons.lockTransparency.classList.toggle("active", Boolean(layer.lockTransparency));
    buttons.lockPixels.classList.toggle("active", Boolean(layer.lockPixels));
    buttons.lockPosition.classList.toggle("active", Boolean(layer.lockPosition));
    buttons.lockAll.classList.toggle("active", Boolean(layer.lockTransparency && layer.lockPixels && layer.lockPosition));
    buttons.lockTransparency.disabled = backgroundActive;
    buttons.lockPixels.disabled = backgroundActive;
    buttons.lockPosition.disabled = backgroundActive;
    buttons.lockAll.disabled = backgroundActive;
    buttons.deleteLayer.disabled = state.layers.length <= 1 || backgroundActive;
    const alignDisabled = layer.type === "adjustment" || layer.lockPosition;
    [
      buttons.alignLeft,
      buttons.alignHorizontal,
      buttons.alignRight,
      buttons.alignTop,
      buttons.alignVertical,
      buttons.alignBottom,
    ].forEach((button) => {
      button.disabled = alignDisabled;
    });
    buttons.toggleMask.disabled = !layer.mask;
    buttons.toggleMask.textContent = layer.maskDisabled ? "Enable" : "Disable";
    buttons.toggleMask.classList.toggle("active", Boolean(layer.maskDisabled));
    buttons.applyMask.disabled = !layer.mask || layer.maskDisabled || layer.type === "adjustment" || pixelEditingLocked(layer, true);
    buttons.invertMask.disabled = !layer.mask;
    buttons.deleteMask.disabled = !layer.mask;
    buttons.contentAwareFill.disabled = !state.selectionRect || layer.type === "adjustment" || state.paintTarget === "mask" || pixelEditingLocked(layer, true);
    buttons.rasterizeLayerStyle.disabled = layer.type !== "pixel" || activeStyleCount(layer.styles) === 0 || layer.mask || layer.clipped || layer.lockPixels || layer.lockTransparency || layer.lockPosition;
    const filterDisabled = layer.type === "adjustment" || pixelEditingLocked(layer);
    buttons.filterBlur.disabled = filterDisabled;
    buttons.filterBoxBlur.disabled = filterDisabled;
    buttons.filterAverage.disabled = filterDisabled;
    buttons.filterSurfaceBlur.disabled = filterDisabled;
    buttons.filterSmartBlur.disabled = filterDisabled;
    buttons.filterRadialBlur.disabled = filterDisabled;
    buttons.filterTwirl.disabled = filterDisabled;
    buttons.filterPinch.disabled = filterDisabled;
    buttons.filterRipple.disabled = filterDisabled;
    buttons.filterSpherize.disabled = filterDisabled;
    buttons.filterZigZag.disabled = filterDisabled;
    buttons.filterWave.disabled = filterDisabled;
    buttons.filterPolar.disabled = filterDisabled;
    buttons.filterShear.disabled = filterDisabled;
    buttons.filterMotionBlur.disabled = filterDisabled;
    buttons.filterSharpen.disabled = filterDisabled;
    buttons.filterUnsharp.disabled = filterDisabled;
    buttons.filterSmartSharpen.disabled = filterDisabled;
    buttons.filterHighPass.disabled = filterDisabled;
    buttons.filterFindEdges.disabled = filterDisabled;
    buttons.filterOilPaint.disabled = filterDisabled;
    buttons.filterGlowingEdges.disabled = filterDisabled;
    buttons.filterEmboss.disabled = filterDisabled;
    buttons.filterDiffuse.disabled = filterDisabled;
    buttons.filterWind.disabled = filterDisabled;
    buttons.filterTraceContour.disabled = filterDisabled;
    buttons.filterExtrude.disabled = filterDisabled;
    buttons.filterTiles.disabled = filterDisabled;
    buttons.filterSolarize.disabled = filterDisabled;
    buttons.filterClouds.disabled = filterDisabled;
    buttons.filterDifferenceClouds.disabled = filterDisabled;
    buttons.filterLensFlare.disabled = filterDisabled;
    buttons.filterFibers.disabled = filterDisabled;
    buttons.filterLightingEffects.disabled = filterDisabled;
    buttons.filterNoise.disabled = filterDisabled;
    buttons.filterReduceNoise.disabled = filterDisabled;
    buttons.filterDespeckle.disabled = filterDisabled;
    buttons.filterDustScratches.disabled = filterDisabled;
    buttons.filterMedian.disabled = filterDisabled;
    buttons.filterColorHalftone.disabled = filterDisabled;
    buttons.filterCrystallize.disabled = filterDisabled;
    buttons.filterPointillize.disabled = filterDisabled;
    buttons.filterFragment.disabled = filterDisabled;
    buttons.filterFacet.disabled = filterDisabled;
    buttons.filterMezzotint.disabled = filterDisabled;
    buttons.filterMosaic.disabled = filterDisabled;
    buttons.filterOffset.disabled = filterDisabled;
    buttons.filterMaximum.disabled = filterDisabled;
    buttons.filterMinimum.disabled = filterDisabled;
    dom.maskStatus.textContent = layer.mask ? `${layer.maskDisabled ? "Disabled" : state.paintTarget === "mask" ? "Editing" : "Available"} on ${layer.name}` : "No mask";
    syncAdjustmentControls();
    syncLayerStyleControls(layer);
  }
}

function currentAdjustmentValues() {
  const layer = activeLayer();
  return layer?.type === "adjustment" && layer.adjustments ? layer.adjustments : state.adjustments;
}

function syncAdjustmentControls() {
  const adjustments = currentAdjustmentValues();
  Object.keys(defaultAdjustments).forEach((key) => {
    controls[key].value = adjustments[key];
    values[key].textContent = String(adjustments[key]);
  });
}

function syncLayerStyleControls(layer = activeLayer()) {
  const disabled = !layer || layer.type === "adjustment";
  const styles = cloneStyles(layer?.styles);

  controls.shadowEnabled.checked = styles.shadow.enabled;
  controls.shadowDistance.value = styles.shadow.distance;
  controls.shadowSize.value = styles.shadow.size;
  controls.shadowColor.value = styles.shadow.color;
  values.shadowDistance.textContent = String(styles.shadow.distance);
  values.shadowSize.textContent = String(styles.shadow.size);

  controls.strokeEnabled.checked = styles.stroke.enabled;
  controls.strokeSize.value = styles.stroke.size;
  controls.strokeColor.value = styles.stroke.color;
  values.strokeSize.textContent = String(styles.stroke.size);

  controls.glowEnabled.checked = styles.glow.enabled;
  controls.glowSize.value = styles.glow.size;
  controls.glowColor.value = styles.glow.color;
  values.glowSize.textContent = String(styles.glow.size);

  [
    controls.shadowEnabled,
    controls.shadowDistance,
    controls.shadowSize,
    controls.shadowColor,
    controls.strokeEnabled,
    controls.strokeSize,
    controls.strokeColor,
    controls.glowEnabled,
    controls.glowSize,
    controls.glowColor,
  ].forEach((control) => {
    control.disabled = disabled;
  });

  dom.styleStatus.textContent = disabled ? "Unavailable" : `${activeStyleCount(styles)} active`;
}

function activeTextSettings() {
  const layer = activeLayer();
  return layer?.type === "text" && layer.text ? layer.text : state.text;
}

function syncTextControlsFromState() {
  const text = activeTextSettings();
  if (controls.textContent.value !== text.content) controls.textContent.value = text.content;
  if (controls.textFont.value !== text.fontFamily) controls.textFont.value = text.fontFamily;
  if (Number(controls.textSize.value) !== Number(text.size)) controls.textSize.value = text.size;
}

function syncControlsFromState() {
  controls.brushSize.value = state.brush.size;
  controls.brushOpacity.value = Math.round(state.brush.opacity * 100);
  controls.brushColor.value = state.brush.color;
  controls.panelBrushColor.value = state.brush.color;
  controls.backgroundColor.value = state.backgroundColor;
  controls.panelBackgroundColor.value = state.backgroundColor;
  controls.brushHardness.value = state.brush.hardness;
  controls.brushSpacing.value = state.brush.spacing;
  controls.brushFlow.value = Math.round(state.brush.flow * 100);
  controls.moveAutoSelect.checked = state.moveAutoSelect;
  syncTextControlsFromState();
  controls.paintTarget.value = state.paintTarget;
  controls.selectionFeather.value = state.selectionFeather;
  controls.selectionMode.value = state.selectionMode;
  controls.wandTolerance.value = state.wandTolerance;
  controls.wandContiguous.checked = state.wandContiguous;
  controls.wandSampleAll.checked = state.wandSampleAll;
  controls.gradientMode.value = state.gradientMode;
  controls.gradientReverse.checked = state.gradientReverse;
  controls.shapeMode.value = state.shapeMode;
  controls.shapeFillColor.value = state.shapeFillColor;
  controls.shapeStrokeEnabled.checked = state.shapeStrokeEnabled;
  controls.shapeStrokeColor.value = state.shapeStrokeColor;
  controls.shapeStrokeSize.value = state.shapeStrokeSize;
  controls.healStrength.value = Math.round(state.healStrength * 100);
  controls.smudgeStrength.value = Math.round(state.smudgeStrength * 100);
  controls.toneMode.value = state.toneMode;
  controls.toneExposure.value = Math.round(state.toneExposure * 100);
  controls.channelRed.checked = state.visibleChannels.red;
  controls.channelGreen.checked = state.visibleChannels.green;
  controls.channelBlue.checked = state.visibleChannels.blue;
  values.brushSize.textContent = `${state.brush.size} px`;
  values.brushOpacity.textContent = `${Math.round(state.brush.opacity * 100)}%`;
  values.brushHardness.textContent = String(state.brush.hardness);
  values.brushSpacing.textContent = String(state.brush.spacing);
  values.brushFlow.textContent = `${Math.round(state.brush.flow * 100)}%`;
  values.selectionFeather.textContent = `${state.selectionFeather} px`;
  values.wandTolerance.textContent = String(state.wandTolerance);
  values.shapeStrokeSize.textContent = String(state.shapeStrokeSize);
  values.healStrength.textContent = `${Math.round(state.healStrength * 100)}%`;
  values.smudgeStrength.textContent = `${Math.round(state.smudgeStrength * 100)}%`;
  values.toneExposure.textContent = `${Math.round(state.toneExposure * 100)}%`;
  dom.colorValue.textContent = `FG ${state.brush.color}`;
  dom.channelStatus.textContent = channelStatusText();
  syncBrushPresetUi();

  syncAdjustmentControls();
  updateActionStates();
}

function syncBrushPresetUi() {
  document.querySelectorAll("[data-brush-preset]").forEach((button) => {
    button.classList.toggle("active", button.dataset.brushPreset === state.brush.preset);
  });
  dom.brushPresetName.textContent = brushPresets[state.brush.preset]?.name || "Custom";
}

function applyBrushPreset(presetId) {
  const preset = brushPresets[presetId];
  if (!preset) return;
  state.brush.preset = presetId;
  state.brush.shape = preset.shape;
  state.brush.hardness = preset.hardness;
  state.brush.spacing = preset.spacing;
  state.brush.flow = preset.flow;
  state.brush.angle = preset.angle;
  syncControlsFromState();
  updateStatus(`${preset.name} brush`);
  if (state.brushPreviewDoc) render();
}

function setBrushSize(value) {
  state.brush.size = clamp(Math.round(value), Number(controls.brushSize.min), Number(controls.brushSize.max));
  controls.brushSize.value = state.brush.size;
  values.brushSize.textContent = `${state.brush.size} px`;
  if (state.brushPreviewDoc) render();
}

function setBrushHardness(value) {
  state.brush.hardness = clamp(Math.round(value), Number(controls.brushHardness.min), Number(controls.brushHardness.max));
  state.brush.preset = "custom";
  controls.brushHardness.value = state.brush.hardness;
  values.brushHardness.textContent = String(state.brush.hardness);
  syncBrushPresetUi();
  if (state.brushPreviewDoc) render();
}

function adjustBrushShortcut(key, shiftKey) {
  const direction = key === "]" || key === "}" ? 1 : -1;
  if (shiftKey) {
    setBrushHardness(state.brush.hardness + direction * 10);
    updateStatus(`Brush hardness ${state.brush.hardness}`);
    return;
  }
  setBrushSize(state.brush.size + direction * 4);
  updateStatus(`Brush size ${state.brush.size} px`);
}

function opacityPercentFromKey(key) {
  return key === "0" ? 100 : Number(key) * 10;
}

function digitFromShortcutEvent(event) {
  if (/^[0-9]$/.test(event.key)) return event.key;
  if (/^Digit[0-9]$/.test(event.code)) return event.code.slice(5);
  if (/^Numpad[0-9]$/.test(event.code)) return event.code.slice(6);
  return null;
}

function numericOpacityTarget(shiftKey) {
  if (isBrushPreviewTool()) return shiftKey ? "brush-flow" : "brush-opacity";
  return shiftKey ? "layer-fill" : "layer-opacity";
}

function numericOpacityShortcutValue(key, shiftKey, timestamp) {
  const target = numericOpacityTarget(shiftKey);
  const previous = state.numericOpacityShortcut;
  const quickSecondKey = previous.target === target && previous.key && timestamp - previous.at <= 900;
  if (quickSecondKey) {
    state.numericOpacityShortcut = { target: null, key: "", at: 0, historyIndex: -1 };
    return {
      percent: Number(`${previous.key}${key}`),
      target,
      replacingHistoryIndex: previous.historyIndex,
    };
  }
  state.numericOpacityShortcut = { target, key, at: timestamp, historyIndex: state.historyIndex };
  return {
    percent: opacityPercentFromKey(key),
    target,
    replacingHistoryIndex: -1,
  };
}

function rememberNumericOpacityHistory(target) {
  if (state.numericOpacityShortcut.target === target) {
    state.numericOpacityShortcut.historyIndex = state.historyIndex;
  }
}

function setBrushOpacity(percent) {
  const value = clamp(Math.round(percent), Number(controls.brushOpacity.min), Number(controls.brushOpacity.max));
  state.brush.opacity = value / 100;
  controls.brushOpacity.value = value;
  values.brushOpacity.textContent = `${value}%`;
}

function setBrushFlow(percent) {
  const value = clamp(Math.round(percent), Number(controls.brushFlow.min), Number(controls.brushFlow.max));
  state.brush.flow = value / 100;
  state.brush.preset = "custom";
  controls.brushFlow.value = value;
  values.brushFlow.textContent = `${value}%`;
  syncBrushPresetUi();
}

function setForegroundColor(color, status = null) {
  state.brush.color = color;
  controls.brushColor.value = color;
  controls.panelBrushColor.value = color;
  dom.colorValue.textContent = `FG ${color}`;
  if (status) updateStatus(status);
}

function setBackgroundColor(color, status = null) {
  state.backgroundColor = color;
  controls.backgroundColor.value = color;
  controls.panelBackgroundColor.value = color;
  if (status) updateStatus(status);
}

function swapForegroundBackground() {
  const foreground = state.brush.color;
  setForegroundColor(state.backgroundColor);
  setBackgroundColor(foreground);
  updateStatus("Swapped foreground/background colors");
}

function resetDefaultColors() {
  setForegroundColor("#000000");
  setBackgroundColor("#ffffff");
  updateStatus("Default foreground/background colors");
}

function setWandTolerance(value) {
  state.wandTolerance = clamp(Math.round(value), Number(controls.wandTolerance.min), Number(controls.wandTolerance.max));
  controls.wandTolerance.value = state.wandTolerance;
  values.wandTolerance.textContent = String(state.wandTolerance);
}

function setLayerOpacity(percent, commit = false) {
  const layer = activeLayer();
  if (!layer) return;
  if (activeLayerIsBackground()) {
    controls.layerOpacity.value = Math.round(layer.opacity * 100);
    updateStatus("Use Layer from Background to change background opacity");
    return false;
  }
  const value = clamp(Math.round(percent), Number(controls.layerOpacity.min), Number(controls.layerOpacity.max));
  layer.opacity = value / 100;
  controls.layerOpacity.value = value;
  if (commit) {
    commitHistory("Layer opacity");
    renderAll();
    return true;
  }
  renderLayerList();
  render();
  return true;
}

function setLayerFill(percent, commit = false) {
  const layer = activeLayer();
  if (!layer) return;
  if (activeLayerIsBackground()) {
    controls.layerFill.value = Math.round((layer.fillOpacity ?? 1) * 100);
    updateStatus("Use Layer from Background to change background fill");
    return false;
  }
  const value = clamp(Math.round(percent), Number(controls.layerFill.min), Number(controls.layerFill.max));
  layer.fillOpacity = value / 100;
  controls.layerFill.value = value;
  if (commit) {
    commitHistory("Layer fill");
    renderAll();
    return true;
  }
  renderLayerList();
  render();
  return true;
}

function syncBlendIfControls(layer = activeLayer()) {
  const black = layer?.blendIfBlack ?? 0;
  const white = layer?.blendIfWhite ?? 255;
  controls.blendIfBlack.value = black;
  controls.blendIfWhite.value = white;
  values.blendIfBlack.textContent = String(black);
  values.blendIfWhite.textContent = String(white);
}

function setLayerBlendIf(edge, rawValue, commit = false) {
  const layer = activeLayer();
  if (!layer) return false;
  if (activeLayerIsBackground()) {
    syncBlendIfControls(layer);
    updateStatus("Use Layer from Background to change Blend If");
    return false;
  }
  if (layer.type === "adjustment") {
    syncBlendIfControls(layer);
    updateStatus("Blend If edits pixel layers");
    return false;
  }

  let black = layer.blendIfBlack ?? 0;
  let white = layer.blendIfWhite ?? 255;
  const value = Math.round(Number(rawValue));
  if (!Number.isFinite(value)) return false;
  if (edge === "black") {
    black = clamp(value, Number(controls.blendIfBlack.min), Math.min(Number(controls.blendIfBlack.max), white - 1));
  } else {
    white = clamp(value, Math.max(Number(controls.blendIfWhite.min), black + 1), Number(controls.blendIfWhite.max));
  }

  layer.blendIfBlack = black;
  layer.blendIfWhite = white;
  syncBlendIfControls(layer);
  if (commit) {
    commitHistory("Blend If");
    renderAll();
    return true;
  }
  renderLayerList();
  render();
  return true;
}

function applyNumericOpacityShortcut(key, shiftKey, timestamp = performance.now()) {
  const shortcut = numericOpacityShortcutValue(key, shiftKey, timestamp);
  const { percent, target } = shortcut;
  if (target === "brush-opacity" || target === "brush-flow") {
    if (target === "brush-flow") {
      setBrushFlow(percent);
      updateStatus(`Brush flow ${percent}%`);
      return;
    }
    setBrushOpacity(percent);
    updateStatus(`Brush opacity ${percent}%`);
    return;
  }

  const replaceHistory = shortcut.replacingHistoryIndex === state.historyIndex && shortcut.replacingHistoryIndex >= 0;
  if (target === "layer-fill") {
    if (setLayerFill(percent, !replaceHistory) === false) return;
    if (replaceHistory) replaceCurrentHistory("Layer fill");
    rememberNumericOpacityHistory(target);
    updateStatus(`Layer fill ${percent}%`);
    return;
  }
  if (setLayerOpacity(percent, !replaceHistory) === false) return;
  if (replaceHistory) replaceCurrentHistory("Layer opacity");
  rememberNumericOpacityHistory(target);
  updateStatus(`Layer opacity ${percent}%`);
}

function cycleLayerBlendMode(direction) {
  const layer = activeLayer();
  const modes = Array.from(controls.blendMode.options);
  if (!layer || modes.length === 0) return false;
  if (activeLayerIsBackground()) {
    updateStatus("Use Layer from Background to change background blend mode");
    return true;
  }
  const currentIndex = Math.max(0, modes.findIndex((option) => option.value === layer.blendMode));
  const nextIndex = (currentIndex + direction + modes.length) % modes.length;
  const nextMode = modes[nextIndex];
  layer.blendMode = nextMode.value;
  controls.blendMode.value = nextMode.value;
  commitHistory("Blend mode");
  renderAll();
  updateStatus(`Blend mode ${nextMode.textContent}`);
  return true;
}

function alignActiveLayer(kind) {
  const layer = activeLayer();
  if (!layer) return false;
  if (layer.type === "adjustment") {
    updateStatus("Adjustment layer has no position");
    return false;
  }
  if (guardPositionEditing(layer)) return false;

  const selection = selectionBounds();
  const target = selection || { x: 0, y: 0, w: state.doc.width, h: state.doc.height };
  const specs = {
    left: { axis: "x", label: "left edges", value: () => target.x },
    horizontal: { axis: "x", label: "horizontal centers", value: () => target.x + (target.w - layer.canvas.width) / 2 },
    right: { axis: "x", label: "right edges", value: () => target.x + target.w - layer.canvas.width },
    top: { axis: "y", label: "top edges", value: () => target.y },
    vertical: { axis: "y", label: "vertical centers", value: () => target.y + (target.h - layer.canvas.height) / 2 },
    bottom: { axis: "y", label: "bottom edges", value: () => target.y + target.h - layer.canvas.height },
  };
  const spec = specs[kind];
  if (!spec) return false;

  const nextValue = Math.round(spec.value());
  if (Math.abs(layer[spec.axis] - nextValue) < 0.01) {
    updateStatus(`${layer.name} already aligned to ${spec.label}`);
    return false;
  }

  layer[spec.axis] = nextValue;
  commitHistory(`Align ${spec.label}`);
  renderAll();
  updateStatus(`${layer.name} aligned to ${spec.label} of ${selection ? "selection" : "canvas"}`);
  return true;
}

function nudgeActiveLayer(dx, dy) {
  const layer = activeLayer();
  if (!layer) return false;
  if (layer.type === "adjustment") {
    updateStatus("Adjustment layer has no position");
    return true;
  }
  if (guardPositionEditing(layer)) return true;
  layer.x += dx;
  layer.y += dy;
  commitHistory("Nudge layer");
  renderAll();
  updateStatus(`Nudged ${layer.name} ${dx}, ${dy}`);
  return true;
}

function renderLayerList() {
  dom.layerList.replaceChildren();
  [...state.layers].reverse().forEach((layer) => {
    const row = document.createElement("button");
    row.className = `layer-row${layer.id === state.activeLayerId ? " active" : ""}${layer.clipped ? " clipped" : ""}${layer.lockTransparency || layer.lockPixels || layer.lockPosition ? " locked" : ""}${layer.maskDisabled ? " mask-off" : ""}`;
    row.type = "button";
    row.dataset.layerId = layer.id;

    const visibility = document.createElement("span");
    visibility.className = "visibility-toggle";
    visibility.dataset.action = "visibility";
    visibility.title = "Click to toggle visibility, Alt/Option-click to solo";
    visibility.textContent = layer.visible ? "ON" : "--";

    const thumb = document.createElement("canvas");
    thumb.className = "layer-thumb";
    thumb.dataset.action = "pixels";
    thumb.title = "Ctrl-click to load layer transparency";
    thumb.width = 96;
    thumb.height = 64;
    const thumbCtx = thumb.getContext("2d");
    drawCheckerboard(thumbCtx, thumb.width, thumb.height, 8);
    if (layer.type === "adjustment") {
      const gradient = thumbCtx.createLinearGradient(8, 8, thumb.width - 8, thumb.height - 8);
      gradient.addColorStop(0, "#101114");
      gradient.addColorStop(0.5, "#f7f7f2");
      gradient.addColorStop(1, "#5ea1ff");
      thumbCtx.fillStyle = gradient;
      thumbCtx.beginPath();
      thumbCtx.arc(thumb.width / 2, thumb.height / 2, 22, 0, Math.PI * 2);
      thumbCtx.fill();
      thumbCtx.fillStyle = "rgba(0, 0, 0, 0.44)";
      thumbCtx.fillRect(thumb.width / 2, 10, 2, thumb.height - 20);
    } else {
      const scale = Math.min((thumb.width - 6) / layer.canvas.width, (thumb.height - 6) / layer.canvas.height);
      const width = layer.canvas.width * scale;
      const height = layer.canvas.height * scale;
      thumbCtx.save();
      thumbCtx.globalAlpha = layer.visible ? layer.opacity : 0.32;
      thumbCtx.drawImage(layer.canvas, (thumb.width - width) / 2, (thumb.height - height) / 2, width, height);
      thumbCtx.restore();
    }

    const maskThumb = document.createElement(layer.mask ? "canvas" : "span");
    maskThumb.className = `mask-thumb${layer.mask ? "" : " empty"}${layer.maskDisabled ? " disabled" : ""}`;
    if (layer.mask) {
      maskThumb.dataset.action = "mask";
      maskThumb.title = "Click to edit mask, Ctrl-click to load mask selection, Shift-click to disable";
      maskThumb.width = 56;
      maskThumb.height = 64;
      const maskCtx = maskThumb.getContext("2d");
      drawCheckerboard(maskCtx, maskThumb.width, maskThumb.height, 8);
      const maskScale = Math.min((maskThumb.width - 6) / layer.mask.width, (maskThumb.height - 6) / layer.mask.height);
      const maskWidth = layer.mask.width * maskScale;
      const maskHeight = layer.mask.height * maskScale;
      maskCtx.drawImage(layer.mask, (maskThumb.width - maskWidth) / 2, (maskThumb.height - maskHeight) / 2, maskWidth, maskHeight);
      if (layer.maskDisabled) {
        maskCtx.strokeStyle = "#ff5b57";
        maskCtx.lineWidth = 7;
        maskCtx.beginPath();
        maskCtx.moveTo(4, maskThumb.height - 5);
        maskCtx.lineTo(maskThumb.width - 4, 5);
        maskCtx.stroke();
      }
    } else {
      maskThumb.textContent = "-";
    }

    const name = document.createElement("span");
    name.className = "layer-name";
    name.title = "Double-click to rename";
    name.textContent = layer.name;

    const meta = document.createElement("span");
    meta.className = "layer-meta";
    const styleCount = activeStyleCount(layer.styles);
    meta.textContent = layer.maskDisabled ? "MASK OFF" : layer.clipped ? "CLIP" : layer.type === "text" ? "TYPE" : layer.lockTransparency || layer.lockPixels || layer.lockPosition ? "LOCK" : layer.type === "adjustment" ? "ADJ" : styleCount ? `FX ${styleCount}` : `${Math.round(layer.opacity * 100)}%`;

    row.append(visibility, thumb, maskThumb, name, meta);
    dom.layerList.append(row);
  });
}

function captureLayerVisibility() {
  return state.layers.map((layer) => ({ id: layer.id, visible: layer.visible }));
}

function restoreLayerVisibility(savedVisibility) {
  const visibilityById = new Map(savedVisibility.map((item) => [item.id, item.visible]));
  state.layers.forEach((layer) => {
    if (visibilityById.has(layer.id)) {
      layer.visible = visibilityById.get(layer.id);
    }
  });
}

function onlyLayerVisible(layerId) {
  return state.layers.every((layer) => (layer.id === layerId ? layer.visible : !layer.visible));
}

function toggleLayerVisibility(layer, solo = false) {
  if (solo) {
    if (onlyLayerVisible(layer.id) && state.visibilitySoloRestore) {
      restoreLayerVisibility(state.visibilitySoloRestore);
      state.visibilitySoloRestore = null;
      commitHistory("Restore layer visibility");
      return "Restored layer visibility";
    }
    if (!state.visibilitySoloRestore) {
      state.visibilitySoloRestore = captureLayerVisibility();
    }
    state.layers.forEach((item) => {
      item.visible = item.id === layer.id;
    });
    commitHistory("Solo layer");
    return `Solo ${layer.name}`;
  }
  state.visibilitySoloRestore = null;
  layer.visible = !layer.visible;
  commitHistory(layer.visible ? "Show layer" : "Hide layer");
  return layer.visible ? "Show layer" : "Hide layer";
}

function renderAlphaChannels() {
  dom.alphaChannelList.replaceChildren();
  state.alphaChannels.forEach((channel) => {
    const row = document.createElement("div");
    row.className = "channel-row alpha-channel-row";
    row.dataset.alphaChannelId = channel.id;

    const swatch = document.createElement("span");
    swatch.className = "channel-swatch alpha";

    const name = document.createElement("span");
    name.textContent = channel.name;

    const load = document.createElement("button");
    load.className = "panel-link";
    load.type = "button";
    load.dataset.action = "load";
    load.textContent = "Load";

    const remove = document.createElement("button");
    remove.className = "panel-link";
    remove.type = "button";
    remove.dataset.action = "delete";
    remove.textContent = "Del";

    row.append(swatch, name, load, remove);
    dom.alphaChannelList.append(row);
  });
  dom.channelStatus.textContent = channelStatusText();
}

function renderHistory() {
  dom.historyList.replaceChildren();
  state.history.forEach((entry, index) => {
    const item = document.createElement("button");
    item.className = `history-item${index === state.historyIndex ? " current" : ""}`;
    item.type = "button";
    item.dataset.historyIndex = index;
    item.textContent = entry.label;
    dom.historyList.append(item);
  });
}

function historySnapshotThumbnail() {
  const source = composeDocument({ applyFilters: true });
  const thumb = makeCanvas(44, 30);
  const thumbCtx = thumb.getContext("2d");
  drawCheckerboard(thumbCtx, thumb.width, thumb.height, 6);
  const padding = 3;
  const scale = Math.min((thumb.width - padding * 2) / source.width, (thumb.height - padding * 2) / source.height);
  const width = source.width * scale;
  const height = source.height * scale;
  thumbCtx.imageSmoothingEnabled = true;
  thumbCtx.imageSmoothingQuality = "high";
  thumbCtx.drawImage(source, (thumb.width - width) / 2, (thumb.height - height) / 2, width, height);
  return thumb;
}

function cloneHistoryThumbnail(thumbnail) {
  const canvas = thumbnail ? cloneCanvas(thumbnail) : historySnapshotThumbnail();
  canvas.className = "history-snapshot-thumb";
  return canvas;
}

function renderHistorySnapshots() {
  dom.historySnapshotList.replaceChildren();
  if (state.historySnapshots.length === 0) {
    const empty = document.createElement("span");
    empty.className = "history-snapshot-empty";
    empty.textContent = "No snapshots";
    dom.historySnapshotList.append(empty);
    return;
  }

  state.historySnapshots.forEach((entry, index) => {
    const row = document.createElement("div");
    row.className = `history-snapshot-row${index === state.historyBrushSourceIndex ? " source" : ""}`;
    row.dataset.historySnapshotIndex = index;

    const restore = document.createElement("button");
    restore.className = "history-snapshot-item";
    restore.type = "button";
    restore.dataset.action = "restore";

    const thumb = cloneHistoryThumbnail(entry.thumbnail);
    const label = document.createElement("span");
    label.textContent = entry.name;
    restore.append(thumb, label);

    const source = document.createElement("button");
    source.className = "history-snapshot-source";
    source.type = "button";
    source.dataset.action = "source";
    source.textContent = "Src";
    source.title = "Use as History Brush source";

    const remove = document.createElement("button");
    remove.className = "history-snapshot-delete";
    remove.type = "button";
    remove.dataset.action = "delete";
    remove.textContent = "Del";

    row.append(restore, source, remove);
    dom.historySnapshotList.append(row);
  });
}

function setHistoryBrushSource(index) {
  if (!state.historySnapshots[index]) return;
  state.historyBrushSourceIndex = index;
  renderHistorySnapshots();
  updateStatus(`${state.historySnapshots[index].name} set as History Brush source`);
}

function createHistorySnapshot() {
  const name = `Snapshot ${state.historySnapshotCounter}`;
  state.historySnapshotCounter += 1;
  state.historySnapshots.push({ name, data: snapshot(), thumbnail: historySnapshotThumbnail() });
  state.historyBrushSourceIndex = state.historySnapshots.length - 1;
  renderHistorySnapshots();
  updateStatus(`${name} saved`);
}

function historyBrushSource() {
  return state.historySnapshots[state.historyBrushSourceIndex] || null;
}

function restoreHistorySnapshot(index) {
  const entry = state.historySnapshots[index];
  if (!entry) return;
  restoreSnapshot(entry.data);
  commitHistory(`Restore ${entry.name}`);
  updateStatus(`${entry.name} restored`);
}

function deleteHistorySnapshot(index) {
  const entry = state.historySnapshots[index];
  if (!entry) return;
  state.historySnapshots.splice(index, 1);
  if (state.historySnapshots.length === 0) {
    state.historyBrushSourceIndex = null;
  } else if (state.historyBrushSourceIndex === index) {
    state.historyBrushSourceIndex = Math.min(index, state.historySnapshots.length - 1);
  } else if (state.historyBrushSourceIndex > index) {
    state.historyBrushSourceIndex -= 1;
  }
  renderHistorySnapshots();
  updateStatus(`${entry.name} deleted`);
}

function selectTool(tool) {
  state.activeTool = tool;
  if (!isBrushPreviewTool(tool)) {
    state.brushPreviewDoc = null;
  }
  if (tool !== "move") {
    state.freeTransform = false;
  }
  if (tool === "crop" && !state.cropRect) {
    const marginX = state.doc.width * 0.12;
    const marginY = state.doc.height * 0.12;
    state.cropRect = {
      x: marginX,
      y: marginY,
      w: state.doc.width - marginX * 2,
      h: state.doc.height - marginY * 2,
    };
  }
  canvas.style.cursor = tool === "hand" ? "grab" : "crosshair";
  updateToolUi();
  render();
}

function isEditableTarget(target) {
  return target instanceof HTMLElement && target.matches("input, textarea, select, [contenteditable='true']");
}

function beginTemporaryHandTool() {
  if (temporaryHandTool || state.activeTool === "hand") return;
  temporaryHandTool = state.activeTool;
  restoreHandAfterDrag = false;
  selectTool("hand");
  updateStatus("Hold Space to pan");
}

function restoreTemporaryHandTool() {
  if (!temporaryHandTool) return false;
  const nextTool = temporaryHandTool;
  temporaryHandTool = null;
  restoreHandAfterDrag = false;
  selectTool(nextTool);
  return true;
}

function hitCrop(point) {
  if (!state.cropRect) return null;
  const viewRect = docRectToView(state.cropRect);
  const handle = cropHandles(viewRect).find((candidate) => Math.hypot(point.x - candidate.x, point.y - candidate.y) <= 12);
  if (handle) return handle.name;
  const inside =
    point.x >= viewRect.x &&
    point.x <= viewRect.x + viewRect.w &&
    point.y >= viewRect.y &&
    point.y <= viewRect.y + viewRect.h;
  return inside ? "move" : null;
}

function hitTransform(point) {
  if (!state.freeTransform) return null;
  const rect = activeLayerRect();
  if (!rect) return null;
  const viewRect = docRectToView(rect);
  const rotate = rotationHandle(viewRect);
  if (Math.hypot(point.x - rotate.x, point.y - rotate.y) <= 14) {
    return "rotate";
  }
  const handle = cropHandles(viewRect).find((candidate) => Math.hypot(point.x - candidate.x, point.y - candidate.y) <= 12);
  if (handle) return handle.name;
  const inside =
    point.x >= viewRect.x &&
    point.x <= viewRect.x + viewRect.w &&
    point.y >= viewRect.y &&
    point.y <= viewRect.y + viewRect.h;
  return inside ? "move" : null;
}

function cursorForTransform(hit) {
  const cursors = {
    n: "ns-resize",
    s: "ns-resize",
    e: "ew-resize",
    w: "ew-resize",
    nw: "nwse-resize",
    se: "nwse-resize",
    ne: "nesw-resize",
    sw: "nesw-resize",
    move: "move",
    rotate: "grab",
  };
  return cursors[hit] || "crosshair";
}

function toggleFreeTransform(force) {
  const layer = activeLayer();
  if (force !== false && layer?.type === "text") {
    updateStatus("Text layer remains editable; use Move or text settings");
    return;
  }
  if (force !== false && guardPositionEditing(layer)) return;
  state.freeTransform = Boolean(layer) && (force ?? !state.freeTransform);
  if (state.freeTransform) {
    state.activeTool = "move";
    state.cropRect = null;
  }
  updateToolUi();
  render();
}

function updateCropRect(handle, docPoint) {
  const start = state.drag.startRect;
  const point = {
    x: clamp(docPoint.x, 0, state.doc.width),
    y: clamp(docPoint.y, 0, state.doc.height),
  };
  const minSize = Math.min(48, Math.min(state.doc.width, state.doc.height) / 4);
  let left = start.x;
  let top = start.y;
  let right = start.x + start.w;
  let bottom = start.y + start.h;

  if (handle === "move") {
    const dx = point.x - state.drag.startDoc.x;
    const dy = point.y - state.drag.startDoc.y;
    left = clamp(start.x + dx, 0, state.doc.width - start.w);
    top = clamp(start.y + dy, 0, state.doc.height - start.h);
    state.cropRect = { x: left, y: top, w: start.w, h: start.h };
    return;
  }

  if (handle.includes("w")) left = clamp(point.x, 0, right - minSize);
  if (handle.includes("e")) right = clamp(point.x, left + minSize, state.doc.width);
  if (handle.includes("n")) top = clamp(point.y, 0, bottom - minSize);
  if (handle.includes("s")) bottom = clamp(point.y, top + minSize, state.doc.height);

  state.cropRect = {
    x: left,
    y: top,
    w: right - left,
    h: bottom - top,
  };
}

function snapAxis(value, axis) {
  if (!state.snapEnabled) return value;
  const threshold = Math.min(36, Math.max(6, 10 / state.view.scale));
  const targets = [];
  if (state.snapToGrid && state.showGrid) {
    for (let target = 0; target <= (axis === "x" ? state.doc.width : state.doc.height); target += 100) {
      targets.push(target);
    }
  }
  if (state.snapToGuides && state.showGuides) {
    const guideAxis = axis === "x" ? "vertical" : "horizontal";
    state.guides.forEach((guide) => {
      if (guide.axis === guideAxis) targets.push(guide.position);
    });
  }

  let snapped = value;
  let nearest = threshold + 1;
  targets.forEach((target) => {
    const distance = Math.abs(value - target);
    if (distance <= threshold && distance < nearest) {
      snapped = target;
      nearest = distance;
    }
  });
  return snapped;
}

function snapMovePoint(point) {
  return {
    x: snapAxis(point.x, "x"),
    y: snapAxis(point.y, "y"),
  };
}

function updateFreeTransform(handle, docPoint, keepAspect) {
  const layer = activeLayer();
  if (!layer) return;
  const start = state.drag.startRect;
  const minSize = 8;

  if (handle === "rotate") {
    const startCenter = {
      x: start.x + start.w / 2,
      y: start.y + start.h / 2,
    };
    const startAngle = Math.atan2(state.drag.startDoc.y - startCenter.y, state.drag.startDoc.x - startCenter.x);
    let angle = Math.atan2(docPoint.y - startCenter.y, docPoint.x - startCenter.x) - startAngle;
    if (keepAspect) {
      const snap = Math.PI / 12;
      angle = Math.round(angle / snap) * snap;
    }
    const rotated = rotateCanvas(state.drag.startCanvas, angle);
    layer.canvas = rotated;
    if (state.drag.startMask) {
      layer.mask = rotateCanvas(state.drag.startMask, angle);
    }
    layer.x = startCenter.x - rotated.width / 2;
    layer.y = startCenter.y - rotated.height / 2;
    return;
  }

  if (handle === "move") {
    const snapped = snapMovePoint({
      x: state.drag.startRect.x + docPoint.x - state.drag.startDoc.x,
      y: state.drag.startRect.y + docPoint.y - state.drag.startDoc.y,
    });
    layer.x = snapped.x;
    layer.y = snapped.y;
    layer.canvas = cloneCanvas(state.drag.startCanvas);
    layer.mask = state.drag.startMask ? cloneCanvas(state.drag.startMask) : layer.mask;
    return;
  }

  let left = start.x;
  let top = start.y;
  let right = start.x + start.w;
  let bottom = start.y + start.h;

  if (handle.includes("w")) left = Math.min(docPoint.x, right - minSize);
  if (handle.includes("e")) right = Math.max(docPoint.x, left + minSize);
  if (handle.includes("n")) top = Math.min(docPoint.y, bottom - minSize);
  if (handle.includes("s")) bottom = Math.max(docPoint.y, top + minSize);

  if (keepAspect && handle.length === 2) {
    const aspect = start.w / start.h;
    const width = right - left;
    const height = bottom - top;
    if (width / height > aspect) {
      const nextWidth = height * aspect;
      if (handle.includes("w")) left = right - nextWidth;
      else right = left + nextWidth;
    } else {
      const nextHeight = width / aspect;
      if (handle.includes("n")) top = bottom - nextHeight;
      else bottom = top + nextHeight;
    }
  }

  const width = Math.max(minSize, right - left);
  const height = Math.max(minSize, bottom - top);
  layer.x = left;
  layer.y = top;
  layer.canvas = resizeLayerCanvas(state.drag.startCanvas, width, height);
  if (state.drag.startMask) {
    layer.mask = resizeLayerCanvas(state.drag.startMask, width, height);
  }
}

function cropDocumentToRect(crop, historyLabel) {
  state.layers.forEach((layer) => {
    const next = makeCanvas(crop.w, crop.h);
    const nextCtx = next.getContext("2d");
    nextCtx.drawImage(layer.canvas, layer.x - crop.x, layer.y - crop.y);
    layer.canvas = next;
    if (layer.mask) {
      const nextMask = makeCanvas(crop.w, crop.h);
      nextMask.getContext("2d").drawImage(layer.mask, layer.x - crop.x, layer.y - crop.y);
      layer.mask = nextMask;
    }
    layer.x = 0;
    layer.y = 0;
  });
  state.alphaChannels = state.alphaChannels.map((channel) => {
    const nextMask = makeCanvas(crop.w, crop.h);
    nextMask.getContext("2d").drawImage(channel.mask, -crop.x, -crop.y);
    return { ...channel, mask: nextMask };
  });
  if (state.quickMaskCanvas) {
    const nextQuickMask = makeCanvas(crop.w, crop.h);
    nextQuickMask.getContext("2d").drawImage(state.quickMaskCanvas, -crop.x, -crop.y);
    state.quickMaskCanvas = nextQuickMask;
  }
  state.doc = { width: crop.w, height: crop.h };
  state.cropRect = null;
  state.selectionRect = null;
  state.selectionMaskCanvas = null;
  state.selectionPath = null;
  state.lastSelection = null;
  state.lastPaintDoc = null;
  state.selectionKind = "rect";
  state.selectionInverse = false;
  state.quickMaskMode = false;
  state.quickMaskCanvas = null;
  state.cloneSource = null;
  commitHistory(historyLabel);
  renderAll();
}

function applyCrop() {
  if (!state.cropRect) return;
  cropDocumentToRect(normalizeRect(state.cropRect), "Crop");
  selectTool("move");
}

function cancelCrop() {
  state.cropRect = null;
  selectTool("move");
}

function confirmModalToolAction() {
  if (state.activeTool === "crop" && state.cropRect) {
    applyCrop();
    updateStatus("Crop applied");
    return true;
  }
  if (state.freeTransform) {
    toggleFreeTransform(false);
    updateStatus("Free Transform committed");
    return true;
  }
  return false;
}

function cancelModalToolAction() {
  if (state.activeTool === "crop" && state.cropRect) {
    cancelCrop();
    updateStatus("Crop canceled");
    return true;
  }
  if (state.freeTransform) {
    toggleFreeTransform(false);
    updateStatus("Free Transform canceled");
    return true;
  }
  return false;
}

function drawBrushStamp(targetCtx, x, y, erase) {
  const size = state.brush.size;
  const radius = size / 2;
  const alpha = clamp(state.brush.opacity * state.brush.flow, 0.01, 1);
  const color = state.paintTarget === "mask" ? "#ffffff" : state.brush.color;
  const { r, g, b } = hexToRgb(color);

  targetCtx.save();
  targetCtx.globalAlpha = alpha;
  targetCtx.globalCompositeOperation = erase ? "destination-out" : "source-over";
  targetCtx.translate(x, y);
  targetCtx.rotate((state.brush.angle * Math.PI) / 180);

  if (state.brush.shape === "square") {
    targetCtx.fillStyle = color;
    targetCtx.fillRect(-radius, -radius, size, size);
    targetCtx.restore();
    return;
  }

  if (state.brush.shape === "ellipse") {
    targetCtx.fillStyle = color;
    targetCtx.beginPath();
    targetCtx.ellipse(0, 0, radius, Math.max(2, radius * 0.42), 0, 0, Math.PI * 2);
    targetCtx.fill();
    targetCtx.restore();
    return;
  }

  const hardness = clamp(state.brush.hardness / 100, 0, 1);
  if (hardness >= 0.98) {
    targetCtx.fillStyle = color;
  } else {
    const gradient = targetCtx.createRadialGradient(0, 0, Math.max(0, radius * hardness), 0, 0, radius);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    targetCtx.fillStyle = gradient;
  }

  targetCtx.beginPath();
  targetCtx.arc(0, 0, radius, 0, Math.PI * 2);
  targetCtx.fill();
  targetCtx.restore();
}

function makeBrushAlphaMask(alphaOverride) {
  const size = state.brush.size;
  const radius = size / 2;
  const alpha = clamp(alphaOverride ?? state.brush.opacity * state.brush.flow, 0.01, 1);
  const mask = makeCanvas(size, size);
  const maskCtx = mask.getContext("2d");
  maskCtx.save();
  maskCtx.globalAlpha = alpha;
  maskCtx.translate(radius, radius);
  maskCtx.rotate((state.brush.angle * Math.PI) / 180);

  if (state.brush.shape === "square") {
    maskCtx.fillStyle = "#ffffff";
    maskCtx.fillRect(-radius, -radius, size, size);
  } else if (state.brush.shape === "ellipse") {
    maskCtx.fillStyle = "#ffffff";
    maskCtx.beginPath();
    maskCtx.ellipse(0, 0, radius, Math.max(2, radius * 0.42), 0, 0, Math.PI * 2);
    maskCtx.fill();
  } else {
    const hardness = clamp(state.brush.hardness / 100, 0, 1);
    if (hardness >= 0.98) {
      maskCtx.fillStyle = "#ffffff";
    } else {
      const gradient = maskCtx.createRadialGradient(0, 0, Math.max(0, radius * hardness), 0, 0, radius);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      maskCtx.fillStyle = gradient;
    }
    maskCtx.beginPath();
    maskCtx.arc(0, 0, radius, 0, Math.PI * 2);
    maskCtx.fill();
  }

  maskCtx.restore();
  return mask;
}

function drawQuickMaskStroke(from, to, erase) {
  if (!state.quickMaskCanvas) state.quickMaskCanvas = fullSelectionMask();
  const maskCtx = state.quickMaskCanvas.getContext("2d");
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const spacing = Math.max(1, state.brush.size * (state.brush.spacing / 100));
  const steps = Math.max(1, Math.ceil(distance / spacing));
  const stamp = makeBrushAlphaMask();
  const radius = state.brush.size / 2;

  maskCtx.save();
  maskCtx.globalCompositeOperation = erase ? "destination-out" : "source-over";
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    maskCtx.drawImage(stamp, from.x + (to.x - from.x) * t - radius, from.y + (to.y - from.y) * t - radius);
  }
  maskCtx.restore();
  return true;
}

function replaceSelectedTargetPixels(target, edited, selectionLocal) {
  const patch = cloneCanvas(edited);
  const patchCtx = patch.getContext("2d");
  patchCtx.globalCompositeOperation = "destination-in";
  patchCtx.drawImage(selectionLocal, 0, 0);

  const targetCtx = target.getContext("2d");
  targetCtx.save();
  targetCtx.globalCompositeOperation = "destination-out";
  targetCtx.drawImage(selectionLocal, 0, 0);
  targetCtx.restore();
  targetCtx.drawImage(patch, 0, 0);
}

function editTargetWithinSelection(target, layer, edit) {
  const selectionLocal = selectionBounds() ? localSelectionMask(target, layer) : null;
  const editable = selectionLocal ? cloneCanvas(target) : target;
  const result = edit(editable);
  if (selectionLocal && result) replaceSelectedTargetPixels(target, editable, selectionLocal);
  return result;
}

function drawStroke(from, to, erase) {
  if (state.quickMaskMode) return drawQuickMaskStroke(from, to, erase);
  const layer = activeLayer();
  if (!layer || !layer.visible) return false;
  if (guardPixelEditing(layer)) return false;
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (erase && guardTransparencyEditing(layer, target)) return false;
  const start = { x: from.x - layer.x, y: from.y - layer.y };
  const end = { x: to.x - layer.x, y: to.y - layer.y };
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const spacing = Math.max(1, state.brush.size * (state.brush.spacing / 100));
  const steps = Math.max(1, Math.ceil(distance / spacing));

  return preserveLockedTransparency(layer, target, () => {
    return editTargetWithinSelection(target, layer, (editable) => {
      const layerCtx = editable.getContext("2d");
      for (let i = 0; i <= steps; i += 1) {
        const t = i / steps;
        drawBrushStamp(layerCtx, start.x + (end.x - start.x) * t, start.y + (end.y - start.y) * t, erase);
      }
      return true;
    });
  });
}

function drawCloneStamp(targetCtx, localPoint, docPoint, cloneDrag) {
  const size = state.brush.size;
  const radius = size / 2;
  const samplePoint = {
    x: cloneDrag.sourceStart.x + docPoint.x - cloneDrag.startDoc.x,
    y: cloneDrag.sourceStart.y + docPoint.y - cloneDrag.startDoc.y,
  };
  const stamp = makeCanvas(size, size);
  const stampCtx = stamp.getContext("2d");
  stampCtx.imageSmoothingEnabled = true;
  stampCtx.imageSmoothingQuality = "high";
  stampCtx.drawImage(cloneDrag.sourceCanvas, radius - samplePoint.x, radius - samplePoint.y);
  stampCtx.globalCompositeOperation = "destination-in";
  stampCtx.drawImage(makeBrushAlphaMask(), 0, 0);
  stampCtx.globalCompositeOperation = "source-over";
  targetCtx.drawImage(stamp, localPoint.x - radius, localPoint.y - radius);
}

function drawCloneStroke(from, to, cloneDrag) {
  const layer = activeLayer();
  if (!layer || !layer.visible) return false;
  if (guardPixelEditing(layer, true)) return false;
  const start = { x: from.x - layer.x, y: from.y - layer.y };
  const end = { x: to.x - layer.x, y: to.y - layer.y };
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const spacing = Math.max(1, state.brush.size * (state.brush.spacing / 100));
  const steps = Math.max(1, Math.ceil(distance / spacing));

  return preserveLockedTransparency(layer, layer.canvas, () => {
    return editTargetWithinSelection(layer.canvas, layer, (editable) => {
      const layerCtx = editable.getContext("2d");
      for (let i = 0; i <= steps; i += 1) {
        const t = i / steps;
        const docPoint = {
          x: from.x + (to.x - from.x) * t,
          y: from.y + (to.y - from.y) * t,
        };
        drawCloneStamp(layerCtx, {
          x: start.x + (end.x - start.x) * t,
          y: start.y + (end.y - start.y) * t,
        }, docPoint, cloneDrag);
      }
      return true;
    });
  });
}

function drawHistoryBrushStamp(targetCtx, localPoint, docPoint, sourceCanvas, selectionLocal) {
  const size = state.brush.size;
  const radius = size / 2;
  const stamp = makeCanvas(size, size);
  const stampCtx = stamp.getContext("2d");
  stampCtx.imageSmoothingEnabled = true;
  stampCtx.imageSmoothingQuality = "high";
  stampCtx.drawImage(sourceCanvas, radius - docPoint.x, radius - docPoint.y);
  stampCtx.globalCompositeOperation = "destination-in";
  stampCtx.drawImage(makeBrushAlphaMask(), 0, 0);
  if (selectionLocal) {
    stampCtx.drawImage(selectionLocal, localPoint.x - radius, localPoint.y - radius, size, size, 0, 0, size, size);
  }
  targetCtx.drawImage(stamp, localPoint.x - radius, localPoint.y - radius);
}

function drawHistoryBrushStroke(from, to, historyDrag) {
  const layer = activeLayer();
  if (!layer || !layer.visible || layer.type === "adjustment") return false;
  if (state.paintTarget === "mask") {
    updateStatus("History Brush paints layer pixels");
    return false;
  }
  if (guardPixelEditing(layer, true)) return false;
  const target = layer.canvas;
  const targetCtx = target.getContext("2d");
  const selectionLocal = selectionBounds() ? localSelectionMask(target, layer) : null;
  const start = { x: from.x - layer.x, y: from.y - layer.y };
  const end = { x: to.x - layer.x, y: to.y - layer.y };
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const spacing = Math.max(1, state.brush.size * (state.brush.spacing / 100));
  const steps = Math.max(1, Math.ceil(distance / spacing));

  return preserveLockedTransparency(layer, target, () => {
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const docPoint = {
        x: from.x + (to.x - from.x) * t,
        y: from.y + (to.y - from.y) * t,
      };
      drawHistoryBrushStamp(targetCtx, {
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
      }, docPoint, historyDrag.sourceCanvas, selectionLocal);
    }
    return true;
  });
}

function drawHealingStamp(targetCtx, localPoint, docPoint, sourceCanvas, selectionLocal) {
  const size = state.brush.size;
  const radius = size / 2;
  const stamp = makeCanvas(size, size);
  const stampCtx = stamp.getContext("2d");
  const sampleDistance = Math.max(8, radius * 1.1);
  const samples = [
    { x: sampleDistance, y: 0 },
    { x: -sampleDistance, y: 0 },
    { x: 0, y: sampleDistance },
    { x: 0, y: -sampleDistance },
  ];
  stampCtx.imageSmoothingEnabled = true;
  stampCtx.imageSmoothingQuality = "high";
  stampCtx.filter = `blur(${Math.max(2, radius * 0.18)}px)`;
  stampCtx.globalAlpha = 1 / samples.length;
  samples.forEach((sample) => {
    stampCtx.drawImage(sourceCanvas, radius - docPoint.x - sample.x, radius - docPoint.y - sample.y);
  });
  stampCtx.filter = "none";
  stampCtx.globalAlpha = 1;
  stampCtx.globalCompositeOperation = "destination-in";
  stampCtx.drawImage(makeBrushAlphaMask(state.healStrength * state.brush.opacity * state.brush.flow), 0, 0);
  if (selectionLocal) {
    stampCtx.drawImage(selectionLocal, localPoint.x - radius, localPoint.y - radius, size, size, 0, 0, size, size);
  }
  targetCtx.drawImage(stamp, localPoint.x - radius, localPoint.y - radius);
  return true;
}

function drawHealingStroke(from, to, healingDrag) {
  const layer = activeLayer();
  if (!layer || !layer.visible) return false;
  if (guardPixelEditing(layer, true)) return false;
  const target = layer.canvas;
  const targetCtx = target.getContext("2d");
  const selectionLocal = selectionBounds() ? localSelectionMask(target, layer) : null;
  const start = { x: from.x - layer.x, y: from.y - layer.y };
  const end = { x: to.x - layer.x, y: to.y - layer.y };
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const spacing = Math.max(1, state.brush.size * (state.brush.spacing / 100));
  const steps = Math.max(1, Math.ceil(distance / spacing));

  return preserveLockedTransparency(layer, target, () => {
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const docPoint = {
        x: from.x + (to.x - from.x) * t,
        y: from.y + (to.y - from.y) * t,
      };
      drawHealingStamp(targetCtx, {
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
      }, docPoint, healingDrag.sourceCanvas, selectionLocal);
    }
    return true;
  });
}

function drawSmudgeStamp(targetCtx, target, fromLocal, toLocal, selectionLocal) {
  const size = state.brush.size;
  const radius = size / 2;
  const stamp = makeCanvas(size, size);
  const stampCtx = stamp.getContext("2d");
  stampCtx.imageSmoothingEnabled = true;
  stampCtx.imageSmoothingQuality = "high";
  stampCtx.drawImage(target, radius - fromLocal.x, radius - fromLocal.y);
  stampCtx.globalCompositeOperation = "destination-in";
  stampCtx.drawImage(makeBrushAlphaMask(state.smudgeStrength * state.brush.opacity * state.brush.flow), 0, 0);
  if (selectionLocal) {
    stampCtx.drawImage(selectionLocal, toLocal.x - radius, toLocal.y - radius, size, size, 0, 0, size, size);
  }
  targetCtx.drawImage(stamp, toLocal.x - radius, toLocal.y - radius);
}

function drawSmudgeStroke(from, to) {
  const layer = activeLayer();
  if (!layer || !layer.visible) return false;
  if (guardPixelEditing(layer)) return false;
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  const targetCtx = target.getContext("2d");
  const selectionLocal = selectionBounds() ? localSelectionMask(target, layer) : null;
  const start = { x: from.x - layer.x, y: from.y - layer.y };
  const end = { x: to.x - layer.x, y: to.y - layer.y };
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const spacing = Math.max(1, state.brush.size * (state.brush.spacing / 100));
  const steps = Math.max(1, Math.ceil(distance / spacing));

  return preserveLockedTransparency(layer, target, () => {
    for (let i = 1; i <= steps; i += 1) {
      const t = i / steps;
      const previousT = Math.max(0, (i - 1) / steps);
      drawSmudgeStamp(
        targetCtx,
        target,
        { x: start.x + (end.x - start.x) * previousT, y: start.y + (end.y - start.y) * previousT },
        { x: start.x + (end.x - start.x) * t, y: start.y + (end.y - start.y) * t },
        selectionLocal,
      );
    }
    return true;
  });
}

function drawToneStamp(targetCtx, target, localPoint, selectionLocal) {
  const size = state.brush.size;
  const radius = size / 2;
  const left = Math.round(localPoint.x - radius);
  const top = Math.round(localPoint.y - radius);
  const right = Math.min(target.width, left + size);
  const bottom = Math.min(target.height, top + size);
  const x = Math.max(0, left);
  const y = Math.max(0, top);
  const width = right - x;
  const height = bottom - y;
  if (width <= 0 || height <= 0) return false;

  const brushMask = makeBrushAlphaMask(state.toneExposure * state.brush.opacity * state.brush.flow);
  const maskCtx = brushMask.getContext("2d");
  const maskData = maskCtx.getImageData(x - left, y - top, width, height).data;
  const selectionData = selectionLocal ? selectionLocal.getContext("2d").getImageData(x, y, width, height).data : null;
  const image = targetCtx.getImageData(x, y, width, height);
  const pixels = image.data;

  for (let i = 0; i < pixels.length; i += 4) {
    let amount = maskData[i + 3] / 255;
    if (selectionData) {
      amount *= selectionData[i + 3] / 255;
    }
    if (amount <= 0) continue;

    for (let channel = 0; channel < 3; channel += 1) {
      const value = pixels[i + channel];
      pixels[i + channel] = state.toneMode === "dodge"
        ? value + (255 - value) * amount
        : value * (1 - amount);
    }
  }

  targetCtx.putImageData(image, x, y);
  return true;
}

function drawToneStroke(from, to) {
  const layer = activeLayer();
  if (!layer || !layer.visible) return false;
  if (guardPixelEditing(layer)) return false;
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  const targetCtx = target.getContext("2d");
  const selectionLocal = selectionBounds() ? localSelectionMask(target, layer) : null;
  const start = { x: from.x - layer.x, y: from.y - layer.y };
  const end = { x: to.x - layer.x, y: to.y - layer.y };
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const spacing = Math.max(1, state.brush.size * (state.brush.spacing / 100));
  const steps = Math.max(1, Math.ceil(distance / spacing));
  let painted = false;

  return preserveLockedTransparency(layer, target, () => {
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      painted = drawToneStamp(targetCtx, target, {
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
      }, selectionLocal) || painted;
    }
    return painted;
  });
}

function activeTextLayer() {
  const layer = activeLayer();
  return layer?.type === "text" && layer.text ? layer : null;
}

function updateActiveTextLayer(updates) {
  const layer = activeTextLayer();
  if (!layer) return false;
  layer.text = { ...layer.text, ...updates };
  renderTextLayer(layer);
  renderAll();
  return true;
}

function commitActiveTextLayerEdit(label) {
  if (!activeTextLayer()) return;
  commitHistory(label);
}

function placeText(docPoint) {
  const content = state.text.content || "Text";
  const layer = createLayer(`Type ${state.layerCounter}`, makeCanvas(1, 1), {
    type: "text",
    text: {
      content,
      fontFamily: state.text.fontFamily,
      size: state.text.size,
      color: state.brush.color,
    },
  });
  state.layerCounter += 1;
  renderTextLayer(layer, docPoint);
  state.layers.push(layer);
  state.activeLayerId = layer.id;
  commitHistory("Add text layer");
  renderAll();
}

function pickColor(docPoint, target = "foreground") {
  const sample = sampleCompositePixel(docPoint);
  if (!sample) return;
  const color = sample.hex;
  if (target === "background") {
    setBackgroundColor(color);
  } else {
    setForegroundColor(color);
  }
  updateInfoPanel(docPoint);
  render();
  updateStatus(`Picked ${target} ${color}`);
}

function isWithinTolerance(data, offset, sample, toleranceSq) {
  const dr = data[offset] - sample.r;
  const dg = data[offset + 1] - sample.g;
  const db = data[offset + 2] - sample.b;
  const da = (data[offset + 3] - sample.a) * 0.5;
  return dr * dr + dg * dg + db * db + da * da <= toleranceSq;
}

function magicWandSourceCanvas() {
  if (state.wandSampleAll) return composeDocument({ applyFilters: true });
  const source = makeCanvas(state.doc.width, state.doc.height);
  const layer = activeLayer();
  if (!layer || !layer.visible || layer.opacity <= 0 || layer.type === "adjustment") return source;
  const sourceCtx = source.getContext("2d");
  sourceCtx.globalAlpha = layer.opacity * (layer.fillOpacity ?? 1);
  sourceCtx.drawImage(applyBlendIf(layerSourceWithMask(layer), layer), layer.x, layer.y);
  return source;
}

function magicWandSelect(docPoint, mode = "new") {
  const source = magicWandSourceCanvas();
  const width = source.width;
  const height = source.height;
  const x = Math.floor(clamp(docPoint.x, 0, width - 1));
  const y = Math.floor(clamp(docPoint.y, 0, height - 1));
  const sourceCtx = source.getContext("2d");
  const image = sourceCtx.getImageData(0, 0, width, height);
  const pixels = image.data;
  const startOffset = (y * width + x) * 4;
  const sample = {
    r: pixels[startOffset],
    g: pixels[startOffset + 1],
    b: pixels[startOffset + 2],
    a: pixels[startOffset + 3],
  };
  const toleranceSq = state.wandTolerance * state.wandTolerance;
  const selected = new Uint8Array(width * height);
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  let count = 0;

  const addSelectedPixel = (index) => {
    const offset = index * 4;
    if (!isWithinTolerance(pixels, offset, sample, toleranceSq)) return false;

    selected[index] = 1;
    count += 1;
    const px = index % width;
    const py = Math.floor(index / width);
    minX = Math.min(minX, px);
    minY = Math.min(minY, py);
    maxX = Math.max(maxX, px);
    maxY = Math.max(maxY, py);
    return true;
  };

  if (state.wandContiguous) {
    const visited = new Uint8Array(width * height);
    const stack = [y * width + x];
    visited[stack[0]] = 1;

    while (stack.length > 0) {
      const index = stack.pop();
      if (!addSelectedPixel(index)) continue;

      const px = index % width;
      const py = Math.floor(index / width);

      if (px > 0 && !visited[index - 1]) {
        visited[index - 1] = 1;
        stack.push(index - 1);
      }
      if (px < width - 1 && !visited[index + 1]) {
        visited[index + 1] = 1;
        stack.push(index + 1);
      }
      if (py > 0 && !visited[index - width]) {
        visited[index - width] = 1;
        stack.push(index - width);
      }
      if (py < height - 1 && !visited[index + width]) {
        visited[index + width] = 1;
        stack.push(index + width);
      }
    }
  } else {
    for (let index = 0; index < width * height; index += 1) {
      addSelectedPixel(index);
    }
  }

  if (count === 0) {
    updateStatus("No similar pixels selected");
    return;
  }

  const mask = makeCanvas(width, height);
  const maskCtx = mask.getContext("2d");
  const maskImage = maskCtx.createImageData(width, height);
  const maskPixels = maskImage.data;
  for (let index = 0; index < selected.length; index += 1) {
    if (!selected[index]) continue;
    const offset = index * 4;
    maskPixels[offset] = 255;
    maskPixels[offset + 1] = 255;
    maskPixels[offset + 2] = 255;
    maskPixels[offset + 3] = 255;
  }
  maskCtx.putImageData(maskImage, 0, 0);

  combineSelectionMask(mask, mode, "magic", `Magic wand selected ${count.toLocaleString()} px`, "magic wand selection");
}

function selectColorRange(fuzziness = state.wandTolerance) {
  const color = state.brush.color;
  const sample = hexToRgb(color);
  const tolerance = clamp(Math.round(fuzziness), Number(controls.wandTolerance.min), Number(controls.wandTolerance.max));
  const toleranceSq = tolerance * tolerance;
  const source = composeDocument({ applyFilters: true });
  const width = source.width;
  const height = source.height;
  const sourceCtx = source.getContext("2d");
  const image = sourceCtx.getImageData(0, 0, width, height);
  const pixels = image.data;
  const mask = makeCanvas(width, height);
  const maskCtx = mask.getContext("2d");
  const maskImage = maskCtx.createImageData(width, height);
  const maskPixels = maskImage.data;
  let count = 0;

  for (let offset = 0; offset < pixels.length; offset += 4) {
    if (pixels[offset + 3] === 0) continue;
    const dr = pixels[offset] - sample.r;
    const dg = pixels[offset + 1] - sample.g;
    const db = pixels[offset + 2] - sample.b;
    if (dr * dr + dg * dg + db * db > toleranceSq) continue;
    maskPixels[offset] = 255;
    maskPixels[offset + 1] = 255;
    maskPixels[offset + 2] = 255;
    maskPixels[offset + 3] = 255;
    count += 1;
  }

  maskCtx.putImageData(maskImage, 0, 0);
  return applySelectionMask(mask, `No pixels matched ${color}`, `Color range selected ${count.toLocaleString()} px from ${color}`, "color");
}

function selectSimilar(fuzziness = state.wandTolerance) {
  let current = baseSelectionMask();
  if (!current) {
    updateStatus("Select pixels before Similar");
    return false;
  }
  if (state.selectionInverse) {
    const inverted = makeCanvas(state.doc.width, state.doc.height);
    const invertedCtx = inverted.getContext("2d");
    invertedCtx.fillStyle = "#ffffff";
    invertedCtx.fillRect(0, 0, inverted.width, inverted.height);
    invertedCtx.globalCompositeOperation = "destination-out";
    invertedCtx.drawImage(current, 0, 0);
    current = inverted;
  }

  const source = composeDocument({ applyFilters: true });
  const width = source.width;
  const height = source.height;
  const sourcePixels = source.getContext("2d").getImageData(0, 0, width, height).data;
  const selectionPixels = current.getContext("2d").getImageData(0, 0, width, height).data;
  let r = 0;
  let g = 0;
  let b = 0;
  let weight = 0;

  for (let offset = 0; offset < sourcePixels.length; offset += 4) {
    const selectedAlpha = selectionPixels[offset + 3];
    const sourceAlpha = sourcePixels[offset + 3];
    if (selectedAlpha === 0 || sourceAlpha === 0) continue;
    const sampleWeight = selectedAlpha * sourceAlpha;
    r += sourcePixels[offset] * sampleWeight;
    g += sourcePixels[offset + 1] * sampleWeight;
    b += sourcePixels[offset + 2] * sampleWeight;
    weight += sampleWeight;
  }

  if (weight === 0) {
    updateStatus("Selected pixels are transparent");
    return false;
  }

  const sample = {
    r: Math.round(r / weight),
    g: Math.round(g / weight),
    b: Math.round(b / weight),
  };
  const tolerance = clamp(Math.round(fuzziness), Number(controls.wandTolerance.min), Number(controls.wandTolerance.max));
  const toleranceSq = tolerance * tolerance;
  const mask = makeCanvas(width, height);
  const maskCtx = mask.getContext("2d");
  const maskImage = maskCtx.createImageData(width, height);
  const maskPixels = maskImage.data;
  let count = 0;

  for (let offset = 0; offset < sourcePixels.length; offset += 4) {
    if (sourcePixels[offset + 3] === 0) continue;
    const dr = sourcePixels[offset] - sample.r;
    const dg = sourcePixels[offset + 1] - sample.g;
    const db = sourcePixels[offset + 2] - sample.b;
    if (dr * dr + dg * dg + db * db > toleranceSq) continue;
    maskPixels[offset] = 255;
    maskPixels[offset + 1] = 255;
    maskPixels[offset + 2] = 255;
    maskPixels[offset + 3] = 255;
    count += 1;
  }

  maskCtx.putImageData(maskImage, 0, 0);
  return applySelectionMask(mask, "No similar pixels selected", `Similar selected ${count.toLocaleString()} px`, "similar");
}

function growSelection(fuzziness = state.wandTolerance) {
  let current = baseSelectionMask();
  if (!current) {
    updateStatus("Select pixels before Grow");
    return false;
  }
  if (state.selectionInverse) {
    const inverted = makeCanvas(state.doc.width, state.doc.height);
    const invertedCtx = inverted.getContext("2d");
    invertedCtx.fillStyle = "#ffffff";
    invertedCtx.fillRect(0, 0, inverted.width, inverted.height);
    invertedCtx.globalCompositeOperation = "destination-out";
    invertedCtx.drawImage(current, 0, 0);
    current = inverted;
  }

  const source = composeDocument({ applyFilters: true });
  const width = source.width;
  const height = source.height;
  const sourcePixels = source.getContext("2d").getImageData(0, 0, width, height).data;
  const selectionPixels = current.getContext("2d").getImageData(0, 0, width, height).data;
  const selected = new Uint8Array(width * height);
  const queued = new Uint8Array(width * height);
  const stack = [];
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  let weight = 0;
  let count = 0;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  const addMaskPixel = (index) => {
    if (selected[index]) return;
    selected[index] = 1;
    count += 1;
    const px = index % width;
    const py = Math.floor(index / width);
    minX = Math.min(minX, px);
    minY = Math.min(minY, py);
    maxX = Math.max(maxX, px);
    maxY = Math.max(maxY, py);
  };

  for (let index = 0; index < selected.length; index += 1) {
    const offset = index * 4;
    const selectedAlpha = selectionPixels[offset + 3];
    const sourceAlpha = sourcePixels[offset + 3];
    if (selectedAlpha === 0) continue;
    addMaskPixel(index);
    if (sourceAlpha === 0) continue;
    const sampleWeight = selectedAlpha * sourceAlpha;
    r += sourcePixels[offset] * sampleWeight;
    g += sourcePixels[offset + 1] * sampleWeight;
    b += sourcePixels[offset + 2] * sampleWeight;
    a += sourceAlpha * sampleWeight;
    weight += sampleWeight;
  }

  if (weight === 0) {
    updateStatus("Selected pixels are transparent");
    return false;
  }

  const sample = {
    r: Math.round(r / weight),
    g: Math.round(g / weight),
    b: Math.round(b / weight),
    a: Math.round(a / weight),
  };
  const tolerance = clamp(Math.round(fuzziness), Number(controls.wandTolerance.min), Number(controls.wandTolerance.max));
  const toleranceSq = tolerance * tolerance;
  const originalCount = count;

  const queueNeighbor = (index) => {
    if (index < 0 || index >= selected.length || selected[index] || queued[index]) return;
    queued[index] = 1;
    const offset = index * 4;
    if (sourcePixels[offset + 3] === 0 || !isWithinTolerance(sourcePixels, offset, sample, toleranceSq)) return;
    addMaskPixel(index);
    stack.push(index);
  };

  for (let index = 0; index < selected.length; index += 1) {
    if (!selected[index]) continue;
    const px = index % width;
    const py = Math.floor(index / width);
    if (px > 0) queueNeighbor(index - 1);
    if (px < width - 1) queueNeighbor(index + 1);
    if (py > 0) queueNeighbor(index - width);
    if (py < height - 1) queueNeighbor(index + width);
  }

  while (stack.length > 0) {
    const index = stack.pop();
    const px = index % width;
    const py = Math.floor(index / width);
    if (px > 0) queueNeighbor(index - 1);
    if (px < width - 1) queueNeighbor(index + 1);
    if (py > 0) queueNeighbor(index - width);
    if (py < height - 1) queueNeighbor(index + width);
  }

  if (count === originalCount) {
    updateStatus("No adjacent similar pixels to grow");
    return false;
  }

  const mask = makeCanvas(width, height);
  const maskCtx = mask.getContext("2d");
  const maskImage = maskCtx.createImageData(width, height);
  const maskPixels = maskImage.data;
  for (let index = 0; index < selected.length; index += 1) {
    if (!selected[index]) continue;
    const offset = index * 4;
    maskPixels[offset] = 255;
    maskPixels[offset + 1] = 255;
    maskPixels[offset + 2] = 255;
    maskPixels[offset + 3] = 255;
  }
  maskCtx.putImageData(maskImage, 0, 0);

  state.selectionRect = { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
  state.selectionMaskCanvas = mask;
  state.selectionPath = null;
  state.selectionKind = "grow";
  state.selectionInverse = false;
  state.selectionFeather = 0;
  controls.selectionFeather.value = state.selectionFeather;
  values.selectionFeather.textContent = `${state.selectionFeather} px`;
  updateToolUi();
  render();
  updateStatus(`Grew selection by ${(count - originalCount).toLocaleString()} px`);
  return true;
}

function selectSubject() {
  const layer = activeLayer();
  if (!layer) return false;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer for Select Subject");
    return false;
  }
  const source = applyBlendIf(layerSourceWithMask(layer), layer);
  const mask = makeCanvas(state.doc.width, state.doc.height);
  const maskCtx = mask.getContext("2d");
  maskCtx.drawImage(source, layer.x, layer.y);
  return applySelectionMask(mask, `No subject found on ${layer.name}`, `${layer.name} subject selected`, "subject");
}

function promptColorRange() {
  const value = window.prompt(`Color Range tolerance for ${state.brush.color}`, String(state.wandTolerance));
  if (value === null) return;
  const tolerance = Math.round(Number(value));
  if (!Number.isFinite(tolerance) || tolerance < 0) {
    updateStatus("Enter a non-negative tolerance");
    return;
  }
  setWandTolerance(tolerance);
  selectColorRange(state.wandTolerance);
}

function normalizePathPoint(point) {
  return {
    x: clamp(point.x, 0, state.doc.width),
    y: clamp(point.y, 0, state.doc.height),
  };
}

function pathBounds(path) {
  const xs = path.map((point) => point.x);
  const ys = path.map((point) => point.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  return clippedRect({ x: minX, y: minY, w: maxX - minX, h: maxY - minY });
}

function commitLassoSelection(path, mode = "new", startSelection = null) {
  if (path.length < 3) {
    updateStatus("Lasso selection too small");
    return false;
  }

  const bounds = pathBounds(path);
  if (!bounds || bounds.w < 2 || bounds.h < 2) {
    updateStatus("Lasso selection too small");
    return false;
  }

  const mask = makeCanvas(state.doc.width, state.doc.height);
  const maskCtx = mask.getContext("2d");
  maskCtx.fillStyle = "#ffffff";
  maskCtx.beginPath();
  maskCtx.moveTo(path[0].x, path[0].y);
  path.slice(1).forEach((point) => maskCtx.lineTo(point.x, point.y));
  maskCtx.closePath();
  maskCtx.fill();

  restoreSelectionForCombine(startSelection);
  return combineSelectionMask(mask, mode, "lasso", `Lasso selected ${Math.round(bounds.w)} x ${Math.round(bounds.h)} px`, "lasso selection");
}

function addWorkPathPoint(docPoint) {
  const point = normalizePathPoint(docPoint);
  state.workPath.push(point);
  updateToolUi();
  updateActionStates();
  render();
  updateStatus(`Path anchor ${Math.round(point.x)}, ${Math.round(point.y)}`);
}

function makeWorkPathSelection() {
  if (state.workPath.length < 3) {
    updateStatus("Path needs at least 3 anchors");
    return;
  }
  if (!commitLassoSelection(state.workPath)) return;
  commitHistory("Make path selection");
  renderAll();
}

function strokeWorkPath() {
  if (state.workPath.length < 2) {
    updateStatus("Path needs at least 2 anchors");
    return;
  }
  const layer = activeLayer();
  if (!layer || !layer.visible) return;
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const targetCtx = target.getContext("2d");
  targetCtx.save();
  targetCtx.globalAlpha = state.brush.opacity;
  targetCtx.strokeStyle = target === layer.mask ? "#ffffff" : state.brush.color;
  targetCtx.lineWidth = state.brush.size;
  targetCtx.lineCap = "round";
  targetCtx.lineJoin = "round";
  targetCtx.beginPath();
  targetCtx.moveTo(state.workPath[0].x - layer.x, state.workPath[0].y - layer.y);
  state.workPath.slice(1).forEach((point) => {
    targetCtx.lineTo(point.x - layer.x, point.y - layer.y);
  });
  targetCtx.stroke();
  targetCtx.restore();
  commitHistory(target === layer.mask ? "Stroke path mask" : "Stroke path");
  renderAll();
}

function clearWorkPath() {
  if (state.workPath.length === 0) {
    updateStatus("No path to clear");
    return;
  }
  state.workPath = [];
  updateToolUi();
  updateActionStates();
  render();
  updateStatus("Work path cleared");
}

function parseDocumentSize(input) {
  const match = String(input || "").trim().match(/^(\d+(?:\.\d+)?)\s*(?:x|,|\s)\s*(\d+(?:\.\d+)?)$/i);
  if (!match) return null;
  const width = Math.round(Number(match[1]));
  const height = Math.round(Number(match[2]));
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) return null;
  return {
    width: clamp(width, 1, 8192),
    height: clamp(height, 1, 8192),
  };
}

function promptDocumentSize(title) {
  const input = window.prompt(`${title} in pixels (width x height)`, `${state.doc.width} x ${state.doc.height}`);
  if (input === null) return null;
  const size = parseDocumentSize(input);
  if (!size) {
    updateStatus("Use width x height");
    return null;
  }
  return size;
}

function scaleRect(rect, scaleX, scaleY) {
  return {
    x: rect.x * scaleX,
    y: rect.y * scaleY,
    w: rect.w * scaleX,
    h: rect.h * scaleY,
  };
}

function offsetRect(rect, offsetX, offsetY) {
  return {
    x: rect.x + offsetX,
    y: rect.y + offsetY,
    w: rect.w,
    h: rect.h,
  };
}

function scaleLayerStyles(styles, scale) {
  const next = cloneStyles(styles);
  next.shadow.distance = Math.max(0, Math.round(next.shadow.distance * scale));
  next.shadow.size = Math.max(0, Math.round(next.shadow.size * scale));
  next.stroke.size = Math.max(0, Math.round(next.stroke.size * scale));
  next.glow.size = Math.max(0, Math.round(next.glow.size * scale));
  return next;
}

function alphaBounds(source) {
  const pixels = source.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, source.width, source.height).data;
  let minX = source.width;
  let minY = source.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      if (pixels[(y * source.width + x) * 4 + 3] === 0) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  return maxX >= minX ? { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 } : null;
}

function unionRect(a, b) {
  if (!a) return b;
  if (!b) return a;
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const right = Math.max(a.x + a.w, b.x + b.w);
  const bottom = Math.max(a.y + a.h, b.y + b.h);
  return { x, y, w: right - x, h: bottom - y };
}

function visibleLayerAlphaBounds(layer, index) {
  if (!layer.visible || layer.opacity <= 0 || (layer.fillOpacity ?? 1) <= 0 || layer.type === "adjustment") return null;
  const clipBase = layer.clipped ? state.layers[index - 1] : null;
  const bounds = alphaBounds(effectiveLayerSource(layer, clipBase));
  if (!bounds) return null;
  return {
    x: layer.x + bounds.x,
    y: layer.y + bounds.y,
    w: bounds.w,
    h: bounds.h,
  };
}

function trimTransparentPixels() {
  const bounds = alphaBounds(composeDocument({ applyFilters: true }));
  if (!bounds) {
    updateStatus("No opaque pixels to trim");
    return;
  }
  if (bounds.x === 0 && bounds.y === 0 && bounds.w === state.doc.width && bounds.h === state.doc.height) {
    updateStatus("No transparent edge pixels to trim");
    return;
  }
  cropDocumentToRect(bounds, "Trim transparent pixels");
  updateStatus(`Trimmed to ${bounds.w} x ${bounds.h}px`);
}

function revealAll() {
  const contentBounds = state.layers.reduce((bounds, layer, index) => unionRect(bounds, visibleLayerAlphaBounds(layer, index)), null);
  if (!contentBounds) {
    updateStatus("No visible pixels to reveal");
    return;
  }
  const left = Math.floor(Math.min(0, contentBounds.x));
  const top = Math.floor(Math.min(0, contentBounds.y));
  const right = Math.ceil(Math.max(state.doc.width, contentBounds.x + contentBounds.w));
  const bottom = Math.ceil(Math.max(state.doc.height, contentBounds.y + contentBounds.h));
  const width = right - left;
  const height = bottom - top;
  if (left === 0 && top === 0 && width === state.doc.width && height === state.doc.height) {
    updateStatus("No hidden pixels to reveal");
    return;
  }
  const offsetX = -left;
  const offsetY = -top;
  state.layers.forEach((layer) => {
    if (layer.type === "adjustment") {
      layer.canvas = makeCanvas(width, height);
      layer.x = 0;
      layer.y = 0;
    } else {
      layer.x += offsetX;
      layer.y += offsetY;
    }
    if (layer.mask) layer.mask = offsetCanvas(layer.mask, width, height, offsetX, offsetY);
  });
  state.alphaChannels = state.alphaChannels.map((channel) => ({
    ...channel,
    mask: offsetCanvas(channel.mask, width, height, offsetX, offsetY),
  }));
  if (state.quickMaskCanvas) state.quickMaskCanvas = offsetCanvas(state.quickMaskCanvas, width, height, offsetX, offsetY);
  if (state.selectionRect) state.selectionRect = offsetRect(state.selectionRect, offsetX, offsetY);
  if (state.cropRect) state.cropRect = offsetRect(state.cropRect, offsetX, offsetY);
  if (state.selectionMaskCanvas) state.selectionMaskCanvas = offsetCanvas(state.selectionMaskCanvas, width, height, offsetX, offsetY);
  if (state.selectionPath) state.selectionPath = state.selectionPath.map((point) => ({ x: point.x + offsetX, y: point.y + offsetY }));
  state.workPath = state.workPath.map((point) => ({ x: point.x + offsetX, y: point.y + offsetY }));
  state.guides = state.guides.map((guide) => ({
    ...guide,
    position: guide.position + (guide.axis === "vertical" ? offsetX : offsetY),
  })).filter((guide) => guide.position >= 0 && guide.position <= (guide.axis === "vertical" ? width : height));
  if (state.cloneSource) state.cloneSource = { x: state.cloneSource.x + offsetX, y: state.cloneSource.y + offsetY };
  state.lastPaintDoc = null;
  state.doc = { width, height };
  commitHistory("Reveal all");
  renderAll();
  updateStatus(`Revealed ${width} x ${height}px canvas`);
}

function resizeImageSize() {
  const size = promptDocumentSize("Image Size");
  if (!size) return;
  if (size.width === state.doc.width && size.height === state.doc.height) {
    updateStatus("Image size unchanged");
    return;
  }
  const scaleX = size.width / state.doc.width;
  const scaleY = size.height / state.doc.height;
  const styleScale = (scaleX + scaleY) / 2;
  state.layers.forEach((layer) => {
    layer.x *= scaleX;
    layer.y *= scaleY;
    layer.canvas = scaleCanvas(layer.canvas, layer.canvas.width * scaleX, layer.canvas.height * scaleY);
    if (layer.mask) {
      layer.mask = scaleCanvas(layer.mask, layer.mask.width * scaleX, layer.mask.height * scaleY);
    }
    layer.styles = scaleLayerStyles(layer.styles, styleScale);
  });
  state.alphaChannels = state.alphaChannels.map((channel) => ({
    ...channel,
    mask: scaleCanvas(channel.mask, size.width, size.height),
  }));
  if (state.quickMaskCanvas) state.quickMaskCanvas = scaleCanvas(state.quickMaskCanvas, size.width, size.height);
  if (state.selectionRect) state.selectionRect = scaleRect(state.selectionRect, scaleX, scaleY);
  if (state.cropRect) state.cropRect = scaleRect(state.cropRect, scaleX, scaleY);
  if (state.selectionMaskCanvas) state.selectionMaskCanvas = scaleCanvas(state.selectionMaskCanvas, size.width, size.height);
  if (state.selectionPath) state.selectionPath = state.selectionPath.map((point) => ({ x: point.x * scaleX, y: point.y * scaleY }));
  state.workPath = state.workPath.map((point) => ({ x: point.x * scaleX, y: point.y * scaleY }));
  state.guides = state.guides.map((guide) => ({
    ...guide,
    position: guide.position * (guide.axis === "vertical" ? scaleX : scaleY),
  }));
  if (state.cloneSource) state.cloneSource = { x: state.cloneSource.x * scaleX, y: state.cloneSource.y * scaleY };
  state.doc = { width: size.width, height: size.height };
  commitHistory("Image size");
  renderAll();
}

function resizeCanvasSize() {
  const size = promptDocumentSize("Canvas Size");
  if (!size) return;
  if (size.width === state.doc.width && size.height === state.doc.height) {
    updateStatus("Canvas size unchanged");
    return;
  }
  const offsetX = Math.round((size.width - state.doc.width) / 2);
  const offsetY = Math.round((size.height - state.doc.height) / 2);
  state.layers.forEach((layer) => {
    if (layer.type === "adjustment") {
      layer.canvas = makeCanvas(size.width, size.height);
      if (layer.mask) layer.mask = offsetCanvas(layer.mask, size.width, size.height, offsetX, offsetY);
      layer.x = 0;
      layer.y = 0;
      return;
    }
    layer.x += offsetX;
    layer.y += offsetY;
  });
  if (state.selectionRect) state.selectionRect = offsetRect(state.selectionRect, offsetX, offsetY);
  if (state.cropRect) state.cropRect = offsetRect(state.cropRect, offsetX, offsetY);
  if (state.selectionMaskCanvas) state.selectionMaskCanvas = offsetCanvas(state.selectionMaskCanvas, size.width, size.height, offsetX, offsetY);
  state.alphaChannels = state.alphaChannels.map((channel) => ({
    ...channel,
    mask: offsetCanvas(channel.mask, size.width, size.height, offsetX, offsetY),
  }));
  if (state.quickMaskCanvas) state.quickMaskCanvas = offsetCanvas(state.quickMaskCanvas, size.width, size.height, offsetX, offsetY);
  if (state.selectionPath) state.selectionPath = state.selectionPath.map((point) => ({ x: point.x + offsetX, y: point.y + offsetY }));
  state.workPath = state.workPath.map((point) => ({ x: point.x + offsetX, y: point.y + offsetY }));
  state.guides = state.guides.map((guide) => ({
    ...guide,
    position: guide.position + (guide.axis === "vertical" ? offsetX : offsetY),
  })).filter((guide) => guide.position >= 0 && guide.position <= (guide.axis === "vertical" ? size.width : size.height));
  if (state.cloneSource) state.cloneSource = { x: state.cloneSource.x + offsetX, y: state.cloneSource.y + offsetY };
  state.doc = { width: size.width, height: size.height };
  commitHistory("Canvas size");
  renderAll();
}

function rotateDocumentPoint(point, direction, width, height) {
  return direction > 0
    ? { x: height - point.y, y: point.x }
    : { x: point.y, y: width - point.x };
}

function rotateDocumentRect(rect, direction, width, height) {
  return direction > 0
    ? { x: height - (rect.y + rect.h), y: rect.x, w: rect.h, h: rect.w }
    : { x: rect.y, y: width - (rect.x + rect.w), w: rect.h, h: rect.w };
}

function rotateDocumentGuide(guide, direction, width, height) {
  if (direction > 0) {
    return guide.axis === "vertical"
      ? { axis: "horizontal", position: guide.position }
      : { axis: "vertical", position: height - guide.position };
  }
  return guide.axis === "vertical"
    ? { axis: "horizontal", position: width - guide.position }
    : { axis: "vertical", position: guide.position };
}

function rotateSelectionState(selection, direction, width, height) {
  if (!selection?.selectionRect) return null;
  return {
    ...selection,
    selectionRect: rotateDocumentRect(selection.selectionRect, direction, width, height),
    selectionMaskCanvas: selection.selectionMaskCanvas ? transformCanvas(selection.selectionMaskCanvas, direction > 0 ? "rotate-right" : "rotate-left") : null,
    selectionPath: selection.selectionPath ? selection.selectionPath.map((point) => rotateDocumentPoint(point, direction, width, height)) : null,
  };
}

function rotateDocumentPointHalf(point, width, height) {
  return { x: width - point.x, y: height - point.y };
}

function rotateDocumentRectHalf(rect, width, height) {
  return {
    x: width - (rect.x + rect.w),
    y: height - (rect.y + rect.h),
    w: rect.w,
    h: rect.h,
  };
}

function rotateDocumentGuideHalf(guide, width, height) {
  return guide.axis === "vertical"
    ? { ...guide, position: width - guide.position }
    : { ...guide, position: height - guide.position };
}

function rotateSelectionStateHalf(selection, width, height) {
  if (!selection?.selectionRect) return null;
  return {
    ...selection,
    selectionRect: rotateDocumentRectHalf(selection.selectionRect, width, height),
    selectionMaskCanvas: selection.selectionMaskCanvas ? transformCanvas(selection.selectionMaskCanvas, "rotate-180") : null,
    selectionPath: selection.selectionPath ? selection.selectionPath.map((point) => rotateDocumentPointHalf(point, width, height)) : null,
  };
}

function flipDocumentPoint(point, axis, width, height) {
  return axis === "x"
    ? { x: width - point.x, y: point.y }
    : { x: point.x, y: height - point.y };
}

function flipDocumentRect(rect, axis, width, height) {
  return axis === "x"
    ? { x: width - (rect.x + rect.w), y: rect.y, w: rect.w, h: rect.h }
    : { x: rect.x, y: height - (rect.y + rect.h), w: rect.w, h: rect.h };
}

function flipDocumentGuide(guide, axis, width, height) {
  if (axis === "x" && guide.axis === "vertical") return { ...guide, position: width - guide.position };
  if (axis === "y" && guide.axis === "horizontal") return { ...guide, position: height - guide.position };
  return { ...guide };
}

function flipSelectionState(selection, axis, width, height) {
  if (!selection?.selectionRect) return null;
  const transform = axis === "x" ? "flip-x" : "flip-y";
  return {
    ...selection,
    selectionRect: flipDocumentRect(selection.selectionRect, axis, width, height),
    selectionMaskCanvas: selection.selectionMaskCanvas ? transformCanvas(selection.selectionMaskCanvas, transform) : null,
    selectionPath: selection.selectionPath ? selection.selectionPath.map((point) => flipDocumentPoint(point, axis, width, height)) : null,
  };
}

function rotateImage(direction) {
  const width = state.doc.width;
  const height = state.doc.height;
  const transform = direction > 0 ? "rotate-right" : "rotate-left";
  state.layers.forEach((layer) => {
    const nextX = direction > 0 ? height - (layer.y + layer.canvas.height) : layer.y;
    const nextY = direction > 0 ? layer.x : width - (layer.x + layer.canvas.width);
    layer.canvas = transformCanvas(layer.canvas, transform);
    if (layer.mask) layer.mask = transformCanvas(layer.mask, transform);
    layer.x = nextX;
    layer.y = nextY;
  });
  state.alphaChannels = state.alphaChannels.map((channel) => ({
    ...channel,
    mask: transformCanvas(channel.mask, transform),
  }));
  if (state.quickMaskCanvas) state.quickMaskCanvas = transformCanvas(state.quickMaskCanvas, transform);
  if (state.selectionRect) state.selectionRect = rotateDocumentRect(state.selectionRect, direction, width, height);
  if (state.cropRect) state.cropRect = rotateDocumentRect(state.cropRect, direction, width, height);
  if (state.selectionMaskCanvas) state.selectionMaskCanvas = transformCanvas(state.selectionMaskCanvas, transform);
  state.lastSelection = rotateSelectionState(state.lastSelection, direction, width, height);
  if (state.selectionPath) state.selectionPath = state.selectionPath.map((point) => rotateDocumentPoint(point, direction, width, height));
  state.workPath = state.workPath.map((point) => rotateDocumentPoint(point, direction, width, height));
  state.guides = state.guides
    .map((guide) => rotateDocumentGuide(guide, direction, width, height))
    .filter((guide) => guide.position >= 0 && guide.position <= (guide.axis === "vertical" ? height : width));
  if (state.cloneSource) state.cloneSource = rotateDocumentPoint(state.cloneSource, direction, width, height);
  state.doc = { width: height, height: width };
  calculateView();
  commitHistory(direction > 0 ? "Rotate image 90 CW" : "Rotate image 90 CCW");
  renderAll();
}

function rotateImageHalf() {
  const width = state.doc.width;
  const height = state.doc.height;
  state.layers.forEach((layer) => {
    layer.x = width - (layer.x + layer.canvas.width);
    layer.y = height - (layer.y + layer.canvas.height);
    layer.canvas = transformCanvas(layer.canvas, "rotate-180");
    if (layer.mask) layer.mask = transformCanvas(layer.mask, "rotate-180");
  });
  state.alphaChannels = state.alphaChannels.map((channel) => ({
    ...channel,
    mask: transformCanvas(channel.mask, "rotate-180"),
  }));
  if (state.quickMaskCanvas) state.quickMaskCanvas = transformCanvas(state.quickMaskCanvas, "rotate-180");
  if (state.selectionRect) state.selectionRect = rotateDocumentRectHalf(state.selectionRect, width, height);
  if (state.cropRect) state.cropRect = rotateDocumentRectHalf(state.cropRect, width, height);
  if (state.selectionMaskCanvas) state.selectionMaskCanvas = transformCanvas(state.selectionMaskCanvas, "rotate-180");
  state.lastSelection = rotateSelectionStateHalf(state.lastSelection, width, height);
  if (state.selectionPath) state.selectionPath = state.selectionPath.map((point) => rotateDocumentPointHalf(point, width, height));
  state.workPath = state.workPath.map((point) => rotateDocumentPointHalf(point, width, height));
  state.guides = state.guides
    .map((guide) => rotateDocumentGuideHalf(guide, width, height))
    .filter((guide) => guide.position >= 0 && guide.position <= (guide.axis === "vertical" ? width : height));
  if (state.cloneSource) state.cloneSource = rotateDocumentPointHalf(state.cloneSource, width, height);
  commitHistory("Rotate image 180");
  renderAll();
}

function flipImage(axis) {
  const width = state.doc.width;
  const height = state.doc.height;
  const transform = axis === "x" ? "flip-x" : "flip-y";
  state.layers.forEach((layer) => {
    const nextX = axis === "x" ? width - (layer.x + layer.canvas.width) : layer.x;
    const nextY = axis === "y" ? height - (layer.y + layer.canvas.height) : layer.y;
    layer.canvas = transformCanvas(layer.canvas, transform);
    if (layer.mask) layer.mask = transformCanvas(layer.mask, transform);
    layer.x = nextX;
    layer.y = nextY;
  });
  state.alphaChannels = state.alphaChannels.map((channel) => ({
    ...channel,
    mask: transformCanvas(channel.mask, transform),
  }));
  if (state.quickMaskCanvas) state.quickMaskCanvas = transformCanvas(state.quickMaskCanvas, transform);
  if (state.selectionRect) state.selectionRect = flipDocumentRect(state.selectionRect, axis, width, height);
  if (state.cropRect) state.cropRect = flipDocumentRect(state.cropRect, axis, width, height);
  if (state.selectionMaskCanvas) state.selectionMaskCanvas = transformCanvas(state.selectionMaskCanvas, transform);
  state.lastSelection = flipSelectionState(state.lastSelection, axis, width, height);
  if (state.selectionPath) state.selectionPath = state.selectionPath.map((point) => flipDocumentPoint(point, axis, width, height));
  state.workPath = state.workPath.map((point) => flipDocumentPoint(point, axis, width, height));
  state.guides = state.guides
    .map((guide) => flipDocumentGuide(guide, axis, width, height))
    .filter((guide) => guide.position >= 0 && guide.position <= (guide.axis === "vertical" ? width : height));
  if (state.cloneSource) state.cloneSource = flipDocumentPoint(state.cloneSource, axis, width, height);
  commitHistory(axis === "x" ? "Flip canvas horizontal" : "Flip canvas vertical");
  renderAll();
}

function rotateLayer(direction) {
  const layer = activeLayer();
  if (!layer) return;
  if (guardPixelEditing(layer, true) || guardPositionEditing(layer)) return;
  const source = layer.canvas;
  const centerX = layer.x + source.width / 2;
  const centerY = layer.y + source.height / 2;
  const next = transformCanvas(source, direction < 0 ? "rotate-left" : "rotate-right");
  layer.canvas = next;
  if (layer.mask) {
    layer.mask = transformCanvas(layer.mask, direction < 0 ? "rotate-left" : "rotate-right");
  }
  layer.x = centerX - next.width / 2;
  layer.y = centerY - next.height / 2;
  commitHistory(direction < 0 ? "Rotate layer left" : "Rotate layer right");
  renderAll();
}

function flipLayer(axis) {
  const layer = activeLayer();
  if (!layer) return;
  if (guardPixelEditing(layer, true)) return;
  const source = layer.canvas;
  const next = transformCanvas(source, axis === "x" ? "flip-x" : "flip-y");
  layer.canvas = next;
  if (layer.mask) {
    layer.mask = transformCanvas(layer.mask, axis === "x" ? "flip-x" : "flip-y");
  }
  commitHistory(axis === "x" ? "Flip layer horizontal" : "Flip layer vertical");
  renderAll();
}

function addLayer() {
  state.layerCounter += 1;
  const layer = createLayer(`Layer ${state.layerCounter}`, null);
  state.layers.push(layer);
  state.activeLayerId = layer.id;
  commitHistory("New layer");
  renderAll();
}

function addAdjustmentLayer() {
  state.adjustmentCounter += 1;
  const layer = createLayer(`Adjustment ${state.adjustmentCounter}`, null, {
    type: "adjustment",
    adjustments: { ...defaultAdjustments, brightness: 8, contrast: 12 },
    mask: createMask(state.doc.width, state.doc.height, true),
  });
  state.layers.push(layer);
  state.activeLayerId = layer.id;
  state.paintTarget = "pixels";
  commitHistory("New adjustment layer");
  renderAll();
}

function toggleLayerStyle(styleKey) {
  const layer = activeLayer();
  if (!layer || layer.type === "adjustment") return;
  layer.styles = cloneStyles(layer.styles);
  layer.styles[styleKey].enabled = !layer.styles[styleKey].enabled;
  commitHistory(layer.styles[styleKey].enabled ? `Enable ${styleKey}` : `Disable ${styleKey}`);
  renderAll();
}

function updateLayerStyle(styleKey, property, value) {
  const layer = activeLayer();
  if (!layer || layer.type === "adjustment") return;
  layer.styles = cloneStyles(layer.styles);
  layer.styles[styleKey][property] = value;
  if (property !== "enabled") {
    layer.styles[styleKey].enabled = true;
  }
  syncLayerStyleControls(layer);
  renderLayerList();
  render();
}

function commitLayerStyle(styleKey) {
  const layer = activeLayer();
  if (!layer || layer.type === "adjustment") return;
  commitHistory(`Layer style ${styleKey}`);
  renderAll();
}

function copyLayerStyle() {
  const layer = activeLayer();
  if (!layer || layer.type === "adjustment") {
    updateStatus("No layer style to copy");
    return;
  }
  state.layerStyleClipboard = cloneStyles(layer.styles);
  updateStatus(`Copied ${layer.name} layer style`);
}

function pasteLayerStyle() {
  const layer = activeLayer();
  if (!state.layerStyleClipboard) {
    updateStatus("No copied layer style");
    return;
  }
  if (!layer || layer.type === "adjustment") {
    updateStatus("Cannot paste style to this layer");
    return;
  }
  layer.styles = cloneStyles(state.layerStyleClipboard);
  commitHistory("Paste layer style");
  renderAll();
  updateStatus(`Pasted layer style to ${layer.name}`);
}

function clearLayerStyle() {
  const layer = activeLayer();
  if (!layer || layer.type === "adjustment") {
    updateStatus("No layer style to clear");
    return;
  }
  if (activeStyleCount(layer.styles) === 0) {
    updateStatus("Layer style already clear");
    return;
  }
  layer.styles = cloneStyles(defaultStyles);
  commitHistory("Clear layer style");
  renderAll();
  updateStatus(`Cleared ${layer.name} layer style`);
}

function layerStylePadding(styles) {
  const next = { left: 0, top: 0, right: 0, bottom: 0 };
  if (styles.shadow.enabled) {
    const blur = Math.ceil(styles.shadow.size);
    const distance = Math.round(styles.shadow.distance);
    next.left = Math.max(next.left, blur + Math.max(0, -distance));
    next.top = Math.max(next.top, blur + Math.max(0, -distance));
    next.right = Math.max(next.right, blur + Math.max(0, distance));
    next.bottom = Math.max(next.bottom, blur + Math.max(0, distance));
  }
  if (styles.glow.enabled) {
    const glow = Math.ceil(styles.glow.size);
    next.left = Math.max(next.left, glow);
    next.top = Math.max(next.top, glow);
    next.right = Math.max(next.right, glow);
    next.bottom = Math.max(next.bottom, glow);
  }
  if (styles.stroke.enabled) {
    const stroke = Math.ceil(styles.stroke.size);
    next.left = Math.max(next.left, stroke);
    next.top = Math.max(next.top, stroke);
    next.right = Math.max(next.right, stroke);
    next.bottom = Math.max(next.bottom, stroke);
  }
  return next;
}

function rasterizeLayerStyle() {
  const layer = activeLayer();
  if (!layer || layer.type !== "pixel") {
    updateStatus("Select a pixel layer to rasterize style");
    return;
  }
  if (activeStyleCount(layer.styles) === 0) {
    updateStatus("No active layer style to rasterize");
    return;
  }
  if (layer.mask) {
    updateStatus("Apply or delete mask before rasterizing style");
    return;
  }
  if (layer.clipped) {
    updateStatus("Release clipping mask before rasterizing style");
    return;
  }
  if (guardPixelEditing(layer, true) || guardTransparencyEditing(layer, layer.canvas) || guardPositionEditing(layer)) return;

  const styles = cloneStyles(layer.styles);
  const padding = layerStylePadding(styles);
  const source = cloneCanvas(layer.canvas);
  const raster = makeCanvas(source.width + padding.left + padding.right, source.height + padding.top + padding.bottom);
  const rasterCtx = raster.getContext("2d");
  const rasterLayer = { ...layer, x: padding.left, y: padding.top, styles };
  drawLayerStyles(rasterCtx, source, rasterLayer);
  rasterCtx.save();
  rasterCtx.globalAlpha = layer.fillOpacity ?? 1;
  rasterCtx.drawImage(source, padding.left, padding.top);
  rasterCtx.restore();

  layer.canvas = raster;
  layer.x -= padding.left;
  layer.y -= padding.top;
  layer.fillOpacity = 1;
  layer.styles = cloneStyles(defaultStyles);
  commitHistory("Rasterize layer style");
  renderAll();
  updateStatus(`Rasterized ${layer.name} layer style`);
}

function layerFromBackground() {
  const layer = activeLayer();
  const index = activeLayerIndex();
  if (!isBackgroundLayer(layer, index)) {
    updateStatus("Select the background layer");
    return;
  }
  layer.name = "Layer 0";
  layer.lockTransparency = false;
  layer.lockPosition = false;
  commitHistory("Layer from background");
  renderAll();
  updateStatus("Background converted to Layer 0");
}

function backgroundFromLayer() {
  const layer = activeLayer();
  const index = activeLayerIndex();
  if (!layer || layer.type === "adjustment") {
    updateStatus("Select a pixel layer for background");
    return;
  }
  if (isBackgroundLayer(layer, index)) {
    updateStatus("Layer is already background");
    return;
  }
  if (state.layers[0] && isBackgroundLayer(state.layers[0], 0) && index !== 0) {
    updateStatus("Document already has a background layer");
    return;
  }

  const flattened = makeCanvas(state.doc.width, state.doc.height);
  const flattenedCtx = flattened.getContext("2d");
  flattenedCtx.fillStyle = state.backgroundColor;
  flattenedCtx.fillRect(0, 0, flattened.width, flattened.height);
  const source = applyBlendIf(layerSourceWithMask(layer), layer);
  flattenedCtx.save();
  flattenedCtx.globalAlpha = layer.opacity;
  drawLayerStyles(flattenedCtx, source, layer);
  flattenedCtx.globalAlpha = layer.opacity * (layer.fillOpacity ?? 1);
  flattenedCtx.drawImage(source, layer.x, layer.y);
  flattenedCtx.restore();

  const background = createBackgroundLayer(flattened);
  state.layers.splice(index, 1);
  state.layers.unshift(background);
  state.activeLayerId = background.id;
  state.paintTarget = "pixels";
  normalizeClippingMasks();
  commitHistory("Background from layer");
  renderAll();
  updateStatus("Layer converted to Background");
}

function resetCurrentAdjustments() {
  const layer = activeLayer();
  const target = layer?.type === "adjustment" && layer.adjustments ? layer.adjustments : state.adjustments;
  Object.assign(target, defaultAdjustments);
  commitHistory(layer?.type === "adjustment" ? "Reset adjustment layer" : "Reset adjustments");
  syncAdjustmentControls();
  renderAll();
}

function toggleClippingMask() {
  const layer = activeLayer();
  const index = activeLayerIndex();
  if (!layer || index <= 0) return;
  layer.clipped = !layer.clipped;
  commitHistory(layer.clipped ? "Create clipping mask" : "Release clipping mask");
  renderAll();
}

function layerLockLabel(lockKey) {
  if (lockKey === "lockTransparency") return "transparent pixels";
  if (lockKey === "lockPixels") return "pixels";
  return "position";
}

function toggleLayerLock(lockKey) {
  const layer = activeLayer();
  if (!layer) return;
  if (activeLayerIsBackground()) {
    updateStatus("Use Layer from Background to unlock the background");
    return;
  }
  layer[lockKey] = !layer[lockKey];
  commitHistory(layer[lockKey] ? `Lock ${layerLockLabel(lockKey)}` : `Unlock ${layerLockLabel(lockKey)}`);
  renderAll();
}

function toggleLayerLockAll() {
  const layer = activeLayer();
  if (!layer) return;
  if (activeLayerIsBackground()) {
    updateStatus("Use Layer from Background to unlock the background");
    return;
  }
  const shouldLock = !(layer.lockTransparency && layer.lockPixels && layer.lockPosition);
  layer.lockTransparency = shouldLock;
  layer.lockPixels = shouldLock;
  layer.lockPosition = shouldLock;
  commitHistory(shouldLock ? "Lock all" : "Unlock all");
  renderAll();
}

function createLayerCopy(layer, offset = 24) {
  const index = state.layers.findIndex((item) => item.id === layer.id);
  const copyLocks = isBackgroundLayer(layer, index)
    ? { lockTransparency: false, lockPixels: false, lockPosition: false }
    : {
      lockTransparency: layer.lockTransparency,
      lockPixels: layer.lockPixels,
      lockPosition: layer.lockPosition,
    };
  return createLayer(`${layer.name} copy`, layer.canvas, {
    x: layer.x + offset,
    y: layer.y + offset,
    opacity: layer.opacity,
    fillOpacity: layer.fillOpacity ?? 1,
    blendIfBlack: layer.blendIfBlack ?? 0,
    blendIfWhite: layer.blendIfWhite ?? 255,
    blendMode: layer.blendMode,
    visible: layer.visible,
    mask: layer.mask,
    maskDisabled: layer.maskDisabled,
    type: layer.type,
    adjustments: layer.adjustments,
    styles: layer.styles,
    text: layer.text,
    clipped: layer.clipped,
    ...copyLocks,
  });
}

function duplicateLayer(options = {}) {
  const layer = activeLayer();
  if (!layer) return;
  const offset = options.offset === false ? 0 : 24;
  const copy = createLayerCopy(layer, offset);
  state.layers.push(copy);
  state.activeLayerId = copy.id;
  commitHistory(options.label || "Duplicate layer");
  renderAll();
  return copy;
}

function layerViaCopy(cut = false) {
  const layer = activeLayer();
  if (!layer) return;
  const selection = selectionBounds();
  if (!selection && !cut) {
    duplicateLayer({ offset: false, label: "Layer via copy" });
    return;
  }
  if (!selection && cut) {
    updateStatus("Select pixels to cut to a new layer");
    return;
  }
  if (guardPixelEditing(layer, cut)) return;
  const sourceRect = selectionCopyBounds();
  const mask = selectionMask();
  if (!sourceRect || !mask) {
    updateStatus("Selection is empty");
    return;
  }

  const rect = pixelRect(sourceRect);
  const pixels = makeCanvas(rect.w, rect.h);
  const pixelsCtx = pixels.getContext("2d");
  pixelsCtx.drawImage(layer.canvas, layer.x - rect.x, layer.y - rect.y);
  pixelsCtx.globalCompositeOperation = "destination-in";
  pixelsCtx.drawImage(mask, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
  pixelsCtx.globalCompositeOperation = "source-over";

  const newLayer = createLayer(cut ? `${layer.name} via cut` : `${layer.name} via copy`, pixels, {
    x: rect.x,
    y: rect.y,
    opacity: layer.opacity,
    fillOpacity: layer.fillOpacity ?? 1,
    blendIfBlack: layer.blendIfBlack ?? 0,
    blendIfWhite: layer.blendIfWhite ?? 255,
    blendMode: layer.blendMode,
  });
  const index = activeLayerIndex();
  state.layers.splice(index + 1, 0, newLayer);
  state.activeLayerId = newLayer.id;

  if (cut) {
    eraseSelectionFromTarget(layer.canvas, layer);
  }

  commitHistory(cut ? "Layer via cut" : "Layer via copy");
  selectTool("move");
  renderAll();
}

function renameLayer(layerId = state.activeLayerId) {
  const layer = state.layers.find((item) => item.id === layerId);
  if (!layer) return;
  const index = state.layers.findIndex((item) => item.id === layer.id);
  if (isBackgroundLayer(layer, index)) {
    updateStatus("Use Layer from Background to rename the background");
    return;
  }
  const nextName = window.prompt("Layer name", layer.name);
  if (nextName === null) return;
  const trimmed = nextName.trim();
  if (!trimmed) {
    updateStatus("Layer name cannot be empty");
    return;
  }
  if (trimmed === layer.name) {
    updateStatus("Layer name unchanged");
    return;
  }
  layer.name = trimmed;
  state.activeLayerId = layer.id;
  commitHistory("Rename layer");
  renderAll();
  updateStatus(`Renamed layer to ${trimmed}`);
}

function deleteLayer() {
  if (state.layers.length <= 1) return;
  const index = state.layers.findIndex((layer) => layer.id === state.activeLayerId);
  if (isBackgroundLayer(state.layers[index], index)) {
    updateStatus("Use Layer from Background before deleting the background");
    return;
  }
  state.layers.splice(index, 1);
  normalizeClippingMasks();
  state.activeLayerId = state.layers[Math.max(0, index - 1)].id;
  commitHistory("Delete layer");
  renderAll();
}

function mergeVisible() {
  const visibleComposite = composeDocument({ applyFilters: false });
  const hidden = state.layers.filter((layer) => !layer.visible);
  const merged = createLayer("Merged visible", visibleComposite);
  state.layers = [...hidden, merged];
  state.activeLayerId = merged.id;
  commitHistory("Merge visible");
  renderAll();
}

function flattenImage() {
  const flattened = makeCanvas(state.doc.width, state.doc.height);
  const flattenedCtx = flattened.getContext("2d");
  flattenedCtx.fillStyle = state.backgroundColor;
  flattenedCtx.fillRect(0, 0, flattened.width, flattened.height);
  flattenedCtx.drawImage(composeDocument({ applyFilters: true }), 0, 0);
  const background = createBackgroundLayer(flattened);
  state.layers = [background];
  state.activeLayerId = background.id;
  state.paintTarget = "pixels";
  commitHistory("Flatten image");
  renderAll();
  updateStatus("Flattened image");
}

function drawLayerForMerge(output, layer, clipBase = null) {
  if (!layer.visible || layer.opacity <= 0) return;
  if (layer.type === "adjustment") {
    applyAdjustmentLayer(output, layer, clipBase);
    return;
  }
  const outputCtx = output.getContext("2d");
  const sourceCanvas = effectiveLayerSource(layer, clipBase);
  outputCtx.save();
  outputCtx.globalCompositeOperation = layer.blendMode;
  outputCtx.globalAlpha = layer.opacity;
  drawLayerStyles(outputCtx, sourceCanvas, layer);
  outputCtx.globalAlpha = layer.opacity * (layer.fillOpacity ?? 1);
  outputCtx.drawImage(sourceCanvas, layer.x, layer.y);
  outputCtx.restore();
}

function mergeLayerDown() {
  const index = activeLayerIndex();
  if (index <= 0) {
    updateStatus("No layer below to merge");
    return;
  }
  const mergeToBackground = isBackgroundLayer(state.layers[index - 1], index - 1);
  const output = makeCanvas(state.doc.width, state.doc.height);
  [index - 1, index].forEach((layerIndex) => {
    const layer = state.layers[layerIndex];
    const clipBase = layer.clipped ? state.layers[layerIndex - 1] : null;
    drawLayerForMerge(output, layer, clipBase);
  });
  const merged = mergeToBackground ? createBackgroundLayer(output) : createLayer("Merged down", output);
  state.layers.splice(index - 1, 2, merged);
  state.activeLayerId = merged.id;
  normalizeClippingMasks();
  commitHistory("Merge down");
  renderAll();
}

function stampVisible() {
  const visibleComposite = composeDocument({ applyFilters: true });
  const stamped = createLayer("Stamp visible", visibleComposite);
  state.layers.push(stamped);
  state.activeLayerId = stamped.id;
  commitHistory("Stamp visible");
  renderAll();
}

function pixelRect(rect) {
  return {
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    w: Math.max(1, Math.round(rect.w)),
    h: Math.max(1, Math.round(rect.h)),
  };
}

function localSelectionMask(target, layer) {
  const mask = selectionMask();
  if (!mask) return null;
  return localDocumentMask(mask, target, layer);
}

function eraseSelectionFromTarget(target, layer) {
  if (guardTransparencyEditing(layer, target)) return false;
  const local = localSelectionMask(target, layer);
  if (!local) return false;
  const targetCtx = target.getContext("2d");
  targetCtx.save();
  targetCtx.globalCompositeOperation = "destination-out";
  targetCtx.drawImage(local, 0, 0);
  targetCtx.restore();
  return true;
}

function gradientBrushColor() {
  return state.paintTarget === "mask" ? "#ffffff" : state.brush.color;
}

function gradientBackgroundColor() {
  return state.paintTarget === "mask" ? "rgba(255, 255, 255, 0)" : state.backgroundColor;
}

function gradientFillCanvas(target, layer, startDoc, endDoc) {
  const fill = makeCanvas(target.width, target.height);
  const fillCtx = fill.getContext("2d");
  const start = { x: startDoc.x - layer.x, y: startDoc.y - layer.y };
  const end = { x: endDoc.x - layer.x, y: endDoc.y - layer.y };
  const distance = Math.max(1, Math.hypot(end.x - start.x, end.y - start.y));
  const gradient = state.gradientMode === "radial"
    ? fillCtx.createRadialGradient(start.x, start.y, 0, start.x, start.y, distance)
    : fillCtx.createLinearGradient(start.x, start.y, end.x, end.y);
  const color = gradientBrushColor();
  const alpha = clamp(state.brush.opacity, 0, 1);
  const solid = rgbaString(color, alpha);
  const background = gradientBackgroundColor();
  gradient.addColorStop(0, state.gradientReverse ? background : solid);
  gradient.addColorStop(1, state.gradientReverse ? solid : background);
  fillCtx.fillStyle = gradient;
  fillCtx.fillRect(0, 0, fill.width, fill.height);
  return fill;
}

function applyGradientFill(startDoc, endDoc) {
  const layer = activeLayer();
  if (!layer || !layer.visible) return false;
  if (guardPixelEditing(layer)) return false;
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  const fill = gradientFillCanvas(target, layer, startDoc, endDoc);
  const selection = selectionBounds();

  if (selection) {
    const local = localSelectionMask(target, layer);
    if (!local) {
      updateStatus("Selection is empty");
      return false;
    }
    const fillCtx = fill.getContext("2d");
    fillCtx.globalCompositeOperation = "destination-in";
    fillCtx.drawImage(local, 0, 0);
  }

  preserveLockedTransparency(layer, target, () => {
    target.getContext("2d").drawImage(fill, 0, 0);
  });
  commitHistory(state.paintTarget === "mask" ? "Gradient mask" : selection ? "Gradient selection" : "Gradient fill");
  return true;
}

function createShapeLayer(startDoc, endDoc, constrain) {
  const rect = shapeRectFromPoints(startDoc, endDoc, constrain);
  if (!rect || rect.w < 1 || rect.h < 1) return null;
  const shapeCanvas = makeCanvas(state.doc.width, state.doc.height);
  const shapeCtx = shapeCanvas.getContext("2d");
  const shapeRect = pixelRect(rect);
  shapeCtx.fillStyle = state.shapeFillColor;
  drawShapePath(shapeCtx, shapeRect);
  if (state.shapeStrokeEnabled) {
    shapeCtx.strokeStyle = state.shapeStrokeColor;
    shapeCtx.lineWidth = state.shapeStrokeSize;
    drawShapePath(shapeCtx, shapeRect, "stroke");
  }
  const name = state.shapeMode === "ellipse" ? "Ellipse Shape" : "Rectangle Shape";
  const layer = createLayer(name, shapeCanvas, { opacity: state.brush.opacity });
  state.layers.push(layer);
  state.activeLayerId = layer.id;
  commitHistory("Create shape");
  return name;
}

function copyPixels(options = {}) {
  const layer = activeLayer();
  const merged = options.merged === true;
  const selection = selectionBounds();
  const sourceRect = selection ? selectionCopyBounds() : (merged ? { x: 0, y: 0, w: state.doc.width, h: state.doc.height } : activeLayerBounds());
  if (!sourceRect) {
    updateStatus("Nothing to copy");
    return;
  }
  const mask = selection ? selectionMask() : null;
  if (selection && !mask) {
    updateStatus("Selection is empty");
    return;
  }
  if (options.cut && layer && !merged && guardPixelEditing(layer, true)) return;
  if (options.cut && layer && !merged && guardTransparencyEditing(layer, layer.canvas)) return;
  const rect = pixelRect(sourceRect);

  const clip = makeCanvas(rect.w, rect.h);
  const clipCtx = clip.getContext("2d");
  if (merged) {
    clipCtx.drawImage(composeDocument({ applyFilters: true }), rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
  } else if (layer) {
    clipCtx.drawImage(layer.canvas, layer.x - rect.x, layer.y - rect.y);
  }
  if (mask) {
    clipCtx.globalCompositeOperation = "destination-in";
    clipCtx.drawImage(mask, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
    clipCtx.globalCompositeOperation = "source-over";
  }

  state.clipboard = {
    canvas: clip,
    x: rect.x,
    y: rect.y,
    name: selection ? "Selection pixels" : merged ? "Merged pixels" : `${layer?.name || "Layer"} pixels`,
  };

  if (options.cut && layer && !merged) {
    if (selection) {
      eraseSelectionFromTarget(layer.canvas, layer);
    } else {
      const layerCtx = layer.canvas.getContext("2d");
      layerCtx.clearRect(rect.x - layer.x, rect.y - layer.y, rect.w, rect.h);
    }
    commitHistory("Cut");
    renderAll();
    return;
  }

  updateActionStates();
  updateStatus(selection ? "Copied selection" : merged ? "Copied merged pixels" : "Copied pixels");
}

function pastePixels() {
  if (!state.clipboard) return;
  const pasted = createLayer("Pasted pixels", state.clipboard.canvas, {
    x: clamp(state.clipboard.x + 18, 0, state.doc.width - 1),
    y: clamp(state.clipboard.y + 18, 0, state.doc.height - 1),
  });
  state.layers.push(pasted);
  state.activeLayerId = pasted.id;
  selectTool("move");
  commitHistory("Paste");
  renderAll();
}

function pasteIntoSelection() {
  if (!state.clipboard) return;
  const selection = selectionMask();
  if (!selection) {
    pastePixels();
    return;
  }
  const pasted = createLayer("Pasted into selection", state.clipboard.canvas, {
    x: clamp(state.clipboard.x, 0, state.doc.width - 1),
    y: clamp(state.clipboard.y, 0, state.doc.height - 1),
  });
  pasted.mask = layerMaskFromSelection(pasted, true, selection);
  pasted.maskDisabled = false;
  state.layers.push(pasted);
  state.activeLayerId = pasted.id;
  selectTool("move");
  commitHistory("Paste into");
  renderAll();
}

function fillColorForRole(role) {
  if (role === "background") return state.backgroundColor;
  if (role === "black") return "#000000";
  if (role === "white") return "#ffffff";
  if (role === "gray") return "#808080";
  return state.brush.color;
}

function fillLabelForRole(role) {
  const labels = {
    background: "background",
    black: "black",
    white: "white",
    gray: "50% gray",
  };
  return labels[role] || "foreground";
}

function fillRoleFromInput(input) {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, "-");
  const fillRoles = {
    fg: "foreground",
    foreground: "foreground",
    bg: "background",
    background: "background",
    black: "black",
    white: "white",
    gray: "gray",
    grey: "gray",
    "50-gray": "gray",
    "50%-gray": "gray",
  };
  return fillRoles[normalized] || null;
}

function maskAlphaForColor(color) {
  const { r, g, b } = hexToRgb(color);
  return clamp(((r * 0.2126 + g * 0.7152 + b * 0.0722) / 255) * state.brush.opacity, 0, 1);
}

function fillPixels(role = "foreground") {
  const layer = activeLayer();
  if (!layer || !layer.visible) return;
  if (guardPixelEditing(layer)) return;
  const selection = selectionBounds();
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  const isMask = target === layer.mask;
  const color = fillColorForRole(role);
  const fillLabel = fillLabelForRole(role);
  const layerCtx = target.getContext("2d");
  const filled = preserveLockedTransparency(layer, target, () => {
    if (selection) {
      const local = localSelectionMask(target, layer);
      if (!local) return false;
      const fill = makeCanvas(target.width, target.height);
      const fillCtx = fill.getContext("2d");
      fillCtx.globalAlpha = isMask ? maskAlphaForColor(color) : state.brush.opacity;
      fillCtx.fillStyle = isMask ? "#ffffff" : color;
      fillCtx.fillRect(0, 0, fill.width, fill.height);
      fillCtx.globalAlpha = 1;
      fillCtx.globalCompositeOperation = "destination-in";
      fillCtx.drawImage(local, 0, 0);
      if (isMask) {
        layerCtx.save();
        layerCtx.globalCompositeOperation = "destination-out";
        layerCtx.drawImage(local, 0, 0);
        layerCtx.restore();
      }
      layerCtx.drawImage(fill, 0, 0);
      return true;
    }

    const rect = pixelRect({ x: 0, y: 0, w: state.doc.width, h: state.doc.height });
    layerCtx.save();
    if (isMask) layerCtx.clearRect(rect.x - layer.x, rect.y - layer.y, rect.w, rect.h);
    layerCtx.globalAlpha = isMask ? maskAlphaForColor(color) : state.brush.opacity;
    layerCtx.fillStyle = isMask ? "#ffffff" : color;
    layerCtx.fillRect(rect.x - layer.x, rect.y - layer.y, rect.w, rect.h);
    layerCtx.restore();
    return true;
  });
  if (!filled) {
    updateStatus("Selection is empty");
    return;
  }
  commitHistory(state.paintTarget === "mask" ? `Fill ${fillLabel} mask` : selection ? `Fill ${fillLabel} selection` : `Fill ${fillLabel} layer`);
  renderAll();
}

function contentAwareSampleColor(target, layer, selection, localMask) {
  const radius = 8;
  const localRect = {
    x: Math.round(selection.x - layer.x),
    y: Math.round(selection.y - layer.y),
    w: Math.round(selection.w),
    h: Math.round(selection.h),
  };
  const x = clamp(localRect.x - radius, 0, target.width);
  const y = clamp(localRect.y - radius, 0, target.height);
  const right = clamp(localRect.x + localRect.w + radius, 0, target.width);
  const bottom = clamp(localRect.y + localRect.h + radius, 0, target.height);
  const width = Math.max(0, right - x);
  const height = Math.max(0, bottom - y);
  if (width === 0 || height === 0) return null;

  const targetPixels = target.getContext("2d").getImageData(x, y, width, height).data;
  const maskPixels = localMask.getContext("2d").getImageData(x, y, width, height).data;
  let r = 0;
  let g = 0;
  let b = 0;
  let alpha = 0;
  let weight = 0;
  let count = 0;

  for (let offset = 0; offset < targetPixels.length; offset += 4) {
    if (maskPixels[offset + 3] > 0 || targetPixels[offset + 3] === 0) continue;
    const a = targetPixels[offset + 3];
    r += targetPixels[offset] * a;
    g += targetPixels[offset + 1] * a;
    b += targetPixels[offset + 2] * a;
    alpha += a;
    weight += a;
    count += 1;
  }

  if (weight === 0) return null;
  return {
    r: Math.round(r / weight),
    g: Math.round(g / weight),
    b: Math.round(b / weight),
    a: clamp(Math.round(alpha / count), 1, 255),
  };
}

function contentAwareFillSelection() {
  const layer = activeLayer();
  if (!layer || !layer.visible) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer for Content-Aware Fill");
    return;
  }
  if (state.paintTarget === "mask") {
    updateStatus("Content-Aware Fill edits layer pixels");
    return;
  }
  if (guardPixelEditing(layer, true)) return;

  const selection = selectionBounds();
  if (!selection) {
    updateStatus("Select an area for Content-Aware Fill");
    return;
  }

  const local = localSelectionMask(layer.canvas, layer);
  if (!local) {
    updateStatus("Selection is empty");
    return;
  }

  const sample = contentAwareSampleColor(layer.canvas, layer, selection, local);
  if (!sample) {
    updateStatus("No surrounding pixels for Content-Aware Fill");
    return;
  }

  const fill = makeCanvas(layer.canvas.width, layer.canvas.height);
  const fillCtx = fill.getContext("2d");
  fillCtx.fillStyle = `rgba(${sample.r}, ${sample.g}, ${sample.b}, ${sample.a / 255})`;
  fillCtx.fillRect(0, 0, fill.width, fill.height);
  fillCtx.globalCompositeOperation = "destination-in";
  fillCtx.drawImage(local, 0, 0);

  const layerCtx = layer.canvas.getContext("2d");
  const filled = preserveLockedTransparency(layer, layer.canvas, () => {
    layerCtx.drawImage(fill, 0, 0);
    return true;
  });
  if (!filled) {
    updateStatus("Selection is empty");
    return;
  }
  commitHistory("Content-Aware Fill");
  renderAll();
  updateStatus(`Content-Aware filled ${layer.name}`);
}

function promptFillPixels() {
  const value = window.prompt("Fill with foreground, background, black, white, or 50% gray", "foreground");
  if (value === null) return;
  const role = fillRoleFromInput(value);
  if (!role) {
    updateStatus("Choose foreground, background, black, white, or 50% gray");
    return;
  }
  fillPixels(role);
}

function selectionStrokeMask(width) {
  const source = selectionMask();
  if (!source) return null;
  const outerRadius = Math.ceil(width / 2);
  const innerRadius = Math.floor(width / 2);
  const outer = outerRadius > 0 ? expandedAlphaMask(source, outerRadius) : cloneCanvas(source);
  const inner = innerRadius > 0 ? contractedAlphaMask(source, innerRadius) : cloneCanvas(source);
  const stroke = cloneCanvas(outer);
  const strokeCtx = stroke.getContext("2d");
  strokeCtx.globalCompositeOperation = "destination-out";
  strokeCtx.drawImage(inner, 0, 0);
  strokeCtx.globalCompositeOperation = "source-over";
  return stroke;
}

function localDocumentMask(mask, target, layer) {
  const local = makeCanvas(target.width, target.height);
  local.getContext("2d").drawImage(mask, -layer.x, -layer.y);
  return local;
}

function strokeSelectionPixels(width, role = "foreground") {
  const layer = activeLayer();
  if (!layer || !layer.visible) return;
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const strokeMask = selectionStrokeMask(width);
  if (!strokeMask) {
    updateStatus("No selection to stroke");
    return;
  }
  const local = localDocumentMask(strokeMask, target, layer);
  const isMask = target === layer.mask;
  const color = fillColorForRole(role);
  const fill = makeCanvas(target.width, target.height);
  const fillCtx = fill.getContext("2d");
  fillCtx.globalAlpha = isMask ? maskAlphaForColor(color) : state.brush.opacity;
  fillCtx.fillStyle = isMask ? "#ffffff" : color;
  fillCtx.fillRect(0, 0, fill.width, fill.height);
  fillCtx.globalAlpha = 1;
  fillCtx.globalCompositeOperation = "destination-in";
  fillCtx.drawImage(local, 0, 0);

  const targetCtx = target.getContext("2d");
  preserveLockedTransparency(layer, target, () => {
    if (isMask) {
      targetCtx.save();
      targetCtx.globalCompositeOperation = "destination-out";
      targetCtx.drawImage(local, 0, 0);
      targetCtx.restore();
    }
    targetCtx.drawImage(fill, 0, 0);
  });
  commitHistory(isMask ? `Stroke ${width}px mask` : `Stroke ${width}px ${fillLabelForRole(role)} selection`);
  renderAll();
}

function promptStrokeSelection() {
  const value = window.prompt("Stroke width and fill, e.g. 8 foreground", "8 foreground");
  if (value === null) return;
  const match = value.trim().match(/^(\d+(?:\.\d+)?)(?:px)?(?:\s+(.+))?$/i);
  if (!match) {
    updateStatus("Enter width and fill, e.g. 8 foreground");
    return;
  }
  const width = Math.round(Number(match[1]));
  if (!Number.isFinite(width) || width <= 0) {
    updateStatus("Enter a positive stroke width");
    return;
  }
  const role = fillRoleFromInput(match[2] || "foreground");
  if (!role) {
    updateStatus("Choose foreground, background, black, white, or 50% gray");
    return;
  }
  strokeSelectionPixels(Math.min(width, 128), role);
}

function deletePixels() {
  const layer = activeLayer();
  if (!layer) return;
  if (guardPixelEditing(layer)) return;
  const selection = selectionBounds();
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardTransparencyEditing(layer, target)) return;
  if (selection) {
    if (!eraseSelectionFromTarget(target, layer)) {
      updateStatus("Selection is empty");
      return;
    }
  } else {
    const bounds = activeLayerBounds();
    if (!bounds) return;
    const rect = pixelRect(bounds);
    target.getContext("2d").clearRect(rect.x - layer.x, rect.y - layer.y, rect.w, rect.h);
  }
  commitHistory(state.paintTarget === "mask" ? "Conceal mask" : selection ? "Delete selection" : "Clear layer");
  renderAll();
}

function selectAll() {
  state.selectionRect = { x: 0, y: 0, w: state.doc.width, h: state.doc.height };
  state.selectionMaskCanvas = null;
  state.selectionPath = null;
  state.selectionKind = "rect";
  state.selectionInverse = false;
  selectTool("marquee");
  updateStatus("Selected all");
}

function deselect() {
  const selection = currentSelectionState();
  if (selection) {
    state.lastSelection = selection;
  }
  state.selectionRect = null;
  state.selectionMaskCanvas = null;
  state.selectionPath = null;
  state.selectionKind = "rect";
  state.selectionInverse = false;
  updateToolUi();
  render();
}

function reselect() {
  if (!restoreSelectionState(state.lastSelection)) {
    updateStatus("No selection to reselect");
    return;
  }
  controls.selectionFeather.value = state.selectionFeather;
  values.selectionFeather.textContent = `${state.selectionFeather} px`;
  updateToolUi();
  render();
  updateStatus("Reselected previous selection");
}

function rulerStep() {
  const targetPixels = 96;
  const rawStep = targetPixels / state.view.scale;
  const power = 10 ** Math.floor(Math.log10(Math.max(1, rawStep)));
  return [1, 2, 5, 10].map((unit) => unit * power).find((step) => step >= rawStep) || power * 10;
}

function renderRulers() {
  if (!state.showRulers) {
    dom.rulerTop.replaceChildren();
    dom.rulerLeft.replaceChildren();
    return;
  }
  const majorStep = rulerStep();
  const minorStep = majorStep / 5;
  renderRuler(dom.rulerTop, "horizontal", majorStep, minorStep);
  renderRuler(dom.rulerLeft, "vertical", majorStep, minorStep);
}

function renderRuler(ruler, axis, majorStep, minorStep) {
  const rect = ruler.getBoundingClientRect();
  const length = axis === "horizontal" ? rect.width : rect.height;
  const docLength = axis === "horizontal" ? state.doc.width : state.doc.height;
  const startDoc = clamp(axis === "horizontal" ? viewToDoc({ x: 0, y: 0 }).x : viewToDoc({ x: 0, y: 0 }).y, 0, docLength);
  const endDoc = clamp(axis === "horizontal" ? viewToDoc({ x: length, y: 0 }).x : viewToDoc({ x: 0, y: length }).y, 0, docLength);
  const firstMinor = Math.floor(startDoc / minorStep) * minorStep;
  const fragment = document.createDocumentFragment();

  for (let value = firstMinor; value <= endDoc + minorStep; value += minorStep) {
    if (value < 0 || value > docLength) continue;
    const position = (axis === "horizontal" ? state.view.x : state.view.y) + value * state.view.scale;
    const isMajor = Math.abs(value / majorStep - Math.round(value / majorStep)) < 0.001;
    const tick = document.createElement("span");
    tick.className = `ruler-tick ${isMajor ? "ruler-major" : "ruler-minor"}`;
    if (axis === "horizontal") tick.style.left = `${Math.round(position)}px`;
    else tick.style.top = `${Math.round(position)}px`;
    fragment.appendChild(tick);

    if (isMajor) {
      const label = document.createElement("span");
      label.className = "ruler-label";
      label.textContent = String(Math.round(value));
      if (axis === "horizontal") label.style.left = `${Math.round(position) + 3}px`;
      else label.style.top = `${Math.round(position) + 3}px`;
      fragment.appendChild(label);
    }
  }

  ruler.replaceChildren(fragment);
}

function invertSelection() {
  if (!state.selectionRect) {
    updateStatus("No selection to invert");
    return;
  }
  state.selectionInverse = !state.selectionInverse;
  updateToolUi();
  render();
  updateStatus(state.selectionInverse ? "Selection inverted" : "Selection restored");
}

function toggleGrid() {
  state.showGrid = !state.showGrid;
  render();
  updateStatus(state.showGrid ? "Grid visible" : "Grid hidden");
}

function toggleRulers() {
  state.showRulers = !state.showRulers;
  render();
  updateStatus(state.showRulers ? "Rulers visible" : "Rulers hidden");
}

function toggleGuides() {
  state.showGuides = !state.showGuides;
  render();
  updateStatus(state.showGuides ? "Guides visible" : "Guides hidden");
}

function toggleExtras() {
  state.showExtras = !state.showExtras;
  render();
  updateStatus(state.showExtras ? "Extras visible" : "Extras hidden");
}

function toggleSnap() {
  state.snapEnabled = !state.snapEnabled;
  updateStatus(state.snapEnabled ? "Snap enabled" : "Snap disabled");
}

function toggleSnapTarget(target) {
  state[target] = !state[target];
  const label = target === "snapToGrid" ? "grid" : "guides";
  updateStatus(state[target] ? `Snap to ${label} enabled` : `Snap to ${label} disabled`);
}

function addGuide(axis) {
  const position = axis === "vertical" ? state.doc.width / 2 : state.doc.height / 2;
  state.guides.push({ axis, position });
  state.showGuides = true;
  commitHistory(`New ${axis} guide`);
  renderAll();
}

function clearGuides() {
  if (state.guides.length === 0) {
    updateStatus("No guides to clear");
    return;
  }
  state.guides = [];
  commitHistory("Clear guides");
  renderAll();
}

function togglePreviewChannel(channel, checked) {
  const next = { ...state.visibleChannels, [channel]: checked };
  if (!next.red && !next.green && !next.blue) {
    controls[`channel${channel[0].toUpperCase()}${channel.slice(1)}`].checked = true;
    updateStatus("At least one channel must be visible");
    return;
  }
  state.visibleChannels = next;
  dom.channelStatus.textContent = channelStatusText();
  render();
  updateStatus(`${channelStatusText()} channel preview`);
}

function moveLayerOrder(direction) {
  const index = state.layers.findIndex((layer) => layer.id === state.activeLayerId);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= state.layers.length) return;
  if (isBackgroundLayer(state.layers[index], index) || (direction < 0 && nextIndex === 0 && isBackgroundLayer(state.layers[0], 0))) {
    updateStatus("Background layer must stay at bottom");
    return;
  }
  const [layer] = state.layers.splice(index, 1);
  state.layers.splice(nextIndex, 0, layer);
  normalizeClippingMasks();
  commitHistory(direction > 0 ? "Bring layer forward" : "Send layer backward");
  renderAll();
}

function moveLayerToEdge(direction) {
  const index = state.layers.findIndex((layer) => layer.id === state.activeLayerId);
  const nextIndex = direction > 0 ? state.layers.length - 1 : isBackgroundLayer(state.layers[0], 0) ? 1 : 0;
  if (index < 0 || index === nextIndex) return;
  if (isBackgroundLayer(state.layers[index], index)) {
    updateStatus("Background layer must stay at bottom");
    return;
  }
  const [layer] = state.layers.splice(index, 1);
  state.layers.splice(nextIndex, 0, layer);
  normalizeClippingMasks();
  commitHistory(direction > 0 ? "Bring layer to front" : "Send layer to back");
  renderAll();
}

function selectLayerByOffset(direction, toEdge = false) {
  const index = activeLayerIndex();
  if (index < 0) return false;
  const nextIndex = toEdge ? (direction > 0 ? state.layers.length - 1 : 0) : clamp(index + direction, 0, state.layers.length - 1);
  if (nextIndex === index) return false;
  state.activeLayerId = state.layers[nextIndex].id;
  renderAll();
  updateStatus(`Selected ${state.layers[nextIndex].name}`);
  return true;
}

function applyVisibleFilters() {
  if (!isFilterActive()) {
    updateStatus("No visible filters to apply");
    return;
  }
  const filtered = composeDocument({ applyFilters: true });
  state.layers = [createLayer("Filtered composite", filtered)];
  state.activeLayerId = state.layers[0].id;
  resetAdjustments();
  commitHistory("Apply visible filters");
  renderAll();
}

function blurCanvas(source, radius = 4) {
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  nextCtx.filter = `blur(${radius}px)`;
  nextCtx.drawImage(source, 0, 0);
  nextCtx.filter = "none";
  return next;
}

function boxBlurCanvas(source, radius) {
  const size = Math.max(1, Math.round(radius));
  const span = size * 2 + 1;
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const tempPixels = new Uint8ClampedArray(sourcePixels.length);
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      for (let channel = 0; channel < 4; channel += 1) {
        let sum = 0;
        for (let kx = -size; kx <= size; kx += 1) {
          const sampleX = clamp(x + kx, 0, source.width - 1);
          sum += sourcePixels[(y * source.width + sampleX) * 4 + channel];
        }
        tempPixels[pixelIndex + channel] = Math.round(sum / span);
      }
    }
  }

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      for (let channel = 0; channel < 4; channel += 1) {
        let sum = 0;
        for (let ky = -size; ky <= size; ky += 1) {
          const sampleY = clamp(y + ky, 0, source.height - 1);
          sum += tempPixels[(sampleY * source.width + x) * 4 + channel];
        }
        outputPixels[pixelIndex + channel] = Math.round(sum / span);
      }
    }
  }

  nextCtx.putImageData(output, 0, 0);
  return next;
}

function boxBlurFilterCanvas(source, radius, useAlpha = false) {
  const blurred = boxBlurCanvas(source, radius);
  const sourceData = source.getContext("2d").getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const blurredData = blurred.getContext("2d").getImageData(0, 0, blurred.width, blurred.height);
  const blurredPixels = blurredData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  let changed = false;

  for (let index = 0; index < sourcePixels.length; index += 4) {
    const red = useAlpha ? 255 : blurredPixels[index];
    const green = useAlpha ? 255 : blurredPixels[index + 1];
    const blue = useAlpha ? 255 : blurredPixels[index + 2];
    const alpha = blurredPixels[index + 3];
    changed = changed || sourcePixels[index] !== red || sourcePixels[index + 1] !== green || sourcePixels[index + 2] !== blue || sourcePixels[index + 3] !== alpha;
    outputPixels[index] = red;
    outputPixels[index + 1] = green;
    outputPixels[index + 2] = blue;
    outputPixels[index + 3] = alpha;
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function averageCanvas(source, useAlpha = false, mask = null) {
  const sourceData = source.getContext("2d").getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const maskPixels = mask?.getContext("2d").getImageData(0, 0, mask.width, mask.height).data || null;
  let totalWeight = 0;
  let alphaSum = 0;
  let redSum = 0;
  let greenSum = 0;
  let blueSum = 0;

  for (let index = 0; index < sourcePixels.length; index += 4) {
    const weight = maskPixels ? maskPixels[index + 3] / 255 : 1;
    if (weight <= 0) continue;
    const alpha = sourcePixels[index + 3];
    totalWeight += weight;
    alphaSum += alpha * weight;
    redSum += sourcePixels[index] * alpha * weight;
    greenSum += sourcePixels[index + 1] * alpha * weight;
    blueSum += sourcePixels[index + 2] * alpha * weight;
  }

  if (totalWeight <= 0) return null;

  const alpha = clamp(Math.round(alphaSum / totalWeight), 0, 255);
  const red = useAlpha || alphaSum === 0 ? (useAlpha ? 255 : 0) : clamp(Math.round(redSum / alphaSum), 0, 255);
  const green = useAlpha || alphaSum === 0 ? (useAlpha ? 255 : 0) : clamp(Math.round(greenSum / alphaSum), 0, 255);
  const blue = useAlpha || alphaSum === 0 ? (useAlpha ? 255 : 0) : clamp(Math.round(blueSum / alphaSum), 0, 255);
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  let changed = false;

  for (let index = 0; index < outputPixels.length; index += 4) {
    changed = changed || sourcePixels[index] !== red || sourcePixels[index + 1] !== green || sourcePixels[index + 2] !== blue || sourcePixels[index + 3] !== alpha;
    outputPixels[index] = red;
    outputPixels[index + 1] = green;
    outputPixels[index + 2] = blue;
    outputPixels[index + 3] = alpha;
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function gaussianBlurCanvas(source, radius, useAlpha = false) {
  const blurred = boxBlurCanvas(source, radius);
  const sourceData = source.getContext("2d").getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const blurredData = blurred.getContext("2d").getImageData(0, 0, blurred.width, blurred.height);
  const blurredPixels = blurredData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  let changed = false;

  for (let index = 0; index < sourcePixels.length; index += 4) {
    const red = useAlpha ? 255 : blurredPixels[index];
    const green = useAlpha ? 255 : blurredPixels[index + 1];
    const blue = useAlpha ? 255 : blurredPixels[index + 2];
    const alpha = blurredPixels[index + 3];
    changed = changed || sourcePixels[index] !== red || sourcePixels[index + 1] !== green || sourcePixels[index + 2] !== blue || sourcePixels[index + 3] !== alpha;
    outputPixels[index] = red;
    outputPixels[index + 1] = green;
    outputPixels[index + 2] = blue;
    outputPixels[index + 3] = alpha;
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function surfaceBlurCanvas(source, options, useAlpha = false) {
  const { radius, threshold } = options;
  const size = Math.max(1, Math.round(radius));
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const sampleValue = (index) => useAlpha ? sourcePixels[index + 3] : sourcePixels[index] * 0.299 + sourcePixels[index + 1] * 0.587 + sourcePixels[index + 2] * 0.114;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      if (!useAlpha && sourcePixels[pixelIndex + 3] === 0) {
        outputPixels[pixelIndex] = sourcePixels[pixelIndex];
        outputPixels[pixelIndex + 1] = sourcePixels[pixelIndex + 1];
        outputPixels[pixelIndex + 2] = sourcePixels[pixelIndex + 2];
        outputPixels[pixelIndex + 3] = sourcePixels[pixelIndex + 3];
        continue;
      }

      const centerValue = sampleValue(pixelIndex);
      let count = 0;
      let alphaSum = 0;
      let redSum = 0;
      let greenSum = 0;
      let blueSum = 0;

      for (let ky = -size; ky <= size; ky += 1) {
        for (let kx = -size; kx <= size; kx += 1) {
          const sampleX = clamp(x + kx, 0, source.width - 1);
          const sampleY = clamp(y + ky, 0, source.height - 1);
          const sampleIndex = (sampleY * source.width + sampleX) * 4;
          if (!useAlpha && sourcePixels[sampleIndex + 3] === 0) continue;
          if (Math.abs(sampleValue(sampleIndex) - centerValue) > threshold) continue;
          const alpha = sourcePixels[sampleIndex + 3];
          count += 1;
          alphaSum += alpha;
          redSum += sourcePixels[sampleIndex] * alpha;
          greenSum += sourcePixels[sampleIndex + 1] * alpha;
          blueSum += sourcePixels[sampleIndex + 2] * alpha;
        }
      }

      const sourceAlpha = sourcePixels[pixelIndex + 3];
      const alpha = useAlpha && count > 0 ? clamp(Math.round(alphaSum / count), 0, 255) : sourceAlpha;
      const red = useAlpha ? 255 : alphaSum > 0 ? clamp(Math.round(redSum / alphaSum), 0, 255) : sourcePixels[pixelIndex];
      const green = useAlpha ? 255 : alphaSum > 0 ? clamp(Math.round(greenSum / alphaSum), 0, 255) : sourcePixels[pixelIndex + 1];
      const blue = useAlpha ? 255 : alphaSum > 0 ? clamp(Math.round(blueSum / alphaSum), 0, 255) : sourcePixels[pixelIndex + 2];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourceAlpha !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function smartBlurPassCanvas(source, options, useAlpha = false) {
  const { radius, threshold } = options;
  const size = Math.max(1, Math.round(radius));
  const sourcePixels = source.getContext("2d").getImageData(0, 0, source.width, source.height).data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const sampleValue = (index) => useAlpha ? sourcePixels[index + 3] : sourcePixels[index] * 0.299 + sourcePixels[index + 1] * 0.587 + sourcePixels[index + 2] * 0.114;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      if (!useAlpha && sourcePixels[pixelIndex + 3] === 0) {
        outputPixels[pixelIndex] = sourcePixels[pixelIndex];
        outputPixels[pixelIndex + 1] = sourcePixels[pixelIndex + 1];
        outputPixels[pixelIndex + 2] = sourcePixels[pixelIndex + 2];
        outputPixels[pixelIndex + 3] = sourcePixels[pixelIndex + 3];
        continue;
      }

      const centerValue = sampleValue(pixelIndex);
      let weightSum = 0;
      let alphaSum = 0;
      let redSum = 0;
      let greenSum = 0;
      let blueSum = 0;

      for (let ky = -size; ky <= size; ky += 1) {
        for (let kx = -size; kx <= size; kx += 1) {
          const sampleX = clamp(x + kx, 0, source.width - 1);
          const sampleY = clamp(y + ky, 0, source.height - 1);
          const sampleIndex = (sampleY * source.width + sampleX) * 4;
          if (!useAlpha && sourcePixels[sampleIndex + 3] === 0) continue;
          const difference = Math.abs(sampleValue(sampleIndex) - centerValue);
          if (difference > threshold) continue;
          const distance = Math.hypot(kx, ky);
          const spatialWeight = Math.max(0.05, 1 - distance / (size + 1));
          const tonalWeight = threshold === 0 ? 1 : 1 - difference / (threshold + 1);
          const weight = spatialWeight * tonalWeight;
          const alpha = sourcePixels[sampleIndex + 3];
          weightSum += weight;
          alphaSum += alpha * weight;
          redSum += sourcePixels[sampleIndex] * alpha * weight;
          greenSum += sourcePixels[sampleIndex + 1] * alpha * weight;
          blueSum += sourcePixels[sampleIndex + 2] * alpha * weight;
        }
      }

      const sourceAlpha = sourcePixels[pixelIndex + 3];
      const alpha = useAlpha && weightSum > 0 ? clamp(Math.round(alphaSum / weightSum), 0, 255) : sourceAlpha;
      const red = useAlpha ? 255 : alphaSum > 0 ? clamp(Math.round(redSum / alphaSum), 0, 255) : sourcePixels[pixelIndex];
      const green = useAlpha ? 255 : alphaSum > 0 ? clamp(Math.round(greenSum / alphaSum), 0, 255) : sourcePixels[pixelIndex + 1];
      const blue = useAlpha ? 255 : alphaSum > 0 ? clamp(Math.round(blueSum / alphaSum), 0, 255) : sourcePixels[pixelIndex + 2];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourceAlpha !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function smartBlurCanvas(source, options, useAlpha = false) {
  const quality = Math.max(1, Math.round(options.quality || 1));
  let current = source;
  let changed = false;

  for (let pass = 0; pass < quality; pass += 1) {
    const filtered = smartBlurPassCanvas(current, options, useAlpha);
    if (!filtered) break;
    current = filtered;
    changed = true;
  }

  return changed ? current : null;
}

function twirlCanvas(source, angle, useAlpha = false) {
  const angleRadians = (angle * Math.PI) / 180;
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const centerX = (source.width - 1) / 2;
  const centerY = (source.height - 1) / 2;
  const maxRadius = Math.max(1, Math.hypot(centerX, centerY));
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.hypot(dx, dy);
      const ratio = clamp(distance / maxRadius, 0, 1);
      const twist = angleRadians * (1 - ratio) * (1 - ratio);
      const sourceAngle = Math.atan2(dy, dx) - twist;
      const sourceX = clamp(Math.round(centerX + Math.cos(sourceAngle) * distance), 0, source.width - 1);
      const sourceY = clamp(Math.round(centerY + Math.sin(sourceAngle) * distance), 0, source.height - 1);
      const sourceIndex = (sourceY * source.width + sourceX) * 4;
      const red = useAlpha ? 255 : sourcePixels[sourceIndex];
      const green = useAlpha ? 255 : sourcePixels[sourceIndex + 1];
      const blue = useAlpha ? 255 : sourcePixels[sourceIndex + 2];
      const alpha = sourcePixels[sourceIndex + 3];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function pinchCanvas(source, amount, useAlpha = false) {
  const strength = amount / 100;
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const centerX = (source.width - 1) / 2;
  const centerY = (source.height - 1) / 2;
  const maxRadius = Math.max(1, Math.hypot(centerX, centerY));
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.hypot(dx, dy);
      const ratio = clamp(distance / maxRadius, 0, 1);
      const scale = distance === 0 ? 0 : (1 + strength * (1 - ratio) * (1 - ratio));
      const sourceX = clamp(Math.round(centerX + dx * scale), 0, source.width - 1);
      const sourceY = clamp(Math.round(centerY + dy * scale), 0, source.height - 1);
      const sourceIndex = (sourceY * source.width + sourceX) * 4;
      const red = useAlpha ? 255 : sourcePixels[sourceIndex];
      const green = useAlpha ? 255 : sourcePixels[sourceIndex + 1];
      const blue = useAlpha ? 255 : sourcePixels[sourceIndex + 2];
      const alpha = sourcePixels[sourceIndex + 3];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function rippleCanvas(source, options, useAlpha = false) {
  const { amount, wavelength } = options;
  const amplitude = amount / 10;
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const wave = (Math.PI * 2) / wavelength;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      const sourceX = clamp(Math.round(x + Math.sin(y * wave) * amplitude), 0, source.width - 1);
      const sourceY = clamp(Math.round(y + Math.sin(x * wave) * amplitude), 0, source.height - 1);
      const sourceIndex = (sourceY * source.width + sourceX) * 4;
      const red = useAlpha ? 255 : sourcePixels[sourceIndex];
      const green = useAlpha ? 255 : sourcePixels[sourceIndex + 1];
      const blue = useAlpha ? 255 : sourcePixels[sourceIndex + 2];
      const alpha = sourcePixels[sourceIndex + 3];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function spherizeCanvas(source, amount, useAlpha = false) {
  const strength = amount / 100;
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const centerX = (source.width - 1) / 2;
  const centerY = (source.height - 1) / 2;
  const maxRadius = Math.max(1, Math.hypot(centerX, centerY));
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.hypot(dx, dy);
      const ratio = clamp(distance / maxRadius, 0, 1);
      const bulgedRatio = (2 / Math.PI) * Math.asin(ratio);
      const pinchedRatio = Math.sin((ratio * Math.PI) / 2);
      const sourceRatio = strength >= 0
        ? ratio + (bulgedRatio - ratio) * strength
        : ratio + (pinchedRatio - ratio) * -strength;
      const scale = distance === 0 ? 0 : (sourceRatio * maxRadius) / distance;
      const sourceX = clamp(Math.round(centerX + dx * scale), 0, source.width - 1);
      const sourceY = clamp(Math.round(centerY + dy * scale), 0, source.height - 1);
      const sourceIndex = (sourceY * source.width + sourceX) * 4;
      const red = useAlpha ? 255 : sourcePixels[sourceIndex];
      const green = useAlpha ? 255 : sourcePixels[sourceIndex + 1];
      const blue = useAlpha ? 255 : sourcePixels[sourceIndex + 2];
      const alpha = sourcePixels[sourceIndex + 3];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function zigZagCanvas(source, options, useAlpha = false) {
  const { amount, ridges } = options;
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const centerX = (source.width - 1) / 2;
  const centerY = (source.height - 1) / 2;
  const maxRadius = Math.max(1, Math.hypot(centerX, centerY));
  const amplitude = (amount / 100) * maxRadius * 0.25;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.hypot(dx, dy);
      const ratio = clamp(distance / maxRadius, 0, 1);
      const wave = Math.sin(ratio * ridges * Math.PI * 2);
      const sourceDistance = clamp(distance + wave * amplitude * (1 - ratio * 0.15), 0, maxRadius);
      const scale = distance === 0 ? 0 : sourceDistance / distance;
      const sourceX = clamp(Math.round(centerX + dx * scale), 0, source.width - 1);
      const sourceY = clamp(Math.round(centerY + dy * scale), 0, source.height - 1);
      const sourceIndex = (sourceY * source.width + sourceX) * 4;
      const red = useAlpha ? 255 : sourcePixels[sourceIndex];
      const green = useAlpha ? 255 : sourcePixels[sourceIndex + 1];
      const blue = useAlpha ? 255 : sourcePixels[sourceIndex + 2];
      const alpha = sourcePixels[sourceIndex + 3];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function waveCanvas(source, options, useAlpha = false) {
  const { xAmplitude, yAmplitude, wavelength } = options;
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const wave = (Math.PI * 2) / wavelength;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      const sourceX = clamp(Math.round(x + Math.sin(y * wave) * xAmplitude), 0, source.width - 1);
      const sourceY = clamp(Math.round(y + Math.sin(x * wave) * yAmplitude), 0, source.height - 1);
      const sourceIndex = (sourceY * source.width + sourceX) * 4;
      const red = useAlpha ? 255 : sourcePixels[sourceIndex];
      const green = useAlpha ? 255 : sourcePixels[sourceIndex + 1];
      const blue = useAlpha ? 255 : sourcePixels[sourceIndex + 2];
      const alpha = sourcePixels[sourceIndex + 3];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function polarCoordinatesCanvas(source, mode, useAlpha = false) {
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const centerX = (source.width - 1) / 2;
  const centerY = (source.height - 1) / 2;
  const maxRadius = Math.max(1, Math.hypot(centerX, centerY));
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      let sourceX = x;
      let sourceY = y;

      if (mode === "rect") {
        const dx = x - centerX;
        const dy = y - centerY;
        const angle = Math.atan2(dy, dx);
        const angleRatio = (angle + Math.PI) / (Math.PI * 2);
        const radiusRatio = clamp(Math.hypot(dx, dy) / maxRadius, 0, 1);
        sourceX = clamp(Math.round(angleRatio * (source.width - 1)), 0, source.width - 1);
        sourceY = clamp(Math.round(radiusRatio * (source.height - 1)), 0, source.height - 1);
      } else {
        const angleRatio = source.width <= 1 ? 0 : x / (source.width - 1);
        const radiusRatio = source.height <= 1 ? 0 : y / (source.height - 1);
        const angle = angleRatio * Math.PI * 2 - Math.PI;
        const distance = radiusRatio * maxRadius;
        sourceX = clamp(Math.round(centerX + Math.cos(angle) * distance), 0, source.width - 1);
        sourceY = clamp(Math.round(centerY + Math.sin(angle) * distance), 0, source.height - 1);
      }

      const sourceIndex = (sourceY * source.width + sourceX) * 4;
      const red = useAlpha ? 255 : sourcePixels[sourceIndex];
      const green = useAlpha ? 255 : sourcePixels[sourceIndex + 1];
      const blue = useAlpha ? 255 : sourcePixels[sourceIndex + 2];
      const alpha = sourcePixels[sourceIndex + 3];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function shearCanvas(source, amount, useAlpha = false) {
  const maxShift = (amount / 100) * source.width * 0.5;
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    const ratio = source.height <= 1 ? 0 : y / (source.height - 1) - 0.5;
    const offset = ratio * maxShift;
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      const sourceX = clamp(Math.round(x - offset), 0, source.width - 1);
      const sourceIndex = (y * source.width + sourceX) * 4;
      const red = useAlpha ? 255 : sourcePixels[sourceIndex];
      const green = useAlpha ? 255 : sourcePixels[sourceIndex + 1];
      const blue = useAlpha ? 255 : sourcePixels[sourceIndex + 2];
      const alpha = sourcePixels[sourceIndex + 3];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function motionBlurCanvas(source, options, useAlpha = false) {
  const { angle, distance } = options;
  const angleRadians = (angle * Math.PI) / 180;
  const deltaX = Math.cos(angleRadians);
  const deltaY = Math.sin(angleRadians);
  const sampleCount = Math.max(2, Math.round(distance) + 1);
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      let alphaSum = 0;
      let redSum = 0;
      let greenSum = 0;
      let blueSum = 0;

      for (let sample = 0; sample < sampleCount; sample += 1) {
        const progress = sampleCount === 1 ? 0 : sample / (sampleCount - 1) - 0.5;
        const sampleX = clamp(Math.round(x + deltaX * distance * progress), 0, source.width - 1);
        const sampleY = clamp(Math.round(y + deltaY * distance * progress), 0, source.height - 1);
        const sampleIndex = (sampleY * source.width + sampleX) * 4;
        const alpha = sourcePixels[sampleIndex + 3];
        alphaSum += alpha;
        redSum += sourcePixels[sampleIndex] * alpha;
        greenSum += sourcePixels[sampleIndex + 1] * alpha;
        blueSum += sourcePixels[sampleIndex + 2] * alpha;
      }

      const alpha = clamp(Math.round(alphaSum / sampleCount), 0, 255);
      const red = useAlpha || alphaSum === 0 ? (useAlpha ? 255 : 0) : clamp(Math.round(redSum / alphaSum), 0, 255);
      const green = useAlpha || alphaSum === 0 ? (useAlpha ? 255 : 0) : clamp(Math.round(greenSum / alphaSum), 0, 255);
      const blue = useAlpha || alphaSum === 0 ? (useAlpha ? 255 : 0) : clamp(Math.round(blueSum / alphaSum), 0, 255);
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function radialBlurCanvas(source, amount, useAlpha = false) {
  const strength = amount / 100;
  const sampleCount = Math.max(2, Math.round(amount / 8) + 2);
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const centerX = (source.width - 1) / 2;
  const centerY = (source.height - 1) / 2;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      const dx = x - centerX;
      const dy = y - centerY;
      let alphaSum = 0;
      let redSum = 0;
      let greenSum = 0;
      let blueSum = 0;

      for (let sample = 0; sample < sampleCount; sample += 1) {
        const progress = sampleCount === 1 ? 0 : sample / (sampleCount - 1);
        const scale = 1 - strength * 0.35 * progress;
        const sampleX = clamp(Math.round(centerX + dx * scale), 0, source.width - 1);
        const sampleY = clamp(Math.round(centerY + dy * scale), 0, source.height - 1);
        const sampleIndex = (sampleY * source.width + sampleX) * 4;
        const alpha = sourcePixels[sampleIndex + 3];
        alphaSum += alpha;
        redSum += sourcePixels[sampleIndex] * alpha;
        greenSum += sourcePixels[sampleIndex + 1] * alpha;
        blueSum += sourcePixels[sampleIndex + 2] * alpha;
      }

      const alpha = clamp(Math.round(alphaSum / sampleCount), 0, 255);
      const red = useAlpha || alphaSum === 0 ? (useAlpha ? 255 : 0) : clamp(Math.round(redSum / alphaSum), 0, 255);
      const green = useAlpha || alphaSum === 0 ? (useAlpha ? 255 : 0) : clamp(Math.round(greenSum / alphaSum), 0, 255);
      const blue = useAlpha || alphaSum === 0 ? (useAlpha ? 255 : 0) : clamp(Math.round(blueSum / alphaSum), 0, 255);
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function medianCanvas(source, radius, useAlpha = false) {
  const size = Math.max(1, Math.round(radius));
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const medianValue = (values) => {
    values.sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)];
  };
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      const alphaValues = [];
      const redValues = [];
      const greenValues = [];
      const blueValues = [];

      for (let ky = -size; ky <= size; ky += 1) {
        for (let kx = -size; kx <= size; kx += 1) {
          const sampleX = clamp(x + kx, 0, source.width - 1);
          const sampleY = clamp(y + ky, 0, source.height - 1);
          const sampleIndex = (sampleY * source.width + sampleX) * 4;
          alphaValues.push(sourcePixels[sampleIndex + 3]);
          if (!useAlpha && sourcePixels[sampleIndex + 3] > 0) {
            redValues.push(sourcePixels[sampleIndex]);
            greenValues.push(sourcePixels[sampleIndex + 1]);
            blueValues.push(sourcePixels[sampleIndex + 2]);
          }
        }
      }

      const sourceAlpha = sourcePixels[pixelIndex + 3];
      if (!useAlpha && sourceAlpha === 0) {
        outputPixels[pixelIndex] = sourcePixels[pixelIndex];
        outputPixels[pixelIndex + 1] = sourcePixels[pixelIndex + 1];
        outputPixels[pixelIndex + 2] = sourcePixels[pixelIndex + 2];
        outputPixels[pixelIndex + 3] = sourceAlpha;
        continue;
      }
      const alpha = useAlpha ? medianValue(alphaValues) : sourceAlpha;
      const red = useAlpha ? 255 : redValues.length ? medianValue(redValues) : sourcePixels[pixelIndex];
      const green = useAlpha ? 255 : greenValues.length ? medianValue(greenValues) : sourcePixels[pixelIndex + 1];
      const blue = useAlpha ? 255 : blueValues.length ? medianValue(blueValues) : sourcePixels[pixelIndex + 2];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourceAlpha !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function dustScratchesCanvas(source, options, useAlpha = false) {
  const { radius, threshold } = options;
  const size = Math.max(1, Math.round(radius));
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const medianValue = (values) => {
    values.sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)];
  };
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      const alphaValues = [];
      const redValues = [];
      const greenValues = [];
      const blueValues = [];

      for (let ky = -size; ky <= size; ky += 1) {
        for (let kx = -size; kx <= size; kx += 1) {
          const sampleX = clamp(x + kx, 0, source.width - 1);
          const sampleY = clamp(y + ky, 0, source.height - 1);
          const sampleIndex = (sampleY * source.width + sampleX) * 4;
          alphaValues.push(sourcePixels[sampleIndex + 3]);
          if (!useAlpha && sourcePixels[sampleIndex + 3] > 0) {
            redValues.push(sourcePixels[sampleIndex]);
            greenValues.push(sourcePixels[sampleIndex + 1]);
            blueValues.push(sourcePixels[sampleIndex + 2]);
          }
        }
      }

      const sourceAlpha = sourcePixels[pixelIndex + 3];
      const medianAlpha = medianValue(alphaValues);
      const medianRed = redValues.length ? medianValue(redValues) : sourcePixels[pixelIndex];
      const medianGreen = greenValues.length ? medianValue(greenValues) : sourcePixels[pixelIndex + 1];
      const medianBlue = blueValues.length ? medianValue(blueValues) : sourcePixels[pixelIndex + 2];
      const colorDifference = Math.max(
        Math.abs(sourcePixels[pixelIndex] - medianRed),
        Math.abs(sourcePixels[pixelIndex + 1] - medianGreen),
        Math.abs(sourcePixels[pixelIndex + 2] - medianBlue),
      );
      const alphaDifference = Math.abs(sourceAlpha - medianAlpha);
      const replacePixel = useAlpha ? alphaDifference > threshold : sourceAlpha > 0 && colorDifference > threshold;
      const red = useAlpha ? 255 : replacePixel ? medianRed : sourcePixels[pixelIndex];
      const green = useAlpha ? 255 : replacePixel ? medianGreen : sourcePixels[pixelIndex + 1];
      const blue = useAlpha ? 255 : replacePixel ? medianBlue : sourcePixels[pixelIndex + 2];
      const alpha = useAlpha && replacePixel ? medianAlpha : sourceAlpha;

      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourceAlpha !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function despeckleCanvas(source, useAlpha = false) {
  return dustScratchesCanvas(source, { radius: 1, threshold: 20 }, useAlpha);
}

function reduceNoiseCanvas(source, options, useAlpha = false) {
  const { strength, preserve } = options;
  const radius = strength >= 7 ? 2 : 1;
  const amount = strength / 10;
  const preserveAmount = preserve / 100;
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      const sourceAlpha = sourcePixels[pixelIndex + 3];
      let sampleCount = 0;
      let alphaSum = 0;
      let weightedAlphaSum = 0;
      let redSum = 0;
      let greenSum = 0;
      let blueSum = 0;

      for (let ky = -radius; ky <= radius; ky += 1) {
        for (let kx = -radius; kx <= radius; kx += 1) {
          const sampleX = clamp(x + kx, 0, source.width - 1);
          const sampleY = clamp(y + ky, 0, source.height - 1);
          const sampleIndex = (sampleY * source.width + sampleX) * 4;
          const sampleAlpha = sourcePixels[sampleIndex + 3];
          sampleCount += 1;
          alphaSum += sampleAlpha;
          weightedAlphaSum += sampleAlpha;
          redSum += sourcePixels[sampleIndex] * sampleAlpha;
          greenSum += sourcePixels[sampleIndex + 1] * sampleAlpha;
          blueSum += sourcePixels[sampleIndex + 2] * sampleAlpha;
        }
      }

      if (!useAlpha && sourceAlpha === 0) {
        outputPixels[pixelIndex] = sourcePixels[pixelIndex];
        outputPixels[pixelIndex + 1] = sourcePixels[pixelIndex + 1];
        outputPixels[pixelIndex + 2] = sourcePixels[pixelIndex + 2];
        outputPixels[pixelIndex + 3] = sourceAlpha;
        continue;
      }

      const averageAlpha = clamp(Math.round(alphaSum / sampleCount), 0, 255);
      const averageRed = weightedAlphaSum > 0 ? clamp(Math.round(redSum / weightedAlphaSum), 0, 255) : sourcePixels[pixelIndex];
      const averageGreen = weightedAlphaSum > 0 ? clamp(Math.round(greenSum / weightedAlphaSum), 0, 255) : sourcePixels[pixelIndex + 1];
      const averageBlue = weightedAlphaSum > 0 ? clamp(Math.round(blueSum / weightedAlphaSum), 0, 255) : sourcePixels[pixelIndex + 2];
      const localDifference = useAlpha
        ? Math.abs(sourceAlpha - averageAlpha)
        : Math.max(
            Math.abs(sourcePixels[pixelIndex] - averageRed),
            Math.abs(sourcePixels[pixelIndex + 1] - averageGreen),
            Math.abs(sourcePixels[pixelIndex + 2] - averageBlue),
          );
      const detailProtect = clamp((localDifference / 255) * preserveAmount * 1.5, 0, 0.95);
      const blend = clamp(amount * (1 - detailProtect), 0, 1);
      const alpha = useAlpha ? clamp(Math.round(sourceAlpha + (averageAlpha - sourceAlpha) * blend), 0, 255) : sourceAlpha;
      const red = useAlpha ? 255 : clamp(Math.round(sourcePixels[pixelIndex] + (averageRed - sourcePixels[pixelIndex]) * blend), 0, 255);
      const green = useAlpha ? 255 : clamp(Math.round(sourcePixels[pixelIndex + 1] + (averageGreen - sourcePixels[pixelIndex + 1]) * blend), 0, 255);
      const blue = useAlpha ? 255 : clamp(Math.round(sourcePixels[pixelIndex + 2] + (averageBlue - sourcePixels[pixelIndex + 2]) * blend), 0, 255);

      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourceAlpha !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function highPassCanvas(source, radius, useAlpha = false) {
  const blurred = blurCanvas(source, radius);
  const sourceCtx = source.getContext("2d");
  const blurredCtx = blurred.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const blurredData = blurredCtx.getImageData(0, 0, blurred.width, blurred.height);
  const sourcePixels = sourceData.data;
  const blurredPixels = blurredData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  let changed = false;

  for (let index = 0; index < sourcePixels.length; index += 4) {
    if (useAlpha) {
      const nextAlpha = clamp(Math.round(128 + sourcePixels[index + 3] - blurredPixels[index + 3]), 0, 255);
      changed = changed || nextAlpha !== sourcePixels[index + 3] || sourcePixels[index] !== 255 || sourcePixels[index + 1] !== 255 || sourcePixels[index + 2] !== 255;
      outputPixels[index] = 255;
      outputPixels[index + 1] = 255;
      outputPixels[index + 2] = 255;
      outputPixels[index + 3] = nextAlpha;
      continue;
    }
    if (sourcePixels[index + 3] === 0) continue;
    for (let channel = 0; channel < 3; channel += 1) {
      const nextValue = clamp(Math.round(128 + sourcePixels[index + channel] - blurredPixels[index + channel]), 0, 255);
      changed = changed || nextValue !== sourcePixels[index + channel];
      outputPixels[index + channel] = nextValue;
    }
    outputPixels[index + 3] = sourcePixels[index + 3];
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function sharpenCanvas(source) {
  const sourceCtx = source.getContext("2d");
  const imageData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = imageData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      for (let channel = 0; channel < 3; channel += 1) {
        let value = 0;
        for (let ky = -1; ky <= 1; ky += 1) {
          for (let kx = -1; kx <= 1; kx += 1) {
            const sampleX = clamp(x + kx, 0, source.width - 1);
            const sampleY = clamp(y + ky, 0, source.height - 1);
            const sampleIndex = (sampleY * source.width + sampleX) * 4 + channel;
            value += sourcePixels[sampleIndex] * kernel[(ky + 1) * 3 + kx + 1];
          }
        }
        outputPixels[pixelIndex + channel] = clamp(Math.round(value), 0, 255);
      }
      outputPixels[pixelIndex + 3] = sourcePixels[pixelIndex + 3];
    }
  }

  nextCtx.putImageData(output, 0, 0);
  return next;
}

function unsharpMaskCanvas(source, options, useAlpha = false) {
  const { amount, radius, threshold } = options;
  const scale = amount / 100;
  const blurred = boxBlurCanvas(source, radius);
  const sourceCtx = source.getContext("2d");
  const blurredCtx = blurred.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const blurredData = blurredCtx.getImageData(0, 0, blurred.width, blurred.height);
  const sourcePixels = sourceData.data;
  const blurredPixels = blurredData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  let changed = false;

  for (let index = 0; index < sourcePixels.length; index += 4) {
    if (useAlpha) {
      const difference = sourcePixels[index + 3] - blurredPixels[index + 3];
      const nextAlpha = Math.abs(difference) >= threshold ? clamp(Math.round(sourcePixels[index + 3] + difference * scale), 0, 255) : sourcePixels[index + 3];
      changed = changed || nextAlpha !== sourcePixels[index + 3] || sourcePixels[index] !== 255 || sourcePixels[index + 1] !== 255 || sourcePixels[index + 2] !== 255;
      outputPixels[index] = 255;
      outputPixels[index + 1] = 255;
      outputPixels[index + 2] = 255;
      outputPixels[index + 3] = nextAlpha;
      continue;
    }
    outputPixels[index + 3] = sourcePixels[index + 3];
    if (sourcePixels[index + 3] === 0) {
      outputPixels[index] = sourcePixels[index];
      outputPixels[index + 1] = sourcePixels[index + 1];
      outputPixels[index + 2] = sourcePixels[index + 2];
      continue;
    }
    for (let channel = 0; channel < 3; channel += 1) {
      const difference = sourcePixels[index + channel] - blurredPixels[index + channel];
      const nextValue = Math.abs(difference) >= threshold ? clamp(Math.round(sourcePixels[index + channel] + difference * scale), 0, 255) : sourcePixels[index + channel];
      changed = changed || nextValue !== sourcePixels[index + channel];
      outputPixels[index + channel] = nextValue;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function findEdgesCanvas(source, useAlpha = false) {
  const sourceCtx = source.getContext("2d");
  const imageData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = imageData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const sample = (x, y) => {
    const sampleX = clamp(x, 0, source.width - 1);
    const sampleY = clamp(y, 0, source.height - 1);
    const index = (sampleY * source.width + sampleX) * 4;
    if (useAlpha) return sourcePixels[index + 3];
    if (sourcePixels[index + 3] === 0) return 0;
    return sourcePixels[index] * 0.299 + sourcePixels[index + 1] * 0.587 + sourcePixels[index + 2] * 0.114;
  };
  const kernelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const kernelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      if (!useAlpha && sourcePixels[pixelIndex + 3] === 0) continue;
      let gx = 0;
      let gy = 0;
      let kernelIndex = 0;
      for (let ky = -1; ky <= 1; ky += 1) {
        for (let kx = -1; kx <= 1; kx += 1) {
          const value = sample(x + kx, y + ky);
          gx += value * kernelX[kernelIndex];
          gy += value * kernelY[kernelIndex];
          kernelIndex += 1;
        }
      }
      const edge = clamp(Math.round(Math.hypot(gx, gy)), 0, 255);
      const red = useAlpha ? 255 : edge;
      const green = useAlpha ? 255 : edge;
      const blue = useAlpha ? 255 : edge;
      const alpha = useAlpha ? edge : sourcePixels[pixelIndex + 3];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function glowingEdgesCanvas(source, options, useAlpha = false) {
  const edgeWidth = Math.max(1, Math.round(options.width));
  const brightness = options.brightness;
  const smoothness = Math.max(0, Math.round(options.smoothness));
  const sampleSource = smoothness > 0 ? boxBlurCanvas(source, Math.ceil(smoothness / 2)) : source;
  const samplePixels = sampleSource.getContext("2d").getImageData(0, 0, source.width, source.height).data;
  const sourcePixels = source.getContext("2d").getImageData(0, 0, source.width, source.height).data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const rawEdges = new Uint8ClampedArray(source.width * source.height);
  const sample = (x, y) => {
    const sampleX = clamp(x, 0, source.width - 1);
    const sampleY = clamp(y, 0, source.height - 1);
    const index = (sampleY * source.width + sampleX) * 4;
    if (useAlpha) return samplePixels[index + 3];
    if (samplePixels[index + 3] === 0) return 0;
    return samplePixels[index] * 0.299 + samplePixels[index + 1] * 0.587 + samplePixels[index + 2] * 0.114;
  };
  const kernelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const kernelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      let gx = 0;
      let gy = 0;
      let kernelIndex = 0;
      for (let ky = -1; ky <= 1; ky += 1) {
        for (let kx = -1; kx <= 1; kx += 1) {
          const value = sample(x + kx, y + ky);
          gx += value * kernelX[kernelIndex];
          gy += value * kernelY[kernelIndex];
          kernelIndex += 1;
        }
      }
      rawEdges[y * source.width + x] = clamp(Math.round(Math.hypot(gx, gy)), 0, 255);
    }
  }

  let changed = false;
  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      let edge = 0;
      for (let offsetY = -edgeWidth + 1; offsetY <= edgeWidth - 1; offsetY += 1) {
        for (let offsetX = -edgeWidth + 1; offsetX <= edgeWidth - 1; offsetX += 1) {
          const sampleX = clamp(x + offsetX, 0, source.width - 1);
          const sampleY = clamp(y + offsetY, 0, source.height - 1);
          edge = Math.max(edge, rawEdges[sampleY * source.width + sampleX]);
        }
      }
      const glow = clamp(Math.round(edge * (brightness / 8)), 0, 255);
      const intensity = glow / 255;
      const red = useAlpha ? 255 : clamp(Math.round(sourcePixels[pixelIndex] * intensity), 0, 255);
      const green = useAlpha ? 255 : clamp(Math.round(sourcePixels[pixelIndex + 1] * intensity), 0, 255);
      const blue = useAlpha ? 255 : clamp(Math.round(sourcePixels[pixelIndex + 2] * intensity), 0, 255);
      const alpha = useAlpha ? glow : sourcePixels[pixelIndex + 3];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function smartSharpenCanvas(source, options, useAlpha = false) {
  const { amount, radius, reduceNoise } = options;
  const scale = amount / 100;
  const noiseFloor = reduceNoise * 0.45;
  const blurred = boxBlurCanvas(source, radius);
  const sourcePixels = source.getContext("2d").getImageData(0, 0, source.width, source.height).data;
  const blurredPixels = blurred.getContext("2d").getImageData(0, 0, blurred.width, blurred.height).data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  let changed = false;

  for (let index = 0; index < sourcePixels.length; index += 4) {
    if (useAlpha) {
      const difference = sourcePixels[index + 3] - blurredPixels[index + 3];
      const magnitude = Math.abs(difference);
      const weight = magnitude <= noiseFloor ? 0 : (magnitude - noiseFloor) / (magnitude + 1);
      const alpha = clamp(Math.round(sourcePixels[index + 3] + difference * scale * weight), 0, 255);
      changed = changed || sourcePixels[index] !== 255 || sourcePixels[index + 1] !== 255 || sourcePixels[index + 2] !== 255 || sourcePixels[index + 3] !== alpha;
      outputPixels[index] = 255;
      outputPixels[index + 1] = 255;
      outputPixels[index + 2] = 255;
      outputPixels[index + 3] = alpha;
      continue;
    }

    outputPixels[index + 3] = sourcePixels[index + 3];
    if (sourcePixels[index + 3] === 0) {
      outputPixels[index] = sourcePixels[index];
      outputPixels[index + 1] = sourcePixels[index + 1];
      outputPixels[index + 2] = sourcePixels[index + 2];
      continue;
    }

    for (let channel = 0; channel < 3; channel += 1) {
      const difference = sourcePixels[index + channel] - blurredPixels[index + channel];
      const magnitude = Math.abs(difference);
      const weight = magnitude <= noiseFloor ? 0 : (magnitude - noiseFloor) / (magnitude + 1);
      const value = clamp(Math.round(sourcePixels[index + channel] + difference * scale * weight), 0, 255);
      changed = changed || value !== sourcePixels[index + channel];
      outputPixels[index + channel] = value;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function oilPaintCanvas(source, options, useAlpha = false) {
  const radius = Math.max(1, Math.round(options.radius));
  const intensity = clamp(Math.round(options.intensity), 1, 20);
  const bins = Math.max(4, 24 - intensity);
  const sourcePixels = source.getContext("2d").getImageData(0, 0, source.width, source.height).data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      if (!useAlpha && sourcePixels[pixelIndex + 3] === 0) {
        outputPixels[pixelIndex] = sourcePixels[pixelIndex];
        outputPixels[pixelIndex + 1] = sourcePixels[pixelIndex + 1];
        outputPixels[pixelIndex + 2] = sourcePixels[pixelIndex + 2];
        outputPixels[pixelIndex + 3] = sourcePixels[pixelIndex + 3];
        continue;
      }

      const counts = new Array(bins).fill(0);
      const reds = new Array(bins).fill(0);
      const greens = new Array(bins).fill(0);
      const blues = new Array(bins).fill(0);
      const alphas = new Array(bins).fill(0);

      for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
        for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
          if (offsetX * offsetX + offsetY * offsetY > radius * radius) continue;
          const sampleX = clamp(x + offsetX, 0, source.width - 1);
          const sampleY = clamp(y + offsetY, 0, source.height - 1);
          const sampleIndex = (sampleY * source.width + sampleX) * 4;
          const alpha = sourcePixels[sampleIndex + 3];
          if (!useAlpha && alpha === 0) continue;
          const value = useAlpha
            ? alpha
            : sourcePixels[sampleIndex] * 0.299 + sourcePixels[sampleIndex + 1] * 0.587 + sourcePixels[sampleIndex + 2] * 0.114;
          const bin = clamp(Math.floor((value / 256) * bins), 0, bins - 1);
          counts[bin] += 1;
          reds[bin] += sourcePixels[sampleIndex] * alpha;
          greens[bin] += sourcePixels[sampleIndex + 1] * alpha;
          blues[bin] += sourcePixels[sampleIndex + 2] * alpha;
          alphas[bin] += alpha;
        }
      }

      let bestBin = 0;
      for (let bin = 1; bin < bins; bin += 1) {
        if (counts[bin] > counts[bestBin]) bestBin = bin;
      }

      let red = sourcePixels[pixelIndex];
      let green = sourcePixels[pixelIndex + 1];
      let blue = sourcePixels[pixelIndex + 2];
      let alpha = sourcePixels[pixelIndex + 3];
      if (counts[bestBin] > 0 && alphas[bestBin] > 0) {
        if (useAlpha) {
          red = 255;
          green = 255;
          blue = 255;
          alpha = clamp(Math.round(alphas[bestBin] / counts[bestBin]), 0, 255);
        } else {
          red = clamp(Math.round(reds[bestBin] / alphas[bestBin]), 0, 255);
          green = clamp(Math.round(greens[bestBin] / alphas[bestBin]), 0, 255);
          blue = clamp(Math.round(blues[bestBin] / alphas[bestBin]), 0, 255);
        }
      }

      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function embossCanvas(source, options, useAlpha = false) {
  const { angle, height, amount } = options;
  const angleRadians = (angle * Math.PI) / 180;
  const offsetX = Math.round(Math.cos(angleRadians) * height);
  const offsetY = Math.round(Math.sin(angleRadians) * height);
  const strength = amount / 100;
  const sourceCtx = source.getContext("2d");
  const imageData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = imageData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const sample = (x, y) => {
    const sampleX = clamp(x, 0, source.width - 1);
    const sampleY = clamp(y, 0, source.height - 1);
    const index = (sampleY * source.width + sampleX) * 4;
    if (useAlpha) return sourcePixels[index + 3];
    if (sourcePixels[index + 3] === 0) return 0;
    return sourcePixels[index] * 0.299 + sourcePixels[index + 1] * 0.587 + sourcePixels[index + 2] * 0.114;
  };
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      if (!useAlpha && sourcePixels[pixelIndex + 3] === 0) continue;
      const low = sample(x - offsetX, y - offsetY);
      const high = sample(x + offsetX, y + offsetY);
      const value = clamp(Math.round(128 + (high - low) * strength), 0, 255);
      const red = useAlpha ? 255 : value;
      const green = useAlpha ? 255 : value;
      const blue = useAlpha ? 255 : value;
      const alpha = useAlpha ? value : sourcePixels[pixelIndex + 3];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function diffuseCanvas(source, mode = "normal", useAlpha = false) {
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const offsets = [
    { x: -1, y: -1 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ];
  const luminance = (index) => sourcePixels[index] * 0.299 + sourcePixels[index + 1] * 0.587 + sourcePixels[index + 2] * 0.114;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      const offset = offsets[((x * 37 + y * 57 + x * y * 11) >>> 0) % offsets.length];
      const sampleX = clamp(x + offset.x, 0, source.width - 1);
      const sampleY = clamp(y + offset.y, 0, source.height - 1);
      const sampleIndex = (sampleY * source.width + sampleX) * 4;
      let targetIndex = sampleIndex;

      if (!useAlpha && mode !== "normal") {
        const currentLight = luminance(pixelIndex);
        const sampleLight = luminance(sampleIndex);
        if (mode === "darken" && sampleLight >= currentLight) targetIndex = pixelIndex;
        if (mode === "lighten" && sampleLight <= currentLight) targetIndex = pixelIndex;
      }

      const red = useAlpha ? 255 : sourcePixels[targetIndex];
      const green = useAlpha ? 255 : sourcePixels[targetIndex + 1];
      const blue = useAlpha ? 255 : sourcePixels[targetIndex + 2];
      const alpha = sourcePixels[targetIndex + 3];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function windCanvas(source, options, useAlpha = false) {
  const { direction, method } = options;
  const settings = {
    wind: { radius: 6, strength: 0.36 },
    blast: { radius: 12, strength: 0.58 },
    stagger: { radius: 8, strength: 0.48 },
  }[method];
  const step = direction === "left" ? -1 : 1;
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const scoreAt = (index) => {
    if (useAlpha) return sourcePixels[index + 3];
    return sourcePixels[index + 3] === 0 ? 0 : (sourcePixels[index] * 0.299 + sourcePixels[index + 1] * 0.587 + sourcePixels[index + 2] * 0.114) * (sourcePixels[index + 3] / 255);
  };
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      let bestIndex = pixelIndex;
      let bestScore = scoreAt(pixelIndex);
      let bestDistance = 0;

      for (let distance = 1; distance <= settings.radius; distance += 1) {
        const sampleX = x - step * distance;
        if (sampleX < 0 || sampleX >= source.width) continue;
        const sampleY = method === "stagger" ? clamp(y + ((distance + y) % 2 === 0 ? -1 : 1), 0, source.height - 1) : y;
        const sampleIndex = (sampleY * source.width + sampleX) * 4;
        const sampleScore = scoreAt(sampleIndex);
        if (sampleScore > bestScore) {
          bestScore = sampleScore;
          bestIndex = sampleIndex;
          bestDistance = distance;
        }
      }

      const weight = bestDistance === 0 ? 0 : ((settings.radius - bestDistance + 1) / (settings.radius + 1)) * settings.strength;
      const red = useAlpha ? 255 : clamp(Math.round(sourcePixels[pixelIndex] + (sourcePixels[bestIndex] - sourcePixels[pixelIndex]) * weight), 0, 255);
      const green = useAlpha ? 255 : clamp(Math.round(sourcePixels[pixelIndex + 1] + (sourcePixels[bestIndex + 1] - sourcePixels[pixelIndex + 1]) * weight), 0, 255);
      const blue = useAlpha ? 255 : clamp(Math.round(sourcePixels[pixelIndex + 2] + (sourcePixels[bestIndex + 2] - sourcePixels[pixelIndex + 2]) * weight), 0, 255);
      const alpha = clamp(Math.round(sourcePixels[pixelIndex + 3] + (sourcePixels[bestIndex + 3] - sourcePixels[pixelIndex + 3]) * weight), 0, 255);
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function traceContourCanvas(source, options, useAlpha = false) {
  const { level, edge } = options;
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const offsets = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  const valueAt = (x, y) => {
    const sampleX = clamp(x, 0, source.width - 1);
    const sampleY = clamp(y, 0, source.height - 1);
    const index = (sampleY * source.width + sampleX) * 4;
    if (useAlpha) return sourcePixels[index + 3];
    if (sourcePixels[index + 3] === 0) return 0;
    return sourcePixels[index] * 0.299 + sourcePixels[index + 1] * 0.587 + sourcePixels[index + 2] * 0.114;
  };
  let foundContour = false;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      const current = valueAt(x, y);
      const contour = offsets.some((offset) => {
        const neighbor = valueAt(x + offset.x, y + offset.y);
        if (edge === "lower") return current <= level && neighbor > level;
        return current >= level && neighbor < level;
      });
      foundContour = foundContour || contour;
      const red = useAlpha || !contour ? 255 : 0;
      const green = useAlpha || !contour ? 255 : 0;
      const blue = useAlpha || !contour ? 255 : 0;
      const alpha = useAlpha ? (contour ? 255 : 0) : sourcePixels[pixelIndex + 3];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!foundContour || !changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function extrudeNoise(gridX, gridY) {
  const value = Math.sin(gridX * 157.9 + gridY * 263.3 + 19.7) * 43758.5453;
  return value - Math.floor(value);
}

function extrudeCanvas(source, options, useAlpha = false) {
  const size = Math.max(2, Math.round(options.size));
  const depth = Math.max(1, Math.round(options.depth));
  const sourceCtx = source.getContext("2d");
  const input = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = input.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  outputPixels.set(sourcePixels);

  if (useAlpha) {
    for (let index = 0; index < outputPixels.length; index += 4) {
      outputPixels[index] = 255;
      outputPixels[index + 1] = 255;
      outputPixels[index + 2] = 255;
    }
  }

  const setPixel = (x, y, red, green, blue, alpha) => {
    if (x < 0 || y < 0 || x >= source.width || y >= source.height) return;
    const index = (y * source.width + x) * 4;
    outputPixels[index] = red;
    outputPixels[index + 1] = green;
    outputPixels[index + 2] = blue;
    outputPixels[index + 3] = alpha;
  };
  const shadeColor = (color, shade) => clamp(Math.round(color * shade), 0, 255);
  const cellStarts = (limit) => {
    const starts = [];
    for (let value = 0; value < limit; value += size) starts.push(value);
    return starts;
  };
  const xStarts = cellStarts(source.width);
  const yStarts = cellStarts(source.height);

  for (let row = yStarts.length - 1; row >= 0; row -= 1) {
    for (let column = xStarts.length - 1; column >= 0; column -= 1) {
      const startX = xStarts[column];
      const startY = yStarts[row];
      const blockWidth = Math.min(size, source.width - startX);
      const blockHeight = Math.min(size, source.height - startY);
      let alphaSum = 0;
      let redSum = 0;
      let greenSum = 0;
      let blueSum = 0;
      let count = 0;

      for (let y = 0; y < blockHeight; y += 1) {
        for (let x = 0; x < blockWidth; x += 1) {
          const index = ((startY + y) * source.width + startX + x) * 4;
          const alpha = sourcePixels[index + 3];
          count += 1;
          alphaSum += alpha;
          redSum += sourcePixels[index] * alpha;
          greenSum += sourcePixels[index + 1] * alpha;
          blueSum += sourcePixels[index + 2] * alpha;
        }
      }

      if (alphaSum === 0) continue;
      const averageAlpha = clamp(Math.round(alphaSum / count), 0, 255);
      const averageRed = clamp(Math.round(redSum / alphaSum), 0, 255);
      const averageGreen = clamp(Math.round(greenSum / alphaSum), 0, 255);
      const averageBlue = clamp(Math.round(blueSum / alphaSum), 0, 255);
      const cellDepth = Math.max(1, Math.round(depth * (0.45 + extrudeNoise(column, row) * 0.55)));

      for (let step = cellDepth; step >= 1; step -= 1) {
        const shade = 0.42 + ((cellDepth - step) / cellDepth) * 0.28;
        const red = useAlpha ? 255 : shadeColor(averageRed, shade);
        const green = useAlpha ? 255 : shadeColor(averageGreen, shade);
        const blue = useAlpha ? 255 : shadeColor(averageBlue, shade);
        const alpha = useAlpha ? clamp(Math.round(averageAlpha * shade), 0, 255) : averageAlpha;
        for (let y = 0; y < blockHeight; y += 1) {
          for (let x = 0; x < blockWidth; x += 1) {
            setPixel(startX + x + step, startY + y + step, red, green, blue, alpha);
          }
        }
      }

      for (let y = 0; y < blockHeight; y += 1) {
        for (let x = 0; x < blockWidth; x += 1) {
          const sourceIndex = ((startY + y) * source.width + startX + x) * 4;
          const baseRed = options.solid || useAlpha ? averageRed : sourcePixels[sourceIndex];
          const baseGreen = options.solid || useAlpha ? averageGreen : sourcePixels[sourceIndex + 1];
          const baseBlue = options.solid || useAlpha ? averageBlue : sourcePixels[sourceIndex + 2];
          const baseAlpha = options.solid || useAlpha ? averageAlpha : sourcePixels[sourceIndex + 3];
          let shade = 1;
          if (options.type === "pyramids") {
            const centerX = (blockWidth - 1) / 2;
            const centerY = (blockHeight - 1) / 2;
            const distanceX = centerX > 0 ? Math.abs(x - centerX) / centerX : 0;
            const distanceY = centerY > 0 ? Math.abs(y - centerY) / centerY : 0;
            shade = 1.16 - Math.max(distanceX, distanceY) * 0.42;
          }
          const red = useAlpha ? 255 : shadeColor(baseRed, shade);
          const green = useAlpha ? 255 : shadeColor(baseGreen, shade);
          const blue = useAlpha ? 255 : shadeColor(baseBlue, shade);
          const alpha = useAlpha && options.type === "pyramids" ? clamp(Math.round(baseAlpha * shade), 0, 255) : baseAlpha;
          setPixel(startX + x, startY + y, red, green, blue, alpha);
        }
      }
    }
  }

  let changed = false;
  for (let index = 0; index < outputPixels.length; index += 1) {
    if (outputPixels[index] !== sourcePixels[index]) {
      changed = true;
      break;
    }
  }
  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function tilesNoise(gridX, gridY, salt) {
  const value = Math.sin(gridX * 193.7 + gridY * 421.9 + salt * 61.3) * 91731.123;
  return value - Math.floor(value);
}

function tilesCanvas(source, options, useAlpha = false) {
  const tileCount = Math.max(1, Math.round(options.tiles));
  const maxOffset = Math.max(0, Math.round(options.offset));
  const tileSize = Math.max(1, Math.round(Math.max(source.width, source.height) / tileCount));
  const foreground = hexToRgb(options.foreground || state.brush.color);
  const background = hexToRgb(options.background || state.backgroundColor);
  const sourceCtx = source.getContext("2d");
  const input = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = input.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;

  for (let index = 0; index < sourcePixels.length; index += 4) {
    if (options.fill === "unaltered") {
      outputPixels[index] = useAlpha ? 255 : sourcePixels[index];
      outputPixels[index + 1] = useAlpha ? 255 : sourcePixels[index + 1];
      outputPixels[index + 2] = useAlpha ? 255 : sourcePixels[index + 2];
      outputPixels[index + 3] = sourcePixels[index + 3];
      continue;
    }
    if (options.fill === "inverse") {
      outputPixels[index] = useAlpha ? 255 : 255 - sourcePixels[index];
      outputPixels[index + 1] = useAlpha ? 255 : 255 - sourcePixels[index + 1];
      outputPixels[index + 2] = useAlpha ? 255 : 255 - sourcePixels[index + 2];
      outputPixels[index + 3] = useAlpha ? 255 - sourcePixels[index + 3] : sourcePixels[index + 3];
      continue;
    }
    const fill = options.fill === "foreground" ? foreground : background;
    outputPixels[index] = useAlpha ? 255 : fill.r;
    outputPixels[index + 1] = useAlpha ? 255 : fill.g;
    outputPixels[index + 2] = useAlpha ? 255 : fill.b;
    outputPixels[index + 3] = useAlpha && options.fill === "background" ? 0 : 255;
  }

  for (let startY = 0; startY < source.height; startY += tileSize) {
    for (let startX = 0; startX < source.width; startX += tileSize) {
      const gridX = Math.floor(startX / tileSize);
      const gridY = Math.floor(startY / tileSize);
      const offsetX = Math.round((tilesNoise(gridX, gridY, 1) * 2 - 1) * maxOffset);
      const offsetY = Math.round((tilesNoise(gridX, gridY, 2) * 2 - 1) * maxOffset);
      const blockWidth = Math.min(tileSize, source.width - startX);
      const blockHeight = Math.min(tileSize, source.height - startY);

      for (let y = 0; y < blockHeight; y += 1) {
        const targetY = startY + y + offsetY;
        if (targetY < 0 || targetY >= source.height) continue;
        for (let x = 0; x < blockWidth; x += 1) {
          const targetX = startX + x + offsetX;
          if (targetX < 0 || targetX >= source.width) continue;
          const sourceIndex = ((startY + y) * source.width + startX + x) * 4;
          const targetIndex = (targetY * source.width + targetX) * 4;
          outputPixels[targetIndex] = useAlpha ? 255 : sourcePixels[sourceIndex];
          outputPixels[targetIndex + 1] = useAlpha ? 255 : sourcePixels[sourceIndex + 1];
          outputPixels[targetIndex + 2] = useAlpha ? 255 : sourcePixels[sourceIndex + 2];
          outputPixels[targetIndex + 3] = sourcePixels[sourceIndex + 3];
        }
      }
    }
  }

  let changed = false;
  for (let index = 0; index < outputPixels.length; index += 1) {
    if (outputPixels[index] !== sourcePixels[index]) {
      changed = true;
      break;
    }
  }
  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function cloudNoise(gridX, gridY, seed) {
  const value = Math.sin(gridX * 127.1 + gridY * 311.7 + seed * 74.7) * 43758.5453;
  return value - Math.floor(value);
}

function smoothCloudNoise(x, y, scale, seed) {
  const scaledX = x / scale;
  const scaledY = y / scale;
  const x0 = Math.floor(scaledX);
  const y0 = Math.floor(scaledY);
  const tx = scaledX - x0;
  const ty = scaledY - y0;
  const easeX = tx * tx * (3 - 2 * tx);
  const easeY = ty * ty * (3 - 2 * ty);
  const top = cloudNoise(x0, y0, seed) * (1 - easeX) + cloudNoise(x0 + 1, y0, seed) * easeX;
  const bottom = cloudNoise(x0, y0 + 1, seed) * (1 - easeX) + cloudNoise(x0 + 1, y0 + 1, seed) * easeX;
  return top * (1 - easeY) + bottom * easeY;
}

function cloudValue(x, y, width, height, seed) {
  const baseScale = Math.max(8, Math.max(width, height) / 2);
  let scale = baseScale;
  let amplitude = 1;
  let total = 0;
  let weight = 0;
  for (let octave = 0; octave < 6; octave += 1) {
    total += smoothCloudNoise(x, y, scale, seed + octave * 17.31) * amplitude;
    weight += amplitude;
    scale = Math.max(2, scale / 2);
    amplitude *= 0.55;
  }
  return clamp(total / weight, 0, 1);
}

function cloudsCanvas(source, options, useAlpha = false) {
  const foreground = hexToRgb(options.foreground || state.brush.color);
  const background = hexToRgb(options.background || state.backgroundColor);
  const seed = options.seed || 0;
  const foregroundAlpha = foreground.r * 0.2126 + foreground.g * 0.7152 + foreground.b * 0.0722;
  const backgroundAlpha = background.r * 0.2126 + background.g * 0.7152 + background.b * 0.0722;
  const sourcePixels = source.getContext("2d").getImageData(0, 0, source.width, source.height).data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const index = (y * source.width + x) * 4;
      const value = cloudValue(x, y, source.width, source.height, seed);
      const red = useAlpha ? 255 : clamp(Math.round(background.r + (foreground.r - background.r) * value), 0, 255);
      const green = useAlpha ? 255 : clamp(Math.round(background.g + (foreground.g - background.g) * value), 0, 255);
      const blue = useAlpha ? 255 : clamp(Math.round(background.b + (foreground.b - background.b) * value), 0, 255);
      const alpha = useAlpha ? clamp(Math.round(backgroundAlpha + (foregroundAlpha - backgroundAlpha) * value), 0, 255) : 255;
      changed = changed || sourcePixels[index] !== red || sourcePixels[index + 1] !== green || sourcePixels[index + 2] !== blue || sourcePixels[index + 3] !== alpha;
      outputPixels[index] = red;
      outputPixels[index + 1] = green;
      outputPixels[index + 2] = blue;
      outputPixels[index + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function differenceCloudsCanvas(source, options, useAlpha = false) {
  const foreground = hexToRgb(options.foreground || state.brush.color);
  const background = hexToRgb(options.background || state.backgroundColor);
  const seed = options.seed || 0;
  const foregroundAlpha = foreground.r * 0.2126 + foreground.g * 0.7152 + foreground.b * 0.0722;
  const backgroundAlpha = background.r * 0.2126 + background.g * 0.7152 + background.b * 0.0722;
  const sourcePixels = source.getContext("2d").getImageData(0, 0, source.width, source.height).data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const index = (y * source.width + x) * 4;
      const value = cloudValue(x, y, source.width, source.height, seed);
      const cloudRed = clamp(Math.round(background.r + (foreground.r - background.r) * value), 0, 255);
      const cloudGreen = clamp(Math.round(background.g + (foreground.g - background.g) * value), 0, 255);
      const cloudBlue = clamp(Math.round(background.b + (foreground.b - background.b) * value), 0, 255);
      const cloudAlpha = clamp(Math.round(backgroundAlpha + (foregroundAlpha - backgroundAlpha) * value), 0, 255);
      const red = useAlpha ? 255 : Math.abs(sourcePixels[index] - cloudRed);
      const green = useAlpha ? 255 : Math.abs(sourcePixels[index + 1] - cloudGreen);
      const blue = useAlpha ? 255 : Math.abs(sourcePixels[index + 2] - cloudBlue);
      const alpha = useAlpha ? Math.abs(sourcePixels[index + 3] - cloudAlpha) : 255;
      changed = changed || sourcePixels[index] !== red || sourcePixels[index + 1] !== green || sourcePixels[index + 2] !== blue || sourcePixels[index + 3] !== alpha;
      outputPixels[index] = red;
      outputPixels[index + 1] = green;
      outputPixels[index + 2] = blue;
      outputPixels[index + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function lensFlareCanvas(source, options, useAlpha = false) {
  const type = typeof options.type === "string" ? parseLensFlareType(options.type) || LENS_FLARE_TYPES[0] : options.type || LENS_FLARE_TYPES[0];
  const amount = clamp((options.brightness || 100) / 100, 0.01, 3);
  const centerX = clamp((options.x ?? 50) / 100, 0, 1) * Math.max(0, source.width - 1);
  const centerY = clamp((options.y ?? 50) / 100, 0, 1) * Math.max(0, source.height - 1);
  const maxDimension = Math.max(source.width, source.height, 1);
  const maxDistance = Math.max(1, Math.hypot(Math.max(centerX, source.width - centerX), Math.max(centerY, source.height - centerY)));
  const axisX = source.width / 2 - centerX;
  const axisY = source.height / 2 - centerY;
  const input = source.getContext("2d").getImageData(0, 0, source.width, source.height);
  const sourcePixels = input.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const ghostStops = [-0.58, 0.38, 0.82, 1.24];
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const index = (y * source.width + x) * 4;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.hypot(dx, dy) / maxDistance;
      let light = Math.exp(-Math.pow(distance / type.core, 2)) * 1.05;
      light += Math.exp(-Math.pow(distance / (type.core * 2.6), 2)) * 0.34;
      light += Math.exp(-Math.pow((distance - type.core * 2.85) / (type.core * 0.18), 2)) * 0.16;
      light += Math.exp(-Math.abs(dy) / Math.max(1, source.height * 0.018)) * Math.exp(-Math.abs(dx) / Math.max(1, source.width * 0.44)) * 0.22 * type.streak;
      light += Math.exp(-Math.abs(dx) / Math.max(1, source.width * 0.015)) * Math.exp(-Math.abs(dy) / Math.max(1, source.height * 0.34)) * 0.08 * type.streak;

      for (let stopIndex = 0; stopIndex < ghostStops.length; stopIndex += 1) {
        const stop = ghostStops[stopIndex];
        const ghostX = centerX + axisX * stop;
        const ghostY = centerY + axisY * stop;
        const ghostRadius = maxDimension * (0.035 + stopIndex * 0.018);
        const ghostDistance = Math.hypot(x - ghostX, y - ghostY);
        light += Math.exp(-Math.pow(ghostDistance / ghostRadius, 2)) * (0.15 + stopIndex * 0.025) * type.ghost;
      }

      const contribution = light * amount < 0.004 ? 0 : clamp(light * amount, 0, 1.75);
      let red = sourcePixels[index];
      let green = sourcePixels[index + 1];
      let blue = sourcePixels[index + 2];
      let alpha = sourcePixels[index + 3];

      if (useAlpha) {
        red = 255;
        green = 255;
        blue = 255;
        alpha = clamp(Math.round(alpha + (255 - alpha) * Math.min(contribution, 1)), 0, 255);
      } else {
        red = clamp(Math.round(red + type.tint[0] * contribution), 0, 255);
        green = clamp(Math.round(green + type.tint[1] * contribution), 0, 255);
        blue = clamp(Math.round(blue + type.tint[2] * contribution), 0, 255);
        alpha = clamp(Math.max(alpha, Math.round(255 * Math.min(contribution * 0.72, 0.9))), 0, 255);
      }

      changed = changed || sourcePixels[index] !== red || sourcePixels[index + 1] !== green || sourcePixels[index + 2] !== blue || sourcePixels[index + 3] !== alpha;
      outputPixels[index] = red;
      outputPixels[index + 1] = green;
      outputPixels[index + 2] = blue;
      outputPixels[index + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function fibersCanvas(source, options, useAlpha = false) {
  const foreground = hexToRgb(options.foreground || state.brush.color);
  const background = hexToRgb(options.background || state.backgroundColor);
  const seed = options.seed || 0;
  const variance = clamp(options.variance || 16, 1, 64);
  const strength = clamp(options.strength || 4, 1, 64);
  const density = 0.45 + variance / 10;
  const stretch = 18 + strength * 4.8;
  const contrast = 0.9 + strength / 10;
  const foregroundAlpha = foreground.r * 0.2126 + foreground.g * 0.7152 + foreground.b * 0.0722;
  const backgroundAlpha = background.r * 0.2126 + background.g * 0.7152 + background.b * 0.0722;
  const sourcePixels = source.getContext("2d").getImageData(0, 0, source.width, source.height).data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const index = (y * source.width + x) * 4;
      const strandX = x * density + smoothCloudNoise(x, y, 18, seed + 8.2) * variance * 0.12;
      const strandY = y / stretch;
      let value = smoothCloudNoise(strandX, strandY, 9, seed);
      value += smoothCloudNoise(strandX * 1.85, strandY * 1.4, 5, seed + 19.7) * 0.45;
      value += smoothCloudNoise(strandX * 4.2, strandY * 2.2, 2.5, seed + 47.3) * 0.18;
      value = clamp(((value / 1.63) - 0.5) * contrast + 0.5, 0, 1);

      const red = useAlpha ? 255 : clamp(Math.round(background.r + (foreground.r - background.r) * value), 0, 255);
      const green = useAlpha ? 255 : clamp(Math.round(background.g + (foreground.g - background.g) * value), 0, 255);
      const blue = useAlpha ? 255 : clamp(Math.round(background.b + (foreground.b - background.b) * value), 0, 255);
      const alpha = useAlpha ? clamp(Math.round(backgroundAlpha + (foregroundAlpha - backgroundAlpha) * value), 0, 255) : 255;
      changed = changed || sourcePixels[index] !== red || sourcePixels[index + 1] !== green || sourcePixels[index + 2] !== blue || sourcePixels[index + 3] !== alpha;
      outputPixels[index] = red;
      outputPixels[index + 1] = green;
      outputPixels[index + 2] = blue;
      outputPixels[index + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function lightingEffectsCanvas(source, options, useAlpha = false) {
  const intensity = clamp(options.intensity ?? 75, -100, 200) / 100;
  const ambient = clamp(options.ambient ?? 25, 0, 100) / 100;
  const centerX = clamp((options.x ?? 50) / 100, 0, 1) * Math.max(0, source.width - 1);
  const centerY = clamp((options.y ?? 50) / 100, 0, 1) * Math.max(0, source.height - 1);
  const radius = Math.max(1, Math.max(source.width, source.height) * clamp(options.radius ?? 55, 1, 200) / 100);
  const lightColor = hexToRgb(options.color || state.brush.color);
  const input = source.getContext("2d").getImageData(0, 0, source.width, source.height);
  const sourcePixels = input.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const index = (y * source.width + x) * 4;
      const falloff = Math.max(0, 1 - Math.hypot(x - centerX, y - centerY) / radius);
      const spotlight = falloff * falloff * (3 - 2 * falloff);
      const multiplier = clamp(ambient + spotlight * intensity, 0, 3);
      const tint = Math.max(0, intensity) * spotlight * 0.18;
      let red = sourcePixels[index];
      let green = sourcePixels[index + 1];
      let blue = sourcePixels[index + 2];
      let alpha = sourcePixels[index + 3];

      if (useAlpha) {
        red = 255;
        green = 255;
        blue = 255;
        alpha = clamp(Math.round(alpha * multiplier), 0, 255);
      } else {
        red = clamp(Math.round(red * multiplier + lightColor.r * tint), 0, 255);
        green = clamp(Math.round(green * multiplier + lightColor.g * tint), 0, 255);
        blue = clamp(Math.round(blue * multiplier + lightColor.b * tint), 0, 255);
      }

      changed = changed || sourcePixels[index] !== red || sourcePixels[index + 1] !== green || sourcePixels[index + 2] !== blue || sourcePixels[index + 3] !== alpha;
      outputPixels[index] = red;
      outputPixels[index + 1] = green;
      outputPixels[index + 2] = blue;
      outputPixels[index + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function solarizeCanvas(source, useAlpha = false) {
  const next = cloneCanvas(source);
  const nextCtx = next.getContext("2d");
  const imageData = nextCtx.getImageData(0, 0, next.width, next.height);
  const pixels = imageData.data;
  const solarizeValue = (value) => (value > 127 ? 255 - value : value);
  let changed = false;

  for (let index = 0; index < pixels.length; index += 4) {
    if (useAlpha) {
      const nextAlpha = solarizeValue(pixels[index + 3]);
      changed = changed || nextAlpha !== pixels[index + 3] || pixels[index] !== 255 || pixels[index + 1] !== 255 || pixels[index + 2] !== 255;
      pixels[index] = 255;
      pixels[index + 1] = 255;
      pixels[index + 2] = 255;
      pixels[index + 3] = nextAlpha;
      continue;
    }
    if (pixels[index + 3] === 0) continue;
    for (let channel = 0; channel < 3; channel += 1) {
      const nextValue = solarizeValue(pixels[index + channel]);
      changed = changed || nextValue !== pixels[index + channel];
      pixels[index + channel] = nextValue;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(imageData, 0, 0);
  return next;
}

function noiseCanvas(source, options = {}, useAlpha = false) {
  const settings = typeof options === "number" ? { amount: options } : options;
  const amount = clamp(settings.amount ?? 24, 0, 400) * 2.55;
  const distribution = settings.distribution || "uniform";
  const monochromatic = settings.monochromatic !== false;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const imageData = source.getContext("2d").getImageData(0, 0, source.width, source.height);
  const sourcePixels = imageData.data;
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const randomNoise = () => {
    if (distribution === "gaussian") {
      const u1 = Math.max(Math.random(), 0.000001);
      const u2 = Math.random();
      return clamp((Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)) / 3, -1, 1) * amount;
    }
    return (Math.random() * 2 - 1) * amount;
  };
  let changed = false;

  for (let index = 0; index < sourcePixels.length; index += 4) {
    let red = sourcePixels[index];
    let green = sourcePixels[index + 1];
    let blue = sourcePixels[index + 2];
    let alpha = sourcePixels[index + 3];

    if (useAlpha) {
      red = 255;
      green = 255;
      blue = 255;
      alpha = clamp(Math.round(alpha + randomNoise()), 0, 255);
    } else if (alpha > 0) {
      const sharedNoise = randomNoise();
      red = clamp(Math.round(red + sharedNoise), 0, 255);
      green = clamp(Math.round(green + (monochromatic ? sharedNoise : randomNoise())), 0, 255);
      blue = clamp(Math.round(blue + (monochromatic ? sharedNoise : randomNoise())), 0, 255);
    }

    changed = changed || sourcePixels[index] !== red || sourcePixels[index + 1] !== green || sourcePixels[index + 2] !== blue || sourcePixels[index + 3] !== alpha;
    outputPixels[index] = red;
    outputPixels[index + 1] = green;
    outputPixels[index + 2] = blue;
    outputPixels[index + 3] = alpha;
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function mosaicCanvas(source, cellSize, useAlpha = false) {
  const size = Math.max(1, Math.round(cellSize));
  const sourceCtx = source.getContext("2d");
  const input = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = input.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  let changed = false;

  for (let y = 0; y < source.height; y += size) {
    for (let x = 0; x < source.width; x += size) {
      const blockWidth = Math.min(size, source.width - x);
      const blockHeight = Math.min(size, source.height - y);
      let count = 0;
      let alphaSum = 0;
      let redSum = 0;
      let greenSum = 0;
      let blueSum = 0;

      for (let blockY = 0; blockY < blockHeight; blockY += 1) {
        for (let blockX = 0; blockX < blockWidth; blockX += 1) {
          const index = ((y + blockY) * source.width + x + blockX) * 4;
          const alpha = sourcePixels[index + 3];
          count += 1;
          alphaSum += alpha;
          redSum += sourcePixels[index] * alpha;
          greenSum += sourcePixels[index + 1] * alpha;
          blueSum += sourcePixels[index + 2] * alpha;
        }
      }

      const alpha = clamp(Math.round(alphaSum / count), 0, 255);
      const red = useAlpha || alphaSum === 0 ? (useAlpha ? 255 : 0) : clamp(Math.round(redSum / alphaSum), 0, 255);
      const green = useAlpha || alphaSum === 0 ? (useAlpha ? 255 : 0) : clamp(Math.round(greenSum / alphaSum), 0, 255);
      const blue = useAlpha || alphaSum === 0 ? (useAlpha ? 255 : 0) : clamp(Math.round(blueSum / alphaSum), 0, 255);

      for (let blockY = 0; blockY < blockHeight; blockY += 1) {
        for (let blockX = 0; blockX < blockWidth; blockX += 1) {
          const index = ((y + blockY) * source.width + x + blockX) * 4;
          changed = changed || sourcePixels[index] !== red || sourcePixels[index + 1] !== green || sourcePixels[index + 2] !== blue || sourcePixels[index + 3] !== alpha;
          outputPixels[index] = red;
          outputPixels[index + 1] = green;
          outputPixels[index + 2] = blue;
          outputPixels[index + 3] = alpha;
        }
      }
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function colorHalftoneCanvas(source, maxRadius, useAlpha = false) {
  const radius = Math.max(2, Math.round(maxRadius));
  const cellSize = radius * 2;
  const sourceCtx = source.getContext("2d");
  const input = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = input.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  let changed = false;

  for (let y = 0; y < source.height; y += cellSize) {
    for (let x = 0; x < source.width; x += cellSize) {
      const blockWidth = Math.min(cellSize, source.width - x);
      const blockHeight = Math.min(cellSize, source.height - y);
      const centerX = x + (blockWidth - 1) / 2;
      const centerY = y + (blockHeight - 1) / 2;
      let count = 0;
      let alphaSum = 0;
      let redSum = 0;
      let greenSum = 0;
      let blueSum = 0;

      for (let blockY = 0; blockY < blockHeight; blockY += 1) {
        for (let blockX = 0; blockX < blockWidth; blockX += 1) {
          const index = ((y + blockY) * source.width + x + blockX) * 4;
          const alpha = sourcePixels[index + 3];
          count += 1;
          alphaSum += alpha;
          redSum += sourcePixels[index] * alpha;
          greenSum += sourcePixels[index + 1] * alpha;
          blueSum += sourcePixels[index + 2] * alpha;
        }
      }

      const averageAlpha = count > 0 ? alphaSum / count : 0;
      const red = alphaSum > 0 ? clamp(Math.round(redSum / alphaSum), 0, 255) : 0;
      const green = alphaSum > 0 ? clamp(Math.round(greenSum / alphaSum), 0, 255) : 0;
      const blue = alphaSum > 0 ? clamp(Math.round(blueSum / alphaSum), 0, 255) : 0;
      const luminance = red * 0.299 + green * 0.587 + blue * 0.114;
      const dotRadius = useAlpha ? (averageAlpha / 255) * radius : alphaSum > 0 ? (1 - luminance / 255) * radius : 0;

      for (let blockY = 0; blockY < blockHeight; blockY += 1) {
        for (let blockX = 0; blockX < blockWidth; blockX += 1) {
          const pixelX = x + blockX;
          const pixelY = y + blockY;
          const index = (pixelY * source.width + pixelX) * 4;
          const sourceAlpha = sourcePixels[index + 3];
          const insideDot = sourceAlpha > 0 && Math.hypot(pixelX - centerX, pixelY - centerY) <= dotRadius;
          const nextRed = useAlpha ? 255 : sourceAlpha === 0 ? sourcePixels[index] : insideDot ? red : 255;
          const nextGreen = useAlpha ? 255 : sourceAlpha === 0 ? sourcePixels[index + 1] : insideDot ? green : 255;
          const nextBlue = useAlpha ? 255 : sourceAlpha === 0 ? sourcePixels[index + 2] : insideDot ? blue : 255;
          const nextAlpha = useAlpha ? (insideDot ? 255 : 0) : sourceAlpha;
          changed = changed || sourcePixels[index] !== nextRed || sourcePixels[index + 1] !== nextGreen || sourcePixels[index + 2] !== nextBlue || sourcePixels[index + 3] !== nextAlpha;
          outputPixels[index] = nextRed;
          outputPixels[index + 1] = nextGreen;
          outputPixels[index + 2] = nextBlue;
          outputPixels[index + 3] = nextAlpha;
        }
      }
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function crystallizeCanvas(source, cellSize, useAlpha = false) {
  const size = Math.max(2, Math.round(cellSize));
  const sourceCtx = source.getContext("2d");
  const input = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = input.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const gridWidth = Math.ceil(source.width / size);
  const gridHeight = Math.ceil(source.height / size);
  const jitter = (gridX, gridY, salt) => {
    const value = Math.sin(gridX * 127.1 + gridY * 311.7 + salt * 73.3) * 43758.5453;
    return value - Math.floor(value);
  };
  const seedFor = (gridX, gridY) => {
    const startX = gridX * size;
    const startY = gridY * size;
    const width = Math.min(size, source.width - startX);
    const height = Math.min(size, source.height - startY);
    return {
      x: clamp(Math.round(startX + (0.22 + jitter(gridX, gridY, 1) * 0.56) * width), 0, source.width - 1),
      y: clamp(Math.round(startY + (0.22 + jitter(gridX, gridY, 2) * 0.56) * height), 0, source.height - 1),
    };
  };
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const gridX = Math.floor(x / size);
      const gridY = Math.floor(y / size);
      let nearest = seedFor(gridX, gridY);
      let nearestDistance = Infinity;

      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          const sampleGridX = gridX + offsetX;
          const sampleGridY = gridY + offsetY;
          if (sampleGridX < 0 || sampleGridY < 0 || sampleGridX >= gridWidth || sampleGridY >= gridHeight) continue;
          const seed = seedFor(sampleGridX, sampleGridY);
          const distance = (seed.x - x) ** 2 + (seed.y - y) ** 2;
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearest = seed;
          }
        }
      }

      const pixelIndex = (y * source.width + x) * 4;
      const seedIndex = (nearest.y * source.width + nearest.x) * 4;
      const red = useAlpha ? 255 : sourcePixels[seedIndex];
      const green = useAlpha ? 255 : sourcePixels[seedIndex + 1];
      const blue = useAlpha ? 255 : sourcePixels[seedIndex + 2];
      const alpha = sourcePixels[seedIndex + 3];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function pointillizeCanvas(source, cellSize, useAlpha = false) {
  const size = Math.max(2, Math.round(cellSize));
  const sourceCtx = source.getContext("2d");
  const input = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = input.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const jitter = (gridX, gridY, salt) => {
    const value = Math.sin(gridX * 193.7 + gridY * 421.9 + salt * 61.3) * 91731.123;
    return value - Math.floor(value);
  };
  let changed = false;

  for (let y = 0; y < source.height; y += size) {
    for (let x = 0; x < source.width; x += size) {
      const blockWidth = Math.min(size, source.width - x);
      const blockHeight = Math.min(size, source.height - y);
      const gridX = Math.floor(x / size);
      const gridY = Math.floor(y / size);
      const centerX = x + (0.25 + jitter(gridX, gridY, 1) * 0.5) * blockWidth;
      const centerY = y + (0.25 + jitter(gridX, gridY, 2) * 0.5) * blockHeight;
      const radius = Math.max(1, Math.min(blockWidth, blockHeight) * 0.42);
      let count = 0;
      let alphaSum = 0;
      let redSum = 0;
      let greenSum = 0;
      let blueSum = 0;

      for (let blockY = 0; blockY < blockHeight; blockY += 1) {
        for (let blockX = 0; blockX < blockWidth; blockX += 1) {
          const index = ((y + blockY) * source.width + x + blockX) * 4;
          const alpha = sourcePixels[index + 3];
          count += 1;
          alphaSum += alpha;
          redSum += sourcePixels[index] * alpha;
          greenSum += sourcePixels[index + 1] * alpha;
          blueSum += sourcePixels[index + 2] * alpha;
        }
      }

      const alpha = clamp(Math.round(alphaSum / count), 0, 255);
      const red = alphaSum > 0 ? clamp(Math.round(redSum / alphaSum), 0, 255) : 255;
      const green = alphaSum > 0 ? clamp(Math.round(greenSum / alphaSum), 0, 255) : 255;
      const blue = alphaSum > 0 ? clamp(Math.round(blueSum / alphaSum), 0, 255) : 255;

      for (let blockY = 0; blockY < blockHeight; blockY += 1) {
        for (let blockX = 0; blockX < blockWidth; blockX += 1) {
          const pixelX = x + blockX;
          const pixelY = y + blockY;
          const index = (pixelY * source.width + pixelX) * 4;
          const sourceAlpha = sourcePixels[index + 3];
          const insideDot = sourceAlpha > 0 && Math.hypot(pixelX - centerX, pixelY - centerY) <= radius;
          const nextRed = useAlpha ? 255 : sourceAlpha === 0 ? sourcePixels[index] : insideDot ? red : 255;
          const nextGreen = useAlpha ? 255 : sourceAlpha === 0 ? sourcePixels[index + 1] : insideDot ? green : 255;
          const nextBlue = useAlpha ? 255 : sourceAlpha === 0 ? sourcePixels[index + 2] : insideDot ? blue : 255;
          const nextAlpha = useAlpha ? (insideDot ? alpha : 0) : sourceAlpha;
          changed = changed || sourcePixels[index] !== nextRed || sourcePixels[index + 1] !== nextGreen || sourcePixels[index + 2] !== nextBlue || sourcePixels[index + 3] !== nextAlpha;
          outputPixels[index] = nextRed;
          outputPixels[index + 1] = nextGreen;
          outputPixels[index + 2] = nextBlue;
          outputPixels[index + 3] = nextAlpha;
        }
      }
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function fragmentCanvas(source, useAlpha = false) {
  const sourceCtx = source.getContext("2d");
  const input = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = input.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const offsets = [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
  ];
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      let alphaSum = 0;
      let redSum = 0;
      let greenSum = 0;
      let blueSum = 0;

      offsets.forEach((offset) => {
        const sampleX = clamp(x + offset.x, 0, source.width - 1);
        const sampleY = clamp(y + offset.y, 0, source.height - 1);
        const sampleIndex = (sampleY * source.width + sampleX) * 4;
        const alpha = sourcePixels[sampleIndex + 3];
        alphaSum += alpha;
        redSum += sourcePixels[sampleIndex] * alpha;
        greenSum += sourcePixels[sampleIndex + 1] * alpha;
        blueSum += sourcePixels[sampleIndex + 2] * alpha;
      });

      const alpha = clamp(Math.round(alphaSum / offsets.length), 0, 255);
      const red = useAlpha ? 255 : alphaSum > 0 ? clamp(Math.round(redSum / alphaSum), 0, 255) : sourcePixels[pixelIndex];
      const green = useAlpha ? 255 : alphaSum > 0 ? clamp(Math.round(greenSum / alphaSum), 0, 255) : sourcePixels[pixelIndex + 1];
      const blue = useAlpha ? 255 : alphaSum > 0 ? clamp(Math.round(blueSum / alphaSum), 0, 255) : sourcePixels[pixelIndex + 2];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function facetCanvas(source, useAlpha = false) {
  const sourceCtx = source.getContext("2d");
  const input = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = input.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      const samples = [];
      let count = 0;
      let alphaSum = 0;
      let redSum = 0;
      let greenSum = 0;
      let blueSum = 0;

      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          const sampleX = clamp(x + offsetX, 0, source.width - 1);
          const sampleY = clamp(y + offsetY, 0, source.height - 1);
          const sampleIndex = (sampleY * source.width + sampleX) * 4;
          const alpha = sourcePixels[sampleIndex + 3];
          samples.push(sampleIndex);
          count += 1;
          alphaSum += alpha;
          redSum += sourcePixels[sampleIndex] * alpha;
          greenSum += sourcePixels[sampleIndex + 1] * alpha;
          blueSum += sourcePixels[sampleIndex + 2] * alpha;
        }
      }

      const averageAlpha = alphaSum / count;
      const averageRed = alphaSum > 0 ? redSum / alphaSum : sourcePixels[pixelIndex];
      const averageGreen = alphaSum > 0 ? greenSum / alphaSum : sourcePixels[pixelIndex + 1];
      const averageBlue = alphaSum > 0 ? blueSum / alphaSum : sourcePixels[pixelIndex + 2];
      let bestIndex = pixelIndex;
      let bestScore = Infinity;

      samples.forEach((sampleIndex) => {
        const alpha = sourcePixels[sampleIndex + 3];
        const redDistance = useAlpha ? 0 : sourcePixels[sampleIndex] - averageRed;
        const greenDistance = useAlpha ? 0 : sourcePixels[sampleIndex + 1] - averageGreen;
        const blueDistance = useAlpha ? 0 : sourcePixels[sampleIndex + 2] - averageBlue;
        const alphaDistance = alpha - averageAlpha;
        const score = redDistance * redDistance + greenDistance * greenDistance + blueDistance * blueDistance + alphaDistance * alphaDistance * 0.25;
        if (score < bestScore) {
          bestScore = score;
          bestIndex = sampleIndex;
        }
      });

      const red = useAlpha ? 255 : sourcePixels[bestIndex];
      const green = useAlpha ? 255 : sourcePixels[bestIndex + 1];
      const blue = useAlpha ? 255 : sourcePixels[bestIndex + 2];
      const alpha = sourcePixels[bestIndex + 3];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function mezzotintNoise(x, y, salt) {
  const value = Math.sin(x * 127.1 + y * 311.7 + salt * 74.7) * 43758.5453;
  return value - Math.floor(value);
}

function mezzotintPatternNoise(x, y, salt, type) {
  if (type.mode === "grainy") {
    return mezzotintNoise(x, y, salt) * 0.68 + mezzotintNoise(Math.floor(x / 2), Math.floor(y / 2), salt + 11) * 0.32;
  }
  if (type.mode === "dots") {
    return mezzotintNoise(Math.floor(x / type.cell), Math.floor(y / type.cell), salt);
  }
  if (type.mode === "lines") {
    const row = Math.floor(y / type.width);
    const offset = Math.floor(mezzotintNoise(0, row, salt + 17) * type.length);
    return mezzotintNoise(Math.floor((x + offset) / type.length), row, salt);
  }

  const blockX = Math.floor(x / type.length);
  const blockY = Math.floor(y / type.length);
  const horizontal = mezzotintNoise(blockX, blockY, salt + 23) >= 0.5;
  if (horizontal) {
    const row = Math.floor(y / type.width);
    const offset = Math.floor(mezzotintNoise(blockX, blockY, salt + 29) * type.length);
    return mezzotintNoise(Math.floor((x + offset) / type.length), row, salt);
  }
  const column = Math.floor(x / type.width);
  const offset = Math.floor(mezzotintNoise(blockX, blockY, salt + 31) * type.length);
  return mezzotintNoise(column, Math.floor((y + offset) / type.length), salt);
}

function mezzotintValue(value, x, y, salt, type) {
  if (value <= 0) return 0;
  if (value >= 255) return 255;
  return mezzotintPatternNoise(x, y, salt, type) <= value / 255 ? 255 : 0;
}

function mezzotintCanvas(source, type, useAlpha = false) {
  const sourceCtx = source.getContext("2d");
  const input = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = input.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const index = (y * source.width + x) * 4;
      const red = useAlpha ? 255 : mezzotintValue(sourcePixels[index], x, y, 1, type);
      const green = useAlpha ? 255 : mezzotintValue(sourcePixels[index + 1], x, y, 2, type);
      const blue = useAlpha ? 255 : mezzotintValue(sourcePixels[index + 2], x, y, 3, type);
      const alpha = useAlpha ? mezzotintValue(sourcePixels[index + 3], x, y, 4, type) : sourcePixels[index + 3];
      changed = changed || sourcePixels[index] !== red || sourcePixels[index + 1] !== green || sourcePixels[index + 2] !== blue || sourcePixels[index + 3] !== alpha;
      outputPixels[index] = red;
      outputPixels[index + 1] = green;
      outputPixels[index + 2] = blue;
      outputPixels[index + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function offsetWrapCanvas(source, options, useAlpha = false) {
  const offsetX = Math.round(options.x);
  const offsetY = Math.round(options.y);
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const wrap = (value, size) => ((value % size) + size) % size;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      const sourceX = wrap(x - offsetX, source.width);
      const sourceY = wrap(y - offsetY, source.height);
      const sourceIndex = (sourceY * source.width + sourceX) * 4;
      const red = useAlpha ? 255 : sourcePixels[sourceIndex];
      const green = useAlpha ? 255 : sourcePixels[sourceIndex + 1];
      const blue = useAlpha ? 255 : sourcePixels[sourceIndex + 2];
      const alpha = sourcePixels[sourceIndex + 3];
      changed = changed || sourcePixels[pixelIndex] !== red || sourcePixels[pixelIndex + 1] !== green || sourcePixels[pixelIndex + 2] !== blue || sourcePixels[pixelIndex + 3] !== alpha;
      outputPixels[pixelIndex] = red;
      outputPixels[pixelIndex + 1] = green;
      outputPixels[pixelIndex + 2] = blue;
      outputPixels[pixelIndex + 3] = alpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function extremaCanvas(source, radius, mode, useAlpha = false) {
  const size = Math.max(1, Math.round(radius));
  const sourceCtx = source.getContext("2d");
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const sourcePixels = sourceData.data;
  const next = makeCanvas(source.width, source.height);
  const nextCtx = next.getContext("2d");
  const output = nextCtx.createImageData(source.width, source.height);
  const outputPixels = output.data;
  const pick = mode === "maximum" ? Math.max : Math.min;
  const startValue = mode === "maximum" ? 0 : 255;
  let changed = false;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = (y * source.width + x) * 4;
      if (!useAlpha && sourcePixels[pixelIndex + 3] === 0) {
        outputPixels[pixelIndex] = sourcePixels[pixelIndex];
        outputPixels[pixelIndex + 1] = sourcePixels[pixelIndex + 1];
        outputPixels[pixelIndex + 2] = sourcePixels[pixelIndex + 2];
        outputPixels[pixelIndex + 3] = sourcePixels[pixelIndex + 3];
        continue;
      }

      let alpha = startValue;
      let red = startValue;
      let green = startValue;
      let blue = startValue;
      let foundSample = false;

      for (let ky = -size; ky <= size; ky += 1) {
        for (let kx = -size; kx <= size; kx += 1) {
          const sampleX = clamp(x + kx, 0, source.width - 1);
          const sampleY = clamp(y + ky, 0, source.height - 1);
          const sampleIndex = (sampleY * source.width + sampleX) * 4;
          if (!useAlpha && sourcePixels[sampleIndex + 3] === 0) continue;
          foundSample = true;
          alpha = pick(alpha, sourcePixels[sampleIndex + 3]);
          red = pick(red, sourcePixels[sampleIndex]);
          green = pick(green, sourcePixels[sampleIndex + 1]);
          blue = pick(blue, sourcePixels[sampleIndex + 2]);
        }
      }

      if (!foundSample) {
        alpha = sourcePixels[pixelIndex + 3];
        red = sourcePixels[pixelIndex];
        green = sourcePixels[pixelIndex + 1];
        blue = sourcePixels[pixelIndex + 2];
      }
      const nextAlpha = useAlpha ? alpha : sourcePixels[pixelIndex + 3];
      const nextRed = useAlpha ? 255 : red;
      const nextGreen = useAlpha ? 255 : green;
      const nextBlue = useAlpha ? 255 : blue;
      changed = changed || sourcePixels[pixelIndex] !== nextRed || sourcePixels[pixelIndex + 1] !== nextGreen || sourcePixels[pixelIndex + 2] !== nextBlue || sourcePixels[pixelIndex + 3] !== nextAlpha;
      outputPixels[pixelIndex] = nextRed;
      outputPixels[pixelIndex + 1] = nextGreen;
      outputPixels[pixelIndex + 2] = nextBlue;
      outputPixels[pixelIndex + 3] = nextAlpha;
    }
  }

  if (!changed) return null;
  nextCtx.putImageData(output, 0, 0);
  return next;
}

function autoContrastCanvas(source) {
  const next = cloneCanvas(source);
  const nextCtx = next.getContext("2d");
  const imageData = nextCtx.getImageData(0, 0, next.width, next.height);
  const pixels = imageData.data;
  let min = 255;
  let max = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] === 0) continue;
    min = Math.min(min, pixels[index], pixels[index + 1], pixels[index + 2]);
    max = Math.max(max, pixels[index], pixels[index + 1], pixels[index + 2]);
  }
  if (max <= min) return null;
  const scale = 255 / (max - min);
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] === 0) continue;
    pixels[index] = clamp(Math.round((pixels[index] - min) * scale), 0, 255);
    pixels[index + 1] = clamp(Math.round((pixels[index + 1] - min) * scale), 0, 255);
    pixels[index + 2] = clamp(Math.round((pixels[index + 2] - min) * scale), 0, 255);
  }
  nextCtx.putImageData(imageData, 0, 0);
  return next;
}

function autoToneCanvas(source) {
  const next = cloneCanvas(source);
  const nextCtx = next.getContext("2d");
  const imageData = nextCtx.getImageData(0, 0, next.width, next.height);
  const pixels = imageData.data;
  const min = [255, 255, 255];
  const max = [0, 0, 0];
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] === 0) continue;
    for (let channel = 0; channel < 3; channel += 1) {
      min[channel] = Math.min(min[channel], pixels[index + channel]);
      max[channel] = Math.max(max[channel], pixels[index + channel]);
    }
  }
  const scale = min.map((value, channel) => (max[channel] > value ? 255 / (max[channel] - value) : 0));
  if (scale.every((value) => value === 0)) return null;
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] === 0) continue;
    for (let channel = 0; channel < 3; channel += 1) {
      if (scale[channel] === 0) continue;
      pixels[index + channel] = clamp(Math.round((pixels[index + channel] - min[channel]) * scale[channel]), 0, 255);
    }
  }
  nextCtx.putImageData(imageData, 0, 0);
  return next;
}

function autoColorCanvas(source) {
  const next = cloneCanvas(source);
  const nextCtx = next.getContext("2d");
  const imageData = nextCtx.getImageData(0, 0, next.width, next.height);
  const pixels = imageData.data;
  const sum = [0, 0, 0];
  let count = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] === 0) continue;
    sum[0] += pixels[index];
    sum[1] += pixels[index + 1];
    sum[2] += pixels[index + 2];
    count += 1;
  }
  if (count === 0) return null;
  const average = sum.map((value) => value / count);
  const target = (average[0] + average[1] + average[2]) / 3;
  const gain = average.map((value) => (value > 0 ? target / value : 1));
  if (gain.every((value) => Math.abs(value - 1) < 0.005)) return null;
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] === 0) continue;
    pixels[index] = clamp(Math.round(pixels[index] * gain[0]), 0, 255);
    pixels[index + 1] = clamp(Math.round(pixels[index + 1] * gain[1]), 0, 255);
    pixels[index + 2] = clamp(Math.round(pixels[index + 2] * gain[2]), 0, 255);
  }
  nextCtx.putImageData(imageData, 0, 0);
  return next;
}

function invertCanvas(source, invertAlpha = false) {
  const next = cloneCanvas(source);
  const nextCtx = next.getContext("2d");
  const imageData = nextCtx.getImageData(0, 0, next.width, next.height);
  const pixels = imageData.data;
  let changed = false;
  for (let index = 0; index < pixels.length; index += 4) {
    if (invertAlpha) {
      const nextAlpha = 255 - pixels[index + 3];
      changed = changed || nextAlpha !== pixels[index + 3];
      pixels[index] = 255;
      pixels[index + 1] = 255;
      pixels[index + 2] = 255;
      pixels[index + 3] = nextAlpha;
      continue;
    }
    if (pixels[index + 3] === 0) continue;
    pixels[index] = 255 - pixels[index];
    pixels[index + 1] = 255 - pixels[index + 1];
    pixels[index + 2] = 255 - pixels[index + 2];
    changed = true;
  }
  if (!changed) return null;
  nextCtx.putImageData(imageData, 0, 0);
  return next;
}

function desaturateCanvas(source) {
  const next = cloneCanvas(source);
  const nextCtx = next.getContext("2d");
  const imageData = nextCtx.getImageData(0, 0, next.width, next.height);
  const pixels = imageData.data;
  let changed = false;
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] === 0) continue;
    const gray = clamp(Math.round(pixels[index] * 0.299 + pixels[index + 1] * 0.587 + pixels[index + 2] * 0.114), 0, 255);
    changed = changed || pixels[index] !== gray || pixels[index + 1] !== gray || pixels[index + 2] !== gray;
    pixels[index] = gray;
    pixels[index + 1] = gray;
    pixels[index + 2] = gray;
  }
  if (!changed) return null;
  nextCtx.putImageData(imageData, 0, 0);
  return next;
}

function blackWhiteCanvas(source, weights, useAlpha = false) {
  const { red, green, blue } = weights;
  const alphaScale = (red + green + blue) / 100;
  const next = cloneCanvas(source);
  const nextCtx = next.getContext("2d");
  const imageData = nextCtx.getImageData(0, 0, next.width, next.height);
  const pixels = imageData.data;
  let changed = false;
  for (let index = 0; index < pixels.length; index += 4) {
    if (useAlpha) {
      const nextAlpha = clamp(Math.round(pixels[index + 3] * alphaScale), 0, 255);
      changed = changed || nextAlpha !== pixels[index + 3] || pixels[index] !== 255 || pixels[index + 1] !== 255 || pixels[index + 2] !== 255;
      pixels[index] = 255;
      pixels[index + 1] = 255;
      pixels[index + 2] = 255;
      pixels[index + 3] = nextAlpha;
      continue;
    }
    if (pixels[index + 3] === 0) continue;
    const gray = clamp(Math.round((pixels[index] * red + pixels[index + 1] * green + pixels[index + 2] * blue) / 100), 0, 255);
    changed = changed || pixels[index] !== gray || pixels[index + 1] !== gray || pixels[index + 2] !== gray;
    pixels[index] = gray;
    pixels[index + 1] = gray;
    pixels[index + 2] = gray;
  }
  if (!changed) return null;
  nextCtx.putImageData(imageData, 0, 0);
  return next;
}

function rgbToHsl(r, g, b) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  if (max === min) {
    return { h: 0, s: 0, l: lightness };
  }

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;
  if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
  else if (max === green) hue = (blue - red) / delta + 2;
  else hue = (red - green) / delta + 4;
  return { h: hue * 60, s: saturation, l: lightness };
}

function hslToRgb(h, s, l) {
  const hue = (((h % 360) + 360) % 360) / 360;
  if (s === 0) {
    const gray = clamp(Math.round(l * 255), 0, 255);
    return [gray, gray, gray];
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hueToRgb = (t) => {
    let value = t;
    if (value < 0) value += 1;
    if (value > 1) value -= 1;
    if (value < 1 / 6) return p + (q - p) * 6 * value;
    if (value < 1 / 2) return q;
    if (value < 2 / 3) return p + (q - p) * (2 / 3 - value) * 6;
    return p;
  };
  return [
    clamp(Math.round(hueToRgb(hue + 1 / 3) * 255), 0, 255),
    clamp(Math.round(hueToRgb(hue) * 255), 0, 255),
    clamp(Math.round(hueToRgb(hue - 1 / 3) * 255), 0, 255),
  ];
}

function shiftLightness(value, amount) {
  return amount >= 0 ? value + (1 - value) * amount : value * (1 + amount);
}

function hueSaturationCanvas(source, adjustment, useAlpha = false) {
  const { hue, saturation, lightness } = adjustment;
  const saturationScale = (100 + saturation) / 100;
  const lightnessShift = lightness / 100;
  const next = cloneCanvas(source);
  const nextCtx = next.getContext("2d");
  const imageData = nextCtx.getImageData(0, 0, next.width, next.height);
  const pixels = imageData.data;
  let changed = false;
  for (let index = 0; index < pixels.length; index += 4) {
    if (useAlpha) {
      const nextAlpha = clamp(Math.round(shiftLightness(pixels[index + 3] / 255, lightnessShift) * 255), 0, 255);
      changed = changed || nextAlpha !== pixels[index + 3] || pixels[index] !== 255 || pixels[index + 1] !== 255 || pixels[index + 2] !== 255;
      pixels[index] = 255;
      pixels[index + 1] = 255;
      pixels[index + 2] = 255;
      pixels[index + 3] = nextAlpha;
      continue;
    }
    if (pixels[index + 3] === 0) continue;
    const hsl = rgbToHsl(pixels[index], pixels[index + 1], pixels[index + 2]);
    const rgb = hslToRgb(hsl.h + hue, clamp(hsl.s * saturationScale, 0, 1), clamp(shiftLightness(hsl.l, lightnessShift), 0, 1));
    changed = changed || rgb[0] !== pixels[index] || rgb[1] !== pixels[index + 1] || rgb[2] !== pixels[index + 2];
    pixels[index] = rgb[0];
    pixels[index + 1] = rgb[1];
    pixels[index + 2] = rgb[2];
  }
  if (!changed) return null;
  nextCtx.putImageData(imageData, 0, 0);
  return next;
}

function saturationShiftValue(saturation, amount) {
  const shift = amount / 100;
  return shift >= 0 ? saturation + (1 - saturation) * shift : saturation * (1 + shift);
}

function vibranceCanvas(source, adjustment, useAlpha = false) {
  const { vibrance, saturation } = adjustment;
  const vibranceShift = vibrance / 100;
  const alphaShift = (vibrance + saturation) / 100;
  const next = cloneCanvas(source);
  const nextCtx = next.getContext("2d");
  const imageData = nextCtx.getImageData(0, 0, next.width, next.height);
  const pixels = imageData.data;
  let changed = false;
  for (let index = 0; index < pixels.length; index += 4) {
    if (useAlpha) {
      const nextAlpha = clamp(Math.round(clamp(shiftLightness(pixels[index + 3] / 255, alphaShift), 0, 1) * 255), 0, 255);
      changed = changed || nextAlpha !== pixels[index + 3] || pixels[index] !== 255 || pixels[index + 1] !== 255 || pixels[index + 2] !== 255;
      pixels[index] = 255;
      pixels[index + 1] = 255;
      pixels[index + 2] = 255;
      pixels[index + 3] = nextAlpha;
      continue;
    }
    if (pixels[index + 3] === 0) continue;
    const hsl = rgbToHsl(pixels[index], pixels[index + 1], pixels[index + 2]);
    let nextSaturation = hsl.s;
    if (nextSaturation > 0) {
      if (vibranceShift >= 0) {
        nextSaturation += (1 - nextSaturation) * vibranceShift * (1 - nextSaturation);
      } else {
        nextSaturation *= 1 + vibranceShift;
      }
      nextSaturation = saturationShiftValue(clamp(nextSaturation, 0, 1), saturation);
    }
    const rgb = hslToRgb(hsl.h, clamp(nextSaturation, 0, 1), hsl.l);
    changed = changed || rgb[0] !== pixels[index] || rgb[1] !== pixels[index + 1] || rgb[2] !== pixels[index + 2];
    pixels[index] = rgb[0];
    pixels[index + 1] = rgb[1];
    pixels[index + 2] = rgb[2];
  }
  if (!changed) return null;
  nextCtx.putImageData(imageData, 0, 0);
  return next;
}

function colorBalanceCanvas(source, balance, useAlpha = false) {
  const { cyanRed, magentaGreen, yellowBlue } = balance;
  const maskShift = Math.round((cyanRed + magentaGreen + yellowBlue) / 3);
  const next = cloneCanvas(source);
  const nextCtx = next.getContext("2d");
  const imageData = nextCtx.getImageData(0, 0, next.width, next.height);
  const pixels = imageData.data;
  let changed = false;
  for (let index = 0; index < pixels.length; index += 4) {
    if (useAlpha) {
      const nextAlpha = clamp(pixels[index + 3] + maskShift, 0, 255);
      changed = changed || nextAlpha !== pixels[index + 3] || pixels[index] !== 255 || pixels[index + 1] !== 255 || pixels[index + 2] !== 255;
      pixels[index] = 255;
      pixels[index + 1] = 255;
      pixels[index + 2] = 255;
      pixels[index + 3] = nextAlpha;
      continue;
    }
    if (pixels[index + 3] === 0) continue;
    const red = clamp(pixels[index] + cyanRed, 0, 255);
    const green = clamp(pixels[index + 1] + magentaGreen, 0, 255);
    const blue = clamp(pixels[index + 2] + yellowBlue, 0, 255);
    changed = changed || red !== pixels[index] || green !== pixels[index + 1] || blue !== pixels[index + 2];
    pixels[index] = red;
    pixels[index + 1] = green;
    pixels[index + 2] = blue;
  }
  if (!changed) return null;
  nextCtx.putImageData(imageData, 0, 0);
  return next;
}

function exposureCanvas(source, adjustment, useAlpha = false) {
  const { exposure, offset, gamma } = adjustment;
  const exposureScale = Math.pow(2, exposure);
  const mapValue = (value) => {
    const normalized = clamp((value / 255) * exposureScale + offset, 0, 1);
    return clamp(Math.round(Math.pow(normalized, 1 / gamma) * 255), 0, 255);
  };
  const next = cloneCanvas(source);
  const nextCtx = next.getContext("2d");
  const imageData = nextCtx.getImageData(0, 0, next.width, next.height);
  const pixels = imageData.data;
  let changed = false;
  for (let index = 0; index < pixels.length; index += 4) {
    if (useAlpha) {
      const nextAlpha = mapValue(pixels[index + 3]);
      changed = changed || nextAlpha !== pixels[index + 3] || pixels[index] !== 255 || pixels[index + 1] !== 255 || pixels[index + 2] !== 255;
      pixels[index] = 255;
      pixels[index + 1] = 255;
      pixels[index + 2] = 255;
      pixels[index + 3] = nextAlpha;
      continue;
    }
    if (pixels[index + 3] === 0) continue;
    for (let channel = 0; channel < 3; channel += 1) {
      const value = mapValue(pixels[index + channel]);
      changed = changed || value !== pixels[index + channel];
      pixels[index + channel] = value;
    }
  }
  if (!changed) return null;
  nextCtx.putImageData(imageData, 0, 0);
  return next;
}

function shadowsHighlightsCanvas(source, adjustment, useAlpha = false) {
  const shadowAmount = adjustment.shadows / 100;
  const highlightAmount = adjustment.highlights / 100;
  const mapLightness = (lightness) => clamp(
    lightness + shadowAmount * 0.6 * lightness * (1 - lightness) - highlightAmount * 0.6 * lightness * lightness,
    0,
    1
  );
  const next = cloneCanvas(source);
  const nextCtx = next.getContext("2d");
  const imageData = nextCtx.getImageData(0, 0, next.width, next.height);
  const pixels = imageData.data;
  let changed = false;
  for (let index = 0; index < pixels.length; index += 4) {
    if (useAlpha) {
      const nextAlpha = clamp(Math.round(mapLightness(pixels[index + 3] / 255) * 255), 0, 255);
      changed = changed || nextAlpha !== pixels[index + 3] || pixels[index] !== 255 || pixels[index + 1] !== 255 || pixels[index + 2] !== 255;
      pixels[index] = 255;
      pixels[index + 1] = 255;
      pixels[index + 2] = 255;
      pixels[index + 3] = nextAlpha;
      continue;
    }
    if (pixels[index + 3] === 0) continue;
    const hsl = rgbToHsl(pixels[index], pixels[index + 1], pixels[index + 2]);
    const rgb = hslToRgb(hsl.h, hsl.s, mapLightness(hsl.l));
    changed = changed || rgb[0] !== pixels[index] || rgb[1] !== pixels[index + 1] || rgb[2] !== pixels[index + 2];
    pixels[index] = rgb[0];
    pixels[index + 1] = rgb[1];
    pixels[index + 2] = rgb[2];
  }
  if (!changed) return null;
  nextCtx.putImageData(imageData, 0, 0);
  return next;
}

function thresholdCanvas(source, threshold, useAlpha = false) {
  const next = cloneCanvas(source);
  const nextCtx = next.getContext("2d");
  const imageData = nextCtx.getImageData(0, 0, next.width, next.height);
  const pixels = imageData.data;
  let changed = false;
  for (let index = 0; index < pixels.length; index += 4) {
    if (useAlpha) {
      const nextAlpha = pixels[index + 3] >= threshold ? 255 : 0;
      changed = changed || nextAlpha !== pixels[index + 3] || pixels[index] !== 255 || pixels[index + 1] !== 255 || pixels[index + 2] !== 255;
      pixels[index] = 255;
      pixels[index + 1] = 255;
      pixels[index + 2] = 255;
      pixels[index + 3] = nextAlpha;
      continue;
    }
    if (pixels[index + 3] === 0) continue;
    const gray = pixels[index] * 0.299 + pixels[index + 1] * 0.587 + pixels[index + 2] * 0.114;
    const value = gray >= threshold ? 255 : 0;
    changed = changed || pixels[index] !== value || pixels[index + 1] !== value || pixels[index + 2] !== value;
    pixels[index] = value;
    pixels[index + 1] = value;
    pixels[index + 2] = value;
  }
  if (!changed) return null;
  nextCtx.putImageData(imageData, 0, 0);
  return next;
}

function posterizeCanvas(source, levels, useAlpha = false) {
  const next = cloneCanvas(source);
  const nextCtx = next.getContext("2d");
  const imageData = nextCtx.getImageData(0, 0, next.width, next.height);
  const pixels = imageData.data;
  let changed = false;
  const quantize = (value) => clamp(Math.round((Math.round((value / 255) * (levels - 1)) * 255) / (levels - 1)), 0, 255);
  for (let index = 0; index < pixels.length; index += 4) {
    if (useAlpha) {
      const nextAlpha = quantize(pixels[index + 3]);
      changed = changed || nextAlpha !== pixels[index + 3] || pixels[index] !== 255 || pixels[index + 1] !== 255 || pixels[index + 2] !== 255;
      pixels[index] = 255;
      pixels[index + 1] = 255;
      pixels[index + 2] = 255;
      pixels[index + 3] = nextAlpha;
      continue;
    }
    if (pixels[index + 3] === 0) continue;
    for (let channel = 0; channel < 3; channel += 1) {
      const value = quantize(pixels[index + channel]);
      changed = changed || value !== pixels[index + channel];
      pixels[index + channel] = value;
    }
  }
  if (!changed) return null;
  nextCtx.putImageData(imageData, 0, 0);
  return next;
}

function levelsCanvas(source, levels, useAlpha = false) {
  const { black, gamma, white } = levels;
  const next = cloneCanvas(source);
  const nextCtx = next.getContext("2d");
  const imageData = nextCtx.getImageData(0, 0, next.width, next.height);
  const pixels = imageData.data;
  let changed = false;
  const mapValue = (value) => {
    const normalized = clamp((value - black) / (white - black), 0, 1);
    return clamp(Math.round(Math.pow(normalized, 1 / gamma) * 255), 0, 255);
  };
  for (let index = 0; index < pixels.length; index += 4) {
    if (useAlpha) {
      const nextAlpha = mapValue(pixels[index + 3]);
      changed = changed || nextAlpha !== pixels[index + 3] || pixels[index] !== 255 || pixels[index + 1] !== 255 || pixels[index + 2] !== 255;
      pixels[index] = 255;
      pixels[index + 1] = 255;
      pixels[index + 2] = 255;
      pixels[index + 3] = nextAlpha;
      continue;
    }
    if (pixels[index + 3] === 0) continue;
    for (let channel = 0; channel < 3; channel += 1) {
      const value = mapValue(pixels[index + channel]);
      changed = changed || value !== pixels[index + channel];
      pixels[index + channel] = value;
    }
  }
  if (!changed) return null;
  nextCtx.putImageData(imageData, 0, 0);
  return next;
}

function curvesCanvas(source, points, useAlpha = false) {
  const table = [];
  let segment = 0;
  for (let value = 0; value <= 255; value += 1) {
    while (segment < points.length - 2 && value > points[segment + 1].x) {
      segment += 1;
    }
    const start = points[segment];
    const end = points[segment + 1];
    const ratio = end.x === start.x ? 0 : (value - start.x) / (end.x - start.x);
    table[value] = clamp(Math.round(start.y + (end.y - start.y) * ratio), 0, 255);
  }

  const next = cloneCanvas(source);
  const nextCtx = next.getContext("2d");
  const imageData = nextCtx.getImageData(0, 0, next.width, next.height);
  const pixels = imageData.data;
  let changed = false;
  for (let index = 0; index < pixels.length; index += 4) {
    if (useAlpha) {
      const nextAlpha = table[pixels[index + 3]];
      changed = changed || nextAlpha !== pixels[index + 3] || pixels[index] !== 255 || pixels[index + 1] !== 255 || pixels[index + 2] !== 255;
      pixels[index] = 255;
      pixels[index + 1] = 255;
      pixels[index + 2] = 255;
      pixels[index + 3] = nextAlpha;
      continue;
    }
    if (pixels[index + 3] === 0) continue;
    for (let channel = 0; channel < 3; channel += 1) {
      const value = table[pixels[index + channel]];
      changed = changed || value !== pixels[index + channel];
      pixels[index + channel] = value;
    }
  }
  if (!changed) return null;
  nextCtx.putImageData(imageData, 0, 0);
  return next;
}

function filteredCanvas(source, filterName, useAlpha = false) {
  if (filterName === "blur") return blurCanvas(source);
  if (filterName === "sharpen") return sharpenCanvas(source);
  if (filterName === "find-edges") return findEdgesCanvas(source, useAlpha);
  if (filterName === "solarize") return solarizeCanvas(source, useAlpha);
  if (filterName === "noise") return noiseCanvas(source);
  return null;
}

function filterLabel(filterName) {
  if (filterName === "blur") return "Gaussian blur";
  if (filterName === "sharpen") return "Sharpen";
  if (filterName === "find-edges") return "Find edges";
  if (filterName === "solarize") return "Solarize";
  if (filterName === "noise") return "Add noise";
  return "Filter";
}

function replaceFilteredTarget(target, layer, filtered) {
  const targetCtx = target.getContext("2d");
  const selection = selectionBounds();
  if (!selection) {
    targetCtx.clearRect(0, 0, target.width, target.height);
    targetCtx.drawImage(filtered, 0, 0);
    return "layer";
  }

  const local = localSelectionMask(target, layer);
  if (!local) return null;
  const patch = cloneCanvas(filtered);
  const patchCtx = patch.getContext("2d");
  patchCtx.globalCompositeOperation = "destination-in";
  patchCtx.drawImage(local, 0, 0);
  targetCtx.save();
  targetCtx.globalCompositeOperation = "destination-out";
  targetCtx.drawImage(local, 0, 0);
  targetCtx.restore();
  targetCtx.drawImage(patch, 0, 0);
  return "selection";
}

function applyLayerFilter(filterName) {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to filter");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const filtered = filteredCanvas(target, filterName, target === layer.mask);
  if (!filtered) {
    updateStatus(`${filterLabel(filterName)} unchanged`);
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`${filterLabel(filterName)}${suffix}`);
  renderAll();
}

function promptGaussianBlurRadius() {
  const value = window.prompt("Gaussian Blur radius in pixels", "4");
  if (value === null) return null;
  const radius = Number(value);
  if (!Number.isFinite(radius) || radius <= 0 || radius > 100) {
    updateStatus("Invalid gaussian blur radius");
    return null;
  }
  return radius;
}

function applyGaussianBlurFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to gaussian blur");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const radius = promptGaussianBlurRadius();
  if (!radius) return;
  const filtered = gaussianBlurCanvas(target, radius, target === layer.mask);
  if (!filtered) {
    updateStatus("Gaussian blur unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Gaussian blur${suffix}`);
  renderAll();
}

function promptBoxBlurRadius() {
  const value = window.prompt("Box Blur radius in pixels", "6");
  if (value === null) return null;
  const radius = Number(value);
  if (!Number.isFinite(radius) || radius <= 0 || radius > 100) {
    updateStatus("Invalid box blur radius");
    return null;
  }
  return radius;
}

function applyBoxBlurFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to box blur");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const radius = promptBoxBlurRadius();
  if (!radius) return;
  const filtered = boxBlurFilterCanvas(target, radius, target === layer.mask);
  if (!filtered) {
    updateStatus("Box blur unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Box blur${suffix}`);
  renderAll();
}

function applyAverageFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to average");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const selection = selectionBounds();
  const local = selection ? localSelectionMask(target, layer) : null;
  const filtered = averageCanvas(target, target === layer.mask, local);
  if (!filtered) {
    updateStatus("Average unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Average${suffix}`);
  renderAll();
}

function promptAddNoise() {
  const value = window.prompt("Add Noise values (amount distribution monochromatic), e.g. 12 uniform mono. Distribution: uniform/gaussian. Mono: mono/color", "12 uniform mono");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/);
  const amount = Number(parts[0]);
  const distribution = (parts[1] || "uniform").toLowerCase();
  const colorMode = (parts[2] || "mono").toLowerCase();
  if (!Number.isFinite(amount) || amount < 0.1 || amount > 400 || !["uniform", "gaussian"].includes(distribution) || !["mono", "monochromatic", "color", "colour"].includes(colorMode)) {
    updateStatus("Invalid add noise values");
    return null;
  }
  return {
    amount,
    distribution,
    monochromatic: colorMode === "mono" || colorMode === "monochromatic",
  };
}

function applyAddNoiseFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to add noise");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptAddNoise();
  if (!options) return;
  const filtered = noiseCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Add noise unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Add noise${suffix}`);
  renderAll();
}

function promptSurfaceBlur() {
  const value = window.prompt("Surface Blur values (radius threshold), e.g. 3 20", "3 20");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid surface blur");
    return null;
  }
  const [radius, threshold] = parts;
  if (radius < 1 || radius > 20 || threshold < 0 || threshold > 255) {
    updateStatus("Invalid surface blur");
    return null;
  }
  return { radius: Math.round(radius), threshold };
}

function applySurfaceBlurFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to surface blur");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptSurfaceBlur();
  if (!options) return;
  const filtered = surfaceBlurCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Surface blur unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Surface blur${suffix}`);
  renderAll();
}

function promptSmartBlur() {
  const value = window.prompt("Smart Blur values (radius threshold quality), e.g. 4 24 2", "4 24 2");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid smart blur");
    return null;
  }
  const [radius, threshold, quality] = parts;
  if (radius < 1 || radius > 20 || threshold < 0 || threshold > 255 || quality < 1 || quality > 3) {
    updateStatus("Invalid smart blur");
    return null;
  }
  return { radius: Math.round(radius), threshold, quality: Math.round(quality) };
}

function applySmartBlurFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to smart blur");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptSmartBlur();
  if (!options) return;
  const filtered = smartBlurCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Smart blur unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Smart blur${suffix}`);
  renderAll();
}

function promptTwirlAngle() {
  const value = window.prompt("Twirl angle in degrees", "120");
  if (value === null) return null;
  const angle = Number(value);
  if (!Number.isFinite(angle) || angle < -999 || angle > 999) {
    updateStatus("Invalid twirl angle");
    return null;
  }
  return angle;
}

function applyTwirlFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to twirl");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const angle = promptTwirlAngle();
  if (angle === null) return;
  const filtered = twirlCanvas(target, angle, target === layer.mask);
  if (!filtered) {
    updateStatus("Twirl unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Twirl${suffix}`);
  renderAll();
}

function promptPinchAmount() {
  const value = window.prompt("Pinch amount (-100 to 100)", "50");
  if (value === null) return null;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < -100 || amount > 100) {
    updateStatus("Invalid pinch amount");
    return null;
  }
  return amount;
}

function applyPinchFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to pinch");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const amount = promptPinchAmount();
  if (amount === null) return;
  const filtered = pinchCanvas(target, amount, target === layer.mask);
  if (!filtered) {
    updateStatus("Pinch unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Pinch${suffix}`);
  renderAll();
}

function promptRippleOptions() {
  const value = window.prompt("Ripple values (amount wavelength), e.g. 30 16", "30 16");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid ripple");
    return null;
  }
  const [amount, wavelength] = parts;
  if (amount < -100 || amount > 100 || wavelength < 2 || wavelength > 256) {
    updateStatus("Invalid ripple");
    return null;
  }
  return { amount, wavelength };
}

function applyRippleFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to ripple");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptRippleOptions();
  if (!options) return;
  const filtered = rippleCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Ripple unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Ripple${suffix}`);
  renderAll();
}

function promptSpherizeAmount() {
  const value = window.prompt("Spherize amount (-100 to 100)", "50");
  if (value === null) return null;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < -100 || amount > 100) {
    updateStatus("Invalid spherize amount");
    return null;
  }
  return amount;
}

function applySpherizeFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to spherize");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const amount = promptSpherizeAmount();
  if (amount === null) return;
  const filtered = spherizeCanvas(target, amount, target === layer.mask);
  if (!filtered) {
    updateStatus("Spherize unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Spherize${suffix}`);
  renderAll();
}

function promptZigZagOptions() {
  const value = window.prompt("ZigZag values (amount ridges), e.g. 40 6", "40 6");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid zigzag");
    return null;
  }
  const [amount, ridgeValue] = parts;
  const ridges = Math.round(ridgeValue);
  if (amount < -100 || amount > 100 || ridges < 1 || ridges > 32) {
    updateStatus("Invalid zigzag");
    return null;
  }
  return { amount, ridges };
}

function applyZigZagFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to zigzag");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptZigZagOptions();
  if (!options) return;
  const filtered = zigZagCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("ZigZag unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`ZigZag${suffix}`);
  renderAll();
}

function promptWaveOptions() {
  const value = window.prompt("Wave values (x amplitude, y amplitude, wavelength), e.g. 8 4 24", "8 4 24");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid wave");
    return null;
  }
  const [xAmplitude, yAmplitude, wavelength] = parts;
  if (xAmplitude < -128 || xAmplitude > 128 || yAmplitude < -128 || yAmplitude > 128 || wavelength < 2 || wavelength > 512) {
    updateStatus("Invalid wave");
    return null;
  }
  return { xAmplitude, yAmplitude, wavelength };
}

function applyWaveFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to wave");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptWaveOptions();
  if (!options) return;
  const filtered = waveCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Wave unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Wave${suffix}`);
  renderAll();
}

function promptPolarCoordinatesMode() {
  const value = window.prompt("Polar Coordinates mode (rect or polar)", "rect");
  if (value === null) return null;
  const mode = value.trim().toLowerCase();
  if (mode === "rect" || mode === "rectangular" || mode === "rect-to-polar") return "rect";
  if (mode === "polar" || mode === "polar-to-rect") return "polar";
  updateStatus("Invalid polar coordinates mode");
  return null;
}

function applyPolarCoordinatesFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer for polar coordinates");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const mode = promptPolarCoordinatesMode();
  if (!mode) return;
  const filtered = polarCoordinatesCanvas(target, mode, target === layer.mask);
  if (!filtered) {
    updateStatus("Polar coordinates unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Polar coordinates${suffix}`);
  renderAll();
}

function promptShearAmount() {
  const value = window.prompt("Shear amount (-100 to 100)", "35");
  if (value === null) return null;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < -100 || amount > 100) {
    updateStatus("Invalid shear amount");
    return null;
  }
  return amount;
}

function applyShearFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to shear");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const amount = promptShearAmount();
  if (amount === null) return;
  const filtered = shearCanvas(target, amount, target === layer.mask);
  if (!filtered) {
    updateStatus("Shear unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Shear${suffix}`);
  renderAll();
}

function promptRadialBlurAmount() {
  const value = window.prompt("Radial Blur amount (0 to 100)", "35");
  if (value === null) return null;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0 || amount > 100) {
    updateStatus("Invalid radial blur amount");
    return null;
  }
  return amount;
}

function applyRadialBlurFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to radial blur");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const amount = promptRadialBlurAmount();
  if (amount === null) return;
  const filtered = radialBlurCanvas(target, amount, target === layer.mask);
  if (!filtered) {
    updateStatus("Radial blur unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Radial blur${suffix}`);
  renderAll();
}

function promptMotionBlur() {
  const value = window.prompt("Motion Blur values (angle distance), e.g. 0 12", "0 12");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid motion blur");
    return null;
  }
  const [angle, distance] = parts;
  if (angle < -360 || angle > 360 || distance < 1 || distance > 200) {
    updateStatus("Invalid motion blur");
    return null;
  }
  return { angle, distance };
}

function applyMotionBlurFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to motion blur");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptMotionBlur();
  if (!options) return;
  const filtered = motionBlurCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Motion blur unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Motion blur${suffix}`);
  renderAll();
}

function promptMedianRadius() {
  const value = window.prompt("Median radius in pixels", "1");
  if (value === null) return null;
  const radius = Number(value);
  if (!Number.isFinite(radius) || radius < 1 || radius > 20) {
    updateStatus("Invalid median radius");
    return null;
  }
  return Math.round(radius);
}

function applyMedianFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to median");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const radius = promptMedianRadius();
  if (!radius) return;
  const filtered = medianCanvas(target, radius, target === layer.mask);
  if (!filtered) {
    updateStatus("Median unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Median${suffix}`);
  renderAll();
}

function promptDustScratches() {
  const value = window.prompt("Dust & Scratches values (radius threshold), e.g. 1 24", "1 24");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid dust & scratches");
    return null;
  }
  const [radius, threshold] = parts;
  if (radius < 1 || radius > 20 || threshold < 0 || threshold > 255) {
    updateStatus("Invalid dust & scratches");
    return null;
  }
  return { radius: Math.round(radius), threshold };
}

function applyDustScratchesFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer for dust & scratches");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptDustScratches();
  if (!options) return;
  const filtered = dustScratchesCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Dust & Scratches unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Dust & Scratches${suffix}`);
  renderAll();
}

function promptReduceNoise() {
  const value = window.prompt("Reduce Noise values (strength preserve details), e.g. 6 45", "6 45");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid reduce noise");
    return null;
  }
  const [strength, preserve] = parts;
  if (strength < 1 || strength > 10 || preserve < 0 || preserve > 100) {
    updateStatus("Invalid reduce noise");
    return null;
  }
  return { strength, preserve };
}

function applyReduceNoiseFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to reduce noise");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptReduceNoise();
  if (!options) return;
  const filtered = reduceNoiseCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Reduce noise unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Reduce noise${suffix}`);
  renderAll();
}

function applyDespeckleFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to despeckle");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const filtered = despeckleCanvas(target, target === layer.mask);
  if (!filtered) {
    updateStatus("Despeckle unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Despeckle${suffix}`);
  renderAll();
}

function promptUnsharpMask() {
  const value = window.prompt("Unsharp Mask values (amount radius threshold), e.g. 150 1.5 0", "150 1.5 0");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid unsharp mask");
    return null;
  }
  const [amount, radius, threshold] = parts;
  if (amount < 1 || amount > 500 || radius <= 0 || radius > 100 || threshold < 0 || threshold > 255) {
    updateStatus("Invalid unsharp mask");
    return null;
  }
  return { amount, radius, threshold: Math.round(threshold) };
}

function applyUnsharpMaskFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to unsharp mask");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptUnsharpMask();
  if (!options) return;
  const filtered = unsharpMaskCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Unsharp mask unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Unsharp mask${suffix}`);
  renderAll();
}

function promptSmartSharpen() {
  const value = window.prompt("Smart Sharpen values (amount radius reduce-noise), e.g. 150 1.5 20", "150 1.5 20");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid smart sharpen");
    return null;
  }
  const [amount, radius, reduceNoise] = parts;
  if (amount < 1 || amount > 500 || radius <= 0 || radius > 100 || reduceNoise < 0 || reduceNoise > 100) {
    updateStatus("Invalid smart sharpen");
    return null;
  }
  return { amount, radius, reduceNoise };
}

function applySmartSharpenFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to smart sharpen");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptSmartSharpen();
  if (!options) return;
  const filtered = smartSharpenCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Smart sharpen unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Smart sharpen${suffix}`);
  renderAll();
}

function promptHighPassRadius() {
  const value = window.prompt("High Pass radius in pixels", "3");
  if (value === null) return null;
  const radius = Number(value);
  if (!Number.isFinite(radius) || radius <= 0 || radius > 100) {
    updateStatus("Invalid high pass radius");
    return null;
  }
  return radius;
}

function applyHighPassFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to high pass");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const radius = promptHighPassRadius();
  if (!radius) return;
  const filtered = highPassCanvas(target, radius, target === layer.mask);
  if (!filtered) {
    updateStatus("High pass unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`High pass${suffix}`);
  renderAll();
}

function promptGlowingEdges() {
  const value = window.prompt("Glowing Edges values (width brightness smoothness), e.g. 2 8 5", "2 8 5");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid glowing edges");
    return null;
  }
  const [width, brightness, smoothness] = parts;
  if (width < 1 || width > 8 || brightness < 1 || brightness > 20 || smoothness < 0 || smoothness > 10) {
    updateStatus("Invalid glowing edges");
    return null;
  }
  return {
    width: Math.round(width),
    brightness,
    smoothness: Math.round(smoothness),
  };
}

function applyGlowingEdgesFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer for glowing edges");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptGlowingEdges();
  if (!options) return;
  const filtered = glowingEdgesCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Glowing edges unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Glowing edges${suffix}`);
  renderAll();
}

function promptOilPaint() {
  const value = window.prompt("Oil Paint values (radius intensity), e.g. 3 8", "3 8");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid oil paint values");
    return null;
  }
  const [radius, intensity] = parts;
  if (radius < 1 || radius > 8 || intensity < 1 || intensity > 20) {
    updateStatus("Invalid oil paint values");
    return null;
  }
  return { radius: Math.round(radius), intensity: Math.round(intensity) };
}

function applyOilPaintFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer for oil paint");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptOilPaint();
  if (!options) return;
  const filtered = oilPaintCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Oil paint unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Oil paint${suffix}`);
  renderAll();
}

function promptEmboss() {
  const value = window.prompt("Emboss values (angle height amount), e.g. 135 2 100", "135 2 100");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid emboss");
    return null;
  }
  const [angle, height, amount] = parts;
  if (angle < -360 || angle > 360 || height < 1 || height > 16 || amount < 1 || amount > 500) {
    updateStatus("Invalid emboss");
    return null;
  }
  return { angle, height: Math.round(height), amount };
}

function applyEmbossFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to emboss");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptEmboss();
  if (!options) return;
  const filtered = embossCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Emboss unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Emboss${suffix}`);
  renderAll();
}

function promptDiffuseMode() {
  const value = window.prompt("Diffuse mode (normal, darken, lighten)", "normal");
  if (value === null) return null;
  const mode = value.trim().toLowerCase();
  if (!["normal", "darken", "lighten"].includes(mode)) {
    updateStatus("Invalid diffuse mode");
    return null;
  }
  return mode;
}

function applyDiffuseFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to diffuse");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const mode = promptDiffuseMode();
  if (!mode) return;
  const filtered = diffuseCanvas(target, mode, target === layer.mask);
  if (!filtered) {
    updateStatus("Diffuse unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Diffuse${suffix}`);
  renderAll();
}

function promptWind() {
  const value = window.prompt("Wind values (direction method), e.g. right wind. Direction: right/left. Method: wind/blast/stagger", "right wind");
  if (value === null) return null;
  const parts = value.trim().toLowerCase().split(/[\s,]+/);
  if (parts.length !== 2 || !["right", "left"].includes(parts[0]) || !["wind", "blast", "stagger"].includes(parts[1])) {
    updateStatus("Invalid wind");
    return null;
  }
  return { direction: parts[0], method: parts[1] };
}

function applyWindFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to wind");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptWind();
  if (!options) return;
  const filtered = windCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Wind unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Wind${suffix}`);
  renderAll();
}

function promptTraceContour() {
  const value = window.prompt("Trace Contour values (level edge), e.g. 128 lower. Edge: lower/upper", "128 lower");
  if (value === null) return null;
  const parts = value.trim().toLowerCase().split(/[\s,]+/);
  const level = Number(parts[0]);
  if (parts.length !== 2 || !Number.isFinite(level) || level < 0 || level > 255 || !["lower", "upper"].includes(parts[1])) {
    updateStatus("Invalid trace contour");
    return null;
  }
  return { level: Math.round(level), edge: parts[1] };
}

function applyTraceContourFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to trace contour");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptTraceContour();
  if (!options) return;
  const filtered = traceContourCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Trace contour unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Trace contour${suffix}`);
  renderAll();
}

function promptExtrude() {
  const value = window.prompt("Extrude values (type size depth face), e.g. blocks 8 12 solid. Type: blocks/pyramids. Face: solid/original", "blocks 8 12 solid");
  if (value === null) return null;
  const parts = value.trim().toLowerCase().split(/[\s,]+/);
  const size = Number(parts[1]);
  const depth = Number(parts[2]);
  if (parts.length < 3 || parts.length > 4 || !["blocks", "pyramids"].includes(parts[0]) || !Number.isFinite(size) || !Number.isFinite(depth) || size < 2 || size > 128 || depth < 1 || depth > 128) {
    updateStatus("Invalid extrude");
    return null;
  }
  const face = parts[3] || "solid";
  if (!["solid", "original"].includes(face)) {
    updateStatus("Invalid extrude");
    return null;
  }
  return {
    type: parts[0],
    size: Math.round(size),
    depth: Math.round(depth),
    solid: face === "solid",
  };
}

function applyExtrudeFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to extrude");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptExtrude();
  if (!options) return;
  const filtered = extrudeCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Extrude unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Extrude${suffix}`);
  renderAll();
}

function tilesFillFromInput(input) {
  const normalized = input.trim().toLowerCase().replace(/[\s_]+/g, "-");
  const fills = {
    bg: "background",
    background: "background",
    fg: "foreground",
    foreground: "foreground",
    inverse: "inverse",
    "inverse-image": "inverse",
    original: "unaltered",
    unaltered: "unaltered",
    unchanged: "unaltered",
  };
  return fills[normalized] || null;
}

function promptTiles() {
  const value = window.prompt("Tiles values (tile-count max-offset fill), e.g. 8 12 background. Fill: background/foreground/inverse/unaltered", "8 12 background");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/);
  const tiles = Number(parts[0]);
  const offset = Number(parts[1]);
  const fill = parts[2] ? tilesFillFromInput(parts[2]) : "background";
  if (parts.length < 2 || parts.length > 3 || !Number.isFinite(tiles) || !Number.isFinite(offset) || tiles < 1 || tiles > 99 || offset < 0 || offset > 256 || !fill) {
    updateStatus("Invalid tiles");
    return null;
  }
  return {
    tiles: Math.round(tiles),
    offset: Math.round(offset),
    fill,
    foreground: state.brush.color,
    background: state.backgroundColor,
  };
}

function applyTilesFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to tile");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptTiles();
  if (!options) return;
  const filtered = tilesCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Tiles unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Tiles${suffix}`);
  renderAll();
}

function applyCloudsFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer for clouds");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = {
    foreground: state.brush.color,
    background: state.backgroundColor,
    seed: Math.random() * 10000,
  };
  const filtered = cloudsCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Clouds unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Clouds${suffix}`);
  renderAll();
}

function applyDifferenceCloudsFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer for difference clouds");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = {
    foreground: state.brush.color,
    background: state.backgroundColor,
    seed: Math.random() * 10000,
  };
  const filtered = differenceCloudsCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Difference clouds unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Difference clouds${suffix}`);
  renderAll();
}

function parseLensFlareType(value) {
  const normalized = value.trim().toLowerCase().replace(/[\s_]+/g, "-");
  return LENS_FLARE_TYPES.find((type) => type.key === normalized || type.aliases.includes(normalized) || type.label.toLowerCase().replace(/[\s_]+/g, "-") === normalized) || null;
}

function promptLensFlareOptions() {
  const value = window.prompt("Lens Flare values (brightness x% y% type), e.g. 100 50 50 zoom. Type: zoom/35mm/105mm/movie", "100 50 50 zoom");
  if (value === null) return null;
  const parts = value.trim().split(/\s+/);
  const brightness = Number(parts[0]);
  const x = parts[1] === undefined ? 50 : Number(parts[1]);
  const y = parts[2] === undefined ? 50 : Number(parts[2]);
  const type = parseLensFlareType(parts.slice(3).join(" ") || "zoom");
  if (!Number.isFinite(brightness) || brightness < 1 || brightness > 300 || !Number.isFinite(x) || x < 0 || x > 100 || !Number.isFinite(y) || y < 0 || y > 100 || !type) {
    updateStatus("Invalid lens flare values");
    return null;
  }
  return { brightness, x, y, type };
}

function applyLensFlareFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer for lens flare");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptLensFlareOptions();
  if (!options) return;
  const filtered = lensFlareCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Lens flare unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Lens flare${suffix}`);
  renderAll();
}

function promptFibersOptions() {
  const value = window.prompt("Fibers values (variance strength), e.g. 16 4", "16 4");
  if (value === null) return null;
  const parts = value.trim().split(/\s+/);
  const variance = Number(parts[0]);
  const strength = parts[1] === undefined ? 4 : Number(parts[1]);
  if (!Number.isFinite(variance) || variance < 1 || variance > 64 || !Number.isFinite(strength) || strength < 1 || strength > 64) {
    updateStatus("Invalid fibers values");
    return null;
  }
  return { variance, strength };
}

function applyFibersFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer for fibers");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptFibersOptions();
  if (!options) return;
  options.foreground = state.brush.color;
  options.background = state.backgroundColor;
  options.seed = Math.random() * 10000;
  const filtered = fibersCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Fibers unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Fibers${suffix}`);
  renderAll();
}

function promptLightingEffectsOptions() {
  const value = window.prompt("Lighting Effects values (intensity x% y% radius% ambient%), e.g. 75 50 50 55 25", "75 50 50 55 25");
  if (value === null) return null;
  const parts = value.trim().split(/\s+/);
  const intensity = Number(parts[0]);
  const x = parts[1] === undefined ? 50 : Number(parts[1]);
  const y = parts[2] === undefined ? 50 : Number(parts[2]);
  const radius = parts[3] === undefined ? 55 : Number(parts[3]);
  const ambient = parts[4] === undefined ? 25 : Number(parts[4]);
  if (!Number.isFinite(intensity) || intensity < -100 || intensity > 200 || !Number.isFinite(x) || x < 0 || x > 100 || !Number.isFinite(y) || y < 0 || y > 100 || !Number.isFinite(radius) || radius < 1 || radius > 200 || !Number.isFinite(ambient) || ambient < 0 || ambient > 100) {
    updateStatus("Invalid lighting effects values");
    return null;
  }
  return { intensity, x, y, radius, ambient };
}

function applyLightingEffectsFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer for lighting effects");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptLightingEffectsOptions();
  if (!options) return;
  options.color = state.brush.color;
  const filtered = lightingEffectsCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Lighting effects unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Lighting effects${suffix}`);
  renderAll();
}

function promptMosaicCellSize() {
  const value = window.prompt("Mosaic cell size in pixels", "12");
  if (value === null) return null;
  const cellSize = Number(value);
  if (!Number.isFinite(cellSize) || cellSize < 2 || cellSize > 256) {
    updateStatus("Invalid mosaic cell size");
    return null;
  }
  return Math.round(cellSize);
}

function parseMezzotintType(value) {
  const trimmed = value.trim();
  const numeric = trimmed.match(/^\d+/);
  if (numeric) {
    const index = Number(numeric[0]) - 1;
    return MEZZOTINT_TYPES[index] || null;
  }
  const normalized = trimmed.toLowerCase().replace(/[\s_]+/g, "-");
  return MEZZOTINT_TYPES.find((type) => normalized === type.key || normalized === type.label.toLowerCase().replace(/[\s_]+/g, "-")) || null;
}

function promptMezzotintType() {
  const value = window.prompt("Mezzotint type: 1 Fine Dots, 2 Medium Dots, 3 Grainy Dots, 4 Coarse Dots, 5 Short Lines, 6 Medium Lines, 7 Long Lines, 8 Short Strokes, 9 Medium Strokes, 10 Long Strokes", "Fine Dots");
  if (value === null) return null;
  const type = parseMezzotintType(value);
  if (!type) {
    updateStatus("Invalid mezzotint type");
    return null;
  }
  return type;
}

function applyMezzotintFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to mezzotint");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const type = promptMezzotintType();
  if (!type) return;
  const filtered = mezzotintCanvas(target, type, target === layer.mask);
  if (!filtered) {
    updateStatus("Mezzotint unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Mezzotint${suffix}`);
  renderAll();
}

function applyMosaicFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to mosaic");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const cellSize = promptMosaicCellSize();
  if (!cellSize) return;
  const filtered = mosaicCanvas(target, cellSize, target === layer.mask);
  if (!filtered) {
    updateStatus("Mosaic unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Mosaic${suffix}`);
  renderAll();
}

function promptColorHalftoneRadius() {
  const value = window.prompt("Color Halftone max radius in pixels", "8");
  if (value === null) return null;
  const radius = Number(value);
  if (!Number.isFinite(radius) || radius < 2 || radius > 64) {
    updateStatus("Invalid color halftone radius");
    return null;
  }
  return Math.round(radius);
}

function applyColorHalftoneFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer for color halftone");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const radius = promptColorHalftoneRadius();
  if (!radius) return;
  const filtered = colorHalftoneCanvas(target, radius, target === layer.mask);
  if (!filtered) {
    updateStatus("Color halftone unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Color halftone${suffix}`);
  renderAll();
}

function promptCrystallizeCellSize() {
  const value = window.prompt("Crystallize cell size in pixels", "16");
  if (value === null) return null;
  const cellSize = Number(value);
  if (!Number.isFinite(cellSize) || cellSize < 2 || cellSize > 256) {
    updateStatus("Invalid crystallize cell size");
    return null;
  }
  return Math.round(cellSize);
}

function applyCrystallizeFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to crystallize");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const cellSize = promptCrystallizeCellSize();
  if (!cellSize) return;
  const filtered = crystallizeCanvas(target, cellSize, target === layer.mask);
  if (!filtered) {
    updateStatus("Crystallize unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Crystallize${suffix}`);
  renderAll();
}

function promptPointillizeCellSize() {
  const value = window.prompt("Pointillize cell size in pixels", "12");
  if (value === null) return null;
  const cellSize = Number(value);
  if (!Number.isFinite(cellSize) || cellSize < 2 || cellSize > 256) {
    updateStatus("Invalid pointillize cell size");
    return null;
  }
  return Math.round(cellSize);
}

function applyPointillizeFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to pointillize");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const cellSize = promptPointillizeCellSize();
  if (!cellSize) return;
  const filtered = pointillizeCanvas(target, cellSize, target === layer.mask);
  if (!filtered) {
    updateStatus("Pointillize unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Pointillize${suffix}`);
  renderAll();
}

function applyFragmentFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to fragment");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const filtered = fragmentCanvas(target, target === layer.mask);
  if (!filtered) {
    updateStatus("Fragment unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Fragment${suffix}`);
  renderAll();
}

function applyFacetFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to facet");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const filtered = facetCanvas(target, target === layer.mask);
  if (!filtered) {
    updateStatus("Facet unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Facet${suffix}`);
  renderAll();
}

function promptOffset() {
  const value = window.prompt("Offset values (horizontal vertical), e.g. 24 -12", "24 0");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid offset");
    return null;
  }
  const [x, y] = parts;
  if (Math.abs(x) > 10000 || Math.abs(y) > 10000) {
    updateStatus("Invalid offset");
    return null;
  }
  return { x: Math.round(x), y: Math.round(y) };
}

function applyOffsetFilter() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to offset");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const options = promptOffset();
  if (!options) return;
  const filtered = offsetWrapCanvas(target, options, target === layer.mask);
  if (!filtered) {
    updateStatus("Offset unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Offset${suffix}`);
  renderAll();
}

function promptExtremaRadius(label) {
  const value = window.prompt(`${label} radius in pixels`, "1");
  if (value === null) return null;
  const radius = Number(value);
  if (!Number.isFinite(radius) || radius < 1 || radius > 20) {
    updateStatus(`Invalid ${label.toLowerCase()} radius`);
    return null;
  }
  return Math.round(radius);
}

function applyExtremaFilter(mode) {
  const layer = activeLayer();
  if (!layer) return;
  const label = mode === "maximum" ? "Maximum" : "Minimum";
  if (layer.type === "adjustment") {
    updateStatus(`Select a pixel layer to ${mode}`);
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const radius = promptExtremaRadius(label);
  if (!radius) return;
  const filtered = extremaCanvas(target, radius, mode, target === layer.mask);
  if (!filtered) {
    updateStatus(`${label} unchanged`);
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`${label}${suffix}`);
  renderAll();
}

function applyAutoContrast() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to auto contrast");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const adjusted = autoContrastCanvas(target);
  if (!adjusted) {
    updateStatus("Auto contrast unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, adjusted));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Auto contrast${suffix}`);
  renderAll();
}

function applyAutoTone() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to auto tone");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const adjusted = autoToneCanvas(target);
  if (!adjusted) {
    updateStatus("Auto tone unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, adjusted));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Auto tone${suffix}`);
  renderAll();
}

function applyAutoColor() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to auto color");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const adjusted = autoColorCanvas(target);
  if (!adjusted) {
    updateStatus("Auto color unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, adjusted));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Auto color${suffix}`);
  renderAll();
}

function applyInvert() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to invert");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const inverted = invertCanvas(target, target === layer.mask);
  if (!inverted) {
    updateStatus("Invert unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, inverted));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Invert${suffix}`);
  renderAll();
}

function applyDesaturate() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to desaturate");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const adjusted = desaturateCanvas(target);
  if (!adjusted) {
    updateStatus("Desaturate unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, adjusted));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Desaturate${suffix}`);
  renderAll();
}

function promptBlackWhite() {
  const value = window.prompt("Black & White RGB weights (red green blue), e.g. 30 59 11", "30 59 11");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid black & white");
    return null;
  }
  const [red, green, blue] = parts;
  if ([red, green, blue].some((value) => value < 0 || value > 200)) {
    updateStatus("Invalid black & white");
    return null;
  }
  return { red: Math.round(red), green: Math.round(green), blue: Math.round(blue) };
}

function applyBlackWhite() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to apply black & white");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const weights = promptBlackWhite();
  if (!weights) return;
  const adjusted = blackWhiteCanvas(target, weights, target === layer.mask);
  if (!adjusted) {
    updateStatus("Black & White unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, adjusted));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Black & White${suffix}`);
  renderAll();
}

function promptHueSaturation() {
  const value = window.prompt("Hue/Saturation values (hue saturation lightness), e.g. 30 20 0", "0 20 0");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid hue/saturation");
    return null;
  }
  const [hue, saturation, lightness] = parts;
  if (hue < -180 || hue > 180 || saturation < -100 || saturation > 100 || lightness < -100 || lightness > 100) {
    updateStatus("Invalid hue/saturation");
    return null;
  }
  return { hue: Math.round(hue), saturation: Math.round(saturation), lightness: Math.round(lightness) };
}

function applyHueSaturation() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to adjust hue/saturation");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const adjustment = promptHueSaturation();
  if (!adjustment) return;
  const adjusted = hueSaturationCanvas(target, adjustment, target === layer.mask);
  if (!adjusted) {
    updateStatus("Hue/Saturation unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, adjusted));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Hue/Saturation${suffix}`);
  renderAll();
}

function promptVibrance() {
  const value = window.prompt("Vibrance values (vibrance saturation), e.g. 35 0", "35 0");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid vibrance");
    return null;
  }
  const [vibrance, saturation] = parts;
  if (vibrance < -100 || vibrance > 100 || saturation < -100 || saturation > 100) {
    updateStatus("Invalid vibrance");
    return null;
  }
  return { vibrance: Math.round(vibrance), saturation: Math.round(saturation) };
}

function applyVibrance() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to adjust vibrance");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const adjustment = promptVibrance();
  if (!adjustment) return;
  const adjusted = vibranceCanvas(target, adjustment, target === layer.mask);
  if (!adjusted) {
    updateStatus("Vibrance unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, adjusted));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Vibrance${suffix}`);
  renderAll();
}

function promptColorBalance() {
  const value = window.prompt("Color Balance values (cyan/red magenta/green yellow/blue), e.g. 15 0 -10", "15 0 -10");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid color balance");
    return null;
  }
  const [cyanRed, magentaGreen, yellowBlue] = parts;
  if ([cyanRed, magentaGreen, yellowBlue].some((value) => value < -100 || value > 100)) {
    updateStatus("Invalid color balance");
    return null;
  }
  return {
    cyanRed: Math.round(cyanRed),
    magentaGreen: Math.round(magentaGreen),
    yellowBlue: Math.round(yellowBlue),
  };
}

function applyColorBalance() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to adjust color balance");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const balance = promptColorBalance();
  if (!balance) return;
  const adjusted = colorBalanceCanvas(target, balance, target === layer.mask);
  if (!adjusted) {
    updateStatus("Color Balance unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, adjusted));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Color Balance${suffix}`);
  renderAll();
}

function promptExposure() {
  const value = window.prompt("Exposure values (exposure offset gamma), e.g. 1 0 1", "1 0 1");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid exposure");
    return null;
  }
  const [exposure, offset, gamma] = parts;
  if (exposure < -5 || exposure > 5 || offset < -1 || offset > 1 || gamma < 0.1 || gamma > 9.99) {
    updateStatus("Invalid exposure");
    return null;
  }
  return { exposure, offset, gamma };
}

function applyExposure() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to adjust exposure");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const adjustment = promptExposure();
  if (!adjustment) return;
  const adjusted = exposureCanvas(target, adjustment, target === layer.mask);
  if (!adjusted) {
    updateStatus("Exposure unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, adjusted));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Exposure${suffix}`);
  renderAll();
}

function promptShadowsHighlights() {
  const value = window.prompt("Shadows/Highlights amounts (shadows highlights), e.g. 35 20", "35 20");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid shadows/highlights");
    return null;
  }
  const [shadows, highlights] = parts;
  if (shadows < 0 || shadows > 100 || highlights < 0 || highlights > 100) {
    updateStatus("Invalid shadows/highlights");
    return null;
  }
  return { shadows: Math.round(shadows), highlights: Math.round(highlights) };
}

function applyShadowsHighlights() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to adjust shadows/highlights");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const adjustment = promptShadowsHighlights();
  if (!adjustment) return;
  const adjusted = shadowsHighlightsCanvas(target, adjustment, target === layer.mask);
  if (!adjusted) {
    updateStatus("Shadows/Highlights unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, adjusted));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Shadows/Highlights${suffix}`);
  renderAll();
}

function promptThreshold() {
  const value = window.prompt("Threshold level (0-255)", "128");
  if (value === null) return null;
  const threshold = Number(value);
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 255) {
    updateStatus("Invalid threshold");
    return null;
  }
  return Math.round(threshold);
}

function applyThreshold() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to threshold");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const threshold = promptThreshold();
  if (threshold === null) return;
  const adjusted = thresholdCanvas(target, threshold, target === layer.mask);
  if (!adjusted) {
    updateStatus("Threshold unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, adjusted));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Threshold${suffix}`);
  renderAll();
}

function promptPosterizeLevels() {
  const value = window.prompt("Posterize levels (2-255)", "4");
  if (value === null) return null;
  const levels = Number(value);
  if (!Number.isFinite(levels) || levels < 2 || levels > 255) {
    updateStatus("Invalid posterize levels");
    return null;
  }
  return Math.round(levels);
}

function applyPosterize() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to posterize");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const levels = promptPosterizeLevels();
  if (levels === null) return;
  const adjusted = posterizeCanvas(target, levels, target === layer.mask);
  if (!adjusted) {
    updateStatus("Posterize unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, adjusted));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Posterize${suffix}`);
  renderAll();
}

function promptLevels() {
  const value = window.prompt("Levels input (black gamma white), e.g. 0 1 255", "0 1 255");
  if (value === null) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    updateStatus("Invalid levels");
    return null;
  }
  const [black, gamma, white] = parts;
  if (black < 0 || black > 254 || white < 1 || white > 255 || black >= white || gamma <= 0 || gamma > 9.99) {
    updateStatus("Invalid levels");
    return null;
  }
  return { black: Math.round(black), gamma, white: Math.round(white) };
}

function applyLevels() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to adjust levels");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const levels = promptLevels();
  if (!levels) return;
  const adjusted = levelsCanvas(target, levels, target === layer.mask);
  if (!adjusted) {
    updateStatus("Levels unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, adjusted));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Levels${suffix}`);
  renderAll();
}

function promptCurves() {
  const value = window.prompt("Curves points input:output, e.g. 0:0 128:160 255:255", "0:0 128:160 255:255");
  if (value === null) return null;
  const tokens = value.trim().split(/[\s,]+/).filter(Boolean);
  if (!tokens.length) {
    updateStatus("Invalid curves");
    return null;
  }
  const pointMap = new Map();
  for (const token of tokens) {
    const pair = token.split(":");
    if (pair.length !== 2) {
      updateStatus("Invalid curves");
      return null;
    }
    const x = Number(pair[0]);
    const y = Number(pair[1]);
    if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 255 || y < 0 || y > 255) {
      updateStatus("Invalid curves");
      return null;
    }
    const input = Math.round(x);
    if (pointMap.has(input)) {
      updateStatus("Invalid curves");
      return null;
    }
    pointMap.set(input, { x: input, y: Math.round(y) });
  }
  if (!pointMap.has(0)) pointMap.set(0, { x: 0, y: 0 });
  if (!pointMap.has(255)) pointMap.set(255, { x: 255, y: 255 });
  return [...pointMap.values()].sort((a, b) => a.x - b.x);
}

function applyCurves() {
  const layer = activeLayer();
  if (!layer) return;
  if (layer.type === "adjustment") {
    updateStatus("Select a pixel layer to adjust curves");
    return;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return;
  const points = promptCurves();
  if (!points) return;
  const adjusted = curvesCanvas(target, points, target === layer.mask);
  if (!adjusted) {
    updateStatus("Curves unchanged");
    return;
  }
  const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, adjusted));
  if (!scope) {
    updateStatus("Selection is empty");
    return;
  }
  const suffix = target === layer.mask ? " mask" : scope === "selection" ? " selection" : "";
  commitHistory(`Curves${suffix}`);
  renderAll();
}

function addLayerMask(revealed) {
  const layer = activeLayer();
  if (!layer) return;
  const selection = selectionMask();
  layer.mask = layerMaskFromSelection(layer, revealed, selection);
  layer.maskDisabled = false;
  state.paintTarget = "mask";
  commitHistory(selection ? (revealed ? "Add reveal selection mask" : "Add hide selection mask") : revealed ? "Add reveal mask" : "Add hide mask");
  renderAll();
}

function toggleLayerMaskDisabled(layerId = state.activeLayerId) {
  const layer = state.layers.find((item) => item.id === layerId);
  if (!layer || !layer.mask) return;
  layer.maskDisabled = !layer.maskDisabled;
  commitHistory(layer.maskDisabled ? "Disable mask" : "Enable mask");
  renderAll();
}

function deleteLayerMask() {
  const layer = activeLayer();
  if (!layer || !layer.mask) return;
  layer.mask = null;
  layer.maskDisabled = false;
  state.paintTarget = "pixels";
  commitHistory("Delete mask");
  renderAll();
}

function applyLayerMask() {
  const layer = activeLayer();
  if (!layer || !layer.mask || layer.maskDisabled || layer.type === "adjustment") return;
  if (guardPixelEditing(layer, true)) return;
  layer.canvas = layerSourceWithMask(layer);
  layer.mask = null;
  layer.maskDisabled = false;
  state.paintTarget = "pixels";
  commitHistory("Apply mask");
  renderAll();
}

function invertLayerMask() {
  const layer = activeLayer();
  if (!layer || !layer.mask) return;
  const maskCtx = layer.mask.getContext("2d");
  const imageData = maskCtx.getImageData(0, 0, layer.mask.width, layer.mask.height);
  for (let i = 3; i < imageData.data.length; i += 4) {
    imageData.data[i] = 255 - imageData.data[i];
    imageData.data[i - 3] = 255;
    imageData.data[i - 2] = 255;
    imageData.data[i - 1] = 255;
  }
  maskCtx.putImageData(imageData, 0, 0);
  commitHistory("Invert mask");
  renderAll();
}

function exportImage(type) {
  const output = composeDocument({ applyFilters: true, fillWhite: type === "image/jpeg" });
  const link = document.createElement("a");
  const extension = type === "image/jpeg" ? "jpg" : "png";
  const baseName = state.fileName.replace(/\.[^.]+$/, "") || "image";
  link.download = `${baseName}-edited.${extension}`;
  link.href = output.toDataURL(type, 0.92);
  link.click();
}

class PsdWriter {
  constructor() {
    this.chunks = [];
    this.length = 0;
  }

  bytes(value) {
    this.chunks.push(value);
    this.length += value.length;
  }

  u8(value) {
    this.bytes(Uint8Array.of(value & 0xff));
  }

  u16(value) {
    this.bytes(Uint8Array.of((value >> 8) & 0xff, value & 0xff));
  }

  i16(value) {
    this.u16(value < 0 ? 0x10000 + value : value);
  }

  u32(value) {
    this.bytes(Uint8Array.of((value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff));
  }

  i32(value) {
    this.u32(value < 0 ? 0x100000000 + value : value);
  }

  f32(value) {
    const bytes = new Uint8Array(4);
    new DataView(bytes.buffer).setFloat32(0, value, false);
    this.bytes(bytes);
  }

  f64(value) {
    const bytes = new Uint8Array(8);
    new DataView(bytes.buffer).setFloat64(0, value, false);
    this.bytes(bytes);
  }

  ascii(text) {
    const bytes = new Uint8Array(text.length);
    for (let index = 0; index < text.length; index += 1) {
      bytes[index] = text.charCodeAt(index) & 0xff;
    }
    this.bytes(bytes);
  }

  pad(size) {
    if (size > 0) this.bytes(new Uint8Array(size));
  }

  toBytes() {
    const output = new Uint8Array(this.length);
    let offset = 0;
    this.chunks.forEach((chunk) => {
      output.set(chunk, offset);
      offset += chunk.length;
    });
    return output;
  }
}

function psdAsciiBytes(text, maxLength = 255) {
  const normalized = String(text || "Layer").replace(/[^\x20-\x7e]/g, "?").slice(0, maxLength);
  const bytes = new Uint8Array(normalized.length);
  for (let index = 0; index < normalized.length; index += 1) {
    bytes[index] = normalized.charCodeAt(index);
  }
  return bytes;
}

function writePsdPascalString(writer, text) {
  const name = psdAsciiBytes(text);
  writer.u8(name.length);
  writer.bytes(name);
  writer.pad((4 - ((name.length + 1) % 4)) % 4);
}

function writePsdUnicodeString(writer, text) {
  const value = String(text ?? "");
  writer.u32(value.length + 1);
  for (let index = 0; index < value.length; index += 1) {
    writer.u16(value.charCodeAt(index));
  }
  writer.u16(0);
}

function writePsdClassId(writer, value) {
  const text = String(value || "");
  if (text.length === 4 && !["warp", "time", "hold", "list"].includes(text)) {
    writer.i32(0);
    writer.ascii(text);
    return;
  }
  writer.i32(text.length);
  writer.ascii(text);
}

function writePsdDescriptor(writer, name, classId, entries) {
  writer.u32(16);
  writePsdUnicodeString(writer, name);
  writePsdClassId(writer, classId);
  writer.u32(entries.length);
  entries.forEach(({ key, type, value }) => {
    writePsdClassId(writer, key);
    writer.ascii(type);
    if (type === "TEXT") {
      writePsdUnicodeString(writer, value);
    } else if (type === "enum") {
      const [enumType, enumValue] = String(value).split(".");
      writePsdClassId(writer, enumType);
      writePsdClassId(writer, enumValue);
    } else if (type === "long") {
      writer.i32(value);
    } else if (type === "doub") {
      writer.f64(value);
    } else if (type === "bool") {
      writer.u8(value ? 1 : 0);
    } else if (type === "tdta") {
      writer.u32(value.length);
      writer.bytes(value);
    }
  });
}

function psdBlendModeKey(blendMode) {
  return {
    "source-over": "norm",
    darken: "dark",
    multiply: "mul ",
    "color-burn": "idiv",
    lighten: "lite",
    screen: "scrn",
    "color-dodge": "div ",
    lighter: "lddg",
    overlay: "over",
    "soft-light": "sLit",
    "hard-light": "hLit",
    difference: "diff",
    exclusion: "smud",
    hue: "hue ",
    saturation: "sat ",
    color: "colr",
    luminosity: "lum ",
  }[blendMode] || "norm";
}

function psdFontName(fontFamily) {
  return PSD_FONT_NAMES[fontFamily] || String(fontFamily || "Georgia").replace(/\s+/g, "");
}

function psdEngineNumber(value, key = "") {
  const floatKeys = new Set([
    "Axis", "XY", "Zone", "WordSpacing", "FirstLineIndent", "GlyphSpacing", "StartIndent", "EndIndent", "SpaceBefore",
    "SpaceAfter", "LetterSpacing", "Values", "GridSize", "GridLeading", "PointBase", "BoxBounds", "TransformPoint0",
    "TransformPoint1", "TransformPoint2", "FontSize", "Leading", "HorizontalScale", "VerticalScale", "BaselineShift",
    "Tsume", "OutlineWidth", "AutoLeading",
  ]);
  if (!floatKeys.has(key) && (value | 0) === value) return String(value);
  return value.toFixed(5).replace(/(\d)0+$/g, "$1").replace(/^0+\.([1-9])/g, ".$1").replace(/^-0+\.0(\d)/g, "-.0$1");
}

function serializePsdEngineData(data) {
  let bytes = [];
  let indent = 0;
  const write = (value) => {
    bytes.push(value & 0xff);
  };
  const writeString = (value) => {
    for (let index = 0; index < value.length; index += 1) write(value.charCodeAt(index));
  };
  const writeIndent = () => {
    for (let index = 0; index < indent; index += 1) writeString("\t");
  };
  const writeStringByte = (value) => {
    if (value === 40 || value === 41 || value === 92) write(92);
    write(value);
  };
  const writeValue = (value, key = "", inProperty = false) => {
    const prefix = () => {
      if (inProperty) writeString(" ");
      else writeIndent();
    };
    if (value === null) {
      prefix();
      writeString("null");
    } else if (typeof value === "number") {
      prefix();
      writeString(psdEngineNumber(value, key));
    } else if (typeof value === "boolean") {
      prefix();
      writeString(value ? "true" : "false");
    } else if (typeof value === "string") {
      prefix();
      writeString("(");
      write(0xfe);
      write(0xff);
      for (let index = 0; index < value.length; index += 1) {
        const code = value.charCodeAt(index);
        writeStringByte((code >> 8) & 0xff);
        writeStringByte(code & 0xff);
      }
      writeString(")");
    } else if (Array.isArray(value)) {
      prefix();
      if (value.every((item) => typeof item === "number")) {
        writeString("[");
        value.forEach((item) => {
          writeString(" ");
          writeString(key === "RunLengthArray" ? String(item) : psdEngineNumber(item, key));
        });
        writeString(" ]");
      } else {
        writeString("[\n");
        indent += 1;
        value.forEach((item) => {
          writeValue(item, key);
          writeString("\n");
        });
        indent -= 1;
        writeIndent();
        writeString("]");
      }
    } else {
      if (inProperty) writeString("\n");
      writeIndent();
      writeString("<<\n");
      indent += 1;
      Object.keys(value).forEach((childKey) => {
        writeIndent();
        writeString(`/${childKey}`);
        writeValue(value[childKey], childKey, true);
        writeString("\n");
      });
      indent -= 1;
      writeIndent();
      writeString(">>");
    }
  };
  writeString("\n\n");
  writeValue(data);
  return new Uint8Array(bytes);
}

function psdTextEngineData(layer) {
  const text = `${String(layer.text?.content || "Text").replace(/\r?\n/g, "\r")}\r`;
  const fontName = psdFontName(layer.text?.fontFamily);
  const size = Math.max(1, Number(layer.text?.size) || state.text.size);
  const color = hexToRgb(layer.text?.color || state.brush.color);
  const paragraphProperties = {
    Justification: 0,
    FirstLineIndent: 0,
    StartIndent: 0,
    EndIndent: 0,
    SpaceBefore: 0,
    SpaceAfter: 0,
    AutoHyphenate: true,
    HyphenatedWordSize: 6,
    PreHyphen: 2,
    PostHyphen: 2,
    ConsecutiveHyphens: 8,
    Zone: 36,
    WordSpacing: [0.8, 1, 1.33],
    LetterSpacing: [0, 0, 0],
    GlyphSpacing: [1, 1, 1],
    AutoLeading: 1.2,
    LeadingType: 0,
    Hanging: false,
    Burasagari: false,
    KinsokuOrder: 0,
    EveryLineComposer: false,
  };
  const styleSheetData = {
    Font: 1,
    FontSize: size,
    FauxBold: true,
    FauxItalic: false,
    AutoLeading: true,
    Leading: 0,
    HorizontalScale: 1,
    VerticalScale: 1,
    Tracking: 0,
    AutoKerning: true,
    Kerning: 0,
    BaselineShift: 0,
    FontCaps: 0,
    FontBaseline: 0,
    Underline: false,
    Strikethrough: false,
    Ligatures: true,
    DLigatures: false,
    BaselineDirection: 2,
    Tsume: 0,
    StyleRunAlignment: 2,
    Language: 0,
    NoBreak: false,
    FillColor: { Type: 1, Values: [1, color.r / 255, color.g / 255, color.b / 255] },
    StrokeColor: { Type: 1, Values: [1, 0, 0, 0] },
    FillFlag: true,
    StrokeFlag: false,
    FillFirst: true,
    YUnderline: 1,
    OutlineWidth: 1,
    CharacterDirection: 0,
    HindiNumbers: false,
    Kashida: 1,
    DiacriticPos: 2,
  };
  const resourceDict = {
    KinsokuSet: [],
    MojiKumiSet: [],
    TheNormalStyleSheet: 0,
    TheNormalParagraphSheet: 0,
    ParagraphSheetSet: [{ Name: "Normal RGB", DefaultStyleSheet: 0, Properties: paragraphProperties }],
    StyleSheetSet: [{ Name: "Normal RGB", StyleSheetData: styleSheetData }],
    FontSet: [
      { Name: "AdobeInvisFont", Script: 0, FontType: 0, Synthetic: 0 },
      { Name: fontName, Script: 0, FontType: 0, Synthetic: 0 },
    ],
    SuperscriptSize: 0.583,
    SuperscriptPosition: 0.333,
    SubscriptSize: 0.583,
    SubscriptPosition: 0.333,
    SmallCapSize: 0.7,
  };
  return serializePsdEngineData({
    EngineDict: {
      Editor: { Text: text },
      ParagraphRun: {
        DefaultRunData: { ParagraphSheet: { DefaultStyleSheet: 0, Properties: {} }, Adjustments: { Axis: [1, 0, 1], XY: [0, 0] } },
        RunArray: [{ ParagraphSheet: { DefaultStyleSheet: 0, Properties: paragraphProperties }, Adjustments: { Axis: [1, 0, 1], XY: [0, 0] } }],
        RunLengthArray: [text.length],
        IsJoinable: 1,
      },
      StyleRun: {
        DefaultRunData: { StyleSheet: { StyleSheetData: {} } },
        RunArray: [{ StyleSheet: { StyleSheetData: styleSheetData } }],
        RunLengthArray: [text.length],
        IsJoinable: 2,
      },
      GridInfo: {
        GridIsOn: false,
        ShowGrid: false,
        GridSize: 18,
        GridLeading: 22,
        GridColor: { Type: 1, Values: [1, 0, 0, 1] },
        GridLeadingFillColor: { Type: 1, Values: [1, 0, 0, 1] },
        AlignLineHeightToGridFlags: false,
      },
      AntiAlias: 4,
      UseFractionalGlyphWidths: true,
      Rendered: {
        Version: 1,
        Shapes: {
          WritingDirection: 0,
          Children: [{
            ShapeType: 0,
            Procession: 0,
            Lines: { WritingDirection: 0, Children: [] },
            Cookie: {
              Photoshop: {
                ShapeType: 0,
                PointBase: [0, 0],
                Base: { ShapeType: 0, TransformPoint0: [1, 0], TransformPoint1: [0, 1], TransformPoint2: [0, 0] },
              },
            },
          }],
        },
      },
    },
    ResourceDict: resourceDict,
    DocumentResources: resourceDict,
  });
}

function psdTypeToolData(layer) {
  const writer = new PsdWriter();
  const left = layer.x;
  const top = layer.y;
  const right = layer.x + layer.canvas.width;
  const bottom = layer.y + layer.canvas.height;
  const baselineX = layer.x + (layer.text?.leftOffset ?? TEXT_LAYER_PADDING);
  const baselineY = layer.y + (layer.text?.baselineOffset ?? Math.round((Number(layer.text?.size) || state.text.size) * 0.8));
  const content = String(layer.text?.content || "Text").replace(/\r?\n/g, "\r");

  writer.i16(1);
  [1, 0, 0, 1, baselineX, baselineY].forEach((value) => writer.f64(value));
  writer.i16(50);
  writePsdDescriptor(writer, "", "TxLr", [
    { key: "Txt ", type: "TEXT", value: content },
    { key: "textGridding", type: "enum", value: "textGridding.None" },
    { key: "Ornt", type: "enum", value: "Ornt.Hrzn" },
    { key: "AntA", type: "enum", value: "Annt.antiAliasSharp" },
    { key: "TextIndex", type: "long", value: 0 },
    { key: "EngineData", type: "tdta", value: psdTextEngineData(layer) },
  ]);
  writer.i16(1);
  writePsdDescriptor(writer, "", "warp", [
    { key: "warpStyle", type: "enum", value: "warpStyle.warpNone" },
    { key: "warpValue", type: "doub", value: 0 },
    { key: "warpPerspective", type: "doub", value: 0 },
    { key: "warpPerspectiveOther", type: "doub", value: 0 },
    { key: "warpRotate", type: "enum", value: "Ornt.Hrzn" },
  ]);
  writer.f32(left);
  writer.f32(top);
  writer.f32(right);
  writer.f32(bottom);
  return writer.toBytes();
}

function writePsdAdditionalLayerInfo(writer, key, data, padTo = 2) {
  const length = data.length + ((padTo - (data.length % padTo)) % padTo);
  writer.ascii("8BIM");
  writer.ascii(key);
  writer.u32(length);
  writer.bytes(data);
  writer.pad(length - data.length);
}

function canvasToPsdChannelData(canvas) {
  const pixels = canvas.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, canvas.width, canvas.height).data;
  const pixelCount = canvas.width * canvas.height;
  const channels = [0, 1, 2, 3].map(() => new Uint8Array(pixelCount + 2));
  for (let pixelIndex = 0, sourceIndex = 0; pixelIndex < pixelCount; pixelIndex += 1, sourceIndex += 4) {
    channels[0][pixelIndex + 2] = pixels[sourceIndex];
    channels[1][pixelIndex + 2] = pixels[sourceIndex + 1];
    channels[2][pixelIndex + 2] = pixels[sourceIndex + 2];
    channels[3][pixelIndex + 2] = pixels[sourceIndex + 3];
  }
  return channels;
}

function rasterizePsdLayer(layer, index) {
  if (layer.type === "adjustment") return null;
  const layerCanvas = makeCanvas(state.doc.width, state.doc.height);
  const layerCtx = layerCanvas.getContext("2d");
  const clipBase = layer.clipped ? state.layers[index - 1] : null;
  const source = effectiveLayerSource(layer, clipBase);
  layerCtx.save();
  drawLayerStyles(layerCtx, source, layer);
  layerCtx.globalAlpha = layer.fillOpacity ?? 1;
  layerCtx.drawImage(source, layer.x, layer.y);
  layerCtx.restore();
  return layerCanvas;
}

function psdLayerRecord(layerExport) {
  const record = new PsdWriter();
  record.i32(0);
  record.i32(0);
  record.i32(state.doc.height);
  record.i32(state.doc.width);
  record.u16(layerExport.channels.length);
  layerExport.channels.forEach((channel) => {
    record.i16(channel.id);
    record.u32(channel.data.length);
  });
  record.ascii("8BIM");
  record.ascii(psdBlendModeKey(layerExport.layer.blendMode));
  record.u8(Math.round(clamp(layerExport.layer.opacity, 0, 1) * 255));
  record.u8(0);
  record.u8(layerExport.layer.visible ? 0 : 2);
  record.u8(0);

  const extra = new PsdWriter();
  extra.u32(0);
  extra.u32(0);
  writePsdPascalString(extra, layerExport.layer.name);
  if (layerExport.layer.type === "text" && layerExport.layer.text) {
    writePsdAdditionalLayerInfo(extra, "TySh", psdTypeToolData(layerExport.layer));
  }
  record.u32(extra.length);
  record.bytes(extra.toBytes());
  return record.toBytes();
}

function encodeLayeredPsd(compositeCanvas) {
  const channelCount = 4;
  // state.layers is stored bottom-to-top; the layer panel reverses it only for display.
  const layerExports = state.layers
    .map((layer, index) => {
      const canvas = rasterizePsdLayer(layer, index);
      if (!canvas) return null;
      const channelData = canvasToPsdChannelData(canvas);
      return {
        layer,
        channels: [
          { id: 0, data: channelData[0] },
          { id: 1, data: channelData[1] },
          { id: 2, data: channelData[2] },
          { id: -1, data: channelData[3] },
        ],
      };
    })
    .filter(Boolean);

  const layerInfo = new PsdWriter();
  layerInfo.i16(layerExports.length);
  layerExports.forEach((layerExport) => layerInfo.bytes(psdLayerRecord(layerExport)));
  layerExports.forEach((layerExport) => {
    layerExport.channels.forEach((channel) => layerInfo.bytes(channel.data));
  });
  if (layerInfo.length % 2) layerInfo.pad(1);

  const layerAndMask = new PsdWriter();
  layerAndMask.u32(layerInfo.length);
  layerAndMask.bytes(layerInfo.toBytes());
  layerAndMask.u32(0);
  const layerAndMaskBytes = layerAndMask.toBytes();

  const compositeChannels = canvasToPsdChannelData(compositeCanvas);
  const writer = new PsdWriter();
  writer.ascii("8BPS");
  writer.u16(1);
  writer.pad(6);
  writer.u16(channelCount);
  writer.u32(compositeCanvas.height);
  writer.u32(compositeCanvas.width);
  writer.u16(8);
  writer.u16(3);
  writer.u32(0);
  writer.u32(0);
  writer.u32(layerAndMaskBytes.length);
  writer.bytes(layerAndMaskBytes);
  writer.u16(0);
  compositeChannels.forEach((channel) => writer.bytes(channel.subarray(2)));

  return new Blob([writer.toBytes()], { type: "image/vnd.adobe.photoshop" });
}

function exportPsd() {
  const output = composeDocument({ applyFilters: true });
  const link = document.createElement("a");
  const baseName = state.fileName.replace(/\.[^.]+$/, "") || "image";
  const objectUrl = URL.createObjectURL(encodeLayeredPsd(output));
  link.download = `${baseName}-edited.psd`;
  link.href = objectUrl;
  link.click();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  updateStatus("PSD exported with editable text layers");
}

function newDocument() {
  const size = promptDocumentSize("New Document");
  if (!size) return;

  state.doc = { width: size.width, height: size.height };
  state.layerCounter = 1;
  state.adjustmentCounter = 0;
  const layer = createLayer("Layer 1", null);
  state.layers = [layer];
  state.activeLayerId = layer.id;
  state.fileName = "Untitled.psd";
  state.moveAutoSelect = true;
  state.freeTransform = false;
  state.zoom = 1;
  state.pan = { x: 0, y: 0 };
  state.cropRect = null;
  state.selectionRect = null;
  state.selectionMaskCanvas = null;
  state.selectionPath = null;
  state.lastSelection = null;
  state.selectionKind = "rect";
  state.selectionInverse = false;
  state.selectionFeather = 0;
  state.selectionMode = "new";
  state.quickMaskMode = false;
  state.quickMaskCanvas = null;
  state.cloneSource = null;
  state.showExtras = true;
  state.showGrid = false;
  state.showRulers = true;
  state.showGuides = true;
  state.guides = [];
  state.snapEnabled = true;
  state.snapToGrid = true;
  state.snapToGuides = true;
  state.visibleChannels = { red: true, green: true, blue: true };
  state.alphaChannels = [];
  state.alphaChannelCounter = 1;
  state.visibilitySoloRestore = null;
  state.backgroundColor = "#101114";
  state.workPath = [];
  state.lastPaintDoc = null;
  state.paintTarget = "pixels";
  state.numericOpacityShortcut = { target: null, key: "", at: 0, historyIndex: -1 };
  state.historySnapshots = [];
  state.historySnapshotCounter = 1;
  state.historyBrushSourceIndex = null;
  resetAdjustments();
  syncControlsFromState();
  state.initialSnapshot = snapshot();
  state.history = [];
  state.historyIndex = -1;
  commitHistory("New document");
  renderAll();
  updateStatus(`New ${size.width} x ${size.height}px document`);
}

async function imageBitmapFromFile(file) {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return await createImageBitmap(file);
  }
}

async function loadFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const bitmap = await imageBitmapFromFile(file);
  state.doc = { width: bitmap.width, height: bitmap.height };
  const source = makeCanvas(bitmap.width, bitmap.height);
  source.getContext("2d").drawImage(bitmap, 0, 0);
  state.layers = [createBackgroundLayer(source)];
  state.activeLayerId = state.layers[0].id;
  state.fileName = file.name;
  state.moveAutoSelect = true;
  state.zoom = 1;
  state.pan = { x: 0, y: 0 };
  state.selectionRect = null;
  state.selectionMaskCanvas = null;
  state.selectionPath = null;
  state.lastSelection = null;
  state.selectionKind = "rect";
  state.selectionInverse = false;
  state.cloneSource = null;
  state.showExtras = true;
  state.showGrid = false;
  state.showRulers = true;
  state.showGuides = true;
  state.guides = [];
  state.snapEnabled = true;
  state.snapToGrid = true;
  state.snapToGuides = true;
  state.visibleChannels = { red: true, green: true, blue: true };
  state.alphaChannels = [];
  state.alphaChannelCounter = 1;
  state.visibilitySoloRestore = null;
  state.backgroundColor = "#101114";
  state.workPath = [];
  state.layerCounter = 1;
  state.adjustmentCounter = 0;
  state.historySnapshots = [];
  state.historySnapshotCounter = 1;
  state.historyBrushSourceIndex = null;
  resetAdjustments();
  state.initialSnapshot = snapshot();
  state.history = [];
  state.historyIndex = -1;
  commitHistory("Open image");
  renderAll();
}

async function placeFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const bitmap = await imageBitmapFromFile(file);
  const scale = Math.min(1, state.doc.width / bitmap.width, state.doc.height / bitmap.height);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const source = makeCanvas(width, height);
  const sourceCtx = source.getContext("2d");
  sourceCtx.imageSmoothingEnabled = true;
  sourceCtx.imageSmoothingQuality = "high";
  sourceCtx.drawImage(bitmap, 0, 0, width, height);
  const baseName = file.name.replace(/\.[^.]+$/, "") || "Placed image";
  const layer = createLayer(baseName, source, {
    x: Math.round((state.doc.width - width) / 2),
    y: Math.round((state.doc.height - height) / 2),
  });
  state.layers.push(layer);
  state.activeLayerId = layer.id;
  state.paintTarget = "pixels";
  state.visibilitySoloRestore = null;
  commitHistory(`Place ${layer.name}`);
  renderAll();
  updateStatus(`Placed ${layer.name}`);
}

function resetDocument() {
  if (!state.initialSnapshot) return;
  restoreSnapshot(state.initialSnapshot);
  state.historySnapshots = [];
  state.historySnapshotCounter = 1;
  state.historyBrushSourceIndex = null;
  state.history = [];
  state.historyIndex = -1;
  commitHistory("Reset document");
  renderAll();
}

function fitToScreen() {
  state.zoom = 1;
  state.pan = { x: 0, y: 0 };
  render();
}

function actualPixels() {
  state.zoom = clamp(1 / fitBaseScale(), 0.18, 32);
  state.pan = { x: 0, y: 0 };
  render();
  updateStatus("Actual pixels");
}

function setZoom(nextZoom, anchor) {
  const before = anchor ? viewToDoc(anchor) : null;
  state.zoom = clamp(nextZoom, 0.18, 32);
  calculateView();
  if (before && anchor) {
    const after = viewToDoc(anchor);
    state.pan.x += (after.x - before.x) * state.view.scale;
    state.pan.y += (after.y - before.y) * state.view.scale;
  }
  render();
}

function setNavigatorZoomPercent(percent) {
  if (!Number.isFinite(percent)) return;
  state.zoom = clamp((percent / 100) / fitBaseScale(), 0.18, 32);
  render();
  updateStatus(`Zoom ${zoomPercentText()}`);
}

function zoomToDocumentRect(docRect) {
  const stageRect = stage.getBoundingClientRect();
  const zoomPadding = 48;
  const baseScale = fitBaseScale();
  const targetScale = Math.min(
    (stageRect.width - zoomPadding) / docRect.w,
    (stageRect.height - zoomPadding) / docRect.h,
  );
  state.zoom = clamp(targetScale / baseScale, 0.18, 32);
  centerViewOnDocumentPoint({
    x: docRect.x + docRect.w / 2,
    y: docRect.y + docRect.h / 2,
  });
}

function finishZoomDrag() {
  const rect = normalizeRect({
    x: state.drag.startView.x,
    y: state.drag.startView.y,
    w: state.drag.currentView.x - state.drag.startView.x,
    h: state.drag.currentView.y - state.drag.startView.y,
  });
  if (state.drag.zoomOut || rect.w < 8 || rect.h < 8) {
    setZoom(state.drag.zoomOut ? state.zoom / 1.25 : state.zoom * 1.25, state.drag.startView);
    return state.drag.zoomOut ? "Zoom out" : "Zoom in";
  }

  const start = viewToDoc({ x: rect.x, y: rect.y });
  const end = viewToDoc({ x: rect.x + rect.w, y: rect.y + rect.h });
  const docRect = clippedRect({
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    w: Math.abs(end.x - start.x),
    h: Math.abs(end.y - start.y),
  });
  if (!docRect || docRect.w < 1 || docRect.h < 1) {
    return "Zoom skipped";
  }
  zoomToDocumentRect(docRect);
  return `Zoom to ${Math.round(docRect.w)} x ${Math.round(docRect.h)} px`;
}

function beginNavigatorPointer(event) {
  navigatorDragging = true;
  dom.navigatorCanvas.setPointerCapture(event.pointerId);
  updateNavigatorPan(event);
}

function moveNavigatorPointer(event) {
  if (!navigatorDragging) return;
  updateNavigatorPan(event);
}

function endNavigatorPointer() {
  navigatorDragging = false;
}

function beginPointer(event) {
  const viewPoint = pointFromEvent(event);
  const docPoint = viewToDoc(viewPoint);
  const layer = activeLayer();
  updateInfoPanel(docPoint);
  canvas.setPointerCapture(event.pointerId);

  if (state.activeTool === "hand") {
    state.drag = { type: "pan", startView: viewPoint, startPan: { ...state.pan } };
    canvas.style.cursor = "grabbing";
    return;
  }

  if (state.activeTool === "zoom") {
    state.drag = {
      type: "zoom",
      startView: viewPoint,
      currentView: viewPoint,
      zoomOut: event.altKey,
    };
    return;
  }

  if (state.activeTool === "move") {
    const guideHit = hitGuide(viewPoint);
    if (guideHit && beginGuideDrag(event, guideHit.index)) return;
  }

  if (state.freeTransform && layer) {
    const hit = hitTransform(viewPoint);
    if (hit) {
      if (guardPositionEditing(layer)) return;
      const startRect = activeLayerRect();
      state.drag = {
        type: "free-transform",
        handle: hit,
        startDoc: docPoint,
        startRect,
        startCanvas: extractLayerArea(layer.canvas, layer, startRect),
        startMask: layer.mask ? extractLayerArea(layer.mask, layer, startRect) : null,
      };
      return;
    }
  }

  if (!inDocument(docPoint)) return;

  if (state.activeTool === "move" && layer) {
    const targetLayer = state.moveAutoSelect ? layerAtDocumentPoint(docPoint) : null;
    const moveLayer = targetLayer || layer;
    if (targetLayer && targetLayer.id !== state.activeLayerId) {
      state.activeLayerId = targetLayer.id;
      renderLayerList();
      updateToolUi();
      updateActionStates();
    }
    if (guardPositionEditing(moveLayer)) return;
    state.drag = {
      type: "move",
      startDoc: docPoint,
      layerId: moveLayer.id,
      startLayer: { x: moveLayer.x, y: moveLayer.y },
      duplicateOnMove: event.altKey,
      duplicated: false,
      moved: false,
    };
    return;
  }

  if (state.activeTool === "brush" || state.activeTool === "eraser") {
    if (event.altKey) {
      pickColor(docPoint);
      return;
    }
    const erase = state.activeTool === "eraser";
    const strokeStart = event.shiftKey && state.lastPaintDoc ? state.lastPaintDoc : docPoint;
    state.drag = {
      type: "paint",
      erase,
      lastDoc: docPoint,
      painted: false,
    };
    state.drag.painted = drawStroke(strokeStart, docPoint, erase);
    render();
    return;
  }

  if (state.activeTool === "heal") {
    state.drag = {
      type: "heal",
      lastDoc: docPoint,
      sourceCanvas: composeDocument({ applyFilters: true }),
      painted: false,
    };
    state.drag.painted = drawHealingStroke(docPoint, docPoint, state.drag);
    updateStatus("Spot healing stroke");
    render();
    return;
  }

  if (state.activeTool === "smudge") {
    state.drag = {
      type: "smudge",
      lastDoc: docPoint,
      painted: false,
    };
    updateStatus("Smudge stroke");
    return;
  }

  if (state.activeTool === "tone") {
    state.drag = {
      type: "tone",
      lastDoc: docPoint,
      painted: false,
    };
    state.drag.painted = drawToneStroke(docPoint, docPoint);
    updateStatus(state.toneMode === "dodge" ? "Dodge stroke" : "Burn stroke");
    render();
    return;
  }

  if (state.activeTool === "clone") {
    if (event.altKey) {
      state.cloneSource = normalizePathPoint(docPoint);
      updateStatus(`Clone source ${Math.round(state.cloneSource.x)}, ${Math.round(state.cloneSource.y)}`);
      render();
      return;
    }
    if (!state.cloneSource) {
      updateStatus("Clone source not set");
      return;
    }
    state.drag = {
      type: "clone",
      startDoc: { ...docPoint },
      lastDoc: docPoint,
      sourceStart: { ...state.cloneSource },
      sourceCanvas: composeDocument({ applyFilters: true }),
      painted: false,
    };
    state.drag.painted = drawCloneStroke(docPoint, docPoint, state.drag);
    render();
    return;
  }

  if (state.activeTool === "historyBrush") {
    const source = historyBrushSource();
    if (!source) {
      updateStatus("Create or select a History Brush source");
      return;
    }
    if (!layer || layer.type === "adjustment") {
      updateStatus("Select a pixel layer for History Brush");
      return;
    }
    if (state.paintTarget === "mask") {
      updateStatus("History Brush paints layer pixels");
      return;
    }
    if (guardPixelEditing(layer, true)) return;
    const strokeStart = event.shiftKey && state.lastPaintDoc ? state.lastPaintDoc : docPoint;
    state.drag = {
      type: "history-brush",
      lastDoc: docPoint,
      sourceName: source.name,
      sourceCanvas: composeSnapshotDocument(source.data, { applyFilters: true }),
      painted: false,
    };
    state.drag.painted = drawHistoryBrushStroke(strokeStart, docPoint, state.drag);
    render();
    return;
  }

  if (state.activeTool === "gradient") {
    state.drag = {
      type: "gradient",
      startDoc: normalizePathPoint(docPoint),
      currentDoc: normalizePathPoint(docPoint),
    };
    render();
    return;
  }

  if (state.activeTool === "shape") {
    const point = normalizePathPoint(docPoint);
    state.drag = {
      type: "shape",
      startDoc: point,
      currentDoc: point,
      constrain: event.shiftKey,
    };
    render();
    return;
  }

  if (state.activeTool === "text") {
    placeText(docPoint);
    return;
  }

  if (state.activeTool === "pen") {
    addWorkPathPoint(docPoint);
    return;
  }

  if (state.activeTool === "eyedropper") {
    pickColor(docPoint, event.altKey ? "background" : "foreground");
    return;
  }

  if (state.activeTool === "magic") {
    magicWandSelect(docPoint, selectionModeFromEvent(event));
    return;
  }

  if (state.activeTool === "lasso") {
    const point = normalizePathPoint(docPoint);
    const mode = selectionModeFromEvent(event);
    const startSelection = currentSelectionState();
    state.selectionRect = null;
    state.selectionMaskCanvas = null;
    state.selectionPath = null;
    state.selectionKind = "lasso";
    state.selectionInverse = false;
    state.drag = { type: "lasso", path: [point], lastDoc: point, mode, startSelection };
    updateToolUi();
    render();
    return;
  }

  if (state.activeTool === "marquee") {
    const mode = selectionModeFromEvent(event);
    const startSelection = currentSelectionState();
    state.selectionRect = { x: docPoint.x, y: docPoint.y, w: 0, h: 0 };
    state.selectionMaskCanvas = null;
    state.selectionPath = null;
    state.selectionKind = "rect";
    state.selectionInverse = false;
    state.drag = { type: "selection", startDoc: docPoint, mode, startSelection };
    updateToolUi();
    render();
    return;
  }

  if (state.activeTool === "crop") {
    const hit = hitCrop(viewPoint);
    if (!hit) return;
    state.drag = {
      type: "crop",
      handle: hit,
      startDoc: docPoint,
      startRect: { ...state.cropRect },
    };
  }
}

function movePointer(event) {
  const viewPoint = pointFromEvent(event);
  const docPoint = viewToDoc(viewPoint);
  const layer = activeLayer();
  const brushPreviewChanged = updateBrushPreview(docPoint, event.currentTarget === canvas);
  updateInfoPanel(docPoint);

  if (!state.drag) {
    const guideHit = state.activeTool === "move" ? hitGuide(viewPoint) : null;
    if (guideHit) {
      canvas.style.cursor = guideCursor(guideHit.axis);
      return;
    }
    if (state.freeTransform) {
      canvas.style.cursor = cursorForTransform(hitTransform(viewPoint));
      return;
    }
    if (state.activeTool === "crop") {
      canvas.style.cursor = hitCrop(viewPoint) ? "move" : "crosshair";
      return;
    }
    canvas.style.cursor = state.activeTool === "hand" ? "grab" : "crosshair";
    if (brushPreviewChanged) render();
    return;
  }

  if (state.drag.type === "pan") {
    state.pan = {
      x: state.drag.startPan.x + viewPoint.x - state.drag.startView.x,
      y: state.drag.startPan.y + viewPoint.y - state.drag.startView.y,
    };
    render();
    return;
  }

  if (state.drag.type === "zoom") {
    state.drag.currentView = viewPoint;
    render();
    return;
  }

  if (state.drag.type === "guide") {
    updateGuideDrag(event);
    return;
  }

  let dragLayer = state.drag.layerId ? state.layers.find((item) => item.id === state.drag.layerId) : layer;
  if (state.drag.type === "move" && dragLayer) {
    const deltaX = docPoint.x - state.drag.startDoc.x;
    const deltaY = docPoint.y - state.drag.startDoc.y;
    const lockedAxis = event.shiftKey ? Math.abs(deltaX) >= Math.abs(deltaY) ? "y" : "x" : null;
    const nextPoint = {
      x: lockedAxis === "x" ? state.drag.startLayer.x : state.drag.startLayer.x + deltaX,
      y: lockedAxis === "y" ? state.drag.startLayer.y : state.drag.startLayer.y + deltaY,
    };
    const snapped = snapMovePoint(nextPoint);
    if (lockedAxis === "x") snapped.x = state.drag.startLayer.x;
    if (lockedAxis === "y") snapped.y = state.drag.startLayer.y;
    const moved = Math.abs(snapped.x - state.drag.startLayer.x) > 0.5 || Math.abs(snapped.y - state.drag.startLayer.y) > 0.5;
    if (state.drag.duplicateOnMove && !state.drag.duplicated && moved) {
      const copy = createLayerCopy(dragLayer, 0);
      state.layers.push(copy);
      state.activeLayerId = copy.id;
      state.drag.layerId = copy.id;
      state.drag.duplicated = true;
      dragLayer = copy;
      renderLayerList();
      updateActionStates();
    }
    state.drag.moved = state.drag.moved || moved;
    dragLayer.x = snapped.x;
    dragLayer.y = snapped.y;
    render();
    return;
  }

  if (state.drag.type === "free-transform") {
    updateFreeTransform(state.drag.handle, docPoint, event.shiftKey);
    render();
    return;
  }

  if (state.drag.type === "paint") {
    if (drawStroke(state.drag.lastDoc, docPoint, state.drag.erase)) {
      state.drag.painted = true;
    }
    state.drag.lastDoc = docPoint;
    render();
    return;
  }

  if (state.drag.type === "heal") {
    if (drawHealingStroke(state.drag.lastDoc, docPoint, state.drag)) {
      state.drag.painted = true;
    }
    state.drag.lastDoc = docPoint;
    render();
    return;
  }

  if (state.drag.type === "smudge") {
    if (drawSmudgeStroke(state.drag.lastDoc, docPoint)) {
      state.drag.painted = true;
    }
    state.drag.lastDoc = docPoint;
    render();
    return;
  }

  if (state.drag.type === "tone") {
    if (drawToneStroke(state.drag.lastDoc, docPoint)) {
      state.drag.painted = true;
    }
    state.drag.lastDoc = docPoint;
    render();
    return;
  }

  if (state.drag.type === "clone") {
    if (drawCloneStroke(state.drag.lastDoc, docPoint, state.drag)) {
      state.drag.painted = true;
    }
    state.drag.lastDoc = docPoint;
    render();
    return;
  }

  if (state.drag.type === "history-brush") {
    if (drawHistoryBrushStroke(state.drag.lastDoc, docPoint, state.drag)) {
      state.drag.painted = true;
    }
    state.drag.lastDoc = docPoint;
    render();
    return;
  }

  if (state.drag.type === "gradient") {
    state.drag.currentDoc = normalizePathPoint(docPoint);
    render();
    return;
  }

  if (state.drag.type === "shape") {
    state.drag.currentDoc = normalizePathPoint(docPoint);
    state.drag.constrain = event.shiftKey;
    render();
    return;
  }

  if (state.drag.type === "selection") {
    state.selectionRect = {
      x: state.drag.startDoc.x,
      y: state.drag.startDoc.y,
      w: docPoint.x - state.drag.startDoc.x,
      h: docPoint.y - state.drag.startDoc.y,
    };
    updateToolUi();
    render();
    return;
  }

  if (state.drag.type === "lasso") {
    const point = normalizePathPoint(docPoint);
    const last = state.drag.lastDoc;
    if (Math.hypot(point.x - last.x, point.y - last.y) >= 3) {
      state.drag.path.push(point);
      state.drag.lastDoc = point;
      render();
    }
    return;
  }

  if (state.drag.type === "crop") {
    updateCropRect(state.drag.handle, docPoint);
    render();
  }
}

function endPointer() {
  if (!state.drag) return;
  let lassoStatus = null;
  let gradientStatus = null;
  let shapeStatus = null;
  let selectionStatusText = null;
  let guideStatusText = null;
  let zoomStatusText = null;
  if (state.drag.type === "zoom") {
    zoomStatusText = finishZoomDrag();
  }
  if (state.drag.type === "guide") {
    guideStatusText = finishGuideDrag();
  }
  if (state.drag.type === "move" && state.drag.moved) {
    commitHistory(state.drag.duplicated ? "Alt-drag duplicate layer" : "Move layer");
  }
  if (state.drag.type === "free-transform") {
    commitHistory(state.drag.handle === "move" ? "Move layer" : state.drag.handle === "rotate" ? "Rotate free transform" : "Free transform");
  }
  if (state.drag.type === "paint" && state.drag.painted) {
    state.lastPaintDoc = state.drag.lastDoc;
    commitHistory(state.quickMaskMode ? (state.drag.erase ? "Quick mask erase" : "Quick mask paint") : state.drag.erase ? "Erase" : "Brush stroke");
  }
  if (state.drag.type === "heal" && state.drag.painted) {
    commitHistory("Spot healing");
  }
  if (state.drag.type === "smudge" && state.drag.painted) {
    commitHistory("Smudge");
  }
  if (state.drag.type === "tone" && state.drag.painted) {
    commitHistory(state.toneMode === "dodge" ? "Dodge" : "Burn");
  }
  if (state.drag.type === "clone" && state.drag.painted) {
    commitHistory("Clone stamp");
  }
  if (state.drag.type === "history-brush" && state.drag.painted) {
    state.lastPaintDoc = state.drag.lastDoc;
    commitHistory(`History Brush ${state.drag.sourceName}`);
  }
  if (state.drag.type === "gradient") {
    gradientStatus = applyGradientFill(state.drag.startDoc, state.drag.currentDoc)
      ? `${state.gradientMode === "radial" ? "Radial" : "Linear"} gradient applied`
      : "Gradient skipped";
  }
  if (state.drag.type === "shape") {
    const name = createShapeLayer(state.drag.startDoc, state.drag.currentDoc, state.drag.constrain);
    shapeStatus = name ? `${name} created` : "Shape skipped";
  }
  if (state.drag.type === "selection") {
    const rect = normalizeRect(state.selectionRect);
    const mask = rectSelectionMask(rect);
    restoreSelectionForCombine(state.drag.startSelection);
    if (mask && combineSelectionMask(mask, state.drag.mode, "rect", `Marquee selected ${Math.round(rect.w)} x ${Math.round(rect.h)} px`, "marquee selection")) {
      selectionStatusText = selectionDescription();
    }
  }
  if (state.drag.type === "lasso") {
    lassoStatus = commitLassoSelection(state.drag.path, state.drag.mode, state.drag.startSelection) ? selectionDescription() : "Lasso selection too small";
  }
  const shouldRestoreHand = state.drag.type === "pan" && restoreHandAfterDrag;
  state.drag = null;
  if (shouldRestoreHand && restoreTemporaryHandTool()) return;
  canvas.style.cursor = state.activeTool === "hand" ? "grab" : "crosshair";
  renderAll();
  if (selectionStatusText) updateStatus(selectionStatusText);
  if (lassoStatus) updateStatus(lassoStatus);
  if (gradientStatus) updateStatus(gradientStatus);
  if (shapeStatus) updateStatus(shapeStatus);
  if (guideStatusText) updateStatus(guideStatusText);
  if (zoomStatusText) updateStatus(zoomStatusText);
}

let activeCommandDialog = null;

const fillRoleOptions = [
  { value: "foreground", label: "Foreground" },
  { value: "background", label: "Background" },
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "gray", label: "50% Gray" },
];

const edgeOptions = [
  { value: "lower", label: "Lower" },
  { value: "upper", label: "Upper" },
];

function numberDialogField(name, label, value, min, max, step = 1, unit = "", integer = false) {
  return { type: "number", name, label, value, min, max, step, unit, integer };
}

function selectDialogField(name, label, value, options) {
  return { type: "select", name, label, value, options };
}

function checkboxDialogField(name, label, value) {
  return { type: "checkbox", name, label, value };
}

function textDialogField(name, label, value) {
  return { type: "text", name, label, value };
}

function restoreCanvasFromSnapshot(target, source) {
  const targetCtx = target.getContext("2d");
  targetCtx.clearRect(0, 0, target.width, target.height);
  targetCtx.drawImage(source, 0, 0);
}

function resolveDialogValue(value) {
  return typeof value === "function" ? value() : value;
}

function resolveDialogFields(fields) {
  return resolveDialogValue(fields).map((field) => ({
    ...field,
    value: resolveDialogValue(field.value),
    options: resolveDialogValue(field.options),
  }));
}

function dialogFieldOutputText(value, unit) {
  return `${value}${unit ? ` ${unit}` : ""}`;
}

function readCommandDialogValues(fields, controlsByName) {
  const dialogValues = {};
  for (const field of fields) {
    const control = controlsByName[field.name];
    if (field.type === "number") {
      const rawValue = control.number.value.trim();
      if (!rawValue) return { error: `${field.label} is required` };
      const number = Number(rawValue);
      if (!Number.isFinite(number)) return { error: `${field.label} must be a number` };
      const rounded = field.integer ? Math.round(number) : number;
      dialogValues[field.name] = clamp(rounded, field.min, field.max);
      continue;
    }
    if (field.type === "checkbox") {
      dialogValues[field.name] = control.input.checked;
      continue;
    }
    dialogValues[field.name] = control.input.value;
  }
  return { values: dialogValues };
}

function openCommandDialog(config) {
  if (activeCommandDialog) activeCommandDialog.close();

  const fields = resolveDialogFields(config.fields);
  const overlay = document.createElement("div");
  overlay.className = "command-dialog-backdrop";

  const dialog = document.createElement("form");
  dialog.className = "command-dialog-window";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-label", config.title);

  const header = document.createElement("div");
  header.className = "command-dialog-header";
  const title = document.createElement("h2");
  title.textContent = config.title;
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "command-dialog-close";
  closeButton.setAttribute("aria-label", "Close");
  closeButton.textContent = "x";
  header.append(title, closeButton);

  const body = document.createElement("div");
  body.className = "command-dialog-body";
  const controlsByName = {};

  const clampDialogPosition = (left, top) => {
    const rect = dialog.getBoundingClientRect();
    const padding = 8;
    return {
      left: clamp(left, padding, Math.max(padding, window.innerWidth - rect.width - padding)),
      top: clamp(top, padding, Math.max(padding, window.innerHeight - rect.height - padding)),
    };
  };

  const positionDialog = (left, top) => {
    const position = clampDialogPosition(left, top);
    dialog.style.left = `${position.left}px`;
    dialog.style.top = `${position.top}px`;
  };

  let previewFrame = 0;
  const scheduleCommandDialogPreview = () => {
    if (!config.preview) return;
    if (previewFrame) cancelAnimationFrame(previewFrame);
    previewFrame = requestAnimationFrame(() => {
      previewFrame = 0;
      if (!previewToggle.checked) {
        config.preview.reset();
        return;
      }
      const valuesResult = validatedDialogValues(true);
      if (!valuesResult) {
        config.preview.reset();
        return;
      }
      config.preview.apply(valuesResult);
    });
  };

  fields.forEach((field) => {
    const row = document.createElement("label");
    row.className = `command-dialog-field command-dialog-field-${field.type}`;

    const fieldHeader = document.createElement("span");
    fieldHeader.className = "command-dialog-field-header";
    const fieldLabel = document.createElement("span");
    fieldLabel.textContent = field.label;
    fieldHeader.append(fieldLabel);

    if (field.type === "number") {
      const output = document.createElement("output");
      output.textContent = dialogFieldOutputText(field.value, field.unit);
      fieldHeader.append(output);

      const range = document.createElement("input");
      range.type = "range";
      range.min = String(field.min);
      range.max = String(field.max);
      range.step = String(field.step);
      range.value = String(field.value);

      const number = document.createElement("input");
      number.type = "number";
      number.min = String(field.min);
      number.max = String(field.max);
      number.step = String(field.step);
      number.value = String(field.value);

      const syncNumericValue = (value, clampNow = true) => {
        if (String(value).trim() === "") return;
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) return;
        const rounded = field.integer ? Math.round(parsed) : parsed;
        const nextValue = clampNow ? clamp(rounded, field.min, field.max) : rounded;
        range.value = String(nextValue);
        number.value = String(nextValue);
        output.textContent = dialogFieldOutputText(nextValue, field.unit);
      };

      range.addEventListener("input", () => {
        syncNumericValue(range.value);
        scheduleCommandDialogPreview();
      });
      number.addEventListener("input", () => {
        syncNumericValue(number.value, false);
        scheduleCommandDialogPreview();
      });
      number.addEventListener("change", () => {
        syncNumericValue(number.value);
      });

      row.append(fieldHeader, range, number);
      controlsByName[field.name] = { field, range, number };
      body.append(row);
      return;
    }

    const input = document.createElement(field.type === "select" ? "select" : "input");
    if (field.type === "text") {
      input.type = "text";
      input.value = field.value;
      input.addEventListener("input", scheduleCommandDialogPreview);
    }
    if (field.type === "checkbox") {
      input.type = "checkbox";
      input.checked = Boolean(field.value);
      input.addEventListener("change", scheduleCommandDialogPreview);
    }
    if (field.type === "select") {
      field.options.forEach((option) => {
        const optionNode = document.createElement("option");
        optionNode.value = option.value;
        optionNode.textContent = option.label;
        input.append(optionNode);
      });
      input.value = field.value;
      input.addEventListener("change", scheduleCommandDialogPreview);
    }

    row.append(fieldHeader, input);
    controlsByName[field.name] = { field, input };
    body.append(row);
  });

  const error = document.createElement("p");
  error.className = "command-dialog-error";
  error.setAttribute("role", "alert");

  const footer = document.createElement("div");
  footer.className = "command-dialog-footer";
  let previewToggle = null;
  if (config.preview) {
    const previewLabel = document.createElement("label");
    previewLabel.className = "command-dialog-preview";
    previewToggle = document.createElement("input");
    previewToggle.type = "checkbox";
    previewToggle.checked = false;
    previewToggle.addEventListener("change", () => {
      if (previewToggle.checked) scheduleCommandDialogPreview();
      else config.preview.reset();
    });
    previewLabel.append(previewToggle, document.createTextNode("Preview"));
    footer.append(previewLabel);
  }

  const actionGroup = document.createElement("div");
  actionGroup.className = "command-dialog-actions";
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "command-dialog-button";
  cancelButton.textContent = "Cancel";
  const sendButton = document.createElement("button");
  sendButton.type = "submit";
  sendButton.className = "command-dialog-button command-dialog-send";
  sendButton.textContent = "Send";
  actionGroup.append(cancelButton, sendButton);
  footer.append(actionGroup);

  dialog.append(header, body, error, footer);
  overlay.append(dialog);
  document.body.append(overlay);

  let closed = false;

  function showError(message = "") {
    error.textContent = message;
    dialog.classList.toggle("has-error", Boolean(message));
  }

  function validatedDialogValues(forPreview = false) {
    const result = readCommandDialogValues(fields, controlsByName);
    if (result.error) {
      if (!forPreview) showError(result.error);
      return null;
    }
    const validation = config.validate?.(result.values);
    if (validation) {
      if (!forPreview) showError(validation);
      return null;
    }
    showError("");
    return result.values;
  }

  function closeDialog(resetPreview = true) {
    if (closed) return;
    closed = true;
    if (previewFrame) cancelAnimationFrame(previewFrame);
    if (resetPreview && config.preview) config.preview.reset();
    window.removeEventListener("mousemove", handleMouseMoveDialogDrag);
    window.removeEventListener("mouseup", handleMouseUpDialogDrag);
    overlay.remove();
    activeCommandDialog = null;
  }

  function sendDialog() {
    const valuesResult = validatedDialogValues(false);
    if (!valuesResult) return;
    if (config.preview) config.preview.reset();
    closeDialog(false);
    config.onSend(valuesResult);
  }

  closeButton.addEventListener("click", () => closeDialog());
  cancelButton.addEventListener("click", () => closeDialog());
  overlay.addEventListener("pointerdown", (event) => {
    if (event.target === overlay) closeDialog();
  });
  dialog.addEventListener("submit", (event) => {
    event.preventDefault();
    sendDialog();
  });
  dialog.addEventListener("keydown", (event) => {
    event.stopPropagation();
    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog();
    }
  });

  activeCommandDialog = { close: closeDialog };
  const initialRect = dialog.getBoundingClientRect();
  positionDialog((window.innerWidth - initialRect.width) / 2, (window.innerHeight - initialRect.height) / 2);

  let dragState = null;
  const beginDialogDrag = (event, source) => {
    if (event.target.closest("button")) return;
    if (source === "mouse" && event.button !== 0) return;
    const rect = dialog.getBoundingClientRect();
    dragState = {
      source,
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    if (source === "pointer") header.setPointerCapture(event.pointerId);
    dialog.classList.add("command-dialog-dragging");
    event.preventDefault();
  };
  const moveDialogDrag = (event, source) => {
    if (!dragState || dragState.source !== source) return;
    if (source === "pointer" && dragState.pointerId !== event.pointerId) return;
    positionDialog(event.clientX - dragState.offsetX, event.clientY - dragState.offsetY);
  };
  const endDialogDrag = (event, source) => {
    if (!dragState || dragState.source !== source) return;
    if (source === "pointer" && dragState.pointerId !== event.pointerId) return;
    dragState = null;
    dialog.classList.remove("command-dialog-dragging");
  };
  header.addEventListener("pointerdown", (event) => {
    beginDialogDrag(event, "pointer");
  });
  header.addEventListener("pointermove", (event) => {
    moveDialogDrag(event, "pointer");
  });
  header.addEventListener("pointerup", (event) => endDialogDrag(event, "pointer"));
  header.addEventListener("pointercancel", (event) => endDialogDrag(event, "pointer"));
  header.addEventListener("mousedown", (event) => {
    if (dragState) return;
    beginDialogDrag(event, "mouse");
  });
  const handleMouseMoveDialogDrag = (event) => {
    moveDialogDrag(event, "mouse");
  };
  const handleMouseUpDialogDrag = (event) => {
    endDialogDrag(event, "mouse");
  };
  window.addEventListener("mousemove", handleMouseMoveDialogDrag);
  window.addEventListener("mouseup", handleMouseUpDialogDrag);

  const firstInput = dialog.querySelector("input:not([type='checkbox']), select");
  firstInput?.focus();
  if (firstInput instanceof HTMLInputElement && firstInput.type !== "range") firstInput.select();
}

function restoreSelectionDialogState(selection) {
  if (selection) restoreSelectionState(selection);
  else clearSelectionState();
  controls.selectionFeather.value = state.selectionFeather;
  values.selectionFeather.textContent = `${state.selectionFeather} px`;
  updateToolUi();
  render();
}

function createSelectionDialogPreview(applyPreview) {
  const selection = currentSelectionState();
  return {
    apply(dialogValues) {
      restoreSelectionDialogState(selection);
      applyPreview(dialogValues);
    },
    reset() {
      restoreSelectionDialogState(selection);
    },
  };
}

function createColorRangeDialogPreview() {
  const selection = currentSelectionState();
  const tolerance = state.wandTolerance;
  return {
    apply(dialogValues) {
      restoreSelectionDialogState(selection);
      setWandTolerance(dialogValues.tolerance);
      selectColorRange(dialogValues.tolerance);
      updateStatus(`Color Range preview at ${state.wandTolerance}`);
    },
    reset() {
      restoreSelectionDialogState(selection);
      setWandTolerance(tolerance);
    },
  };
}

function applyStrokeSelectionToTarget(layer, target, width, role) {
  const strokeMask = selectionStrokeMask(width);
  if (!strokeMask) return false;
  const local = localDocumentMask(strokeMask, target, layer);
  const isMask = target === layer.mask;
  const color = fillColorForRole(role);
  const fill = makeCanvas(target.width, target.height);
  const fillCtx = fill.getContext("2d");
  fillCtx.globalAlpha = isMask ? maskAlphaForColor(color) : state.brush.opacity;
  fillCtx.fillStyle = isMask ? "#ffffff" : color;
  fillCtx.fillRect(0, 0, fill.width, fill.height);
  fillCtx.globalAlpha = 1;
  fillCtx.globalCompositeOperation = "destination-in";
  fillCtx.drawImage(local, 0, 0);

  const targetCtx = target.getContext("2d");
  preserveLockedTransparency(layer, target, () => {
    if (isMask) {
      targetCtx.save();
      targetCtx.globalCompositeOperation = "destination-out";
      targetCtx.drawImage(local, 0, 0);
      targetCtx.restore();
    }
    targetCtx.drawImage(fill, 0, 0);
  });
  return true;
}

function createStrokeDialogPreview() {
  const layer = activeLayer();
  if (!layer || !layer.visible) return null;
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return false;
  const original = cloneCanvas(target);
  return {
    apply(dialogValues) {
      restoreCanvasFromSnapshot(target, original);
      const width = Math.min(Math.round(dialogValues.width), 128);
      const applied = applyStrokeSelectionToTarget(layer, target, width, dialogValues.role);
      render();
      updateStatus(applied ? `Stroke ${width}px preview` : "No selection to stroke");
    },
    reset() {
      restoreCanvasFromSnapshot(target, original);
      render();
    },
  };
}

function createLayerProcessorDialogPreview(spec) {
  const layer = activeLayer();
  if (!layer) return null;
  if (layer.type === "adjustment") {
    updateStatus(`Select a pixel layer for ${spec.title}`);
    return false;
  }
  const target = state.paintTarget === "mask" && layer.mask ? layer.mask : layer.canvas;
  if (guardPixelEditing(layer, target === layer.canvas)) return false;
  const original = cloneCanvas(target);
  const useAlpha = target === layer.mask;
  return {
    apply(dialogValues) {
      restoreCanvasFromSnapshot(target, original);
      const filtered = spec.layerProcessor(original, dialogValues, useAlpha);
      if (!filtered) {
        render();
        updateStatus(`${spec.title} unchanged`);
        return;
      }
      const scope = preserveLockedTransparency(layer, target, () => replaceFilteredTarget(target, layer, filtered));
      render();
      updateStatus(scope ? `${spec.title} preview` : "Selection is empty");
    },
    reset() {
      restoreCanvasFromSnapshot(target, original);
      render();
    },
  };
}

function createMenuCommandDialogPreview(spec) {
  if (spec.layerProcessor) return createLayerProcessorDialogPreview(spec);
  if (spec.selectionPreview) return createSelectionDialogPreview(spec.selectionPreview);
  if (spec.colorRangePreview) return createColorRangeDialogPreview();
  if (spec.strokePreview) return createStrokeDialogPreview();
  return null;
}

function documentSizeDialog(title) {
  return {
    title,
    fields: () => [
      numberDialogField("width", "Width", state.doc.width, 1, 8192, 1, "px", true),
      numberDialogField("height", "Height", state.doc.height, 1, 8192, 1, "px", true),
    ],
    serialize: (dialogValues) => `${dialogValues.width} x ${dialogValues.height}`,
  };
}

function singleValueLayerDialog(title, field, processor) {
  return {
    title,
    fields: [field],
    layerProcessor: processor,
    serialize: (dialogValues) => String(dialogValues[field.name]),
  };
}

function layerOptionsDialog(title, fields, processor, serialize, validate = null) {
  return { title, fields, layerProcessor: processor, serialize, validate };
}

const menuCommandDialogs = {
  "new-document": documentSizeDialog("New Document"),
  "fill-dialog": {
    title: "Fill",
    fields: [selectDialogField("role", "Contents", "foreground", fillRoleOptions)],
    serialize: (dialogValues) => dialogValues.role,
  },
  "stroke-selection": {
    title: "Stroke",
    fields: [
      numberDialogField("width", "Width", 8, 1, 128, 1, "px", true),
      selectDialogField("role", "Fill", "foreground", fillRoleOptions),
    ],
    strokePreview: true,
    serialize: (dialogValues) => `${dialogValues.width} ${dialogValues.role}`,
  },
  "image-size": documentSizeDialog("Image Size"),
  "canvas-size": documentSizeDialog("Canvas Size"),
  levels: layerOptionsDialog(
    "Levels",
    [
      numberDialogField("black", "Black Input", 0, 0, 254, 1, "", true),
      numberDialogField("gamma", "Gamma", 1, 0.1, 9.99, 0.01),
      numberDialogField("white", "White Input", 255, 1, 255, 1, "", true),
    ],
    (source, dialogValues, useAlpha) => levelsCanvas(source, dialogValues, useAlpha),
    (dialogValues) => `${dialogValues.black} ${dialogValues.gamma} ${dialogValues.white}`,
    (dialogValues) => (dialogValues.black >= dialogValues.white ? "Black input must be below white input" : null),
  ),
  curves: layerOptionsDialog(
    "Curves",
    [
      numberDialogField("shadow", "Shadow Output", 0, 0, 255, 1, "", true),
      numberDialogField("midtone", "Midtone Output", 160, 0, 255, 1, "", true),
      numberDialogField("highlight", "Highlight Output", 255, 0, 255, 1, "", true),
    ],
    (source, dialogValues, useAlpha) => curvesCanvas(source, [
      { x: 0, y: dialogValues.shadow },
      { x: 128, y: dialogValues.midtone },
      { x: 255, y: dialogValues.highlight },
    ], useAlpha),
    (dialogValues) => `0:${dialogValues.shadow} 128:${dialogValues.midtone} 255:${dialogValues.highlight}`,
  ),
  "black-white": layerOptionsDialog(
    "Black & White",
    [
      numberDialogField("red", "Red Weight", 30, 0, 200, 1, "", true),
      numberDialogField("green", "Green Weight", 59, 0, 200, 1, "", true),
      numberDialogField("blue", "Blue Weight", 11, 0, 200, 1, "", true),
    ],
    (source, dialogValues, useAlpha) => blackWhiteCanvas(source, dialogValues, useAlpha),
    (dialogValues) => `${dialogValues.red} ${dialogValues.green} ${dialogValues.blue}`,
  ),
  "hue-saturation": layerOptionsDialog(
    "Hue/Saturation",
    [
      numberDialogField("hue", "Hue", 0, -180, 180, 1, "deg", true),
      numberDialogField("saturation", "Saturation", 20, -100, 100, 1, "%", true),
      numberDialogField("lightness", "Lightness", 0, -100, 100, 1, "%", true),
    ],
    (source, dialogValues, useAlpha) => hueSaturationCanvas(source, dialogValues, useAlpha),
    (dialogValues) => `${dialogValues.hue} ${dialogValues.saturation} ${dialogValues.lightness}`,
  ),
  vibrance: layerOptionsDialog(
    "Vibrance",
    [
      numberDialogField("vibrance", "Vibrance", 35, -100, 100, 1, "%", true),
      numberDialogField("saturation", "Saturation", 0, -100, 100, 1, "%", true),
    ],
    (source, dialogValues, useAlpha) => vibranceCanvas(source, dialogValues, useAlpha),
    (dialogValues) => `${dialogValues.vibrance} ${dialogValues.saturation}`,
  ),
  "color-balance": layerOptionsDialog(
    "Color Balance",
    [
      numberDialogField("cyanRed", "Cyan / Red", 15, -100, 100, 1, "", true),
      numberDialogField("magentaGreen", "Magenta / Green", 0, -100, 100, 1, "", true),
      numberDialogField("yellowBlue", "Yellow / Blue", -10, -100, 100, 1, "", true),
    ],
    (source, dialogValues, useAlpha) => colorBalanceCanvas(source, dialogValues, useAlpha),
    (dialogValues) => `${dialogValues.cyanRed} ${dialogValues.magentaGreen} ${dialogValues.yellowBlue}`,
  ),
  exposure: layerOptionsDialog(
    "Exposure",
    [
      numberDialogField("exposure", "Exposure", 1, -5, 5, 0.01),
      numberDialogField("offset", "Offset", 0, -1, 1, 0.01),
      numberDialogField("gamma", "Gamma", 1, 0.1, 9.99, 0.01),
    ],
    (source, dialogValues, useAlpha) => exposureCanvas(source, dialogValues, useAlpha),
    (dialogValues) => `${dialogValues.exposure} ${dialogValues.offset} ${dialogValues.gamma}`,
  ),
  "shadows-highlights": layerOptionsDialog(
    "Shadows/Highlights",
    [
      numberDialogField("shadows", "Shadows", 35, 0, 100, 1, "%", true),
      numberDialogField("highlights", "Highlights", 20, 0, 100, 1, "%", true),
    ],
    (source, dialogValues, useAlpha) => shadowsHighlightsCanvas(source, dialogValues, useAlpha),
    (dialogValues) => `${dialogValues.shadows} ${dialogValues.highlights}`,
  ),
  threshold: singleValueLayerDialog("Threshold", numberDialogField("threshold", "Level", 128, 0, 255, 1, "", true), (source, dialogValues, useAlpha) => thresholdCanvas(source, dialogValues.threshold, useAlpha)),
  posterize: singleValueLayerDialog("Posterize", numberDialogField("levels", "Levels", 4, 2, 255, 1, "", true), (source, dialogValues, useAlpha) => posterizeCanvas(source, dialogValues.levels, useAlpha)),
  "filter-blur": singleValueLayerDialog("Gaussian Blur", numberDialogField("radius", "Radius", 4, 0.1, 100, 0.1, "px"), (source, dialogValues, useAlpha) => gaussianBlurCanvas(source, dialogValues.radius, useAlpha)),
  "filter-box-blur": singleValueLayerDialog("Box Blur", numberDialogField("radius", "Radius", 6, 0.1, 100, 0.1, "px"), (source, dialogValues, useAlpha) => boxBlurFilterCanvas(source, dialogValues.radius, useAlpha)),
  "filter-surface-blur": layerOptionsDialog("Surface Blur", [numberDialogField("radius", "Radius", 3, 1, 20, 1, "px", true), numberDialogField("threshold", "Threshold", 20, 0, 255, 1)], (source, dialogValues, useAlpha) => surfaceBlurCanvas(source, dialogValues, useAlpha), (dialogValues) => `${dialogValues.radius} ${dialogValues.threshold}`),
  "filter-smart-blur": layerOptionsDialog("Smart Blur", [numberDialogField("radius", "Radius", 4, 1, 20, 1, "px", true), numberDialogField("threshold", "Threshold", 24, 0, 255, 1), numberDialogField("quality", "Quality", 2, 1, 3, 1, "", true)], (source, dialogValues, useAlpha) => smartBlurCanvas(source, dialogValues, useAlpha), (dialogValues) => `${dialogValues.radius} ${dialogValues.threshold} ${dialogValues.quality}`),
  "filter-radial-blur": singleValueLayerDialog("Radial Blur", numberDialogField("amount", "Amount", 35, 0, 100, 1, "%"), (source, dialogValues, useAlpha) => radialBlurCanvas(source, dialogValues.amount, useAlpha)),
  "filter-twirl": singleValueLayerDialog("Twirl", numberDialogField("angle", "Angle", 120, -999, 999, 1, "deg"), (source, dialogValues, useAlpha) => twirlCanvas(source, dialogValues.angle, useAlpha)),
  "filter-pinch": singleValueLayerDialog("Pinch", numberDialogField("amount", "Amount", 50, -100, 100, 1, "%"), (source, dialogValues, useAlpha) => pinchCanvas(source, dialogValues.amount, useAlpha)),
  "filter-ripple": layerOptionsDialog("Ripple", [numberDialogField("amount", "Amount", 30, -100, 100, 1), numberDialogField("wavelength", "Wavelength", 16, 2, 256, 1, "px")], (source, dialogValues, useAlpha) => rippleCanvas(source, dialogValues, useAlpha), (dialogValues) => `${dialogValues.amount} ${dialogValues.wavelength}`),
  "filter-spherize": singleValueLayerDialog("Spherize", numberDialogField("amount", "Amount", 50, -100, 100, 1, "%"), (source, dialogValues, useAlpha) => spherizeCanvas(source, dialogValues.amount, useAlpha)),
  "filter-zigzag": layerOptionsDialog("ZigZag", [numberDialogField("amount", "Amount", 40, -100, 100, 1), numberDialogField("ridges", "Ridges", 6, 1, 32, 1, "", true)], (source, dialogValues, useAlpha) => zigZagCanvas(source, dialogValues, useAlpha), (dialogValues) => `${dialogValues.amount} ${dialogValues.ridges}`),
  "filter-wave": layerOptionsDialog("Wave", [numberDialogField("xAmplitude", "X Amplitude", 8, -128, 128, 1, "px"), numberDialogField("yAmplitude", "Y Amplitude", 4, -128, 128, 1, "px"), numberDialogField("wavelength", "Wavelength", 24, 2, 512, 1, "px")], (source, dialogValues, useAlpha) => waveCanvas(source, dialogValues, useAlpha), (dialogValues) => `${dialogValues.xAmplitude} ${dialogValues.yAmplitude} ${dialogValues.wavelength}`),
  "filter-polar-coordinates": layerOptionsDialog("Polar Coordinates", [selectDialogField("mode", "Mode", "rect", [{ value: "rect", label: "Rect to Polar" }, { value: "polar", label: "Polar to Rect" }])], (source, dialogValues, useAlpha) => polarCoordinatesCanvas(source, dialogValues.mode, useAlpha), (dialogValues) => dialogValues.mode),
  "filter-shear": singleValueLayerDialog("Shear", numberDialogField("amount", "Amount", 35, -100, 100, 1), (source, dialogValues, useAlpha) => shearCanvas(source, dialogValues.amount, useAlpha)),
  "filter-motion-blur": layerOptionsDialog("Motion Blur", [numberDialogField("angle", "Angle", 0, -360, 360, 1, "deg"), numberDialogField("distance", "Distance", 12, 1, 200, 1, "px")], (source, dialogValues, useAlpha) => motionBlurCanvas(source, dialogValues, useAlpha), (dialogValues) => `${dialogValues.angle} ${dialogValues.distance}`),
  "filter-unsharp-mask": layerOptionsDialog("Unsharp Mask", [numberDialogField("amount", "Amount", 150, 1, 500, 1, "%"), numberDialogField("radius", "Radius", 1.5, 0.1, 100, 0.1, "px"), numberDialogField("threshold", "Threshold", 0, 0, 255, 1, "", true)], (source, dialogValues, useAlpha) => unsharpMaskCanvas(source, dialogValues, useAlpha), (dialogValues) => `${dialogValues.amount} ${dialogValues.radius} ${dialogValues.threshold}`),
  "filter-smart-sharpen": layerOptionsDialog("Smart Sharpen", [numberDialogField("amount", "Amount", 150, 1, 500, 1, "%"), numberDialogField("radius", "Radius", 1.5, 0.1, 100, 0.1, "px"), numberDialogField("reduceNoise", "Reduce Noise", 20, 0, 100, 1, "%")], (source, dialogValues, useAlpha) => smartSharpenCanvas(source, dialogValues, useAlpha), (dialogValues) => `${dialogValues.amount} ${dialogValues.radius} ${dialogValues.reduceNoise}`),
  "filter-high-pass": singleValueLayerDialog("High Pass", numberDialogField("radius", "Radius", 3, 0.1, 100, 0.1, "px"), (source, dialogValues, useAlpha) => highPassCanvas(source, dialogValues.radius, useAlpha)),
  "filter-oil-paint": layerOptionsDialog("Oil Paint", [numberDialogField("radius", "Radius", 3, 1, 8, 1, "px", true), numberDialogField("intensity", "Intensity", 8, 1, 20, 1, "", true)], (source, dialogValues, useAlpha) => oilPaintCanvas(source, dialogValues, useAlpha), (dialogValues) => `${dialogValues.radius} ${dialogValues.intensity}`),
  "filter-glowing-edges": layerOptionsDialog("Glowing Edges", [numberDialogField("width", "Width", 2, 1, 8, 1, "px", true), numberDialogField("brightness", "Brightness", 8, 1, 20, 1), numberDialogField("smoothness", "Smoothness", 5, 0, 10, 1, "", true)], (source, dialogValues, useAlpha) => glowingEdgesCanvas(source, dialogValues, useAlpha), (dialogValues) => `${dialogValues.width} ${dialogValues.brightness} ${dialogValues.smoothness}`),
  "filter-emboss": layerOptionsDialog("Emboss", [numberDialogField("angle", "Angle", 135, -360, 360, 1, "deg"), numberDialogField("height", "Height", 2, 1, 16, 1, "px", true), numberDialogField("amount", "Amount", 100, 1, 500, 1, "%")], (source, dialogValues, useAlpha) => embossCanvas(source, dialogValues, useAlpha), (dialogValues) => `${dialogValues.angle} ${dialogValues.height} ${dialogValues.amount}`),
  "filter-diffuse": layerOptionsDialog("Diffuse", [selectDialogField("mode", "Mode", "normal", [{ value: "normal", label: "Normal" }, { value: "darken", label: "Darken" }, { value: "lighten", label: "Lighten" }])], (source, dialogValues, useAlpha) => diffuseCanvas(source, dialogValues.mode, useAlpha), (dialogValues) => dialogValues.mode),
  "filter-wind": layerOptionsDialog("Wind", [selectDialogField("direction", "Direction", "right", [{ value: "right", label: "Right" }, { value: "left", label: "Left" }]), selectDialogField("method", "Method", "wind", [{ value: "wind", label: "Wind" }, { value: "blast", label: "Blast" }, { value: "stagger", label: "Stagger" }])], (source, dialogValues, useAlpha) => windCanvas(source, dialogValues, useAlpha), (dialogValues) => `${dialogValues.direction} ${dialogValues.method}`),
  "filter-trace-contour": layerOptionsDialog("Trace Contour", [numberDialogField("level", "Level", 128, 0, 255, 1, "", true), selectDialogField("edge", "Edge", "lower", edgeOptions)], (source, dialogValues, useAlpha) => traceContourCanvas(source, dialogValues, useAlpha), (dialogValues) => `${dialogValues.level} ${dialogValues.edge}`),
  "filter-extrude": layerOptionsDialog("Extrude", [selectDialogField("type", "Type", "blocks", [{ value: "blocks", label: "Blocks" }, { value: "pyramids", label: "Pyramids" }]), numberDialogField("size", "Size", 8, 2, 128, 1, "px", true), numberDialogField("depth", "Depth", 12, 1, 128, 1, "", true), selectDialogField("face", "Face", "solid", [{ value: "solid", label: "Solid" }, { value: "original", label: "Original" }])], (source, dialogValues, useAlpha) => extrudeCanvas(source, { ...dialogValues, solid: dialogValues.face === "solid" }, useAlpha), (dialogValues) => `${dialogValues.type} ${dialogValues.size} ${dialogValues.depth} ${dialogValues.face}`),
  "filter-tiles": layerOptionsDialog("Tiles", [numberDialogField("tiles", "Tile Count", 8, 1, 99, 1, "", true), numberDialogField("offset", "Max Offset", 12, 0, 256, 1, "px", true), selectDialogField("fill", "Fill Empty Area", "background", [{ value: "background", label: "Background" }, { value: "foreground", label: "Foreground" }, { value: "inverse", label: "Inverse Image" }, { value: "unaltered", label: "Unaltered" }])], (source, dialogValues, useAlpha) => tilesCanvas(source, { ...dialogValues, foreground: state.brush.color, background: state.backgroundColor }, useAlpha), (dialogValues) => `${dialogValues.tiles} ${dialogValues.offset} ${dialogValues.fill}`),
  "filter-lens-flare": layerOptionsDialog("Lens Flare", [numberDialogField("brightness", "Brightness", 100, 1, 300, 1, "%"), numberDialogField("x", "X Position", 50, 0, 100, 1, "%"), numberDialogField("y", "Y Position", 50, 0, 100, 1, "%"), selectDialogField("type", "Type", "zoom", () => LENS_FLARE_TYPES.map((type) => ({ value: type.key, label: type.label })))], (source, dialogValues, useAlpha) => lensFlareCanvas(source, dialogValues, useAlpha), (dialogValues) => `${dialogValues.brightness} ${dialogValues.x} ${dialogValues.y} ${dialogValues.type}`),
  "filter-fibers": layerOptionsDialog("Fibers", [numberDialogField("variance", "Variance", 16, 1, 64, 1), numberDialogField("strength", "Strength", 4, 1, 64, 1)], (source, dialogValues, useAlpha) => fibersCanvas(source, { ...dialogValues, foreground: state.brush.color, background: state.backgroundColor }, useAlpha), (dialogValues) => `${dialogValues.variance} ${dialogValues.strength}`),
  "filter-lighting-effects": layerOptionsDialog("Lighting Effects", [numberDialogField("intensity", "Intensity", 75, -100, 200, 1, "%"), numberDialogField("x", "X Position", 50, 0, 100, 1, "%"), numberDialogField("y", "Y Position", 50, 0, 100, 1, "%"), numberDialogField("radius", "Radius", 55, 1, 200, 1, "%"), numberDialogField("ambient", "Ambient", 25, 0, 100, 1, "%")], (source, dialogValues, useAlpha) => lightingEffectsCanvas(source, { ...dialogValues, color: state.brush.color }, useAlpha), (dialogValues) => `${dialogValues.intensity} ${dialogValues.x} ${dialogValues.y} ${dialogValues.radius} ${dialogValues.ambient}`),
  "filter-noise": layerOptionsDialog("Add Noise", [numberDialogField("amount", "Amount", 12, 0.1, 400, 0.1, "%"), selectDialogField("distribution", "Distribution", "uniform", [{ value: "uniform", label: "Uniform" }, { value: "gaussian", label: "Gaussian" }]), checkboxDialogField("monochromatic", "Monochromatic", true)], (source, dialogValues, useAlpha) => noiseCanvas(source, dialogValues, useAlpha), (dialogValues) => `${dialogValues.amount} ${dialogValues.distribution} ${dialogValues.monochromatic ? "mono" : "color"}`),
  "filter-reduce-noise": layerOptionsDialog("Reduce Noise", [numberDialogField("strength", "Strength", 6, 1, 10, 1), numberDialogField("preserve", "Preserve Details", 45, 0, 100, 1, "%")], (source, dialogValues, useAlpha) => reduceNoiseCanvas(source, dialogValues, useAlpha), (dialogValues) => `${dialogValues.strength} ${dialogValues.preserve}`),
  "filter-dust-scratches": layerOptionsDialog("Dust & Scratches", [numberDialogField("radius", "Radius", 1, 1, 20, 1, "px", true), numberDialogField("threshold", "Threshold", 24, 0, 255, 1)], (source, dialogValues, useAlpha) => dustScratchesCanvas(source, dialogValues, useAlpha), (dialogValues) => `${dialogValues.radius} ${dialogValues.threshold}`),
  "filter-median": singleValueLayerDialog("Median", numberDialogField("radius", "Radius", 1, 1, 20, 1, "px", true), (source, dialogValues, useAlpha) => medianCanvas(source, dialogValues.radius, useAlpha)),
  "filter-color-halftone": singleValueLayerDialog("Color Halftone", numberDialogField("radius", "Max Radius", 8, 2, 64, 1, "px", true), (source, dialogValues, useAlpha) => colorHalftoneCanvas(source, dialogValues.radius, useAlpha)),
  "filter-crystallize": singleValueLayerDialog("Crystallize", numberDialogField("cellSize", "Cell Size", 16, 2, 256, 1, "px", true), (source, dialogValues, useAlpha) => crystallizeCanvas(source, dialogValues.cellSize, useAlpha)),
  "filter-pointillize": singleValueLayerDialog("Pointillize", numberDialogField("cellSize", "Cell Size", 12, 2, 256, 1, "px", true), (source, dialogValues, useAlpha) => pointillizeCanvas(source, dialogValues.cellSize, useAlpha)),
  "filter-mezzotint": layerOptionsDialog("Mezzotint", [selectDialogField("type", "Type", "fine-dots", () => MEZZOTINT_TYPES.map((type) => ({ value: type.key, label: type.label })))], (source, dialogValues, useAlpha) => mezzotintCanvas(source, parseMezzotintType(dialogValues.type), useAlpha), (dialogValues) => dialogValues.type),
  "filter-mosaic": singleValueLayerDialog("Mosaic", numberDialogField("cellSize", "Cell Size", 12, 2, 256, 1, "px", true), (source, dialogValues, useAlpha) => mosaicCanvas(source, dialogValues.cellSize, useAlpha)),
  "filter-offset": layerOptionsDialog("Offset", [numberDialogField("x", "Horizontal", 24, -10000, 10000, 1, "px", true), numberDialogField("y", "Vertical", 0, -10000, 10000, 1, "px", true)], (source, dialogValues, useAlpha) => offsetWrapCanvas(source, dialogValues, useAlpha), (dialogValues) => `${dialogValues.x} ${dialogValues.y}`),
  "filter-maximum": singleValueLayerDialog("Maximum", numberDialogField("radius", "Radius", 1, 1, 20, 1, "px", true), (source, dialogValues, useAlpha) => extremaCanvas(source, dialogValues.radius, "maximum", useAlpha)),
  "filter-minimum": singleValueLayerDialog("Minimum", numberDialogField("radius", "Radius", 1, 1, 20, 1, "px", true), (source, dialogValues, useAlpha) => extremaCanvas(source, dialogValues.radius, "minimum", useAlpha)),
  "rename-layer": {
    title: "Rename Layer",
    fields: () => [textDialogField("name", "Name", activeLayer()?.name || "")],
    serialize: (dialogValues) => dialogValues.name,
  },
  "color-range": {
    title: "Color Range",
    fields: () => [numberDialogField("tolerance", `Tolerance for ${state.brush.color}`, state.wandTolerance, Number(controls.wandTolerance.min), Number(controls.wandTolerance.max), 1, "", true)],
    colorRangePreview: true,
    serialize: (dialogValues) => String(dialogValues.tolerance),
  },
  "feather-selection": {
    title: "Feather Selection",
    fields: () => [numberDialogField("amount", "Radius", state.selectionFeather || 8, Number(controls.selectionFeather.min), Number(controls.selectionFeather.max), 1, "px", true)],
    selectionPreview(dialogValues) {
      state.selectionFeather = clamp(Math.round(dialogValues.amount), Number(controls.selectionFeather.min), Number(controls.selectionFeather.max));
      controls.selectionFeather.value = state.selectionFeather;
      values.selectionFeather.textContent = `${state.selectionFeather} px`;
      updateToolUi();
      render();
      updateStatus(`Feather ${state.selectionFeather}px preview`);
    },
    serialize: (dialogValues) => String(dialogValues.amount),
  },
  "smooth-selection": {
    title: "Smooth Selection",
    fields: [numberDialogField("amount", "Radius", 8, 1, 32, 1, "px", true)],
    selectionPreview: (dialogValues) => smoothSelection(dialogValues.amount),
    serialize: (dialogValues) => String(dialogValues.amount),
  },
  "expand-selection": {
    title: "Expand Selection",
    fields: [numberDialogField("amount", "Amount", 8, 1, 32, 1, "px", true)],
    selectionPreview: (dialogValues) => modifySelection(dialogValues.amount),
    serialize: (dialogValues) => String(dialogValues.amount),
  },
  "contract-selection": {
    title: "Contract Selection",
    fields: [numberDialogField("amount", "Amount", 8, 1, 32, 1, "px", true)],
    selectionPreview: (dialogValues) => modifySelection(-dialogValues.amount),
    serialize: (dialogValues) => String(dialogValues.amount),
  },
  "border-selection": {
    title: "Border Selection",
    fields: [numberDialogField("amount", "Width", 8, 1, 32, 1, "px", true)],
    selectionPreview: (dialogValues) => borderSelection(dialogValues.amount),
    serialize: (dialogValues) => String(dialogValues.amount),
  },
};

function runWithPromptDialogValue(value, action) {
  const previousPrompt = window.prompt;
  window.prompt = () => value;
  try {
    action();
  } finally {
    window.prompt = previousPrompt;
  }
}

function openMenuCommandDialog(command, action) {
  const spec = menuCommandDialogs[command];
  if (!spec) return false;
  const preview = createMenuCommandDialogPreview(spec);
  if (preview === false) return true;
  openCommandDialog({
    title: spec.title,
    fields: spec.fields,
    preview,
    validate: spec.validate,
    onSend(dialogValues) {
      runWithPromptDialogValue(spec.serialize(dialogValues), action);
    },
  });
  return true;
}

function executeCommand(command) {
  const commands = {
    "new-document": newDocument,
    open: () => fileInput.click(),
    "place-embedded": () => placeInput.click(),
    "save-png": () => exportImage("image/png"),
    "save-jpg": () => exportImage("image/jpeg"),
    "save-psd": exportPsd,
    "reset-document": resetDocument,
    undo,
    redo,
    "step-backward": undo,
    "step-forward": redo,
    cut: () => copyPixels({ cut: true }),
    copy: () => copyPixels(),
    "copy-merged": () => copyPixels({ merged: true }),
    paste: pastePixels,
    "paste-into": pasteIntoSelection,
    "delete-selection": deletePixels,
    "fill-dialog": promptFillPixels,
    "content-aware-fill": contentAwareFillSelection,
    "stroke-selection": promptStrokeSelection,
    "fill-selection": () => fillPixels("foreground"),
    "fill-background": () => fillPixels("background"),
    "image-size": resizeImageSize,
    "canvas-size": resizeCanvasSize,
    levels: applyLevels,
    curves: applyCurves,
    "auto-tone": applyAutoTone,
    "auto-color": applyAutoColor,
    "auto-contrast": applyAutoContrast,
    invert: applyInvert,
    desaturate: applyDesaturate,
    "black-white": applyBlackWhite,
    "hue-saturation": applyHueSaturation,
    vibrance: applyVibrance,
    "color-balance": applyColorBalance,
    exposure: applyExposure,
    "shadows-highlights": applyShadowsHighlights,
    threshold: applyThreshold,
    posterize: applyPosterize,
    "trim-transparent": trimTransparentPixels,
    "reveal-all": revealAll,
    "rotate-image-180": rotateImageHalf,
    "rotate-image-cw": () => rotateImage(1),
    "rotate-image-ccw": () => rotateImage(-1),
    "flip-image-horizontal": () => flipImage("x"),
    "flip-image-vertical": () => flipImage("y"),
    "reset-adjustments": resetCurrentAdjustments,
    "apply-filters": applyVisibleFilters,
    "filter-blur": applyGaussianBlurFilter,
    "filter-box-blur": applyBoxBlurFilter,
    "filter-average": applyAverageFilter,
    "filter-surface-blur": applySurfaceBlurFilter,
    "filter-smart-blur": applySmartBlurFilter,
    "filter-radial-blur": applyRadialBlurFilter,
    "filter-twirl": applyTwirlFilter,
    "filter-pinch": applyPinchFilter,
    "filter-ripple": applyRippleFilter,
    "filter-spherize": applySpherizeFilter,
    "filter-zigzag": applyZigZagFilter,
    "filter-wave": applyWaveFilter,
    "filter-polar-coordinates": applyPolarCoordinatesFilter,
    "filter-shear": applyShearFilter,
    "filter-motion-blur": applyMotionBlurFilter,
    "filter-sharpen": () => applyLayerFilter("sharpen"),
    "filter-unsharp-mask": applyUnsharpMaskFilter,
    "filter-smart-sharpen": applySmartSharpenFilter,
    "filter-high-pass": applyHighPassFilter,
    "filter-find-edges": () => applyLayerFilter("find-edges"),
    "filter-oil-paint": applyOilPaintFilter,
    "filter-glowing-edges": applyGlowingEdgesFilter,
    "filter-emboss": applyEmbossFilter,
    "filter-diffuse": applyDiffuseFilter,
    "filter-wind": applyWindFilter,
    "filter-trace-contour": applyTraceContourFilter,
    "filter-extrude": applyExtrudeFilter,
    "filter-tiles": applyTilesFilter,
    "filter-solarize": () => applyLayerFilter("solarize"),
    "filter-clouds": applyCloudsFilter,
    "filter-difference-clouds": applyDifferenceCloudsFilter,
    "filter-lens-flare": applyLensFlareFilter,
    "filter-fibers": applyFibersFilter,
    "filter-lighting-effects": applyLightingEffectsFilter,
    "filter-noise": applyAddNoiseFilter,
    "filter-reduce-noise": applyReduceNoiseFilter,
    "filter-despeckle": applyDespeckleFilter,
    "filter-dust-scratches": applyDustScratchesFilter,
    "filter-median": applyMedianFilter,
    "filter-color-halftone": applyColorHalftoneFilter,
    "filter-crystallize": applyCrystallizeFilter,
    "filter-pointillize": applyPointillizeFilter,
    "filter-fragment": applyFragmentFilter,
    "filter-facet": applyFacetFilter,
    "filter-mezzotint": applyMezzotintFilter,
    "filter-mosaic": applyMosaicFilter,
    "filter-offset": applyOffsetFilter,
    "filter-maximum": () => applyExtremaFilter("maximum"),
    "filter-minimum": () => applyExtremaFilter("minimum"),
    "new-adjustment-layer": addAdjustmentLayer,
    crop: () => selectTool("crop"),
    "free-transform": () => toggleFreeTransform(true),
    "new-layer": addLayer,
    "layer-via-copy": () => layerViaCopy(false),
    "layer-via-cut": () => layerViaCopy(true),
    "duplicate-layer": duplicateLayer,
    "rename-layer": () => renameLayer(),
    "layer-from-background": layerFromBackground,
    "background-from-layer": backgroundFromLayer,
    "delete-layer": deleteLayer,
    "rotate-layer-cw": () => rotateLayer(1),
    "rotate-layer-ccw": () => rotateLayer(-1),
    "flip-layer-horizontal": () => flipLayer("x"),
    "flip-layer-vertical": () => flipLayer("y"),
    "align-left": () => alignActiveLayer("left"),
    "align-horizontal-centers": () => alignActiveLayer("horizontal"),
    "align-right": () => alignActiveLayer("right"),
    "align-top": () => alignActiveLayer("top"),
    "align-vertical-centers": () => alignActiveLayer("vertical"),
    "align-bottom": () => alignActiveLayer("bottom"),
    "layer-up": () => moveLayerOrder(1),
    "layer-down": () => moveLayerOrder(-1),
    "layer-front": () => moveLayerToEdge(1),
    "layer-back": () => moveLayerToEdge(-1),
    "select-layer-up": () => selectLayerByOffset(1),
    "select-layer-down": () => selectLayerByOffset(-1),
    "select-layer-top": () => selectLayerByOffset(1, true),
    "select-layer-bottom": () => selectLayerByOffset(-1, true),
    "toggle-clipping-mask": toggleClippingMask,
    "toggle-lock-transparency": () => toggleLayerLock("lockTransparency"),
    "toggle-lock-pixels": () => toggleLayerLock("lockPixels"),
    "toggle-lock-position": () => toggleLayerLock("lockPosition"),
    "toggle-lock-all": toggleLayerLockAll,
    "add-reveal-mask": () => addLayerMask(true),
    "add-hide-mask": () => addLayerMask(false),
    "toggle-mask-disabled": () => toggleLayerMaskDisabled(),
    "apply-mask": applyLayerMask,
    "invert-mask": invertLayerMask,
    "delete-mask": deleteLayerMask,
    "toggle-shadow": () => toggleLayerStyle("shadow"),
    "toggle-stroke": () => toggleLayerStyle("stroke"),
    "toggle-glow": () => toggleLayerStyle("glow"),
    "copy-layer-style": copyLayerStyle,
    "paste-layer-style": pasteLayerStyle,
    "clear-layer-style": clearLayerStyle,
    "rasterize-layer-style": rasterizeLayerStyle,
    "merge-down": mergeLayerDown,
    "stamp-visible": stampVisible,
    "merge-visible": mergeVisible,
    "flatten-image": flattenImage,
    "select-all": selectAll,
    deselect,
    reselect,
    "invert-selection": invertSelection,
    "toggle-quick-mask": toggleQuickMask,
    "select-subject": selectSubject,
    "color-range": promptColorRange,
    "select-similar": selectSimilar,
    "grow-selection": growSelection,
    "save-selection-channel": saveSelectionChannel,
    "load-alpha-channel": () => loadAlphaChannel(),
    "feather-selection": promptSelectionFeather,
    "smooth-selection": promptSelectionSmooth,
    "expand-selection": () => promptSelectionModify(1),
    "contract-selection": () => promptSelectionModify(-1),
    "border-selection": promptSelectionBorder,
    "make-path-selection": makeWorkPathSelection,
    "stroke-path": strokeWorkPath,
    "clear-path": clearWorkPath,
    "actual-pixels": actualPixels,
    fit: fitToScreen,
    "zoom-in": () => setZoom(state.zoom * 1.25),
    "zoom-out": () => setZoom(state.zoom / 1.25),
    "toggle-rulers": toggleRulers,
    "toggle-extras": toggleExtras,
    "toggle-grid": toggleGrid,
    "toggle-guides": toggleGuides,
    "toggle-snap": toggleSnap,
    "toggle-snap-grid": () => toggleSnapTarget("snapToGrid"),
    "toggle-snap-guides": () => toggleSnapTarget("snapToGuides"),
    "toggle-panels": () => toggleWorkspaceChrome(true),
    "toggle-chrome": () => toggleWorkspaceChrome(false),
    "new-vertical-guide": () => addGuide("vertical"),
    "new-horizontal-guide": () => addGuide("horizontal"),
    "clear-guides": clearGuides,
  };
  const action = commands[command];
  if (action) {
    if (openMenuCommandDialog(command, action)) return;
    action();
  }
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

function closeMenuPopovers() {
  document.querySelectorAll(".menu-group.menu-open").forEach((group) => {
    group.classList.remove("menu-open");
  });
  document.querySelector(".menu-list")?.classList.remove("has-menu-open");
}

function openMenuPopover(group) {
  document.querySelectorAll(".menu-group.menu-open").forEach((openGroup) => {
    openGroup.classList.toggle("menu-open", openGroup === group);
  });
  group.classList.add("menu-open");
  group.closest(".menu-list")?.classList.add("has-menu-open");
}

function wireEvents() {
  buttons.open.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async () => {
    await loadFile(fileInput.files[0]);
    fileInput.value = "";
  });
  placeInput.addEventListener("change", async () => {
    await placeFile(placeInput.files[0]);
    placeInput.value = "";
  });
  buttons.aiChatSend.addEventListener("click", sendAiChatMessage);
  controls.aiChatInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    sendAiChatMessage();
  });
  buttons.savePng.addEventListener("click", () => exportImage("image/png"));
  buttons.saveJpg.addEventListener("click", () => exportImage("image/jpeg"));
  buttons.savePsd.addEventListener("click", exportPsd);
  buttons.newAdjustmentLayer.addEventListener("click", addAdjustmentLayer);
  buttons.filterBlur.addEventListener("click", () => executeCommand("filter-blur"));
  buttons.filterBoxBlur.addEventListener("click", () => executeCommand("filter-box-blur"));
  buttons.filterAverage.addEventListener("click", applyAverageFilter);
  buttons.filterSurfaceBlur.addEventListener("click", () => executeCommand("filter-surface-blur"));
  buttons.filterSmartBlur.addEventListener("click", () => executeCommand("filter-smart-blur"));
  buttons.filterRadialBlur.addEventListener("click", () => executeCommand("filter-radial-blur"));
  buttons.filterTwirl.addEventListener("click", () => executeCommand("filter-twirl"));
  buttons.filterPinch.addEventListener("click", () => executeCommand("filter-pinch"));
  buttons.filterRipple.addEventListener("click", () => executeCommand("filter-ripple"));
  buttons.filterSpherize.addEventListener("click", () => executeCommand("filter-spherize"));
  buttons.filterZigZag.addEventListener("click", () => executeCommand("filter-zigzag"));
  buttons.filterWave.addEventListener("click", () => executeCommand("filter-wave"));
  buttons.filterPolar.addEventListener("click", () => executeCommand("filter-polar-coordinates"));
  buttons.filterShear.addEventListener("click", () => executeCommand("filter-shear"));
  buttons.filterMotionBlur.addEventListener("click", () => executeCommand("filter-motion-blur"));
  buttons.filterSharpen.addEventListener("click", () => applyLayerFilter("sharpen"));
  buttons.filterUnsharp.addEventListener("click", () => executeCommand("filter-unsharp-mask"));
  buttons.filterSmartSharpen.addEventListener("click", () => executeCommand("filter-smart-sharpen"));
  buttons.filterHighPass.addEventListener("click", () => executeCommand("filter-high-pass"));
  buttons.filterFindEdges.addEventListener("click", () => applyLayerFilter("find-edges"));
  buttons.filterOilPaint.addEventListener("click", () => executeCommand("filter-oil-paint"));
  buttons.filterGlowingEdges.addEventListener("click", () => executeCommand("filter-glowing-edges"));
  buttons.filterEmboss.addEventListener("click", () => executeCommand("filter-emboss"));
  buttons.filterDiffuse.addEventListener("click", () => executeCommand("filter-diffuse"));
  buttons.filterWind.addEventListener("click", () => executeCommand("filter-wind"));
  buttons.filterTraceContour.addEventListener("click", () => executeCommand("filter-trace-contour"));
  buttons.filterExtrude.addEventListener("click", () => executeCommand("filter-extrude"));
  buttons.filterTiles.addEventListener("click", () => executeCommand("filter-tiles"));
  buttons.filterSolarize.addEventListener("click", () => applyLayerFilter("solarize"));
  buttons.filterClouds.addEventListener("click", applyCloudsFilter);
  buttons.filterDifferenceClouds.addEventListener("click", applyDifferenceCloudsFilter);
  buttons.filterLensFlare.addEventListener("click", () => executeCommand("filter-lens-flare"));
  buttons.filterFibers.addEventListener("click", () => executeCommand("filter-fibers"));
  buttons.filterLightingEffects.addEventListener("click", () => executeCommand("filter-lighting-effects"));
  buttons.filterNoise.addEventListener("click", () => executeCommand("filter-noise"));
  buttons.filterReduceNoise.addEventListener("click", () => executeCommand("filter-reduce-noise"));
  buttons.filterDespeckle.addEventListener("click", applyDespeckleFilter);
  buttons.filterDustScratches.addEventListener("click", () => executeCommand("filter-dust-scratches"));
  buttons.filterMedian.addEventListener("click", () => executeCommand("filter-median"));
  buttons.filterColorHalftone.addEventListener("click", () => executeCommand("filter-color-halftone"));
  buttons.filterCrystallize.addEventListener("click", () => executeCommand("filter-crystallize"));
  buttons.filterPointillize.addEventListener("click", () => executeCommand("filter-pointillize"));
  buttons.filterFragment.addEventListener("click", applyFragmentFilter);
  buttons.filterFacet.addEventListener("click", applyFacetFilter);
  buttons.filterMezzotint.addEventListener("click", () => executeCommand("filter-mezzotint"));
  buttons.filterMosaic.addEventListener("click", () => executeCommand("filter-mosaic"));
  buttons.filterOffset.addEventListener("click", () => executeCommand("filter-offset"));
  buttons.filterMaximum.addEventListener("click", () => executeCommand("filter-maximum"));
  buttons.filterMinimum.addEventListener("click", () => executeCommand("filter-minimum"));
  buttons.newHistorySnapshot.addEventListener("click", createHistorySnapshot);
  buttons.applyCrop.addEventListener("click", applyCrop);
  buttons.cancelCrop.addEventListener("click", cancelCrop);
  buttons.clearSelection.addEventListener("click", deselect);
  buttons.freeTransform.addEventListener("click", () => toggleFreeTransform());
  buttons.rotateLeft.addEventListener("click", () => rotateLayer(-1));
  buttons.rotateRight.addEventListener("click", () => rotateLayer(1));
  buttons.flipHorizontal.addEventListener("click", () => flipLayer("x"));
  buttons.flipVertical.addEventListener("click", () => flipLayer("y"));
  buttons.alignLeft.addEventListener("click", () => alignActiveLayer("left"));
  buttons.alignHorizontal.addEventListener("click", () => alignActiveLayer("horizontal"));
  buttons.alignRight.addEventListener("click", () => alignActiveLayer("right"));
  buttons.alignTop.addEventListener("click", () => alignActiveLayer("top"));
  buttons.alignVertical.addEventListener("click", () => alignActiveLayer("vertical"));
  buttons.alignBottom.addEventListener("click", () => alignActiveLayer("bottom"));
  buttons.addLayer.addEventListener("click", addLayer);
  buttons.duplicateLayer.addEventListener("click", duplicateLayer);
  buttons.layerUp.addEventListener("click", () => moveLayerOrder(1));
  buttons.layerDown.addEventListener("click", () => moveLayerOrder(-1));
  buttons.clipLayer.addEventListener("click", toggleClippingMask);
  buttons.lockTransparency.addEventListener("click", () => toggleLayerLock("lockTransparency"));
  buttons.lockPixels.addEventListener("click", () => toggleLayerLock("lockPixels"));
  buttons.lockPosition.addEventListener("click", () => toggleLayerLock("lockPosition"));
  buttons.lockAll.addEventListener("click", toggleLayerLockAll);
  buttons.deleteLayer.addEventListener("click", deleteLayer);
  buttons.mergeVisible.addEventListener("click", mergeVisible);
  buttons.addRevealMask.addEventListener("click", () => addLayerMask(true));
  buttons.addHideMask.addEventListener("click", () => addLayerMask(false));
  buttons.toggleMask.addEventListener("click", () => toggleLayerMaskDisabled());
  buttons.applyMask.addEventListener("click", applyLayerMask);
  buttons.invertMask.addEventListener("click", invertLayerMask);
  buttons.deleteMask.addEventListener("click", deleteLayerMask);
  buttons.selectAll.addEventListener("click", selectAll);
  buttons.deselect.addEventListener("click", deselect);
  buttons.reselect.addEventListener("click", reselect);
  buttons.invertSelection.addEventListener("click", invertSelection);
  buttons.quickMask.addEventListener("click", toggleQuickMask);
  buttons.selectSubject.addEventListener("click", selectSubject);
  buttons.colorRange.addEventListener("click", () => executeCommand("color-range"));
  buttons.selectSimilar.addEventListener("click", selectSimilar);
  buttons.growSelection.addEventListener("click", growSelection);
  buttons.smoothSelection.addEventListener("click", () => executeCommand("smooth-selection"));
  buttons.expandSelection.addEventListener("click", () => executeCommand("expand-selection"));
  buttons.contractSelection.addEventListener("click", () => executeCommand("contract-selection"));
  buttons.borderSelection.addEventListener("click", () => executeCommand("border-selection"));
  buttons.fillSelection.addEventListener("click", () => fillPixels("foreground"));
  buttons.fillBackground.addEventListener("click", () => fillPixels("background"));
  buttons.contentAwareFill.addEventListener("click", contentAwareFillSelection);
  buttons.deleteSelection.addEventListener("click", deletePixels);
  buttons.cut.addEventListener("click", () => copyPixels({ cut: true }));
  buttons.copyMerged.addEventListener("click", () => copyPixels({ merged: true }));
  buttons.swapColors.addEventListener("click", swapForegroundBackground);
  buttons.defaultColors.addEventListener("click", resetDefaultColors);
  buttons.saveSelectionChannel.addEventListener("click", saveSelectionChannel);
  buttons.loadAlphaChannel.addEventListener("click", () => loadAlphaChannel());
  buttons.makePathSelection.addEventListener("click", makeWorkPathSelection);
  buttons.strokePath.addEventListener("click", strokeWorkPath);
  buttons.clearPath.addEventListener("click", clearWorkPath);
  buttons.resetAdjust.addEventListener("click", resetCurrentAdjustments);

  const menuList = document.querySelector(".menu-list");

  menuList.addEventListener("click", (event) => {
    const trigger = event.target.closest(".menu-trigger");
    if (trigger) {
      const group = trigger.closest(".menu-group");
      const wasOpen = group.classList.contains("menu-open");
      closeMenuPopovers();
      if (!wasOpen) openMenuPopover(group);
      return;
    }

    const item = event.target.closest("[data-command]");
    if (!item) return;
    closeMenuPopovers();
    executeCommand(item.dataset.command);
  });

  menuList.addEventListener("mouseover", (event) => {
    if (!menuList.querySelector(".menu-group.menu-open")) return;
    const group = event.target.closest(".menu-group");
    if (!group || !menuList.contains(group)) return;
    openMenuPopover(group);
  });

  menuList.addEventListener("focusin", (event) => {
    const group = event.target.closest(".menu-group");
    if (!group || !menuList.contains(group)) return;
    openMenuPopover(group);
  });

  document.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".menu-list")) return;
    closeMenuPopovers();
  });

  document.addEventListener("focusin", (event) => {
    if (event.target.closest(".menu-list")) return;
    closeMenuPopovers();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeMenuPopovers();
  });

  document.querySelector(".toolbar").addEventListener("click", (event) => {
    const button = event.target.closest("[data-tool]");
    if (!button) return;
    selectTool(button.dataset.tool);
  });

  document.querySelector(".dock-tabs").addEventListener("click", (event) => {
    const button = event.target.closest("[data-dock-tab]");
    if (!button) return;
    selectDockGroup(button.dataset.dockTab);
  });

  document.querySelector("#swatches").addEventListener("click", (event) => {
    const button = event.target.closest("[data-color]");
    if (!button) return;
    setForegroundColor(button.dataset.color, `Foreground ${button.dataset.color}`);
  });

  dom.alphaChannelList.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (!action) return;
    const row = action.closest("[data-alpha-channel-id]");
    if (!row) return;
    if (action.dataset.action === "load") loadAlphaChannel(row.dataset.alphaChannelId);
    if (action.dataset.action === "delete") deleteAlphaChannel(row.dataset.alphaChannelId);
  });

  document.querySelector("#brushPresets").addEventListener("click", (event) => {
    const button = event.target.closest("[data-brush-preset]");
    if (!button) return;
    applyBrushPreset(button.dataset.brushPreset);
  });

  controls.brushSize.addEventListener("input", () => {
    setBrushSize(Number(controls.brushSize.value));
  });
  controls.brushOpacity.addEventListener("input", () => {
    setBrushOpacity(Number(controls.brushOpacity.value));
  });
  controls.brushColor.addEventListener("input", () => {
    setForegroundColor(controls.brushColor.value);
  });
  controls.panelBrushColor.addEventListener("input", () => {
    setForegroundColor(controls.panelBrushColor.value);
  });
  controls.backgroundColor.addEventListener("input", () => {
    setBackgroundColor(controls.backgroundColor.value);
  });
  controls.panelBackgroundColor.addEventListener("input", () => {
    setBackgroundColor(controls.panelBackgroundColor.value);
  });
  controls.brushHardness.addEventListener("input", () => {
    setBrushHardness(Number(controls.brushHardness.value));
  });
  controls.brushSpacing.addEventListener("input", () => {
    state.brush.spacing = Number(controls.brushSpacing.value);
    state.brush.preset = "custom";
    values.brushSpacing.textContent = String(state.brush.spacing);
    syncBrushPresetUi();
  });
  controls.brushFlow.addEventListener("input", () => {
    setBrushFlow(Number(controls.brushFlow.value));
  });
  controls.moveAutoSelect.addEventListener("change", () => {
    state.moveAutoSelect = controls.moveAutoSelect.checked;
    updateStatus(state.moveAutoSelect ? "Move auto-select on" : "Move auto-select off");
  });
  controls.textContent.addEventListener("input", () => {
    state.text.content = controls.textContent.value;
    updateActiveTextLayer({ content: state.text.content });
  });
  controls.textContent.addEventListener("change", () => {
    commitActiveTextLayerEdit("Edit text");
  });
  controls.textFont.addEventListener("change", () => {
    state.text.fontFamily = controls.textFont.value;
    updateActiveTextLayer({ fontFamily: state.text.fontFamily });
    commitActiveTextLayerEdit("Change text font");
  });
  controls.textSize.addEventListener("input", () => {
    state.text.size = Number(controls.textSize.value);
    updateActiveTextLayer({ size: state.text.size });
  });
  controls.textSize.addEventListener("change", () => {
    commitActiveTextLayerEdit("Change text size");
  });
  controls.selectionFeather.addEventListener("input", () => {
    state.selectionFeather = Number(controls.selectionFeather.value);
    values.selectionFeather.textContent = `${state.selectionFeather} px`;
    updateToolUi();
    render();
  });
  controls.selectionMode.addEventListener("change", () => {
    state.selectionMode = controls.selectionMode.value;
    updateStatus(`Selection mode ${state.selectionMode}`);
  });
  controls.wandTolerance.addEventListener("input", () => {
    setWandTolerance(controls.wandTolerance.value);
    updateStatus(`Magic wand tolerance ${state.wandTolerance}`);
  });
  controls.wandContiguous.addEventListener("change", () => {
    state.wandContiguous = controls.wandContiguous.checked;
    updateStatus(state.wandContiguous ? "Magic wand contiguous" : "Magic wand global");
  });
  controls.wandSampleAll.addEventListener("change", () => {
    state.wandSampleAll = controls.wandSampleAll.checked;
    updateStatus(state.wandSampleAll ? "Magic wand samples all layers" : "Magic wand samples active layer");
  });
  controls.gradientMode.addEventListener("change", () => {
    state.gradientMode = controls.gradientMode.value;
    updateStatus(`${state.gradientMode === "radial" ? "Radial" : "Linear"} gradient`);
  });
  controls.gradientReverse.addEventListener("change", () => {
    state.gradientReverse = controls.gradientReverse.checked;
    updateStatus(state.gradientReverse ? "Gradient reversed" : "Gradient normal");
  });
  controls.shapeMode.addEventListener("change", () => {
    state.shapeMode = controls.shapeMode.value;
    updateStatus(`${state.shapeMode === "ellipse" ? "Ellipse" : "Rectangle"} shape`);
  });
  controls.shapeFillColor.addEventListener("input", () => {
    state.shapeFillColor = controls.shapeFillColor.value;
    updateStatus(`Shape fill ${state.shapeFillColor}`);
  });
  controls.shapeStrokeEnabled.addEventListener("change", () => {
    state.shapeStrokeEnabled = controls.shapeStrokeEnabled.checked;
    updateStatus(state.shapeStrokeEnabled ? "Shape stroke on" : "Shape stroke off");
  });
  controls.shapeStrokeColor.addEventListener("input", () => {
    state.shapeStrokeColor = controls.shapeStrokeColor.value;
    updateStatus(`Shape stroke ${state.shapeStrokeColor}`);
  });
  controls.shapeStrokeSize.addEventListener("input", () => {
    state.shapeStrokeSize = Number(controls.shapeStrokeSize.value);
    values.shapeStrokeSize.textContent = String(state.shapeStrokeSize);
    updateStatus(`Shape stroke ${state.shapeStrokeSize}px`);
  });
  controls.healStrength.addEventListener("input", () => {
    state.healStrength = Number(controls.healStrength.value) / 100;
    values.healStrength.textContent = `${Math.round(state.healStrength * 100)}%`;
    updateStatus(`Spot healing strength ${Math.round(state.healStrength * 100)}%`);
  });
  controls.smudgeStrength.addEventListener("input", () => {
    state.smudgeStrength = Number(controls.smudgeStrength.value) / 100;
    values.smudgeStrength.textContent = `${Math.round(state.smudgeStrength * 100)}%`;
    updateStatus(`Smudge strength ${Math.round(state.smudgeStrength * 100)}%`);
  });
  controls.toneMode.addEventListener("change", () => {
    state.toneMode = controls.toneMode.value;
    updateStatus(state.toneMode === "dodge" ? "Dodge mode" : "Burn mode");
  });
  controls.toneExposure.addEventListener("input", () => {
    state.toneExposure = Number(controls.toneExposure.value) / 100;
    values.toneExposure.textContent = `${Math.round(state.toneExposure * 100)}%`;
    updateStatus(`${state.toneMode === "dodge" ? "Dodge" : "Burn"} exposure ${Math.round(state.toneExposure * 100)}%`);
  });
  controls.channelRed.addEventListener("change", () => togglePreviewChannel("red", controls.channelRed.checked));
  controls.channelGreen.addEventListener("change", () => togglePreviewChannel("green", controls.channelGreen.checked));
  controls.channelBlue.addEventListener("change", () => togglePreviewChannel("blue", controls.channelBlue.checked));

  Object.keys(state.adjustments).forEach((key) => {
    controls[key].addEventListener("input", () => {
      const adjustments = currentAdjustmentValues();
      adjustments[key] = Number(controls[key].value);
      values[key].textContent = String(adjustments[key]);
      render();
    });
    controls[key].addEventListener("change", () => {
      const layer = activeLayer();
      commitHistory(layer?.type === "adjustment" ? `Adjust layer ${key}` : `Adjust ${key}`);
      renderLayerList();
    });
  });

  controls.layerOpacity.addEventListener("input", () => {
    setLayerOpacity(Number(controls.layerOpacity.value));
  });
  controls.layerOpacity.addEventListener("change", () => commitHistory("Layer opacity"));
  controls.layerFill.addEventListener("input", () => {
    setLayerFill(Number(controls.layerFill.value));
  });
  controls.layerFill.addEventListener("change", () => commitHistory("Layer fill"));
  controls.blendIfBlack.addEventListener("input", () => {
    setLayerBlendIf("black", controls.blendIfBlack.value);
  });
  controls.blendIfBlack.addEventListener("change", () => {
    setLayerBlendIf("black", controls.blendIfBlack.value, true);
  });
  controls.blendIfWhite.addEventListener("input", () => {
    setLayerBlendIf("white", controls.blendIfWhite.value);
  });
  controls.blendIfWhite.addEventListener("change", () => {
    setLayerBlendIf("white", controls.blendIfWhite.value, true);
  });
  controls.blendMode.addEventListener("change", () => {
    const layer = activeLayer();
    if (!layer) return;
    if (activeLayerIsBackground()) {
      controls.blendMode.value = layer.blendMode;
      updateStatus("Use Layer from Background to change background blend mode");
      return;
    }
    layer.blendMode = controls.blendMode.value;
    commitHistory("Blend mode");
    renderAll();
  });
  controls.paintTarget.addEventListener("change", () => {
    const layer = activeLayer();
    state.paintTarget = layer?.mask ? controls.paintTarget.value : "pixels";
    updateActionStates();
    updateStatus(state.paintTarget === "mask" ? "Editing layer mask" : "Editing layer pixels");
  });

  controls.shadowEnabled.addEventListener("change", () => {
    updateLayerStyle("shadow", "enabled", controls.shadowEnabled.checked);
    commitLayerStyle("shadow");
  });
  controls.shadowDistance.addEventListener("input", () => {
    updateLayerStyle("shadow", "distance", Number(controls.shadowDistance.value));
  });
  controls.shadowDistance.addEventListener("change", () => commitLayerStyle("shadow"));
  controls.shadowSize.addEventListener("input", () => {
    updateLayerStyle("shadow", "size", Number(controls.shadowSize.value));
  });
  controls.shadowSize.addEventListener("change", () => commitLayerStyle("shadow"));
  controls.shadowColor.addEventListener("input", () => {
    updateLayerStyle("shadow", "color", controls.shadowColor.value);
  });
  controls.shadowColor.addEventListener("change", () => commitLayerStyle("shadow"));

  controls.strokeEnabled.addEventListener("change", () => {
    updateLayerStyle("stroke", "enabled", controls.strokeEnabled.checked);
    commitLayerStyle("stroke");
  });
  controls.strokeSize.addEventListener("input", () => {
    updateLayerStyle("stroke", "size", Number(controls.strokeSize.value));
  });
  controls.strokeSize.addEventListener("change", () => commitLayerStyle("stroke"));
  controls.strokeColor.addEventListener("input", () => {
    updateLayerStyle("stroke", "color", controls.strokeColor.value);
  });
  controls.strokeColor.addEventListener("change", () => commitLayerStyle("stroke"));

  controls.glowEnabled.addEventListener("change", () => {
    updateLayerStyle("glow", "enabled", controls.glowEnabled.checked);
    commitLayerStyle("glow");
  });
  controls.glowSize.addEventListener("input", () => {
    updateLayerStyle("glow", "size", Number(controls.glowSize.value));
  });
  controls.glowSize.addEventListener("change", () => commitLayerStyle("glow"));
  controls.glowColor.addEventListener("input", () => {
    updateLayerStyle("glow", "color", controls.glowColor.value);
  });
  controls.glowColor.addEventListener("change", () => commitLayerStyle("glow"));
  buttons.rasterizeLayerStyle.addEventListener("click", rasterizeLayerStyle);

  dom.layerList.addEventListener("click", (event) => {
    const row = event.target.closest("[data-layer-id]");
    if (!row) return;
    const layer = state.layers.find((item) => item.id === row.dataset.layerId);
    if (!layer) return;
    if (event.target.dataset.action === "visibility") {
      state.activeLayerId = layer.id;
      const status = toggleLayerVisibility(layer, event.altKey);
      renderAll();
      updateStatus(status);
      return;
    }
    state.activeLayerId = layer.id;
    if (event.target.dataset.action === "pixels" && (event.ctrlKey || event.metaKey)) {
      loadLayerTransparencySelection(layer);
      return;
    }
    if (event.target.dataset.action === "mask") {
      if (event.ctrlKey || event.metaKey) {
        loadLayerMaskSelection(layer);
        return;
      }
      if (event.shiftKey) {
        toggleLayerMaskDisabled(layer.id);
        return;
      }
      state.paintTarget = "mask";
      updateStatus("Editing layer mask");
      renderAll();
      return;
    }
    renderAll();
  });

  dom.layerList.addEventListener("dblclick", (event) => {
    const name = event.target.closest(".layer-name");
    if (!name) return;
    const row = name.closest("[data-layer-id]");
    if (!row) return;
    renameLayer(row.dataset.layerId);
  });

  dom.historyList.addEventListener("click", (event) => {
    const item = event.target.closest("[data-history-index]");
    if (!item) return;
    state.historyIndex = Number(item.dataset.historyIndex);
    restoreSnapshot(state.history[state.historyIndex].data);
  });
  dom.historySnapshotList.addEventListener("click", (event) => {
    const row = event.target.closest("[data-history-snapshot-index]");
    if (!row) return;
    const index = Number(row.dataset.historySnapshotIndex);
    if (event.target.dataset.action === "delete") {
      deleteHistorySnapshot(index);
      return;
    }
    if (event.target.dataset.action === "source") {
      setHistoryBrushSource(index);
      return;
    }
    restoreHistorySnapshot(index);
  });

  canvas.addEventListener("pointerdown", beginPointer);
  canvas.addEventListener("pointermove", movePointer);
  canvas.addEventListener("pointerup", endPointer);
  canvas.addEventListener("pointercancel", endPointer);
  canvas.addEventListener("pointerleave", () => {
    if (!state.drag) {
      clearInfoPanel();
      if (clearBrushPreview()) render();
    }
  });
  dom.navigatorCanvas.addEventListener("pointerdown", beginNavigatorPointer);
  dom.navigatorCanvas.addEventListener("pointermove", moveNavigatorPointer);
  dom.navigatorCanvas.addEventListener("pointerup", endNavigatorPointer);
  dom.navigatorCanvas.addEventListener("pointercancel", endNavigatorPointer);
  buttons.navigatorZoomOut.addEventListener("click", () => {
    setZoom(state.zoom / 1.25);
    updateStatus(`Zoom ${zoomPercentText()}`);
  });
  buttons.navigatorZoomIn.addEventListener("click", () => {
    setZoom(state.zoom * 1.25);
    updateStatus(`Zoom ${zoomPercentText()}`);
  });
  controls.navigatorZoomSlider.addEventListener("input", () => {
    setNavigatorZoomPercent(Number(controls.navigatorZoomSlider.value));
  });
  dom.rulerTop.addEventListener("pointerdown", (event) => beginRulerGuide(event, "vertical"));
  dom.rulerLeft.addEventListener("pointerdown", (event) => beginRulerGuide(event, "horizontal"));
  [dom.rulerTop, dom.rulerLeft].forEach((ruler) => {
    ruler.addEventListener("pointermove", movePointer);
    ruler.addEventListener("pointerup", endPointer);
    ruler.addEventListener("pointercancel", endPointer);
  });
  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    const point = pointFromEvent(event);
    setZoom(state.zoom * (event.deltaY < 0 ? 1.1 : 0.9), point);
  }, { passive: false });

  window.addEventListener("keydown", (event) => {
    const inTextField = isEditableTarget(event.target);
    const key = event.key.toLowerCase();
    if (key === "tab" && !inTextField && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      toggleWorkspaceChrome(event.shiftKey);
      return;
    }
    if (event.code === "Space" && !inTextField && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      if (!event.repeat) beginTemporaryHandTool();
      return;
    }
    if ((key === "enter" || key === "escape") && !inTextField && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const handled = key === "enter" ? confirmModalToolAction() : cancelModalToolAction();
      if (handled) {
        event.preventDefault();
        return;
      }
    }
    if (key === "f6" && event.shiftKey && !inTextField && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      executeCommand("feather-selection");
      return;
    }
    if (key === "f5" && event.shiftKey && !inTextField && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      executeCommand("fill-dialog");
      return;
    }
    if ((event.ctrlKey || event.metaKey) && !inTextField) {
      const shortcutCommands = {
        0: "fit",
        1: "actual-pixels",
        "'": "toggle-grid",
        ";": "toggle-guides",
        "[": event.shiftKey ? "layer-back" : "layer-down",
        "{": event.shiftKey ? "layer-back" : "layer-down",
        "]": event.shiftKey ? "layer-front" : "layer-up",
        "}": event.shiftKey ? "layer-front" : "layer-up",
        "=": "zoom-in",
        "+": "zoom-in",
        "-": "zoom-out",
        a: "select-all",
        b: event.shiftKey && event.altKey ? "black-white" : !event.shiftKey && !event.altKey ? "color-balance" : null,
        c: event.altKey ? "canvas-size" : event.shiftKey ? "copy-merged" : "copy",
        d: event.shiftKey ? "reselect" : "deselect",
        e: event.shiftKey && event.altKey ? "stamp-visible" : event.shiftKey ? "merge-visible" : event.altKey ? null : "merge-down",
        g: event.altKey ? "toggle-clipping-mask" : null,
        h: "toggle-extras",
        i: event.altKey ? "image-size" : event.shiftKey ? "invert-selection" : "invert",
        j: event.shiftKey ? "layer-via-cut" : "layer-via-copy",
        l: "levels",
        m: "curves",
        n: event.shiftKey ? "new-layer" : "new-document",
        o: "open",
        r: "toggle-rulers",
        t: "free-transform",
        u: event.shiftKey ? "desaturate" : "hue-saturation",
        v: event.altKey ? "paste-into" : "paste",
        x: "cut",
      };
      const command = shortcutCommands[key];
      if (command) {
        event.preventDefault();
        executeCommand(command);
        return;
      }
    }
    if ((event.ctrlKey || event.metaKey) && key === "z" && !inTextField) {
      const stepBackward = event.altKey && !event.shiftKey;
      const stepForward = event.shiftKey && !event.altKey;
      const plainUndo = !event.altKey && !event.shiftKey;
      if (!stepBackward && !stepForward && !plainUndo) return;
      event.preventDefault();
      if (stepForward) redo();
      else undo();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && key === "p" && !inTextField) {
      event.preventDefault();
      exportImage("image/png");
      return;
    }
    if ((key === "backspace" || key === "delete") && !inTextField) {
      event.preventDefault();
      if (event.altKey && !event.ctrlKey && !event.metaKey) {
        fillPixels("foreground");
      } else if ((event.ctrlKey || event.metaKey) && !event.altKey) {
        fillPixels("background");
      } else if (!event.altKey && !event.ctrlKey && !event.metaKey) {
        deletePixels();
      }
      return;
    }
    if ((key === "[" || key === "]" || key === "{" || key === "}") && event.altKey && !inTextField && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      const direction = key === "]" || key === "}" ? 1 : -1;
      selectLayerByOffset(direction, event.shiftKey);
      return;
    }
    if ((key === "[" || key === "]" || key === "{" || key === "}") && !inTextField && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      adjustBrushShortcut(key, event.shiftKey);
      return;
    }
    if ((key === "+" || key === "=" || key === "-" || key === "_") && event.shiftKey && !inTextField && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      cycleLayerBlendMode(key === "-" || key === "_" ? -1 : 1);
      return;
    }
    const shortcutDigit = digitFromShortcutEvent(event);
    if (shortcutDigit && !inTextField && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      applyNumericOpacityShortcut(shortcutDigit, event.shiftKey, event.timeStamp);
      return;
    }
    const nudgeKeys = {
      arrowleft: [-1, 0],
      arrowright: [1, 0],
      arrowup: [0, -1],
      arrowdown: [0, 1],
    };
    const nudge = nudgeKeys[key];
    if (nudge && !inTextField && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const step = event.shiftKey ? 10 : 1;
      if (nudgeActiveLayer(nudge[0] * step, nudge[1] * step)) return;
    }
    if (key === "q" && !inTextField && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      toggleQuickMask();
      return;
    }
    if (key === "x" && !inTextField && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      swapForegroundBackground();
      return;
    }
    if (key === "d" && !inTextField && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      resetDefaultColors();
      return;
    }
    const keyMap = { v: "move", m: "marquee", w: "magic", l: "lasso", p: "pen", c: "crop", b: "brush", e: "eraser", j: "heal", s: "clone", y: "historyBrush", g: "gradient", u: "shape", r: "smudge", o: "tone", t: "text", i: "eyedropper", h: "hand", z: "zoom" };
    const nextTool = keyMap[key];
    if (nextTool && !inTextField && !event.ctrlKey && !event.metaKey) {
      selectTool(nextTool);
    }
  });

  window.addEventListener("keyup", (event) => {
    if (event.code !== "Space" || isEditableTarget(event.target) || !temporaryHandTool) return;
    event.preventDefault();
    if (state.drag?.type === "pan") {
      restoreHandAfterDrag = true;
      return;
    }
    restoreTemporaryHandTool();
  });

  window.addEventListener("blur", () => {
    if (state.drag?.type === "pan") {
      restoreHandAfterDrag = true;
      return;
    }
    restoreTemporaryHandTool();
  });

  window.addEventListener("resize", render);
}

function init() {
  createSampleLayers();
  syncControlsFromState();
  wireEvents();
  selectDockGroup(state.dockGroup);
  state.initialSnapshot = snapshot();
  commitHistory("New document");
  renderAll();
}

init();

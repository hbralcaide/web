import { Color as Color$1, CompositeExpression, DiffCommand, DiffOperations, Feature as Feature$2, FeatureFilter, FeatureState, FilterSpecification, Formatted, FormattedSection, GlobalProperties, ICanonicalTileID, IMercatorCoordinate, InterpolationType, LayerSpecification, LightSpecification, Padding, ProjectionSpecification, PromoteIdSpecification, PropertyValueSpecification, ResolvedImage, SkySpecification, SourceExpression, SourceSpecification, SpriteSpecification, StylePropertyExpression, StylePropertySpecification, StyleSpecification, TerrainSpecification, TransitionSpecification, VariableAnchorOffsetCollection } from '@maplibre/maplibre-gl-style-spec';
import { AnnotationCollection, AnnotationSymbol, AreaCollection, AreaId, BaseTextAreaProperties, Category as MVFCategory, CategoryId, Connection as MVFConnection, Details, EnterpriseCategory as MVFEnterpriseCategory, EnterpriseCategory as MvfEnterpriseCategory, EnterpriseCategoryId as MVFEnterpriseCategoryId, EnterpriseLocation as MVFEnterpriseLocation, EnterpriseLocation as MvfEnterpriseLocation, EnterpriseLocationId as MVFEnterpriseLocationId, EnterpriseLocationInstance, EnterpriseTexture, EnterpriseVenue as MVFEnterpriseVenue, EntranceCollection, EntranceFeature, Facade as MVFFacade, Feature, Feature as MVFFeature, FeatureCollection, FloatingFloorTextProperties, FloorCollection, FloorId, FloorProperties as MVFFloor, FloorProperties as MvfFloor, FloorStack as MVFFloorStack, FloorStack as MvfFloorStack, FloorTextCommonProperties, Geometry, Hyperlink as MVFHyperlink, Image as MVFImage, Language, LineStringStyle, LineStringStyle as TMVFLineStringStyle, Location as MVFLocation, LocationId, LocationLink, LocationSocial, LocationState, MultiPolygon, NavigationFlagDeclarations, NodeCollection, NodeCollection as MVFNodeCollection, NodeId, ObstructionCollection, ObstructionFeature, ObstructionId, ObstructionProperties, OpeningHoursSpecification, OperationHours, ParsedMVF, ParsedMVF as TMVF, ParsedMVFLocalePack, Point, PointStyle, PointStyle as TMVFPointStyle, Polygon, PolygonStyle, PolygonStyle as TMVFPolygonStyle, SiblingGroup, SpaceCollection, SpaceFeature, SpaceId, SpaceProperties, Style as TMVFStyle, StyleCollection, StyleCollection as TMVFStyleCollection, TilesetStyle } from '@mappedin/mvf-v2';
import { ParsedMVF, RawMVF } from '@mappedin/mvf-v2/no-validator';
import { Group as TweenGroup, Tween } from '@tweenjs/tween.js';
import { BatchedMesh, BatchedMeshGeometryRange, BufferAttribute, BufferGeometry, Camera, Camera as ThreeCamera, Color, Group, Intersection, LineSegments, Mesh, MeshLambertMaterial, MeshLambertMaterialParameters, Object3D, Object3DEventMap, PerspectiveCamera, Plane, PlaneGeometry, Raycaster, Scene, ShaderMaterial, Texture, TubeGeometry, Vector2, Vector3, WebGLRenderer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

declare const VALID_CONTEXTS: readonly [
	"websdk",
	"web",
	"webv2",
	"kiosk-v2",
	"mobile",
	"iossdk",
	"androidsdk",
	"reactnativesdk",
	"gen7",
	"bespoke",
	"reactsdk"
];
type ValidContext = (typeof VALID_CONTEXTS)[number];
declare const FOUND_POSITION = "found-position";
declare const FOUND_FLOOR = "found-floor";
type BlueDotEvents = typeof FOUND_FLOOR | typeof FOUND_POSITION;
declare class AnalyticsInternal {
	#private;
	private oneTimeEventsSent;
	constructor();
	init(options: AnalyticsUpdateOptions): void;
	/**
	 * Reset state and options
	 */
	reset(): void;
	private updateStateWithOptions;
	updateState(update: UpdateStateParam): void;
	private handleStateUpdate;
	get authReady(): boolean;
	getState(): AnalyticState;
	private getContext;
	private getSessionId;
	private getDeviceId;
	private sendAnalyticEvent;
	capture<T extends keyof CaptureEventsPayloadMap>(eventName: T, query: CaptureEventsPayloadMap[T]): Promise<Response> | Promise<void>;
	capture<T extends keyof CaptureEventsPayloadMap | (string & NonNullable<unknown>)>(target: T, query: T extends keyof CaptureEventsPayloadMap ? CaptureEventsPayloadMap[T] : Record<string, any>): Promise<Response> | Promise<void>;
	/**
	 * @internal
	 */
	sendGetMapDataEvent(payload: {
		parseDuration: number;
		downloadDuration: number;
		viewId?: string;
	}): void | Promise<Response> | Promise<void>;
	sendChangeLanguageEvent(payload: {
		fromLanguage: string;
	}): void | Promise<Response> | Promise<void>;
	sendWatchPositionDenied(): void | Promise<Response> | Promise<void>;
	/**
	 * @internal
	 */
	sendMapViewLoadedEvent({ firstRenderDuration, dimension, collisionWorkerDisabled, outdoorsWorkerDisabled, }: {
		firstRenderDuration: number;
		dimension: {
			height: number;
			width: number;
		};
		/**
		 * True when setWorkerURL is set, but the worker file cannot be found, so we disable the collision worker and use sync collision detection instead
		 */
		collisionWorkerDisabled: boolean;
		/**
		 * True when setWorkerURL is set, but the worker file cannot be found, so we disable the outdoor context
		 */
		outdoorsWorkerDisabled: boolean;
	}): void | Promise<Response> | Promise<void>;
	/**
	 * @internal
	 */
	sendGetDirectionsEvent: (start: string, end: string, accessible?: boolean | undefined) => void;
	sendBlueDotEvents(event: BlueDotEvents): void | Promise<Response> | Promise<void>;
}
type UpdateStateParam = Partial<Pick<AnalyticState, "geolocationMode" | "context" | "logEvents" | "userPosition" | "mapId" | "sendEvents" | "logEvents" | "accessToken" | "sessionId" | "deviceId">>;
type CaptureEventsPayloadMap = {
	"$select-location": {
		id: string;
	};
	"$select-category": {
		id: string;
	};
	"$query-suggest": {
		query: string;
		suggestions?: string[];
	};
	"$query-search": {
		query: string;
		hits?: string[];
	};
};
export declare class Analytics {
	#private;
	/**
	 * @internal
	 */
	constructor(internalAnalytics: AnalyticsInternal);
	/**
	 * Captures an analytic event with a custom target and query payload.
	 *
	 * @param target - The event name or target can be one of: `$select-location`, `$select-category`, `$query-suggest`, `$query-search`
	 * @param query - The payload associated with the event.
	 * @returns A promise that resolves to the server response or void.
	 */
	capture: typeof AnalyticsInternal.prototype.capture;
	/**
	 * Updates the analytics state with the provided parameters.
	 * @param update - The state parameters to update.
	 */
	updateState: (update: TAnalyticsUpdateState) => void;
	/**
	 * Returns the current analytics state.
	 * @internal
	 * @returns the current analytics state
	 */
	getState(): {
		version: string;
		/** The platform string to be included in analytics. */
		platformString: string;
		/** The base URI for the analytics endpoint. */
		baseUri: string;
		/** The base URI with mapId appended. */
		analyticsBaseUrl: string;
		/** Flag to disable authentication. */
		noAuth: boolean;
		/** Flag to enable geolocation mode. */
		geolocationMode: boolean;
		/** The context in which the analytics are being used. */
		context: ValidContext;
		/** The last known user position. */
		userPosition?: AnalyticsUserPosition;
		/** The ID of the map to be used for analytics. */
		mapId?: string;
		/** Flag to enable logging of events. */
		logEvents: boolean;
		/** Flag to enable sending of events. */
		sendEvents: boolean;
		/** The API key for authentication. */
		key?: string;
		/** The API secret for authentication. */
		secret?: string;
		/** The access token for authentication. */
		accessToken?: string;
	};
	private getContext;
	private getSessionId;
	private getDeviceId;
}
type AnalyticsUserPosition = {
	bluedotTimestamp: number;
	latitude: number;
	longitude: number;
	floorLevel?: number;
	accuracy?: number;
};
type AnalyticsAuth = {
	/** The API key for authentication. */
	key?: string;
	/** The API secret for authentication. */
	secret?: string;
	/** The access token for authentication. */
	accessToken?: string;
};
type AnalyticState = {
	version: string;
	/** The platform string to be included in analytics. */
	platformString: string;
	/** The base URI for the analytics endpoint. */
	baseUri: string;
	/** The base URI with mapId appended. */
	analyticsBaseUrl: string;
	/** Flag to disable authentication. */
	noAuth: boolean;
	/** Flag to enable geolocation mode. */
	geolocationMode: boolean;
	/** @internal The device ID to be used for analytics. */
	deviceId: string;
	/** @internal The session ID to be used for analytics. */
	sessionId: string;
	/** The context in which the analytics are being used. */
	context: ValidContext;
	/** The last known user position. */
	userPosition?: AnalyticsUserPosition;
	/** The ID of the map to be used for analytics. */
	mapId?: string;
	/** Flag to enable logging of events. */
	logEvents: boolean;
	/** Flag to enable sending of events. */
	sendEvents: boolean;
} & AnalyticsAuth;
type AnalyticsOptions = Partial<Omit<AnalyticState, "version" | "analyticsBaseUrl" | "geolocationMode" | "userPosition">>;
type AnalyticsUpdateOptions = Omit<AnalyticsOptions, keyof AnalyticsAuth> & ((Required<Pick<AnalyticsAuth, "key" | "secret">> & Partial<Pick<AnalyticsAuth, "accessToken">>) | (Required<Pick<AnalyticsAuth, "accessToken">> & Partial<Pick<AnalyticsAuth, "key" | "secret">>));
/**
 * Options for updating the current state of analytics.
 * @interface
 */
export type TAnalyticsUpdateState = Pick<Partial<AnalyticState>, "logEvents" | "sendEvents" | "baseUri" | "accessToken">;
/**
 * The valid values for the "type" property of GeoJSON geometry objects.
 * https://tools.ietf.org/html/rfc7946#section-1.4
 */
export type GeoJsonGeometryTypes = Geometry$1["type"];
/**
 * The value values for the "type" property of GeoJSON Objects.
 * https://tools.ietf.org/html/rfc7946#section-1.4
 */
export type GeoJsonTypes = GeoJSON$1["type"];
/**
 * Bounding box
 * https://tools.ietf.org/html/rfc7946#section-5
 */
export type BBox = [
	number,
	number,
	number,
	number
] | [
	number,
	number,
	number,
	number,
	number,
	number
];
/**
 * A Position is an array of coordinates.
 * https://tools.ietf.org/html/rfc7946#section-3.1.1
 * Array should contain between two and three elements.
 * The previous GeoJSON specification allowed more elements (e.g., which could be used to represent M values),
 * but the current specification only allows X, Y, and (optionally) Z to be defined.
 */
export type Position = number[]; // [number, number] | [number, number, number];
/**
 * The base GeoJSON object.
 * https://tools.ietf.org/html/rfc7946#section-3
 * The GeoJSON specification also allows foreign members
 * (https://tools.ietf.org/html/rfc7946#section-6.1)
 * Developers should use "&" type in TypeScript or extend the interface
 * to add these foreign members.
 */
export interface GeoJsonObject {
	// Don't include foreign members directly into this type def.
	// in order to preserve type safety.
	// [key: string]: any;
	/**
	 * Specifies the type of GeoJSON object.
	 */
	type: GeoJsonTypes;
	/**
	 * Bounding box of the coordinate range of the object's Geometries, Features, or Feature Collections.
	 * The value of the bbox member is an array of length 2*n where n is the number of dimensions
	 * represented in the contained geometries, with all axes of the most southwesterly point
	 * followed by all axes of the more northeasterly point.
	 * The axes order of a bbox follows the axes order of geometries.
	 * https://tools.ietf.org/html/rfc7946#section-5
	 */
	bbox?: BBox | undefined;
}
/**
 * Union of GeoJSON objects.
 */
type GeoJSON$1 = Geometry$1 | Feature$1 | FeatureCollection$1;
/**
 * Geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3
 */
type Geometry$1 = Point$1 | MultiPoint | LineString | MultiLineString | Polygon$1 | MultiPolygon$1 | GeometryCollection;
export type GeometryObject = Geometry$1;
/**
 * Point geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.2
 */
interface Point$1 extends GeoJsonObject {
	type: "Point";
	coordinates: Position;
}
/**
 * MultiPoint geometry object.
 *  https://tools.ietf.org/html/rfc7946#section-3.1.3
 */
export interface MultiPoint extends GeoJsonObject {
	type: "MultiPoint";
	coordinates: Position[];
}
/**
 * LineString geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.4
 */
export interface LineString extends GeoJsonObject {
	type: "LineString";
	coordinates: Position[];
}
/**
 * MultiLineString geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.5
 */
export interface MultiLineString extends GeoJsonObject {
	type: "MultiLineString";
	coordinates: Position[][];
}
/**
 * Polygon geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.6
 */
interface Polygon$1 extends GeoJsonObject {
	type: "Polygon";
	coordinates: Position[][];
}
/**
 * MultiPolygon geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.7
 */
interface MultiPolygon$1 extends GeoJsonObject {
	type: "MultiPolygon";
	coordinates: Position[][][];
}
/**
 * Geometry Collection
 * https://tools.ietf.org/html/rfc7946#section-3.1.8
 */
export interface GeometryCollection extends GeoJsonObject {
	type: "GeometryCollection";
	geometries: Geometry$1[];
}
export type GeoJsonProperties = {
	[name: string]: any;
} | null;
/**
 * A feature object which contains a geometry and associated properties.
 * https://tools.ietf.org/html/rfc7946#section-3.2
 */
interface Feature$1<G extends Geometry$1 | null = Geometry$1, P = GeoJsonProperties> extends GeoJsonObject {
	type: "Feature";
	/**
	 * The feature's geometry
	 */
	geometry: G;
	/**
	 * A value that uniquely identifies this feature in a
	 * https://tools.ietf.org/html/rfc7946#section-3.2.
	 */
	id?: string | number | undefined;
	/**
	 * Properties associated with this feature.
	 */
	properties: P;
}
/**
 * A collection of feature objects.
 *  https://tools.ietf.org/html/rfc7946#section-3.3
 */
interface FeatureCollection$1<G extends Geometry$1 | null = Geometry$1, P = GeoJsonProperties> extends GeoJsonObject {
	type: "FeatureCollection";
	features: Array<Feature$1<G, P>>;
}
/**
 * Represents the environment state configuration.
 * @example
 * const mapData = getMapData({
 *  key: '',
 *  secret: '',
 *  environment: 'eu'
 * })
 */
export type Environment = {
	/**
	 * The base URI for the API.
	 */
	baseUri: string;
	/**
	 * The base URI for authentication.
	 */
	baseAuthUri: string;
	/**
	 * The base URI for analytics.
	 */
	analyticsBaseUri: string;
	/**
	 * The URI for the tile server.
	 */
	tileServerUri: string;
};
type InternalServiceEnvironment = "us" | "us-enterprise" | "eu" | "us-staging-enterprise" | "us-staging-self-serve";
type ServiceEnvironment = "us" | "eu";
/**
 * Options for configuring search functionality.
 */
export type TSearchOptions = {
	/**
	 * Indicates whether search functionality is enabled.
	 */
	enabled: boolean;
};
export type TGetMapDataSharedOptions = {
	/**
	 * Mappedin map ID.
	 */
	mapId: string;
	/**
	 * Optionally provide a custom base URL for the Mappedin API request.
	 * Use the {@link Environment | `environment`} setting to switch environments
	 */
	baseUri?: string;
	/**
	 * Optionally provide a custom base URL for authentication when obtaining an access token.
	 * Use the {@link Environment | `environment`} setting to switch environments.
	 */
	baseAuthUri?: string;
	/**
	 * Optionally provide an entirely custom URL for authentication when obtaining an access token.
	 * @hidden
	 * @internal
	 */
	customAuthUri?: string;
	/**
	 * Callback for when the Mappedin map data has been fetched and parsed as Mappedin Venue Format (MVF) data.
	 * @param mvf Parsed MVF data.
	 */
	onMVFParsed?: (mvf: ParsedMVF) => void;
	/**
	 * Load different view of mvf data based on configId
	 */
	viewId?: string;
	/**
	 * set the target SDK environment
	 * @default 'us'
	 * @example
	 * const mapData = getMapData({
	 *  key: '',
	 *  secret: '',
	 *  environment: 'eu'
	 * })
	 */
	environment?: ServiceEnvironment;
	/**
	 * The language of the map data.
	 * The ISO 639-1 language code to change to (e.g., 'en' for English, 'fr' for French). Check ({@link EnterpriseVenue.languages}) for available languages
	 */
	language?: string;
	/**
	 * Whether to use browser's language settings as fallback if the supplied language code is not available.
	 * @default true
	 * */
	fallbackToNavigatorLanguage?: boolean;
	/**
	 * Analytics configuration.
	 */
	analytics?: {
		/**
		 * Whether to log analytics events.
		 * @default false
		 */
		logEvents?: boolean;
		/**
		 * Whether to send analytics events to the server.
		 * @default false
		 */
		sendEvents?: boolean;
		/**
		 * Custom base URI for analytics requests. If not provided, the default analytics endpoint will be used.
		 * Use the {@link Environment | `environment`} setting to switch environments.
		 */
		baseUri?: string;
		/**
		 * Context for analytics events.
		 * @default 'websdk'
		 * @internal
		 */
		context?: string;
	};
	search?: TSearchOptions;
	/**
	 * Fetch bearer and SAS tokens for the map ahead of time and keep them up to date in the background.
	 * @default true
	 */
	prefetchTokens?: boolean;
	/**
	 * @hidden
	 * @internal
	 */
	layoutId?: "draft";
	/**
	 * @hidden
	 * @internal
	 */
	mvfVersion?: "2.0.0" | "2.0.0-c" | "3.0.0";
};
/**
 * @interface
 */
export type TGetMapDataWithCredentialsOptions = {
	/**
	 * Mappedin auth key.
	 */
	key: string;
	/**
	 * Mappedin auth secret.
	 */
	secret: string;
} & TGetMapDataSharedOptions;
/**
 * @interface
 */
export type TGetMapDataWithAccessTokenOptions = {
	/**
	 * Mappedin access token.
	 */
	accessToken: string;
} & TGetMapDataSharedOptions;
export type TGetMapDataOptions = TGetMapDataWithCredentialsOptions | TGetMapDataWithAccessTokenOptions;
/**
 * @internal
 */
declare function parseMVFv2(raw: RawMVF): ParsedMVF;
/**
 * @internal
 */
declare function unzipMVFv2(data: Uint8Array): Promise<RawMVF>;
type LocalePackUrls = {
	[key: string]: string;
};
declare function createEnvControl(): {
	/**
	 * @internal
	 */
	updateByUserOption(userOption: TGetMapDataOptions): void;
	/**
	 * @internal
	 */
	updateTileServerBaseUrl(url: string): void;
	/**
	 * @internal
	 */
	updateEnvironment(env: InternalServiceEnvironment): void;
	/**
	 * @internal
	 */
	setEnterprise(isEnterprise: boolean): void;
	getBaseUri(): string;
	getBaseAuthUri(): string;
	getAnalyticsBaseUri(): string;
	getTileServerUri(): string;
	reset(): void;
	/**
	 * @internal
	 */
	__getState: () => Environment;
};
type EnvControl = ReturnType<typeof createEnvControl>;
export declare function unzipAndParseMVFv2(data: Uint8Array, inputVersion?: string): Promise<ParsedMVF>;
type TDrawFn = (ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, x: number, y: number) => void;
type MaterialSide = "back" | "front" | "double";
type Style = {
	color: string;
	width: number;
	opacity: number;
	visible: boolean;
	height: number;
	altitude: number;
	join: LineStyle["join"];
	cap: LineStyle["cap"];
	topColor?: string;
	showImage: boolean;
	flipImageToFaceCamera: boolean;
	enableImageCollisions: boolean;
	url?: string;
	side?: MaterialSide;
	renderOrder?: number;
	shading?: Shading;
	bevel?: BevelState;
	borderVisible: boolean;
	borderColor?: string;
	borderWidth?: number;
};
declare class StyleComponent implements Style {
	#private;
	initialColor: string;
	set color(color: string);
	get color(): string;
	initialTopColor?: string;
	set topColor(color: string | undefined);
	get topColor(): string | undefined;
	set hoverColor(color: string);
	get hoverColor(): string | undefined;
	dirty: boolean;
	visible: boolean;
	opacity: number;
	width: number;
	height: number;
	initialHeight: number;
	altitude: number;
	join: LineStyle["join"];
	cap: LineStyle["cap"];
	showImage: boolean;
	flipImageToFaceCamera: boolean;
	enableImageCollisions: boolean;
	url?: string;
	side: MaterialSide;
	renderOrder: number;
	shading?: Shading;
	bevel?: BevelState;
	borderVisible: boolean;
	borderColor: string;
	borderWidth: number;
	constructor(style?: Partial<Style>);
}
declare class Text3DStyleComponent implements Partial<Text3DStyle> {
	visible?: boolean;
	altitude?: number;
	color?: string;
	dirty: boolean;
	maxWidth?: number;
	maxHeight?: number;
	hoverByPolygon?: boolean;
	flipToFaceCamera?: boolean | undefined;
	font?: string;
	fillOpacity?: number;
	fontSize?: number;
	margin?: number;
	outlineWidth?: number;
	outlineBlur?: number | string;
	outlineOffsetX?: number;
	strokeColor?: string;
	strokeOpacity?: number;
	strokeWidth?: number;
	hoverColor?: string | undefined;
	outlineOffsetY?: number;
	outlineColor?: string;
	outlineOpacity?: number;
	constructor(initialState?: Partial<Text3DStyle>);
	/**
	 * Put together a json ignore all the undefined fields.
	 * This is helpful when we Object.assign(instance, json) to update the instance.
	 */
	getState(includeDirty?: boolean): Partial<Text3DStyle>;
}
type Text3DStyle = {
	/**
	 * Controls the visibility of the text element.
	 * @default true
	 */
	visible: boolean;
	/**
	 * The color of the text. Will change to hoverColor when the associated polygon is hovered.
	 * Accepts any CSS color string.
	 * @default 'black'
	 */
	color: string;
	/**
	 * When true, the text will flip to face the camera while maintaining its position.
	 * @default true
	 */
	flipToFaceCamera: boolean;
	/**
	 * URL to a custom font file (.ttf, .otf, .woff).
	 * Falls back to Roboto if undefined.
	 */
	font: string | undefined;
	/**
	 * The size of the text in meters. Will be automatically adjusted if it exceeds
	 * the text area bounds.
	 */
	fontSize: number;
	/**
	 * Padding between the text and its bounding box, in meters.
	 * Can be specified as either:
	 * - A single number for uniform padding on all sides
	 * - An array of 4 numbers [top, right, bottom, left] for individual side padding
	 * @default [0.2, 1, 0.2, 1.5]
	 */
	margin: number | [
		number,
		number,
		number,
		number
	];
	/**
	 * Color of the text outline.
	 * Accepts any CSS color string.
	 * @default 'black'
	 */
	outlineColor: string;
	/**
	 * Opacity of the text outline.
	 * Accepts values between 0 and 1.
	 * @default 1
	 */
	outlineOpacity: number;
	/**
	 * Blur radius for the text outline.
	 * Can be a number in pixels or a string with units.
	 */
	outlineBlur: number | string;
	/**
	 * Width of the text outline effect in pixels.
	 */
	outlineWidth: number;
	/**
	 * Horizontal offset of the outline effect from the text, in pixels.
	 */
	outlineOffsetX: number;
	/**
	 * Vertical offset of the outline effect from the text, in pixels.
	 */
	outlineOffsetY: number;
	/**
	 * Width of the inner stroke of each text glyph.
	 * @default 0
	 */
	strokeWidth: number;
	/**
	 * Maximum width constraint for the text area in meters.
	 * Overrides default text field constraints when set.
	 */
	maxWidth: number | undefined;
	/**
	 * Maximum height constraint for the text area in meters.
	 * Overrides default text field constraints when set.
	 */
	maxHeight: number | undefined;
	/**
	 * Opacity of the text stroke when strokeWidth > 0.
	 * @default 1
	 */
	strokeOpacity: number;
	/**
	 * Color of the text stroke when strokeWidth > 0.
	 * Accepts any CSS color string.
	 * @default 'black'
	 */
	strokeColor: string;
	/**
	 * Opacity of the text fill, independent of stroke and outline opacity.
	 * Set to 0 to show only stroke/outline.
	 * Accepts values between 0 and 1.
	 */
	fillOpacity: number;
	/**
	 * Color to display when text is hovered.
	 * Falls back to global hover color if undefined.
	 */
	hoverColor: string | undefined;
};
type MaterialStyle = {
	color: string;
};
type ModelStyle = {
	/**
	 * Model's URL. Can be based64 inlined url.
	 */
	url: string;
	/**
	 * Visiiblity of the model group
	 */
	visible: boolean;
	/**
	 * Opacity of the model group.
	 */
	opacity: number;
	/**
	 * Change material state by name
	 * @example
	 * ```ts
	 * mapView.Models.add(
	 *   { target: new Coordinate(45, -75) },
	 *   {
	 *     url: 'bed.glb',
	 *     materials: {
	 *       Default: {
	 *         color: MAPPEDIN_COLOR.orange,
	 *       },
	 *     },
	 *   },
	 * );
	 * ```
	 */
	material: {
		[name: string]: MaterialStyle;
	};
	/**
	 * vertical offset of the model in meters off the floor
	 */
	verticalOffset: number;
	/**
	 * Color property designed for use with @mappedin/3d-assets.
	 * Updates the accent color of 3d assets by applying the color to materials named
	 * ['Default', 'Fabric', 'Mpdn_Logo', 'Fabric_Logo'].
	 * For custom colors on non-Mappedin models, use the `material` property.
	 * If both the `material` and `color` properties are provided, `material` property updates will take higher precedence than `color` property updates.
	 */
	color: string;
	/**
	 * The rotation of the model in degrees [x, y, z].
	 * - x: Rotation around x-axis (pitch)
	 * - y: Rotation around y-axis (yaw)
	 * - z: Rotation around z-axis (roll), where z points up
	 *
	 * Rotations are applied in order: x, then y, then z.
	 * 0 degrees means the model faces north (or the parent group's forward direction).
	 * Positive rotations follow the right-hand rule.
	 */
	rotation: [
		number,
		number,
		number
	];
	/**
	 * The scale of the model in [x, y, z]
	 */
	scale: [
		number,
		number,
		number
	];
	/**
	 * Whether the model should be visible through geometry.
	 */
	visibleThroughGeometry: boolean;
	/**
	 * The clipping plane z offset of the model.
	 * @default Infinity
	 */
	clippingPlaneZOffset: number;
	/**
	 * The color of the top of the clipping plane.
	 */
	clippingPlaneTopColor: string;
	/**
	 * Whether the clipping plane is visible.
	 * @experimental
	 * @default true
	 */
	clippingPlaneTopVisible: boolean;
};
declare class ModelStyleComponnet implements Partial<ModelStyle> {
	dirty: boolean;
	visible: boolean;
	opacity: number;
	verticalOffset: number;
	interactive: boolean;
	color?: string;
	material?: ModelStyle["material"];
	rotation?: [
		number,
		number,
		number
	];
	scale?: [
		number,
		number,
		number
	];
	visibleThroughGeometry: boolean;
	clippingPlaneZOffset: number;
	clippingPlaneTopColor?: string;
	clippingPlaneTopVisible: boolean;
	constructor(init?: Partial<ModelStyle>);
}
type GeometryGroupState = {
	readonly id: string | number;
	readonly type: "geometry-group";
	/**
	 * The ids of the children of the geometry group
	 */
	readonly children: (string | number)[];
	/**
	 * Whether the geometry group is visible
	 */
	visible: boolean;
	/**
	 * Whether the geometry group is interactive, which means it can be hovered over and clicked on.
	 * This will affect all children of the geometry group and override their interactive state.
	 *
	 * @example
	 * ```javascript
	 * 	renderer.on('click', ({ geometry }) => {});
	 * ```
	 */
	interactive: boolean;
	altitude?: number;
	opacity?: number;
	color?: string;
	height?: number;
	texture?: string;
	topColor?: string;
	topTexture?: string;
	outline?: boolean;
	shading?: Shading;
	side?: MaterialSide;
	/**
	 * Bevel configuration for extruded shapes.
	 */
	bevel?: BevelState;
};
declare class GeometryGroupObject3D extends Object3D {
	visible: boolean;
	readonly type: "geometry-group";
	components: never[];
	userData: {
		entityId: string | number;
		entities3D: Set<string | number>;
		modelURL?: string;
		dirty: boolean;
		shadingDirty: boolean;
	};
	setVisible(visible: boolean): void;
	removeEntity(): void;
	constructor(id: string);
	/**
	 * Get first child entity of a group if it's a batched mesh
	 * We use this logic a lot for getting the material of the group. since group does not have material and batched mesh does
	 */
	getfirstChildEntityId(): string | number | undefined;
}
declare class InteractionComponent {
	hover: boolean | "user-interaction";
	dirty: boolean;
}
declare class BatchedStandardMaterial extends MeshLambertMaterial {
	private propertiesTexture;
	texturesVisible: boolean;
	private uniforms;
	private colorSpace;
	constructor(params: MeshLambertMaterialParameters, geometryCount: number, scaleFactor?: number);
	/**
	 * These control the repeat factor of the texture in the Y direction.
	 * So when we scale a geometry, it needs to scale the texture as well.
	 * For now this only applies to detached geometries.
	 */
	get repeatYFactor(): number;
	set repeatYFactor(value: number);
	get texture(): Texture | null;
	set texture(texture: Texture | null);
	get topTexture(): Texture | null;
	set topTexture(texture: Texture | null);
	get blendTexture(): boolean;
	set blendTexture(value: boolean);
	setGradientShading(start: number, end: number, intensity: number): void;
	getGradientShading(): {
		start: any;
		end: any;
		intensity: any;
	};
	setColor(batchId: number, color: Color, topColor: Color): void;
	getColor(batchId: number): {
		color: Color;
		topColor: Color;
	};
	showTextures: (batchId: number) => void;
	hideTextures(batchId: number): void;
	removeSideTexture(batchId: number): void;
	removeTopTexture(batchId: number): void;
	dispose(): void;
}
interface StandardSchemaV1<Input = unknown, Output = Input> {
	/** The Standard Schema properties. */
	readonly "~standard": StandardSchemaV1.Props<Input, Output>;
}
declare namespace StandardSchemaV1 {
	/** The Standard Schema properties interface. */
	interface Props<Input = unknown, Output = Input> {
		/** The version number of the standard. */
		readonly version: 1;
		/** The vendor name of the schema library. */
		readonly vendor: string;
		/** Validates unknown input values. */
		readonly validate: (value: unknown) => Result<Output> | Promise<Result<Output>>;
		/** Inferred types associated with the schema. */
		readonly types?: Types<Input, Output> | undefined;
	}
	/** The result interface of the validate function. */
	type Result<Output> = SuccessResult<Output> | FailureResult;
	/** The result interface if validation succeeds. */
	interface SuccessResult<Output> {
		/** The typed output value. */
		readonly value: Output;
		/** The non-existent issues. */
		readonly issues?: undefined;
	}
	/** The result interface if validation fails. */
	interface FailureResult {
		/** The issues of failed validation. */
		readonly issues: ReadonlyArray<Issue>;
	}
	/** The issue interface of the failure output. */
	interface Issue {
		/** The error message of the issue. */
		readonly message: string;
		/** The path of the issue, if any. */
		readonly path?: ReadonlyArray<PropertyKey | PathSegment> | undefined;
	}
	/** The path segment interface of the issue. */
	interface PathSegment {
		/** The key representing a path segment. */
		readonly key: PropertyKey;
	}
	/** The Standard Schema types interface. */
	interface Types<Input = unknown, Output = Input> {
		/** The input type of the schema. */
		readonly input: Input;
		/** The output type of the schema. */
		readonly output: Output;
	}
	/** Infers the input type of a Standard Schema. */
	type InferInput<Schema extends StandardSchemaV1> = NonNullable<Schema["~standard"]["types"]>["input"];
	/** Infers the output type of a Standard Schema. */
	type InferOutput<Schema extends StandardSchemaV1> = NonNullable<Schema["~standard"]["types"]>["output"];
}
type JSONType = string | number | boolean | null | JSONType[] | {
	[key: string]: JSONType;
};
type JWTAlgorithm = "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "EdDSA" | (string & {});
type HashAlgorithm = "md5" | "sha1" | "sha256" | "sha384" | "sha512";
type HashEncoding = "hex" | "base64" | "base64url";
type HashFormat = `${HashAlgorithm}_${HashEncoding}`;
type IPVersion = "v4" | "v6";
type MimeTypes = "application/json" | "application/xml" | "application/x-www-form-urlencoded" | "application/javascript" | "application/pdf" | "application/zip" | "application/vnd.ms-excel" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" | "application/msword" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "application/vnd.ms-powerpoint" | "application/vnd.openxmlformats-officedocument.presentationml.presentation" | "application/octet-stream" | "application/graphql" | "text/html" | "text/plain" | "text/css" | "text/javascript" | "text/csv" | "image/png" | "image/jpeg" | "image/gif" | "image/svg+xml" | "image/webp" | "audio/mpeg" | "audio/ogg" | "audio/wav" | "audio/webm" | "video/mp4" | "video/webm" | "video/ogg" | "font/woff" | "font/woff2" | "font/ttf" | "font/otf" | "multipart/form-data" | (string & {});
type ParsedTypes = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "file" | "date" | "array" | "map" | "set" | "nan" | "null" | "promise";
type AssertEqual<T, U> = (<V>() => V extends T ? 1 : 2) extends <V>() => V extends U ? 1 : 2 ? true : false;
type AssertNotEqual<T, U> = (<V>() => V extends T ? 1 : 2) extends <V>() => V extends U ? 1 : 2 ? false : true;
type AssertExtends<T, U> = T extends U ? T : never;
type IsAny<T> = 0 extends 1 & T ? true : false;
type Omit$1<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type OmitKeys<T, K extends string> = Pick<T, Exclude<keyof T, K>>;
type MakePartial<T, K extends keyof T> = Omit$1<T, K> & InexactPartial<Pick<T, K>>;
type MakeRequired<T, K extends keyof T> = Omit$1<T, K> & Required<Pick<T, K>>;
type Exactly<T, X> = T & Record<Exclude<keyof X, keyof T>, never>;
type NoUndefined<T> = T extends undefined ? never : T;
type Whatever = {} | undefined | null;
type LoosePartial<T extends object> = InexactPartial<T> & {
	[k: string]: unknown;
};
type Mask<Keys extends PropertyKey> = {
	[K in Keys]?: true;
};
type Writeable<T> = {
	-readonly [P in keyof T]: T[P];
} & {};
type InexactPartial<T> = {
	[P in keyof T]?: T[P] | undefined;
};
type EmptyObject = Record<string, never>;
type BuiltIn = (((...args: any[]) => any) | (new (...args: any[]) => any)) | {
	readonly [Symbol.toStringTag]: string;
} | Date | Error | Generator | Promise<unknown> | RegExp;
type MakeReadonly<T> = T extends Map<infer K, infer V> ? ReadonlyMap<K, V> : T extends Set<infer V> ? ReadonlySet<V> : T extends [
	infer Head,
	...infer Tail
] ? readonly [
	Head,
	...Tail
] : T extends Array<infer V> ? ReadonlyArray<V> : T extends BuiltIn ? T : Readonly<T>;
type SomeObject = Record<PropertyKey, any>;
type Identity<T> = T;
type Flatten<T> = Identity<{
	[k in keyof T]: T[k];
}>;
type Mapped<T> = {
	[k in keyof T]: T[k];
};
type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};
type NoNeverKeys<T> = {
	[k in keyof T]: [
		T[k]
	] extends [
		never
	] ? never : k;
}[keyof T];
type NoNever<T> = Identity<{
	[k in NoNeverKeys<T>]: k extends keyof T ? T[k] : never;
}>;
type Extend<A extends SomeObject, B extends SomeObject> = Flatten<keyof A & keyof B extends never ? A & B : {
	[K in keyof A as K extends keyof B ? never : K]: A[K];
} & {
	[K in keyof B]: B[K];
}>;
type TupleItems = ReadonlyArray<schemas.SomeType>;
type AnyFunc = (...args: any[]) => any;
type IsProp<T, K extends keyof T> = T[K] extends AnyFunc ? never : K;
type MaybeAsync<T> = T | Promise<T>;
type KeyOf<T> = keyof OmitIndexSignature<T>;
type OmitIndexSignature<T> = {
	[K in keyof T as string extends K ? never : K extends string ? K : never]: T[K];
};
type ExtractIndexSignature<T> = {
	[K in keyof T as string extends K ? K : K extends string ? never : K]: T[K];
};
type Keys<T extends object> = keyof OmitIndexSignature<T>;
type SchemaClass<T extends schemas.SomeType> = {
	new (def: T["_zod"]["def"]): T;
};
type EnumValue = string | number;
type EnumLike = Readonly<Record<string, EnumValue>>;
type ToEnum<T extends EnumValue> = Flatten<{
	[k in T]: k;
}>;
type KeysEnum<T extends object> = ToEnum<Exclude<keyof T, symbol>>;
type KeysArray<T extends object> = Flatten<(keyof T & string)[]>;
type Literal = string | number | bigint | boolean | null | undefined;
type LiteralArray = Array<Literal>;
type Primitive = string | number | symbol | bigint | boolean | null | undefined;
type PrimitiveArray = Array<Primitive>;
type HasSize = {
	size: number;
};
type HasLength = {
	length: number;
};
type Numeric = number | bigint | Date;
type SafeParseResult<T> = SafeParseSuccess<T> | SafeParseError<T>;
type SafeParseSuccess<T> = {
	success: true;
	data: T;
	error?: never;
};
type SafeParseError<T> = {
	success: false;
	data?: never;
	error: $ZodError<T>;
};
type PropValues = Record<string, Set<Primitive>>;
type PrimitiveSet = Set<Primitive>;
declare function assertEqual<A, B>(val: AssertEqual<A, B>): AssertEqual<A, B>;
declare function assertNotEqual<A, B>(val: AssertNotEqual<A, B>): AssertNotEqual<A, B>;
declare function assertIs<T>(_arg: T): void;
declare function assertNever(_x: never): never;
declare function assert<T>(_: any): asserts _ is T;
declare function getEnumValues(entries: EnumLike): EnumValue[];
declare function joinValues<T extends Primitive[]>(array: T, separator?: string): string;
declare function jsonStringifyReplacer(_: string, value: any): any;
declare function cached<T>(getter: () => T): {
	value: T;
};
declare function nullish(input: any): boolean;
declare function cleanRegex(source: string): string;
declare function floatSafeRemainder(val: number, step: number): number;
declare function defineLazy<T, K extends keyof T>(object: T, key: K, getter: () => T[K]): void;
declare function objectClone(obj: object): any;
declare function assignProp<T extends object, K extends PropertyKey>(target: T, prop: K, value: K extends keyof T ? T[K] : any): void;
declare function mergeDefs(...defs: Record<string, any>[]): any;
declare function cloneDef(schema: schemas.$ZodType): any;
declare function getElementAtPath(obj: any, path: (string | number)[] | null | undefined): any;
declare function promiseAllObject<T extends object>(promisesObj: T): Promise<{
	[k in keyof T]: Awaited<T[k]>;
}>;
declare function randomString(length?: number): string;
declare function esc(str: string): string;
declare const captureStackTrace: (targetObject: object, constructorOpt?: Function) => void;
declare function isObject(data: any): data is Record<PropertyKey, unknown>;
declare const allowsEval: {
	value: boolean;
};
declare function isPlainObject(o: any): o is Record<PropertyKey, unknown>;
declare function shallowClone(o: any): any;
declare function numKeys(data: any): number;
declare const getParsedType: (data: any) => ParsedTypes;
declare const propertyKeyTypes: Set<string>;
declare const primitiveTypes: Set<string>;
declare function escapeRegex(str: string): string;
declare function clone<T extends schemas.$ZodType>(inst: T, def?: T["_zod"]["def"], params?: {
	parent: boolean;
}): T;
type EmptyToNever<T> = keyof T extends never ? never : T;
type Normalize<T> = T extends undefined ? never : T extends Record<any, any> ? Flatten<{
	[k in keyof Omit$1<T, "error" | "message">]: T[k];
} & ("error" extends keyof T ? {
	error?: Exclude<T["error"], string>;
} : unknown)> : never;
declare function normalizeParams<T>(_params: T): Normalize<T>;
declare function createTransparentProxy<T extends object>(getter: () => T): T;
declare function stringifyPrimitive(value: any): string;
declare function optionalKeys(shape: schemas.$ZodShape): string[];
type CleanKey<T extends PropertyKey> = T extends `?${infer K}` ? K : T extends `${infer K}?` ? K : T;
type ToCleanMap<T extends schemas.$ZodLooseShape> = {
	[k in keyof T]: k extends `?${infer K}` ? K : k extends `${infer K}?` ? K : k;
};
type FromCleanMap<T extends schemas.$ZodLooseShape> = {
	[k in keyof T as k extends `?${infer K}` ? K : k extends `${infer K}?` ? K : k]: k;
};
declare const NUMBER_FORMAT_RANGES: Record<$ZodNumberFormats, [
	number,
	number
]>;
declare const BIGINT_FORMAT_RANGES: Record<$ZodBigIntFormats, [
	bigint,
	bigint
]>;
declare function pick(schema: schemas.$ZodObject, mask: Record<string, unknown>): any;
declare function omit(schema: schemas.$ZodObject, mask: object): any;
declare function extend(schema: schemas.$ZodObject, shape: schemas.$ZodShape): any;
declare function safeExtend(schema: schemas.$ZodObject, shape: schemas.$ZodShape): any;
declare function merge(a: schemas.$ZodObject, b: schemas.$ZodObject): any;
declare function partial(Class: SchemaClass<schemas.$ZodOptional> | null, schema: schemas.$ZodObject, mask: object | undefined): any;
declare function required(Class: SchemaClass<schemas.$ZodNonOptional>, schema: schemas.$ZodObject, mask: object | undefined): any;
type Constructor<T, Def extends any[] = any[]> = new (...args: Def) => T;
declare function aborted(x: schemas.ParsePayload, startIndex?: number): boolean;
declare function prefixIssues(path: PropertyKey, issues: $ZodRawIssue[]): $ZodRawIssue[];
declare function unwrapMessage(message: string | {
	message: string;
} | undefined | null): string | undefined;
declare function finalizeIssue(iss: $ZodRawIssue, ctx: schemas.ParseContextInternal | undefined, config: $ZodConfig): $ZodIssue;
declare function getSizableOrigin(input: any): "set" | "map" | "file" | "unknown";
declare function getLengthableOrigin(input: any): "array" | "string" | "unknown";
declare function issue(_iss: string, input: any, inst: any): $ZodRawIssue;
declare function issue(_iss: $ZodRawIssue): $ZodRawIssue;
declare function cleanEnum(obj: Record<string, EnumValue>): EnumValue[];
declare function base64ToUint8Array(base64: string): InstanceType<typeof Uint8Array>;
declare function uint8ArrayToBase64(bytes: Uint8Array): string;
declare function base64urlToUint8Array(base64url: string): InstanceType<typeof Uint8Array>;
declare function uint8ArrayToBase64url(bytes: Uint8Array): string;
declare function hexToUint8Array(hex: string): InstanceType<typeof Uint8Array>;
declare function uint8ArrayToHex(bytes: Uint8Array): string;
declare abstract class Class {
	constructor(..._args: any[]);
}
declare const version: {
	readonly major: 4;
	readonly minor: 1;
	readonly patch: number;
};
interface ParseContext<T extends $ZodIssueBase = never> {
	/** Customize error messages. */
	readonly error?: $ZodErrorMap<T>;
	/** Include the `input` field in issue objects. Default `false`. */
	readonly reportInput?: boolean;
	/** Skip eval-based fast path. Default `false`. */
	readonly jitless?: boolean;
}
interface ParseContextInternal<T extends $ZodIssueBase = never> extends ParseContext<T> {
	readonly async?: boolean | undefined;
	readonly direction?: "forward" | "backward";
	readonly skipChecks?: boolean;
}
interface ParsePayload<T = unknown> {
	value: T;
	issues: $ZodRawIssue[];
	/** A may to mark a whole payload as aborted. Used in codecs/pipes. */
	aborted?: boolean;
}
type CheckFn<T> = (input: ParsePayload<T>) => util.MaybeAsync<void>;
interface $ZodTypeDef {
	type: "string" | "number" | "int" | "boolean" | "bigint" | "symbol" | "null" | "undefined" | "void" | "never" | "any" | "unknown" | "date" | "object" | "record" | "file" | "array" | "tuple" | "union" | "intersection" | "map" | "set" | "enum" | "literal" | "nullable" | "optional" | "nonoptional" | "success" | "transform" | "default" | "prefault" | "catch" | "nan" | "pipe" | "readonly" | "template_literal" | "promise" | "lazy" | "function" | "custom";
	error?: $ZodErrorMap<never> | undefined;
	checks?: $ZodCheck<never>[];
}
interface _$ZodTypeInternals {
	/** The `@zod/core` version of this schema */
	version: typeof version;
	/** Schema definition. */
	def: $ZodTypeDef;
	/** @internal Randomly generated ID for this schema. */
	/** @internal List of deferred initializers. */
	deferred: util.AnyFunc[] | undefined;
	/** @internal Parses input and runs all checks (refinements). */
	run(payload: ParsePayload<any>, ctx: ParseContextInternal): util.MaybeAsync<ParsePayload>;
	/** @internal Parses input, doesn't run checks. */
	parse(payload: ParsePayload<any>, ctx: ParseContextInternal): util.MaybeAsync<ParsePayload>;
	/** @internal  Stores identifiers for the set of traits implemented by this schema. */
	traits: Set<string>;
	/** @internal Indicates that a schema output type should be considered optional inside objects.
	 * @default Required
	 */
	/** @internal */
	optin?: "optional" | undefined;
	/** @internal */
	optout?: "optional" | undefined;
	/** @internal The set of literal values that will pass validation. Must be an exhaustive set. Used to determine optionality in z.record().
	 *
	 * Defined on: enum, const, literal, null, undefined
	 * Passthrough: optional, nullable, branded, default, catch, pipe
	 * Todo: unions?
	 */
	values?: util.PrimitiveSet | undefined;
	/** Default value bubbled up from  */
	/** @internal A set of literal discriminators used for the fast path in discriminated unions. */
	propValues?: util.PropValues | undefined;
	/** @internal This flag indicates that a schema validation can be represented with a regular expression. Used to determine allowable schemas in z.templateLiteral(). */
	pattern: RegExp | undefined;
	/** @internal The constructor function of this schema. */
	constr: new (def: any) => $ZodType;
	/** @internal A catchall object for bag metadata related to this schema. Commonly modified by checks using `onattach`. */
	bag: Record<string, unknown>;
	/** @internal The set of issues this schema might throw during type checking. */
	isst: $ZodIssueBase;
	/** An optional method used to override `toJSONSchema` logic. */
	toJSONSchema?: () => unknown;
	/** @internal The parent of this schema. Only set during certain clone operations. */
	parent?: $ZodType | undefined;
}
interface $ZodTypeInternals<out O = unknown, out I = unknown> extends _$ZodTypeInternals {
	/** @internal The inferred output type */
	output: O;
	/** @internal The inferred input type */
	input: I;
}
type $ZodStandardSchema<T> = StandardSchemaV1.Props<input<T>, output<T>>;
type SomeType = {
	_zod: _$ZodTypeInternals;
};
interface $ZodType<O = unknown, I = unknown, Internals extends $ZodTypeInternals<O, I> = $ZodTypeInternals<O, I>> {
	_zod: Internals;
	"~standard": $ZodStandardSchema<this>;
}
interface _$ZodType<T extends $ZodTypeInternals = $ZodTypeInternals> extends $ZodType<T["output"], T["input"], T> {
}
declare const $ZodType: $constructor<$ZodType>;
interface $ZodStringDef extends $ZodTypeDef {
	type: "string";
	coerce?: boolean;
	checks?: $ZodCheck<string>[];
}
interface $ZodStringInternals<Input> extends $ZodTypeInternals<string, Input> {
	def: $ZodStringDef;
	/** @deprecated Internal API, use with caution (not deprecated) */
	pattern: RegExp;
	/** @deprecated Internal API, use with caution (not deprecated) */
	isst: $ZodIssueInvalidType;
	bag: util.LoosePartial<{
		minimum: number;
		maximum: number;
		patterns: Set<RegExp>;
		format: string;
		contentEncoding: string;
	}>;
}
interface $ZodString<Input = unknown> extends _$ZodType<$ZodStringInternals<Input>> {
}
declare const $ZodString: $constructor<$ZodString>;
interface $ZodStringFormatDef<Format extends string = string> extends $ZodStringDef, $ZodCheckStringFormatDef<Format> {
}
interface $ZodStringFormatInternals<Format extends string = string> extends $ZodStringInternals<string>, $ZodCheckStringFormatInternals {
	def: $ZodStringFormatDef<Format>;
}
interface $ZodStringFormat<Format extends string = string> extends $ZodType {
	_zod: $ZodStringFormatInternals<Format>;
}
declare const $ZodStringFormat: $constructor<$ZodStringFormat>;
interface $ZodGUIDDef extends $ZodStringFormatDef<"guid"> {
}
interface $ZodGUIDInternals extends $ZodStringFormatInternals<"guid"> {
}
interface $ZodGUID extends $ZodType {
	_zod: $ZodGUIDInternals;
}
declare const $ZodGUID: $constructor<$ZodGUID>;
interface $ZodUUIDDef extends $ZodStringFormatDef<"uuid"> {
	version?: "v1" | "v2" | "v3" | "v4" | "v5" | "v6" | "v7" | "v8";
}
interface $ZodUUIDInternals extends $ZodStringFormatInternals<"uuid"> {
	def: $ZodUUIDDef;
}
interface $ZodUUID extends $ZodType {
	_zod: $ZodUUIDInternals;
}
declare const $ZodUUID: $constructor<$ZodUUID>;
interface $ZodEmailDef extends $ZodStringFormatDef<"email"> {
}
interface $ZodEmailInternals extends $ZodStringFormatInternals<"email"> {
}
interface $ZodEmail extends $ZodType {
	_zod: $ZodEmailInternals;
}
declare const $ZodEmail: $constructor<$ZodEmail>;
interface $ZodURLDef extends $ZodStringFormatDef<"url"> {
	hostname?: RegExp | undefined;
	protocol?: RegExp | undefined;
	normalize?: boolean | undefined;
}
interface $ZodURLInternals extends $ZodStringFormatInternals<"url"> {
	def: $ZodURLDef;
}
interface $ZodURL extends $ZodType {
	_zod: $ZodURLInternals;
}
declare const $ZodURL: $constructor<$ZodURL>;
interface $ZodEmojiDef extends $ZodStringFormatDef<"emoji"> {
}
interface $ZodEmojiInternals extends $ZodStringFormatInternals<"emoji"> {
}
interface $ZodEmoji extends $ZodType {
	_zod: $ZodEmojiInternals;
}
declare const $ZodEmoji: $constructor<$ZodEmoji>;
interface $ZodNanoIDDef extends $ZodStringFormatDef<"nanoid"> {
}
interface $ZodNanoIDInternals extends $ZodStringFormatInternals<"nanoid"> {
}
interface $ZodNanoID extends $ZodType {
	_zod: $ZodNanoIDInternals;
}
declare const $ZodNanoID: $constructor<$ZodNanoID>;
interface $ZodCUIDDef extends $ZodStringFormatDef<"cuid"> {
}
interface $ZodCUIDInternals extends $ZodStringFormatInternals<"cuid"> {
}
interface $ZodCUID extends $ZodType {
	_zod: $ZodCUIDInternals;
}
declare const $ZodCUID: $constructor<$ZodCUID>;
interface $ZodCUID2Def extends $ZodStringFormatDef<"cuid2"> {
}
interface $ZodCUID2Internals extends $ZodStringFormatInternals<"cuid2"> {
}
interface $ZodCUID2 extends $ZodType {
	_zod: $ZodCUID2Internals;
}
declare const $ZodCUID2: $constructor<$ZodCUID2>;
interface $ZodULIDDef extends $ZodStringFormatDef<"ulid"> {
}
interface $ZodULIDInternals extends $ZodStringFormatInternals<"ulid"> {
}
interface $ZodULID extends $ZodType {
	_zod: $ZodULIDInternals;
}
declare const $ZodULID: $constructor<$ZodULID>;
interface $ZodXIDDef extends $ZodStringFormatDef<"xid"> {
}
interface $ZodXIDInternals extends $ZodStringFormatInternals<"xid"> {
}
interface $ZodXID extends $ZodType {
	_zod: $ZodXIDInternals;
}
declare const $ZodXID: $constructor<$ZodXID>;
interface $ZodKSUIDDef extends $ZodStringFormatDef<"ksuid"> {
}
interface $ZodKSUIDInternals extends $ZodStringFormatInternals<"ksuid"> {
}
interface $ZodKSUID extends $ZodType {
	_zod: $ZodKSUIDInternals;
}
declare const $ZodKSUID: $constructor<$ZodKSUID>;
interface $ZodISODateTimeDef extends $ZodStringFormatDef<"datetime"> {
	precision: number | null;
	offset: boolean;
	local: boolean;
}
interface $ZodISODateTimeInternals extends $ZodStringFormatInternals {
	def: $ZodISODateTimeDef;
}
interface $ZodISODateTime extends $ZodType {
	_zod: $ZodISODateTimeInternals;
}
declare const $ZodISODateTime: $constructor<$ZodISODateTime>;
interface $ZodISODateDef extends $ZodStringFormatDef<"date"> {
}
interface $ZodISODateInternals extends $ZodStringFormatInternals<"date"> {
}
interface $ZodISODate extends $ZodType {
	_zod: $ZodISODateInternals;
}
declare const $ZodISODate: $constructor<$ZodISODate>;
interface $ZodISOTimeDef extends $ZodStringFormatDef<"time"> {
	precision?: number | null;
}
interface $ZodISOTimeInternals extends $ZodStringFormatInternals<"time"> {
	def: $ZodISOTimeDef;
}
interface $ZodISOTime extends $ZodType {
	_zod: $ZodISOTimeInternals;
}
declare const $ZodISOTime: $constructor<$ZodISOTime>;
interface $ZodISODurationDef extends $ZodStringFormatDef<"duration"> {
}
interface $ZodISODurationInternals extends $ZodStringFormatInternals<"duration"> {
}
interface $ZodISODuration extends $ZodType {
	_zod: $ZodISODurationInternals;
}
declare const $ZodISODuration: $constructor<$ZodISODuration>;
interface $ZodIPv4Def extends $ZodStringFormatDef<"ipv4"> {
	version?: "v4";
}
interface $ZodIPv4Internals extends $ZodStringFormatInternals<"ipv4"> {
	def: $ZodIPv4Def;
}
interface $ZodIPv4 extends $ZodType {
	_zod: $ZodIPv4Internals;
}
declare const $ZodIPv4: $constructor<$ZodIPv4>;
interface $ZodIPv6Def extends $ZodStringFormatDef<"ipv6"> {
	version?: "v6";
}
interface $ZodIPv6Internals extends $ZodStringFormatInternals<"ipv6"> {
	def: $ZodIPv6Def;
}
interface $ZodIPv6 extends $ZodType {
	_zod: $ZodIPv6Internals;
}
declare const $ZodIPv6: $constructor<$ZodIPv6>;
interface $ZodCIDRv4Def extends $ZodStringFormatDef<"cidrv4"> {
	version?: "v4";
}
interface $ZodCIDRv4Internals extends $ZodStringFormatInternals<"cidrv4"> {
	def: $ZodCIDRv4Def;
}
interface $ZodCIDRv4 extends $ZodType {
	_zod: $ZodCIDRv4Internals;
}
declare const $ZodCIDRv4: $constructor<$ZodCIDRv4>;
interface $ZodCIDRv6Def extends $ZodStringFormatDef<"cidrv6"> {
	version?: "v6";
}
interface $ZodCIDRv6Internals extends $ZodStringFormatInternals<"cidrv6"> {
	def: $ZodCIDRv6Def;
}
interface $ZodCIDRv6 extends $ZodType {
	_zod: $ZodCIDRv6Internals;
}
declare const $ZodCIDRv6: $constructor<$ZodCIDRv6>;
declare function isValidBase64(data: string): boolean;
interface $ZodBase64Def extends $ZodStringFormatDef<"base64"> {
}
interface $ZodBase64Internals extends $ZodStringFormatInternals<"base64"> {
}
interface $ZodBase64 extends $ZodType {
	_zod: $ZodBase64Internals;
}
declare const $ZodBase64: $constructor<$ZodBase64>;
declare function isValidBase64URL(data: string): boolean;
interface $ZodBase64URLDef extends $ZodStringFormatDef<"base64url"> {
}
interface $ZodBase64URLInternals extends $ZodStringFormatInternals<"base64url"> {
}
interface $ZodBase64URL extends $ZodType {
	_zod: $ZodBase64URLInternals;
}
declare const $ZodBase64URL: $constructor<$ZodBase64URL>;
interface $ZodE164Def extends $ZodStringFormatDef<"e164"> {
}
interface $ZodE164Internals extends $ZodStringFormatInternals<"e164"> {
}
interface $ZodE164 extends $ZodType {
	_zod: $ZodE164Internals;
}
declare const $ZodE164: $constructor<$ZodE164>;
declare function isValidJWT(token: string, algorithm?: util.JWTAlgorithm | null): boolean;
interface $ZodJWTDef extends $ZodStringFormatDef<"jwt"> {
	alg?: util.JWTAlgorithm | undefined;
}
interface $ZodJWTInternals extends $ZodStringFormatInternals<"jwt"> {
	def: $ZodJWTDef;
}
interface $ZodJWT extends $ZodType {
	_zod: $ZodJWTInternals;
}
declare const $ZodJWT: $constructor<$ZodJWT>;
interface $ZodCustomStringFormatDef<Format extends string = string> extends $ZodStringFormatDef<Format> {
	fn: (val: string) => unknown;
}
interface $ZodCustomStringFormatInternals<Format extends string = string> extends $ZodStringFormatInternals<Format> {
	def: $ZodCustomStringFormatDef<Format>;
}
interface $ZodCustomStringFormat<Format extends string = string> extends $ZodStringFormat<Format> {
	_zod: $ZodCustomStringFormatInternals<Format>;
}
declare const $ZodCustomStringFormat: $constructor<$ZodCustomStringFormat>;
interface $ZodNumberDef extends $ZodTypeDef {
	type: "number";
	coerce?: boolean;
}
interface $ZodNumberInternals<Input = unknown> extends $ZodTypeInternals<number, Input> {
	def: $ZodNumberDef;
	/** @deprecated Internal API, use with caution (not deprecated) */
	pattern: RegExp;
	/** @deprecated Internal API, use with caution (not deprecated) */
	isst: $ZodIssueInvalidType;
	bag: util.LoosePartial<{
		minimum: number;
		maximum: number;
		exclusiveMinimum: number;
		exclusiveMaximum: number;
		format: string;
		pattern: RegExp;
	}>;
}
interface $ZodNumber<Input = unknown> extends $ZodType {
	_zod: $ZodNumberInternals<Input>;
}
declare const $ZodNumber: $constructor<$ZodNumber>;
interface $ZodNumberFormatDef extends $ZodNumberDef, $ZodCheckNumberFormatDef {
}
interface $ZodNumberFormatInternals extends $ZodNumberInternals<number>, $ZodCheckNumberFormatInternals {
	def: $ZodNumberFormatDef;
	isst: $ZodIssueInvalidType;
}
interface $ZodNumberFormat extends $ZodType {
	_zod: $ZodNumberFormatInternals;
}
declare const $ZodNumberFormat: $constructor<$ZodNumberFormat>;
interface $ZodBooleanDef extends $ZodTypeDef {
	type: "boolean";
	coerce?: boolean;
	checks?: $ZodCheck<boolean>[];
}
interface $ZodBooleanInternals<T = unknown> extends $ZodTypeInternals<boolean, T> {
	pattern: RegExp;
	def: $ZodBooleanDef;
	isst: $ZodIssueInvalidType;
}
interface $ZodBoolean<T = unknown> extends $ZodType {
	_zod: $ZodBooleanInternals<T>;
}
declare const $ZodBoolean: $constructor<$ZodBoolean>;
interface $ZodBigIntDef extends $ZodTypeDef {
	type: "bigint";
	coerce?: boolean;
}
interface $ZodBigIntInternals<T = unknown> extends $ZodTypeInternals<bigint, T> {
	pattern: RegExp;
	/** @internal Internal API, use with caution */
	def: $ZodBigIntDef;
	isst: $ZodIssueInvalidType;
	bag: util.LoosePartial<{
		minimum: bigint;
		maximum: bigint;
		format: string;
	}>;
}
interface $ZodBigInt<T = unknown> extends $ZodType {
	_zod: $ZodBigIntInternals<T>;
}
declare const $ZodBigInt: $constructor<$ZodBigInt>;
interface $ZodBigIntFormatDef extends $ZodBigIntDef, $ZodCheckBigIntFormatDef {
	check: "bigint_format";
}
interface $ZodBigIntFormatInternals extends $ZodBigIntInternals<bigint>, $ZodCheckBigIntFormatInternals {
	def: $ZodBigIntFormatDef;
}
interface $ZodBigIntFormat extends $ZodType {
	_zod: $ZodBigIntFormatInternals;
}
declare const $ZodBigIntFormat: $constructor<$ZodBigIntFormat>;
interface $ZodSymbolDef extends $ZodTypeDef {
	type: "symbol";
}
interface $ZodSymbolInternals extends $ZodTypeInternals<symbol, symbol> {
	def: $ZodSymbolDef;
	isst: $ZodIssueInvalidType;
}
interface $ZodSymbol extends $ZodType {
	_zod: $ZodSymbolInternals;
}
declare const $ZodSymbol: $constructor<$ZodSymbol>;
interface $ZodUndefinedDef extends $ZodTypeDef {
	type: "undefined";
}
interface $ZodUndefinedInternals extends $ZodTypeInternals<undefined, undefined> {
	pattern: RegExp;
	def: $ZodUndefinedDef;
	values: util.PrimitiveSet;
	isst: $ZodIssueInvalidType;
}
interface $ZodUndefined extends $ZodType {
	_zod: $ZodUndefinedInternals;
}
declare const $ZodUndefined: $constructor<$ZodUndefined>;
interface $ZodNullDef extends $ZodTypeDef {
	type: "null";
}
interface $ZodNullInternals extends $ZodTypeInternals<null, null> {
	pattern: RegExp;
	def: $ZodNullDef;
	values: util.PrimitiveSet;
	isst: $ZodIssueInvalidType;
}
interface $ZodNull extends $ZodType {
	_zod: $ZodNullInternals;
}
declare const $ZodNull: $constructor<$ZodNull>;
interface $ZodAnyDef extends $ZodTypeDef {
	type: "any";
}
interface $ZodAnyInternals extends $ZodTypeInternals<any, any> {
	def: $ZodAnyDef;
	isst: never;
}
interface $ZodAny extends $ZodType {
	_zod: $ZodAnyInternals;
}
declare const $ZodAny: $constructor<$ZodAny>;
interface $ZodUnknownDef extends $ZodTypeDef {
	type: "unknown";
}
interface $ZodUnknownInternals extends $ZodTypeInternals<unknown, unknown> {
	def: $ZodUnknownDef;
	isst: never;
}
interface $ZodUnknown extends $ZodType {
	_zod: $ZodUnknownInternals;
}
declare const $ZodUnknown: $constructor<$ZodUnknown>;
interface $ZodNeverDef extends $ZodTypeDef {
	type: "never";
}
interface $ZodNeverInternals extends $ZodTypeInternals<never, never> {
	def: $ZodNeverDef;
	isst: $ZodIssueInvalidType;
}
interface $ZodNever extends $ZodType {
	_zod: $ZodNeverInternals;
}
declare const $ZodNever: $constructor<$ZodNever>;
interface $ZodVoidDef extends $ZodTypeDef {
	type: "void";
}
interface $ZodVoidInternals extends $ZodTypeInternals<void, void> {
	def: $ZodVoidDef;
	isst: $ZodIssueInvalidType;
}
interface $ZodVoid extends $ZodType {
	_zod: $ZodVoidInternals;
}
declare const $ZodVoid: $constructor<$ZodVoid>;
interface $ZodDateDef extends $ZodTypeDef {
	type: "date";
	coerce?: boolean;
}
interface $ZodDateInternals<T = unknown> extends $ZodTypeInternals<Date, T> {
	def: $ZodDateDef;
	isst: $ZodIssueInvalidType;
	bag: util.LoosePartial<{
		minimum: Date;
		maximum: Date;
		format: string;
	}>;
}
interface $ZodDate<T = unknown> extends $ZodType {
	_zod: $ZodDateInternals<T>;
}
declare const $ZodDate: $constructor<$ZodDate>;
interface $ZodArrayDef<T extends SomeType = $ZodType> extends $ZodTypeDef {
	type: "array";
	element: T;
}
interface $ZodArrayInternals<T extends SomeType = $ZodType> extends _$ZodTypeInternals {
	def: $ZodArrayDef<T>;
	isst: $ZodIssueInvalidType;
	output: output<T>[];
	input: input<T>[];
}
interface $ZodArray<T extends SomeType = $ZodType> extends $ZodType<any, any, $ZodArrayInternals<T>> {
}
declare const $ZodArray: $constructor<$ZodArray>;
type OptionalOutSchema = {
	_zod: {
		optout: "optional";
	};
};
type OptionalInSchema = {
	_zod: {
		optin: "optional";
	};
};
type $InferObjectOutput<T extends $ZodLooseShape, Extra extends Record<string, unknown>> = string extends keyof T ? util.IsAny<T[keyof T]> extends true ? Record<string, unknown> : Record<string, output<T[keyof T]>> : keyof (T & Extra) extends never ? Record<string, never> : util.Prettify<{
	-readonly [k in keyof T as T[k] extends OptionalOutSchema ? never : k]: T[k]["_zod"]["output"];
} & {
	-readonly [k in keyof T as T[k] extends OptionalOutSchema ? k : never]?: T[k]["_zod"]["output"];
} & Extra>;
type $InferObjectInput<T extends $ZodLooseShape, Extra extends Record<string, unknown>> = string extends keyof T ? util.IsAny<T[keyof T]> extends true ? Record<string, unknown> : Record<string, input<T[keyof T]>> : keyof (T & Extra) extends never ? Record<string, never> : util.Prettify<{
	-readonly [k in keyof T as T[k] extends OptionalInSchema ? never : k]: T[k]["_zod"]["input"];
} & {
	-readonly [k in keyof T as T[k] extends OptionalInSchema ? k : never]?: T[k]["_zod"]["input"];
} & Extra>;
type $ZodObjectConfig = {
	out: Record<string, unknown>;
	in: Record<string, unknown>;
};
type $loose = {
	out: Record<string, unknown>;
	in: Record<string, unknown>;
};
type $strict = {
	out: {};
	in: {};
};
type $strip = {
	out: {};
	in: {};
};
type $catchall<T extends SomeType> = {
	out: {
		[k: string]: output<T>;
	};
	in: {
		[k: string]: input<T>;
	};
};
type $ZodShape = Readonly<{
	[k: string]: $ZodType;
}>;
interface $ZodObjectDef<Shape extends $ZodShape = $ZodShape> extends $ZodTypeDef {
	type: "object";
	shape: Shape;
	catchall?: $ZodType | undefined;
}
interface $ZodObjectInternals<
/** @ts-ignore Cast variance */
out Shape extends $ZodShape = $ZodShape, out Config extends $ZodObjectConfig = $ZodObjectConfig> extends _$ZodTypeInternals {
	def: $ZodObjectDef<Shape>;
	config: Config;
	isst: $ZodIssueInvalidType | $ZodIssueUnrecognizedKeys;
	propValues: util.PropValues;
	output: $InferObjectOutput<Shape, Config["out"]>;
	input: $InferObjectInput<Shape, Config["in"]>;
	optin?: "optional" | undefined;
	optout?: "optional" | undefined;
}
type $ZodLooseShape = Record<string, any>;
interface $ZodObject<
/** @ts-ignore Cast variance */
out Shape extends Readonly<$ZodShape> = Readonly<$ZodShape>, out Params extends $ZodObjectConfig = $ZodObjectConfig> extends $ZodType<any, any, $ZodObjectInternals<Shape, Params>> {
	"~standard": $ZodStandardSchema<this>;
}
declare const $ZodObject: $constructor<$ZodObject>;
declare const $ZodObjectJIT: $constructor<$ZodObject>;
type $InferUnionOutput<T extends SomeType> = T extends any ? output<T> : never;
type $InferUnionInput<T extends SomeType> = T extends any ? input<T> : never;
interface $ZodUnionDef<Options extends readonly SomeType[] = readonly $ZodType[]> extends $ZodTypeDef {
	type: "union";
	options: Options;
}
type IsOptionalIn<T extends SomeType> = T extends OptionalInSchema ? true : false;
type IsOptionalOut<T extends SomeType> = T extends OptionalOutSchema ? true : false;
interface $ZodUnionInternals<T extends readonly SomeType[] = readonly $ZodType[]> extends _$ZodTypeInternals {
	def: $ZodUnionDef<T>;
	isst: $ZodIssueInvalidUnion;
	pattern: T[number]["_zod"]["pattern"];
	values: T[number]["_zod"]["values"];
	output: $InferUnionOutput<T[number]>;
	input: $InferUnionInput<T[number]>;
	optin: IsOptionalIn<T[number]> extends false ? "optional" | undefined : "optional";
	optout: IsOptionalOut<T[number]> extends false ? "optional" | undefined : "optional";
}
interface $ZodUnion<T extends readonly SomeType[] = readonly $ZodType[]> extends $ZodType<any, any, $ZodUnionInternals<T>> {
	_zod: $ZodUnionInternals<T>;
}
declare const $ZodUnion: $constructor<$ZodUnion>;
interface $ZodDiscriminatedUnionDef<Options extends readonly SomeType[] = readonly $ZodType[], Disc extends string = string> extends $ZodUnionDef<Options> {
	discriminator: Disc;
	unionFallback?: boolean;
}
interface $ZodDiscriminatedUnionInternals<Options extends readonly SomeType[] = readonly $ZodType[], Disc extends string = string> extends $ZodUnionInternals<Options> {
	def: $ZodDiscriminatedUnionDef<Options, Disc>;
	propValues: util.PropValues;
}
interface $ZodDiscriminatedUnion<Options extends readonly SomeType[] = readonly $ZodType[], Disc extends string = string> extends $ZodType {
	_zod: $ZodDiscriminatedUnionInternals<Options, Disc>;
}
declare const $ZodDiscriminatedUnion: $constructor<$ZodDiscriminatedUnion>;
interface $ZodIntersectionDef<Left extends SomeType = $ZodType, Right extends SomeType = $ZodType> extends $ZodTypeDef {
	type: "intersection";
	left: Left;
	right: Right;
}
interface $ZodIntersectionInternals<A extends SomeType = $ZodType, B extends SomeType = $ZodType> extends _$ZodTypeInternals {
	def: $ZodIntersectionDef<A, B>;
	isst: never;
	optin: A["_zod"]["optin"] | B["_zod"]["optin"];
	optout: A["_zod"]["optout"] | B["_zod"]["optout"];
	output: output<A> & output<B>;
	input: input<A> & input<B>;
}
interface $ZodIntersection<A extends SomeType = $ZodType, B extends SomeType = $ZodType> extends $ZodType {
	_zod: $ZodIntersectionInternals<A, B>;
}
declare const $ZodIntersection: $constructor<$ZodIntersection>;
interface $ZodTupleDef<T extends util.TupleItems = readonly $ZodType[], Rest extends SomeType | null = $ZodType | null> extends $ZodTypeDef {
	type: "tuple";
	items: T;
	rest: Rest;
}
type $InferTupleInputType<T extends util.TupleItems, Rest extends SomeType | null> = [
	...TupleInputTypeWithOptionals<T>,
	...(Rest extends SomeType ? input<Rest>[] : [
	])
];
type TupleInputTypeNoOptionals<T extends util.TupleItems> = {
	[k in keyof T]: input<T[k]>;
};
type TupleInputTypeWithOptionals<T extends util.TupleItems> = T extends readonly [
	...infer Prefix extends SomeType[],
	infer Tail extends SomeType
] ? Tail["_zod"]["optin"] extends "optional" ? [
	...TupleInputTypeWithOptionals<Prefix>,
	input<Tail>?
] : TupleInputTypeNoOptionals<T> : [
];
type $InferTupleOutputType<T extends util.TupleItems, Rest extends SomeType | null> = [
	...TupleOutputTypeWithOptionals<T>,
	...(Rest extends SomeType ? output<Rest>[] : [
	])
];
type TupleOutputTypeNoOptionals<T extends util.TupleItems> = {
	[k in keyof T]: output<T[k]>;
};
type TupleOutputTypeWithOptionals<T extends util.TupleItems> = T extends readonly [
	...infer Prefix extends SomeType[],
	infer Tail extends SomeType
] ? Tail["_zod"]["optout"] extends "optional" ? [
	...TupleOutputTypeWithOptionals<Prefix>,
	output<Tail>?
] : TupleOutputTypeNoOptionals<T> : [
];
interface $ZodTupleInternals<T extends util.TupleItems = readonly $ZodType[], Rest extends SomeType | null = $ZodType | null> extends _$ZodTypeInternals {
	def: $ZodTupleDef<T, Rest>;
	isst: $ZodIssueInvalidType | $ZodIssueTooBig<unknown[]> | $ZodIssueTooSmall<unknown[]>;
	output: $InferTupleOutputType<T, Rest>;
	input: $InferTupleInputType<T, Rest>;
}
interface $ZodTuple<T extends util.TupleItems = readonly $ZodType[], Rest extends SomeType | null = $ZodType | null> extends $ZodType {
	_zod: $ZodTupleInternals<T, Rest>;
}
declare const $ZodTuple: $constructor<$ZodTuple>;
type $ZodRecordKey = $ZodType<string | number | symbol, string | number | symbol>;
interface $ZodRecordDef<Key extends $ZodRecordKey = $ZodRecordKey, Value extends SomeType = $ZodType> extends $ZodTypeDef {
	type: "record";
	keyType: Key;
	valueType: Value;
}
type $InferZodRecordOutput<Key extends $ZodRecordKey = $ZodRecordKey, Value extends SomeType = $ZodType> = Key extends $partial ? Partial<Record<output<Key>, output<Value>>> : Record<output<Key>, output<Value>>;
type $InferZodRecordInput<Key extends $ZodRecordKey = $ZodRecordKey, Value extends SomeType = $ZodType> = Key extends $partial ? Partial<Record<input<Key>, input<Value>>> : Record<input<Key>, input<Value>>;
interface $ZodRecordInternals<Key extends $ZodRecordKey = $ZodRecordKey, Value extends SomeType = $ZodType> extends $ZodTypeInternals<$InferZodRecordOutput<Key, Value>, $InferZodRecordInput<Key, Value>> {
	def: $ZodRecordDef<Key, Value>;
	isst: $ZodIssueInvalidType | $ZodIssueInvalidKey<Record<PropertyKey, unknown>>;
	optin?: "optional" | undefined;
	optout?: "optional" | undefined;
}
type $partial = {
	"~~partial": true;
};
interface $ZodRecord<Key extends $ZodRecordKey = $ZodRecordKey, Value extends SomeType = $ZodType> extends $ZodType {
	_zod: $ZodRecordInternals<Key, Value>;
}
declare const $ZodRecord: $constructor<$ZodRecord>;
interface $ZodMapDef<Key extends SomeType = $ZodType, Value extends SomeType = $ZodType> extends $ZodTypeDef {
	type: "map";
	keyType: Key;
	valueType: Value;
}
interface $ZodMapInternals<Key extends SomeType = $ZodType, Value extends SomeType = $ZodType> extends $ZodTypeInternals<Map<output<Key>, output<Value>>, Map<input<Key>, input<Value>>> {
	def: $ZodMapDef<Key, Value>;
	isst: $ZodIssueInvalidType | $ZodIssueInvalidKey | $ZodIssueInvalidElement<unknown>;
	optin?: "optional" | undefined;
	optout?: "optional" | undefined;
}
interface $ZodMap<Key extends SomeType = $ZodType, Value extends SomeType = $ZodType> extends $ZodType {
	_zod: $ZodMapInternals<Key, Value>;
}
declare const $ZodMap: $constructor<$ZodMap>;
interface $ZodSetDef<T extends SomeType = $ZodType> extends $ZodTypeDef {
	type: "set";
	valueType: T;
}
interface $ZodSetInternals<T extends SomeType = $ZodType> extends $ZodTypeInternals<Set<output<T>>, Set<input<T>>> {
	def: $ZodSetDef<T>;
	isst: $ZodIssueInvalidType;
	optin?: "optional" | undefined;
	optout?: "optional" | undefined;
}
interface $ZodSet<T extends SomeType = $ZodType> extends $ZodType {
	_zod: $ZodSetInternals<T>;
}
declare const $ZodSet: $constructor<$ZodSet>;
type $InferEnumOutput<T extends util.EnumLike> = T[keyof T] & {};
type $InferEnumInput<T extends util.EnumLike> = T[keyof T] & {};
interface $ZodEnumDef<T extends util.EnumLike = util.EnumLike> extends $ZodTypeDef {
	type: "enum";
	entries: T;
}
interface $ZodEnumInternals<
/** @ts-ignore Cast variance */
out T extends util.EnumLike = util.EnumLike> extends $ZodTypeInternals<$InferEnumOutput<T>, $InferEnumInput<T>> {
	def: $ZodEnumDef<T>;
	/** @deprecated Internal API, use with caution (not deprecated) */
	values: util.PrimitiveSet;
	/** @deprecated Internal API, use with caution (not deprecated) */
	pattern: RegExp;
	isst: $ZodIssueInvalidValue;
}
interface $ZodEnum<T extends util.EnumLike = util.EnumLike> extends $ZodType {
	_zod: $ZodEnumInternals<T>;
}
declare const $ZodEnum: $constructor<$ZodEnum>;
interface $ZodLiteralDef<T extends util.Literal> extends $ZodTypeDef {
	type: "literal";
	values: T[];
}
interface $ZodLiteralInternals<T extends util.Literal = util.Literal> extends $ZodTypeInternals<T, T> {
	def: $ZodLiteralDef<T>;
	values: Set<T>;
	pattern: RegExp;
	isst: $ZodIssueInvalidValue;
}
interface $ZodLiteral<T extends util.Literal = util.Literal> extends $ZodType {
	_zod: $ZodLiteralInternals<T>;
}
declare const $ZodLiteral: $constructor<$ZodLiteral>;
type _File = typeof globalThis extends {
	File: infer F extends new (...args: any[]) => any;
} ? InstanceType<F> : {};
interface File$1 extends _File {
	readonly type: string;
	readonly size: number;
}
interface $ZodFileDef extends $ZodTypeDef {
	type: "file";
}
interface $ZodFileInternals extends $ZodTypeInternals<File$1, File$1> {
	def: $ZodFileDef;
	isst: $ZodIssueInvalidType;
	bag: util.LoosePartial<{
		minimum: number;
		maximum: number;
		mime: util.MimeTypes[];
	}>;
}
interface $ZodFile extends $ZodType {
	_zod: $ZodFileInternals;
}
declare const $ZodFile: $constructor<$ZodFile>;
interface $ZodTransformDef extends $ZodTypeDef {
	type: "transform";
	transform: (input: unknown, payload: ParsePayload<unknown>) => util.MaybeAsync<unknown>;
}
interface $ZodTransformInternals<O = unknown, I = unknown> extends $ZodTypeInternals<O, I> {
	def: $ZodTransformDef;
	isst: never;
}
interface $ZodTransform<O = unknown, I = unknown> extends $ZodType {
	_zod: $ZodTransformInternals<O, I>;
}
declare const $ZodTransform: $constructor<$ZodTransform>;
interface $ZodOptionalDef<T extends SomeType = $ZodType> extends $ZodTypeDef {
	type: "optional";
	innerType: T;
}
interface $ZodOptionalInternals<T extends SomeType = $ZodType> extends $ZodTypeInternals<output<T> | undefined, input<T> | undefined> {
	def: $ZodOptionalDef<T>;
	optin: "optional";
	optout: "optional";
	isst: never;
	values: T["_zod"]["values"];
	pattern: T["_zod"]["pattern"];
}
interface $ZodOptional<T extends SomeType = $ZodType> extends $ZodType {
	_zod: $ZodOptionalInternals<T>;
}
declare const $ZodOptional: $constructor<$ZodOptional>;
interface $ZodNullableDef<T extends SomeType = $ZodType> extends $ZodTypeDef {
	type: "nullable";
	innerType: T;
}
interface $ZodNullableInternals<T extends SomeType = $ZodType> extends $ZodTypeInternals<output<T> | null, input<T> | null> {
	def: $ZodNullableDef<T>;
	optin: T["_zod"]["optin"];
	optout: T["_zod"]["optout"];
	isst: never;
	values: T["_zod"]["values"];
	pattern: T["_zod"]["pattern"];
}
interface $ZodNullable<T extends SomeType = $ZodType> extends $ZodType {
	_zod: $ZodNullableInternals<T>;
}
declare const $ZodNullable: $constructor<$ZodNullable>;
interface $ZodDefaultDef<T extends SomeType = $ZodType> extends $ZodTypeDef {
	type: "default";
	innerType: T;
	/** The default value. May be a getter. */
	defaultValue: util.NoUndefined<output<T>>;
}
interface $ZodDefaultInternals<T extends SomeType = $ZodType> extends $ZodTypeInternals<util.NoUndefined<output<T>>, input<T> | undefined> {
	def: $ZodDefaultDef<T>;
	optin: "optional";
	optout?: "optional" | undefined;
	isst: never;
	values: T["_zod"]["values"];
}
interface $ZodDefault<T extends SomeType = $ZodType> extends $ZodType {
	_zod: $ZodDefaultInternals<T>;
}
declare const $ZodDefault: $constructor<$ZodDefault>;
interface $ZodPrefaultDef<T extends SomeType = $ZodType> extends $ZodTypeDef {
	type: "prefault";
	innerType: T;
	/** The default value. May be a getter. */
	defaultValue: input<T>;
}
interface $ZodPrefaultInternals<T extends SomeType = $ZodType> extends $ZodTypeInternals<util.NoUndefined<output<T>>, input<T> | undefined> {
	def: $ZodPrefaultDef<T>;
	optin: "optional";
	optout?: "optional" | undefined;
	isst: never;
	values: T["_zod"]["values"];
}
interface $ZodPrefault<T extends SomeType = $ZodType> extends $ZodType {
	_zod: $ZodPrefaultInternals<T>;
}
declare const $ZodPrefault: $constructor<$ZodPrefault>;
interface $ZodNonOptionalDef<T extends SomeType = $ZodType> extends $ZodTypeDef {
	type: "nonoptional";
	innerType: T;
}
interface $ZodNonOptionalInternals<T extends SomeType = $ZodType> extends $ZodTypeInternals<util.NoUndefined<output<T>>, util.NoUndefined<input<T>>> {
	def: $ZodNonOptionalDef<T>;
	isst: $ZodIssueInvalidType;
	values: T["_zod"]["values"];
	optin: "optional" | undefined;
	optout: "optional" | undefined;
}
interface $ZodNonOptional<T extends SomeType = $ZodType> extends $ZodType {
	_zod: $ZodNonOptionalInternals<T>;
}
declare const $ZodNonOptional: $constructor<$ZodNonOptional>;
interface $ZodSuccessDef<T extends SomeType = $ZodType> extends $ZodTypeDef {
	type: "success";
	innerType: T;
}
interface $ZodSuccessInternals<T extends SomeType = $ZodType> extends $ZodTypeInternals<boolean, input<T>> {
	def: $ZodSuccessDef<T>;
	isst: never;
	optin: T["_zod"]["optin"];
	optout: "optional" | undefined;
}
interface $ZodSuccess<T extends SomeType = $ZodType> extends $ZodType {
	_zod: $ZodSuccessInternals<T>;
}
declare const $ZodSuccess: $constructor<$ZodSuccess>;
interface $ZodCatchCtx extends ParsePayload {
	/** @deprecated Use `ctx.issues` */
	error: {
		issues: $ZodIssue[];
	};
	/** @deprecated Use `ctx.value` */
	input: unknown;
}
interface $ZodCatchDef<T extends SomeType = $ZodType> extends $ZodTypeDef {
	type: "catch";
	innerType: T;
	catchValue: (ctx: $ZodCatchCtx) => unknown;
}
interface $ZodCatchInternals<T extends SomeType = $ZodType> extends $ZodTypeInternals<output<T>, input<T>> {
	def: $ZodCatchDef<T>;
	optin: T["_zod"]["optin"];
	optout: T["_zod"]["optout"];
	isst: never;
	values: T["_zod"]["values"];
}
interface $ZodCatch<T extends SomeType = $ZodType> extends $ZodType {
	_zod: $ZodCatchInternals<T>;
}
declare const $ZodCatch: $constructor<$ZodCatch>;
interface $ZodNaNDef extends $ZodTypeDef {
	type: "nan";
}
interface $ZodNaNInternals extends $ZodTypeInternals<number, number> {
	def: $ZodNaNDef;
	isst: $ZodIssueInvalidType;
}
interface $ZodNaN extends $ZodType {
	_zod: $ZodNaNInternals;
}
declare const $ZodNaN: $constructor<$ZodNaN>;
interface $ZodPipeDef<A extends SomeType = $ZodType, B extends SomeType = $ZodType> extends $ZodTypeDef {
	type: "pipe";
	in: A;
	out: B;
	/** Only defined inside $ZodCodec instances. */
	transform?: (value: output<A>, payload: ParsePayload<output<A>>) => util.MaybeAsync<input<B>>;
	/** Only defined inside $ZodCodec instances. */
	reverseTransform?: (value: input<B>, payload: ParsePayload<input<B>>) => util.MaybeAsync<output<A>>;
}
interface $ZodPipeInternals<A extends SomeType = $ZodType, B extends SomeType = $ZodType> extends $ZodTypeInternals<output<B>, input<A>> {
	def: $ZodPipeDef<A, B>;
	isst: never;
	values: A["_zod"]["values"];
	optin: A["_zod"]["optin"];
	optout: B["_zod"]["optout"];
	propValues: A["_zod"]["propValues"];
}
interface $ZodPipe<A extends SomeType = $ZodType, B extends SomeType = $ZodType> extends $ZodType {
	_zod: $ZodPipeInternals<A, B>;
}
declare const $ZodPipe: $constructor<$ZodPipe>;
interface $ZodCodecDef<A extends SomeType = $ZodType, B extends SomeType = $ZodType> extends $ZodPipeDef<A, B> {
	transform: (value: output<A>, payload: ParsePayload<output<A>>) => util.MaybeAsync<input<B>>;
	reverseTransform: (value: input<B>, payload: ParsePayload<input<B>>) => util.MaybeAsync<output<A>>;
}
interface $ZodCodecInternals<A extends SomeType = $ZodType, B extends SomeType = $ZodType> extends $ZodTypeInternals<output<B>, input<A>> {
	def: $ZodCodecDef<A, B>;
	isst: never;
	values: A["_zod"]["values"];
	optin: A["_zod"]["optin"];
	optout: B["_zod"]["optout"];
	propValues: A["_zod"]["propValues"];
}
interface $ZodCodec<A extends SomeType = $ZodType, B extends SomeType = $ZodType> extends $ZodType {
	_zod: $ZodCodecInternals<A, B>;
}
declare const $ZodCodec: $constructor<$ZodCodec>;
interface $ZodReadonlyDef<T extends SomeType = $ZodType> extends $ZodTypeDef {
	type: "readonly";
	innerType: T;
}
interface $ZodReadonlyInternals<T extends SomeType = $ZodType> extends $ZodTypeInternals<util.MakeReadonly<output<T>>, util.MakeReadonly<input<T>>> {
	def: $ZodReadonlyDef<T>;
	optin: T["_zod"]["optin"];
	optout: T["_zod"]["optout"];
	isst: never;
	propValues: T["_zod"]["propValues"];
	values: T["_zod"]["values"];
}
interface $ZodReadonly<T extends SomeType = $ZodType> extends $ZodType {
	_zod: $ZodReadonlyInternals<T>;
}
declare const $ZodReadonly: $constructor<$ZodReadonly>;
interface $ZodTemplateLiteralDef extends $ZodTypeDef {
	type: "template_literal";
	parts: $ZodTemplateLiteralPart[];
	format?: string | undefined;
}
interface $ZodTemplateLiteralInternals<Template extends string = string> extends $ZodTypeInternals<Template, Template> {
	pattern: RegExp;
	def: $ZodTemplateLiteralDef;
	isst: $ZodIssueInvalidType;
}
interface $ZodTemplateLiteral<Template extends string = string> extends $ZodType {
	_zod: $ZodTemplateLiteralInternals<Template>;
}
type LiteralPart = Exclude<util.Literal, symbol>;
interface SchemaPartInternals extends $ZodTypeInternals<LiteralPart, LiteralPart> {
	pattern: RegExp;
}
interface SchemaPart extends $ZodType {
	_zod: SchemaPartInternals;
}
type $ZodTemplateLiteralPart = LiteralPart | SchemaPart;
type UndefinedToEmptyString<T> = T extends undefined ? "" : T;
type AppendToTemplateLiteral<Template extends string, Suffix extends LiteralPart | $ZodType> = Suffix extends LiteralPart ? `${Template}${UndefinedToEmptyString<Suffix>}` : Suffix extends $ZodType ? `${Template}${output<Suffix> extends infer T extends LiteralPart ? UndefinedToEmptyString<T> : never}` : never;
type ConcatenateTupleOfStrings<T extends string[]> = T extends [
	infer First extends string,
	...infer Rest extends string[]
] ? Rest extends string[] ? First extends "" ? ConcatenateTupleOfStrings<Rest> : `${First}${ConcatenateTupleOfStrings<Rest>}` : never : "";
type ConvertPartsToStringTuple<Parts extends $ZodTemplateLiteralPart[]> = {
	[K in keyof Parts]: Parts[K] extends LiteralPart ? `${UndefinedToEmptyString<Parts[K]>}` : Parts[K] extends $ZodType ? `${output<Parts[K]> extends infer T extends LiteralPart ? UndefinedToEmptyString<T> : never}` : never;
};
type ToTemplateLiteral<Parts extends $ZodTemplateLiteralPart[]> = ConcatenateTupleOfStrings<ConvertPartsToStringTuple<Parts>>;
type $PartsToTemplateLiteral<Parts extends $ZodTemplateLiteralPart[]> = [
] extends Parts ? `` : Parts extends [
	...infer Rest,
	infer Last extends $ZodTemplateLiteralPart
] ? Rest extends $ZodTemplateLiteralPart[] ? AppendToTemplateLiteral<$PartsToTemplateLiteral<Rest>, Last> : never : never;
declare const $ZodTemplateLiteral: $constructor<$ZodTemplateLiteral>;
type $ZodFunctionArgs = $ZodType<unknown[], unknown[]>;
type $ZodFunctionIn = $ZodFunctionArgs;
type $ZodFunctionOut = $ZodType;
type $InferInnerFunctionType<Args extends $ZodFunctionIn, Returns extends $ZodFunctionOut> = (...args: $ZodFunctionIn extends Args ? never[] : output<Args>) => input<Returns>;
type $InferInnerFunctionTypeAsync<Args extends $ZodFunctionIn, Returns extends $ZodFunctionOut> = (...args: $ZodFunctionIn extends Args ? never[] : output<Args>) => util.MaybeAsync<input<Returns>>;
type $InferOuterFunctionType<Args extends $ZodFunctionIn, Returns extends $ZodFunctionOut> = (...args: $ZodFunctionIn extends Args ? never[] : input<Args>) => output<Returns>;
type $InferOuterFunctionTypeAsync<Args extends $ZodFunctionIn, Returns extends $ZodFunctionOut> = (...args: $ZodFunctionIn extends Args ? never[] : input<Args>) => util.MaybeAsync<output<Returns>>;
interface $ZodFunctionDef<In extends $ZodFunctionIn = $ZodFunctionIn, Out extends $ZodFunctionOut = $ZodFunctionOut> extends $ZodTypeDef {
	type: "function";
	input: In;
	output: Out;
}
interface $ZodFunctionInternals<Args extends $ZodFunctionIn, Returns extends $ZodFunctionOut> extends $ZodTypeInternals<$InferOuterFunctionType<Args, Returns>, $InferInnerFunctionType<Args, Returns>> {
	def: $ZodFunctionDef<Args, Returns>;
	isst: $ZodIssueInvalidType;
}
interface $ZodFunction<Args extends $ZodFunctionIn = $ZodFunctionIn, Returns extends $ZodFunctionOut = $ZodFunctionOut> extends $ZodType<any, any, $ZodFunctionInternals<Args, Returns>> {
	/** @deprecated */
	_def: $ZodFunctionDef<Args, Returns>;
	_input: $InferInnerFunctionType<Args, Returns>;
	_output: $InferOuterFunctionType<Args, Returns>;
	implement<F extends $InferInnerFunctionType<Args, Returns>>(func: F): (...args: Parameters<this["_output"]>) => ReturnType<F> extends ReturnType<this["_output"]> ? ReturnType<F> : ReturnType<this["_output"]>;
	implementAsync<F extends $InferInnerFunctionTypeAsync<Args, Returns>>(func: F): F extends $InferOuterFunctionTypeAsync<Args, Returns> ? F : $InferOuterFunctionTypeAsync<Args, Returns>;
	input<const Items extends util.TupleItems, const Rest extends $ZodFunctionOut = $ZodFunctionOut>(args: Items, rest?: Rest): $ZodFunction<$ZodTuple<Items, Rest>, Returns>;
	input<NewArgs extends $ZodFunctionIn>(args: NewArgs): $ZodFunction<NewArgs, Returns>;
	input(...args: any[]): $ZodFunction<any, Returns>;
	output<NewReturns extends $ZodType>(output: NewReturns): $ZodFunction<Args, NewReturns>;
}
interface $ZodFunctionParams<I extends $ZodFunctionIn, O extends $ZodType> {
	input?: I;
	output?: O;
}
declare const $ZodFunction: $constructor<$ZodFunction>;
interface $ZodPromiseDef<T extends SomeType = $ZodType> extends $ZodTypeDef {
	type: "promise";
	innerType: T;
}
interface $ZodPromiseInternals<T extends SomeType = $ZodType> extends $ZodTypeInternals<output<T>, util.MaybeAsync<input<T>>> {
	def: $ZodPromiseDef<T>;
	isst: never;
}
interface $ZodPromise<T extends SomeType = $ZodType> extends $ZodType {
	_zod: $ZodPromiseInternals<T>;
}
declare const $ZodPromise: $constructor<$ZodPromise>;
interface $ZodLazyDef<T extends SomeType = $ZodType> extends $ZodTypeDef {
	type: "lazy";
	getter: () => T;
}
interface $ZodLazyInternals<T extends SomeType = $ZodType> extends $ZodTypeInternals<output<T>, input<T>> {
	def: $ZodLazyDef<T>;
	isst: never;
	/** Auto-cached way to retrieve the inner schema */
	innerType: T;
	pattern: T["_zod"]["pattern"];
	propValues: T["_zod"]["propValues"];
	optin: T["_zod"]["optin"];
	optout: T["_zod"]["optout"];
}
interface $ZodLazy<T extends SomeType = $ZodType> extends $ZodType {
	_zod: $ZodLazyInternals<T>;
}
declare const $ZodLazy: $constructor<$ZodLazy>;
interface $ZodCustomDef<O = unknown> extends $ZodTypeDef, $ZodCheckDef {
	type: "custom";
	check: "custom";
	path?: PropertyKey[] | undefined;
	error?: $ZodErrorMap | undefined;
	params?: Record<string, any> | undefined;
	fn: (arg: O) => unknown;
}
interface $ZodCustomInternals<O = unknown, I = unknown> extends $ZodTypeInternals<O, I>, $ZodCheckInternals<O> {
	def: $ZodCustomDef;
	issc: $ZodIssue;
	isst: never;
	bag: util.LoosePartial<{
		Class: typeof util.Class;
	}>;
}
interface $ZodCustom<O = unknown, I = unknown> extends $ZodType {
	_zod: $ZodCustomInternals<O, I>;
}
declare const $ZodCustom: $constructor<$ZodCustom>;
type $ZodTypes = $ZodString | $ZodNumber | $ZodBigInt | $ZodBoolean | $ZodDate | $ZodSymbol | $ZodUndefined | $ZodNullable | $ZodNull | $ZodAny | $ZodUnknown | $ZodNever | $ZodVoid | $ZodArray | $ZodObject | $ZodUnion | $ZodIntersection | $ZodTuple | $ZodRecord | $ZodMap | $ZodSet | $ZodLiteral | $ZodEnum | $ZodFunction | $ZodPromise | $ZodLazy | $ZodOptional | $ZodDefault | $ZodPrefault | $ZodTemplateLiteral | $ZodCustom | $ZodTransform | $ZodNonOptional | $ZodReadonly | $ZodNaN | $ZodPipe | $ZodSuccess | $ZodCatch | $ZodFile;
type $ZodStringFormatTypes = $ZodGUID | $ZodUUID | $ZodEmail | $ZodURL | $ZodEmoji | $ZodNanoID | $ZodCUID | $ZodCUID2 | $ZodULID | $ZodXID | $ZodKSUID | $ZodISODateTime | $ZodISODate | $ZodISOTime | $ZodISODuration | $ZodIPv4 | $ZodIPv6 | $ZodCIDRv4 | $ZodCIDRv6 | $ZodBase64 | $ZodBase64URL | $ZodE164 | $ZodJWT | $ZodCustomStringFormat<"hex"> | $ZodCustomStringFormat<util.HashFormat> | $ZodCustomStringFormat<"hostname">;
interface $ZodCheckDef {
	check: string;
	error?: $ZodErrorMap<never> | undefined;
	/** If true, no later checks will be executed if this check fails. Default `false`. */
	abort?: boolean | undefined;
	/** If provided, this check will only be executed if the function returns `true`. Defaults to `payload => z.util.isAborted(payload)`. */
	when?: ((payload: schemas.ParsePayload) => boolean) | undefined;
}
interface $ZodCheckInternals<T> {
	def: $ZodCheckDef;
	/** The set of issues this check might throw. */
	issc?: $ZodIssueBase;
	check(payload: schemas.ParsePayload<T>): util.MaybeAsync<void>;
	onattach: ((schema: schemas.$ZodType) => void)[];
}
interface $ZodCheck<in T = never> {
	_zod: $ZodCheckInternals<T>;
}
declare const $ZodCheck: $constructor<$ZodCheck<any>>;
interface $ZodCheckLessThanDef extends $ZodCheckDef {
	check: "less_than";
	value: util.Numeric;
	inclusive: boolean;
}
interface $ZodCheckLessThanInternals<T extends util.Numeric = util.Numeric> extends $ZodCheckInternals<T> {
	def: $ZodCheckLessThanDef;
	issc: $ZodIssueTooBig<T>;
}
interface $ZodCheckLessThan<T extends util.Numeric = util.Numeric> extends $ZodCheck<T> {
	_zod: $ZodCheckLessThanInternals<T>;
}
declare const $ZodCheckLessThan: $constructor<$ZodCheckLessThan>;
interface $ZodCheckGreaterThanDef extends $ZodCheckDef {
	check: "greater_than";
	value: util.Numeric;
	inclusive: boolean;
}
interface $ZodCheckGreaterThanInternals<T extends util.Numeric = util.Numeric> extends $ZodCheckInternals<T> {
	def: $ZodCheckGreaterThanDef;
	issc: $ZodIssueTooSmall<T>;
}
interface $ZodCheckGreaterThan<T extends util.Numeric = util.Numeric> extends $ZodCheck<T> {
	_zod: $ZodCheckGreaterThanInternals<T>;
}
declare const $ZodCheckGreaterThan: $constructor<$ZodCheckGreaterThan>;
interface $ZodCheckMultipleOfDef<T extends number | bigint = number | bigint> extends $ZodCheckDef {
	check: "multiple_of";
	value: T;
}
interface $ZodCheckMultipleOfInternals<T extends number | bigint = number | bigint> extends $ZodCheckInternals<T> {
	def: $ZodCheckMultipleOfDef<T>;
	issc: $ZodIssueNotMultipleOf;
}
interface $ZodCheckMultipleOf<T extends number | bigint = number | bigint> extends $ZodCheck<T> {
	_zod: $ZodCheckMultipleOfInternals<T>;
}
declare const $ZodCheckMultipleOf: $constructor<$ZodCheckMultipleOf<number | bigint>>;
type $ZodNumberFormats = "int32" | "uint32" | "float32" | "float64" | "safeint";
interface $ZodCheckNumberFormatDef extends $ZodCheckDef {
	check: "number_format";
	format: $ZodNumberFormats;
}
interface $ZodCheckNumberFormatInternals extends $ZodCheckInternals<number> {
	def: $ZodCheckNumberFormatDef;
	issc: $ZodIssueInvalidType | $ZodIssueTooBig<"number"> | $ZodIssueTooSmall<"number">;
}
interface $ZodCheckNumberFormat extends $ZodCheck<number> {
	_zod: $ZodCheckNumberFormatInternals;
}
declare const $ZodCheckNumberFormat: $constructor<$ZodCheckNumberFormat>;
type $ZodBigIntFormats = "int64" | "uint64";
interface $ZodCheckBigIntFormatDef extends $ZodCheckDef {
	check: "bigint_format";
	format: $ZodBigIntFormats | undefined;
}
interface $ZodCheckBigIntFormatInternals extends $ZodCheckInternals<bigint> {
	def: $ZodCheckBigIntFormatDef;
	issc: $ZodIssueTooBig<"bigint"> | $ZodIssueTooSmall<"bigint">;
}
interface $ZodCheckBigIntFormat extends $ZodCheck<bigint> {
	_zod: $ZodCheckBigIntFormatInternals;
}
declare const $ZodCheckBigIntFormat: $constructor<$ZodCheckBigIntFormat>;
interface $ZodCheckMaxSizeDef extends $ZodCheckDef {
	check: "max_size";
	maximum: number;
}
interface $ZodCheckMaxSizeInternals<T extends util.HasSize = util.HasSize> extends $ZodCheckInternals<T> {
	def: $ZodCheckMaxSizeDef;
	issc: $ZodIssueTooBig<T>;
}
interface $ZodCheckMaxSize<T extends util.HasSize = util.HasSize> extends $ZodCheck<T> {
	_zod: $ZodCheckMaxSizeInternals<T>;
}
declare const $ZodCheckMaxSize: $constructor<$ZodCheckMaxSize>;
interface $ZodCheckMinSizeDef extends $ZodCheckDef {
	check: "min_size";
	minimum: number;
}
interface $ZodCheckMinSizeInternals<T extends util.HasSize = util.HasSize> extends $ZodCheckInternals<T> {
	def: $ZodCheckMinSizeDef;
	issc: $ZodIssueTooSmall<T>;
}
interface $ZodCheckMinSize<T extends util.HasSize = util.HasSize> extends $ZodCheck<T> {
	_zod: $ZodCheckMinSizeInternals<T>;
}
declare const $ZodCheckMinSize: $constructor<$ZodCheckMinSize>;
interface $ZodCheckSizeEqualsDef extends $ZodCheckDef {
	check: "size_equals";
	size: number;
}
interface $ZodCheckSizeEqualsInternals<T extends util.HasSize = util.HasSize> extends $ZodCheckInternals<T> {
	def: $ZodCheckSizeEqualsDef;
	issc: $ZodIssueTooBig<T> | $ZodIssueTooSmall<T>;
}
interface $ZodCheckSizeEquals<T extends util.HasSize = util.HasSize> extends $ZodCheck<T> {
	_zod: $ZodCheckSizeEqualsInternals<T>;
}
declare const $ZodCheckSizeEquals: $constructor<$ZodCheckSizeEquals>;
interface $ZodCheckMaxLengthDef extends $ZodCheckDef {
	check: "max_length";
	maximum: number;
}
interface $ZodCheckMaxLengthInternals<T extends util.HasLength = util.HasLength> extends $ZodCheckInternals<T> {
	def: $ZodCheckMaxLengthDef;
	issc: $ZodIssueTooBig<T>;
}
interface $ZodCheckMaxLength<T extends util.HasLength = util.HasLength> extends $ZodCheck<T> {
	_zod: $ZodCheckMaxLengthInternals<T>;
}
declare const $ZodCheckMaxLength: $constructor<$ZodCheckMaxLength>;
interface $ZodCheckMinLengthDef extends $ZodCheckDef {
	check: "min_length";
	minimum: number;
}
interface $ZodCheckMinLengthInternals<T extends util.HasLength = util.HasLength> extends $ZodCheckInternals<T> {
	def: $ZodCheckMinLengthDef;
	issc: $ZodIssueTooSmall<T>;
}
interface $ZodCheckMinLength<T extends util.HasLength = util.HasLength> extends $ZodCheck<T> {
	_zod: $ZodCheckMinLengthInternals<T>;
}
declare const $ZodCheckMinLength: $constructor<$ZodCheckMinLength>;
interface $ZodCheckLengthEqualsDef extends $ZodCheckDef {
	check: "length_equals";
	length: number;
}
interface $ZodCheckLengthEqualsInternals<T extends util.HasLength = util.HasLength> extends $ZodCheckInternals<T> {
	def: $ZodCheckLengthEqualsDef;
	issc: $ZodIssueTooBig<T> | $ZodIssueTooSmall<T>;
}
interface $ZodCheckLengthEquals<T extends util.HasLength = util.HasLength> extends $ZodCheck<T> {
	_zod: $ZodCheckLengthEqualsInternals<T>;
}
declare const $ZodCheckLengthEquals: $constructor<$ZodCheckLengthEquals>;
type $ZodStringFormats = "email" | "url" | "emoji" | "uuid" | "guid" | "nanoid" | "cuid" | "cuid2" | "ulid" | "xid" | "ksuid" | "datetime" | "date" | "time" | "duration" | "ipv4" | "ipv6" | "cidrv4" | "cidrv6" | "base64" | "base64url" | "json_string" | "e164" | "lowercase" | "uppercase" | "regex" | "jwt" | "starts_with" | "ends_with" | "includes";
interface $ZodCheckStringFormatDef<Format extends string = string> extends $ZodCheckDef {
	check: "string_format";
	format: Format;
	pattern?: RegExp | undefined;
}
interface $ZodCheckStringFormatInternals extends $ZodCheckInternals<string> {
	def: $ZodCheckStringFormatDef;
	issc: $ZodIssueInvalidStringFormat;
}
interface $ZodCheckStringFormat extends $ZodCheck<string> {
	_zod: $ZodCheckStringFormatInternals;
}
declare const $ZodCheckStringFormat: $constructor<$ZodCheckStringFormat>;
interface $ZodCheckRegexDef extends $ZodCheckStringFormatDef {
	format: "regex";
	pattern: RegExp;
}
interface $ZodCheckRegexInternals extends $ZodCheckInternals<string> {
	def: $ZodCheckRegexDef;
	issc: $ZodIssueInvalidStringFormat;
}
interface $ZodCheckRegex extends $ZodCheck<string> {
	_zod: $ZodCheckRegexInternals;
}
declare const $ZodCheckRegex: $constructor<$ZodCheckRegex>;
interface $ZodCheckLowerCaseDef extends $ZodCheckStringFormatDef<"lowercase"> {
}
interface $ZodCheckLowerCaseInternals extends $ZodCheckInternals<string> {
	def: $ZodCheckLowerCaseDef;
	issc: $ZodIssueInvalidStringFormat;
}
interface $ZodCheckLowerCase extends $ZodCheck<string> {
	_zod: $ZodCheckLowerCaseInternals;
}
declare const $ZodCheckLowerCase: $constructor<$ZodCheckLowerCase>;
interface $ZodCheckUpperCaseDef extends $ZodCheckStringFormatDef<"uppercase"> {
}
interface $ZodCheckUpperCaseInternals extends $ZodCheckInternals<string> {
	def: $ZodCheckUpperCaseDef;
	issc: $ZodIssueInvalidStringFormat;
}
interface $ZodCheckUpperCase extends $ZodCheck<string> {
	_zod: $ZodCheckUpperCaseInternals;
}
declare const $ZodCheckUpperCase: $constructor<$ZodCheckUpperCase>;
interface $ZodCheckIncludesDef extends $ZodCheckStringFormatDef<"includes"> {
	includes: string;
	position?: number | undefined;
}
interface $ZodCheckIncludesInternals extends $ZodCheckInternals<string> {
	def: $ZodCheckIncludesDef;
	issc: $ZodIssueInvalidStringFormat;
}
interface $ZodCheckIncludes extends $ZodCheck<string> {
	_zod: $ZodCheckIncludesInternals;
}
declare const $ZodCheckIncludes: $constructor<$ZodCheckIncludes>;
interface $ZodCheckStartsWithDef extends $ZodCheckStringFormatDef<"starts_with"> {
	prefix: string;
}
interface $ZodCheckStartsWithInternals extends $ZodCheckInternals<string> {
	def: $ZodCheckStartsWithDef;
	issc: $ZodIssueInvalidStringFormat;
}
interface $ZodCheckStartsWith extends $ZodCheck<string> {
	_zod: $ZodCheckStartsWithInternals;
}
declare const $ZodCheckStartsWith: $constructor<$ZodCheckStartsWith>;
interface $ZodCheckEndsWithDef extends $ZodCheckStringFormatDef<"ends_with"> {
	suffix: string;
}
interface $ZodCheckEndsWithInternals extends $ZodCheckInternals<string> {
	def: $ZodCheckEndsWithDef;
	issc: $ZodIssueInvalidStringFormat;
}
interface $ZodCheckEndsWith extends $ZodCheckInternals<string> {
	_zod: $ZodCheckEndsWithInternals;
}
declare const $ZodCheckEndsWith: $constructor<$ZodCheckEndsWith>;
interface $ZodCheckPropertyDef extends $ZodCheckDef {
	check: "property";
	property: string;
	schema: schemas.$ZodType;
}
interface $ZodCheckPropertyInternals<T extends object = object> extends $ZodCheckInternals<T> {
	def: $ZodCheckPropertyDef;
	issc: $ZodIssue;
}
interface $ZodCheckProperty<T extends object = object> extends $ZodCheck<T> {
	_zod: $ZodCheckPropertyInternals<T>;
}
declare const $ZodCheckProperty: $constructor<$ZodCheckProperty>;
interface $ZodCheckMimeTypeDef extends $ZodCheckDef {
	check: "mime_type";
	mime: util.MimeTypes[];
}
interface $ZodCheckMimeTypeInternals<T extends schemas.File = schemas.File> extends $ZodCheckInternals<T> {
	def: $ZodCheckMimeTypeDef;
	issc: $ZodIssueInvalidValue;
}
interface $ZodCheckMimeType<T extends schemas.File = schemas.File> extends $ZodCheck<T> {
	_zod: $ZodCheckMimeTypeInternals<T>;
}
declare const $ZodCheckMimeType: $constructor<$ZodCheckMimeType>;
interface $ZodCheckOverwriteDef<T = unknown> extends $ZodCheckDef {
	check: "overwrite";
	tx(value: T): T;
}
interface $ZodCheckOverwriteInternals<T = unknown> extends $ZodCheckInternals<T> {
	def: $ZodCheckOverwriteDef<T>;
	issc: never;
}
interface $ZodCheckOverwrite<T = unknown> extends $ZodCheck<T> {
	_zod: $ZodCheckOverwriteInternals<T>;
}
declare const $ZodCheckOverwrite: $constructor<$ZodCheckOverwrite>;
type $ZodChecks = $ZodCheckLessThan | $ZodCheckGreaterThan | $ZodCheckMultipleOf | $ZodCheckNumberFormat | $ZodCheckBigIntFormat | $ZodCheckMaxSize | $ZodCheckMinSize | $ZodCheckSizeEquals | $ZodCheckMaxLength | $ZodCheckMinLength | $ZodCheckLengthEquals | $ZodCheckStringFormat | $ZodCheckProperty | $ZodCheckMimeType | $ZodCheckOverwrite;
type $ZodStringFormatChecks = $ZodCheckRegex | $ZodCheckLowerCase | $ZodCheckUpperCase | $ZodCheckIncludes | $ZodCheckStartsWith | $ZodCheckEndsWith | schemas.$ZodStringFormatTypes;
interface $ZodIssueBase {
	readonly code?: string;
	readonly input?: unknown;
	readonly path: PropertyKey[];
	readonly message: string;
}
interface $ZodIssueInvalidType<Input = unknown> extends $ZodIssueBase {
	readonly code: "invalid_type";
	readonly expected: $ZodType["_zod"]["def"]["type"];
	readonly input?: Input;
}
interface $ZodIssueTooBig<Input = unknown> extends $ZodIssueBase {
	readonly code: "too_big";
	readonly origin: "number" | "int" | "bigint" | "date" | "string" | "array" | "set" | "file" | (string & {});
	readonly maximum: number | bigint;
	readonly inclusive?: boolean;
	readonly exact?: boolean;
	readonly input?: Input;
}
interface $ZodIssueTooSmall<Input = unknown> extends $ZodIssueBase {
	readonly code: "too_small";
	readonly origin: "number" | "int" | "bigint" | "date" | "string" | "array" | "set" | "file" | (string & {});
	readonly minimum: number | bigint;
	/** True if the allowable range includes the minimum */
	readonly inclusive?: boolean;
	/** True if the allowed value is fixed (e.g.` z.length(5)`), not a range (`z.minLength(5)`) */
	readonly exact?: boolean;
	readonly input?: Input;
}
interface $ZodIssueInvalidStringFormat extends $ZodIssueBase {
	readonly code: "invalid_format";
	readonly format: $ZodStringFormats | (string & {});
	readonly pattern?: string;
	readonly input?: string;
}
interface $ZodIssueNotMultipleOf<Input extends number | bigint = number | bigint> extends $ZodIssueBase {
	readonly code: "not_multiple_of";
	readonly divisor: number;
	readonly input?: Input;
}
interface $ZodIssueUnrecognizedKeys extends $ZodIssueBase {
	readonly code: "unrecognized_keys";
	readonly keys: string[];
	readonly input?: Record<string, unknown>;
}
interface $ZodIssueInvalidUnion extends $ZodIssueBase {
	readonly code: "invalid_union";
	readonly errors: $ZodIssue[][];
	readonly input?: unknown;
	readonly discriminator?: string | undefined;
}
interface $ZodIssueInvalidKey<Input = unknown> extends $ZodIssueBase {
	readonly code: "invalid_key";
	readonly origin: "map" | "record";
	readonly issues: $ZodIssue[];
	readonly input?: Input;
}
interface $ZodIssueInvalidElement<Input = unknown> extends $ZodIssueBase {
	readonly code: "invalid_element";
	readonly origin: "map" | "set";
	readonly key: unknown;
	readonly issues: $ZodIssue[];
	readonly input?: Input;
}
interface $ZodIssueInvalidValue<Input = unknown> extends $ZodIssueBase {
	readonly code: "invalid_value";
	readonly values: util.Primitive[];
	readonly input?: Input;
}
interface $ZodIssueCustom extends $ZodIssueBase {
	readonly code: "custom";
	readonly params?: Record<string, any> | undefined;
	readonly input?: unknown;
}
interface $ZodIssueStringCommonFormats extends $ZodIssueInvalidStringFormat {
	format: Exclude<$ZodStringFormats, "regex" | "jwt" | "starts_with" | "ends_with" | "includes">;
}
interface $ZodIssueStringInvalidRegex extends $ZodIssueInvalidStringFormat {
	format: "regex";
	pattern: string;
}
interface $ZodIssueStringInvalidJWT extends $ZodIssueInvalidStringFormat {
	format: "jwt";
	algorithm?: string;
}
interface $ZodIssueStringStartsWith extends $ZodIssueInvalidStringFormat {
	format: "starts_with";
	prefix: string;
}
interface $ZodIssueStringEndsWith extends $ZodIssueInvalidStringFormat {
	format: "ends_with";
	suffix: string;
}
interface $ZodIssueStringIncludes extends $ZodIssueInvalidStringFormat {
	format: "includes";
	includes: string;
}
type $ZodStringFormatIssues = $ZodIssueStringCommonFormats | $ZodIssueStringInvalidRegex | $ZodIssueStringInvalidJWT | $ZodIssueStringStartsWith | $ZodIssueStringEndsWith | $ZodIssueStringIncludes;
type $ZodIssue = $ZodIssueInvalidType | $ZodIssueTooBig | $ZodIssueTooSmall | $ZodIssueInvalidStringFormat | $ZodIssueNotMultipleOf | $ZodIssueUnrecognizedKeys | $ZodIssueInvalidUnion | $ZodIssueInvalidKey | $ZodIssueInvalidElement | $ZodIssueInvalidValue | $ZodIssueCustom;
type $ZodIssueCode = $ZodIssue["code"];
type $ZodInternalIssue<T extends $ZodIssueBase = $ZodIssue> = T extends any ? RawIssue<T> : never;
type RawIssue<T extends $ZodIssueBase> = T extends any ? util.Flatten<util.MakePartial<T, "message" | "path"> & {
	/** The input data */
	readonly input: unknown;
	/** The schema or check that originated this issue. */
	readonly inst?: $ZodType | $ZodCheck;
	/** If `true`, Zod will continue executing checks/refinements after this issue. */
	readonly continue?: boolean | undefined;
} & Record<string, unknown>> : never;
type $ZodRawIssue<T extends $ZodIssueBase = $ZodIssue> = $ZodInternalIssue<T>;
interface $ZodErrorMap<T extends $ZodIssueBase = $ZodIssue> {
	(issue: $ZodRawIssue<T>): {
		message: string;
	} | string | undefined | null;
}
interface $ZodError<T = unknown> extends Error {
	type: T;
	issues: $ZodIssue[];
	_zod: {
		output: T;
		def: $ZodIssue[];
	};
	stack?: string;
	name: string;
}
declare const $ZodError: $constructor<$ZodError>;
interface $ZodRealError<T = any> extends $ZodError<T> {
}
declare const $ZodRealError$1: $constructor<$ZodRealError>;
type $ZodFlattenedError<T, U = string> = _FlattenedError<T, U>;
type _FlattenedError<T, U = string> = {
	formErrors: U[];
	fieldErrors: {
		[P in keyof T]?: U[];
	};
};
declare function flattenError<T>(error: $ZodError<T>): _FlattenedError<T>;
declare function flattenError<T, U>(error: $ZodError<T>, mapper?: (issue: $ZodIssue) => U): _FlattenedError<T, U>;
type _ZodFormattedError<T, U = string> = T extends [
	any,
	...any[]
] ? {
	[K in keyof T]?: $ZodFormattedError<T[K], U>;
} : T extends any[] ? {
	[k: number]: $ZodFormattedError<T[number], U>;
} : T extends object ? util.Flatten<{
	[K in keyof T]?: $ZodFormattedError<T[K], U>;
}> : any;
type $ZodFormattedError<T, U = string> = {
	_errors: U[];
} & util.Flatten<_ZodFormattedError<T, U>>;
declare function formatError<T>(error: $ZodError<T>): $ZodFormattedError<T>;
declare function formatError<T, U>(error: $ZodError<T>, mapper?: (issue: $ZodIssue) => U): $ZodFormattedError<T, U>;
type $ZodErrorTree<T, U = string> = T extends util.Primitive ? {
	errors: U[];
} : T extends [
	any,
	...any[]
] ? {
	errors: U[];
	items?: {
		[K in keyof T]?: $ZodErrorTree<T[K], U>;
	};
} : T extends any[] ? {
	errors: U[];
	items?: Array<$ZodErrorTree<T[number], U>>;
} : T extends object ? {
	errors: U[];
	properties?: {
		[K in keyof T]?: $ZodErrorTree<T[K], U>;
	};
} : {
	errors: U[];
};
declare function treeifyError<T>(error: $ZodError<T>): $ZodErrorTree<T>;
declare function treeifyError<T, U>(error: $ZodError<T>, mapper?: (issue: $ZodIssue) => U): $ZodErrorTree<T, U>;
declare function toDotPath(_path: readonly (string | number | symbol | StandardSchemaV1.PathSegment)[]): string;
declare function prettifyError(error: StandardSchemaV1.FailureResult): string;
type ZodTrait = {
	_zod: {
		def: any;
		[k: string]: any;
	};
};
interface $constructor<T extends ZodTrait, D = T["_zod"]["def"]> {
	new (def: D): T;
	init(inst: T, def: D): asserts inst is T;
}
declare const NEVER: never;
declare function $constructor<T extends ZodTrait, D = T["_zod"]["def"]>(name: string, initializer: (inst: T, def: D) => void, params?: {
	Parent?: typeof Class;
}): $constructor<T, D>;
declare const $brand: unique symbol;
type $brand<T extends string | number | symbol = string | number | symbol> = {
	[$brand]: {
		[k in T]: true;
	};
};
type $ZodBranded<T extends schemas.SomeType, Brand extends string | number | symbol> = T & Record<"_zod", Record<"output", output<T> & $brand<Brand>>>;
declare class $ZodAsyncError extends Error {
	constructor();
}
declare class $ZodEncodeError extends Error {
	constructor(name: string);
}
type input<T> = T extends {
	_zod: {
		input: any;
	};
} ? T["_zod"]["input"] : unknown;
type output<T> = T extends {
	_zod: {
		output: any;
	};
} ? T["_zod"]["output"] : unknown;
interface $ZodConfig {
	/** Custom error map. Overrides `config().localeError`. */
	customError?: $ZodErrorMap | undefined;
	/** Localized error map. Lowest priority. */
	localeError?: $ZodErrorMap | undefined;
	/** Disable JIT schema compilation. Useful in environments that disallow `eval`. */
	jitless?: boolean | undefined;
}
declare const globalConfig: $ZodConfig;
declare function config(newConfig?: Partial<$ZodConfig>): $ZodConfig;
type $ZodErrorClass = {
	new (issues: $ZodIssue[]): $ZodError;
};
type $Parse = <T extends schemas.$ZodType>(schema: T, value: unknown, _ctx?: schemas.ParseContext<$ZodIssue>, _params?: {
	callee?: util.AnyFunc;
	Err?: $ZodErrorClass;
}) => output<T>;
declare const _parse: (_Err: $ZodErrorClass) => $Parse;
declare const parse: $Parse;
type $ParseAsync = <T extends schemas.$ZodType>(schema: T, value: unknown, _ctx?: schemas.ParseContext<$ZodIssue>, _params?: {
	callee?: util.AnyFunc;
	Err?: $ZodErrorClass;
}) => Promise<output<T>>;
declare const _parseAsync: (_Err: $ZodErrorClass) => $ParseAsync;
declare const parseAsync: $ParseAsync;
type $SafeParse = <T extends schemas.$ZodType>(schema: T, value: unknown, _ctx?: schemas.ParseContext<$ZodIssue>) => util.SafeParseResult<output<T>>;
declare const _safeParse: (_Err: $ZodErrorClass) => $SafeParse;
declare const safeParse: $SafeParse;
type $SafeParseAsync = <T extends schemas.$ZodType>(schema: T, value: unknown, _ctx?: schemas.ParseContext<$ZodIssue>) => Promise<util.SafeParseResult<output<T>>>;
declare const _safeParseAsync: (_Err: $ZodErrorClass) => $SafeParseAsync;
declare const safeParseAsync: $SafeParseAsync;
type $Encode = <T extends schemas.$ZodType>(schema: T, value: output<T>, _ctx?: schemas.ParseContext<$ZodIssue>) => input<T>;
declare const _encode: (_Err: $ZodErrorClass) => $Encode;
declare const encode: $Encode;
type $Decode = <T extends schemas.$ZodType>(schema: T, value: input<T>, _ctx?: schemas.ParseContext<$ZodIssue>) => output<T>;
declare const _decode: (_Err: $ZodErrorClass) => $Decode;
declare const decode: $Decode;
type $EncodeAsync = <T extends schemas.$ZodType>(schema: T, value: output<T>, _ctx?: schemas.ParseContext<$ZodIssue>) => Promise<input<T>>;
declare const _encodeAsync: (_Err: $ZodErrorClass) => $EncodeAsync;
declare const encodeAsync: $EncodeAsync;
type $DecodeAsync = <T extends schemas.$ZodType>(schema: T, value: input<T>, _ctx?: schemas.ParseContext<$ZodIssue>) => Promise<output<T>>;
declare const _decodeAsync: (_Err: $ZodErrorClass) => $DecodeAsync;
declare const decodeAsync: $DecodeAsync;
type $SafeEncode = <T extends schemas.$ZodType>(schema: T, value: output<T>, _ctx?: schemas.ParseContext<$ZodIssue>) => util.SafeParseResult<input<T>>;
declare const _safeEncode: (_Err: $ZodErrorClass) => $SafeEncode;
declare const safeEncode: $SafeEncode;
type $SafeDecode = <T extends schemas.$ZodType>(schema: T, value: input<T>, _ctx?: schemas.ParseContext<$ZodIssue>) => util.SafeParseResult<output<T>>;
declare const _safeDecode: (_Err: $ZodErrorClass) => $SafeDecode;
declare const safeDecode: $SafeDecode;
type $SafeEncodeAsync = <T extends schemas.$ZodType>(schema: T, value: output<T>, _ctx?: schemas.ParseContext<$ZodIssue>) => Promise<util.SafeParseResult<input<T>>>;
declare const _safeEncodeAsync: (_Err: $ZodErrorClass) => $SafeEncodeAsync;
declare const safeEncodeAsync: $SafeEncodeAsync;
type $SafeDecodeAsync = <T extends schemas.$ZodType>(schema: T, value: input<T>, _ctx?: schemas.ParseContext<$ZodIssue>) => Promise<util.SafeParseResult<output<T>>>;
declare const _safeDecodeAsync: (_Err: $ZodErrorClass) => $SafeDecodeAsync;
declare const safeDecodeAsync: $SafeDecodeAsync;
declare const cuid: RegExp;
declare const cuid2: RegExp;
declare const ulid: RegExp;
declare const xid: RegExp;
declare const ksuid: RegExp;
declare const nanoid: RegExp;
declare const duration: RegExp;
declare const extendedDuration: RegExp;
declare const guid: RegExp;
declare const uuid: (version?: number | undefined) => RegExp;
declare const uuid4: RegExp;
declare const uuid6: RegExp;
declare const uuid7: RegExp;
declare const email: RegExp;
declare const html5Email: RegExp;
declare const rfc5322Email: RegExp;
declare const unicodeEmail: RegExp;
declare const idnEmail: RegExp;
declare const browserEmail: RegExp;
declare function emoji(): RegExp;
declare const ipv4: RegExp;
declare const ipv6: RegExp;
declare const cidrv4: RegExp;
declare const cidrv6: RegExp;
declare const base64: RegExp;
declare const base64url: RegExp;
declare const hostname: RegExp;
declare const domain: RegExp;
declare const e164: RegExp;
declare const date: RegExp;
declare function time(args: {
	precision?: number | null;
}): RegExp;
declare function datetime(args: {
	precision?: number | null;
	offset?: boolean;
	local?: boolean;
}): RegExp;
declare const string: (params?: {
	minimum?: number | undefined;
	maximum?: number | undefined;
}) => RegExp;
declare const bigint: RegExp;
declare const integer: RegExp;
declare const number: RegExp;
declare const boolean: RegExp;
declare const _null: RegExp;
declare const _undefined: RegExp;
declare const lowercase: RegExp;
declare const uppercase: RegExp;
declare const hex: RegExp;
declare const md5_hex: RegExp;
declare const md5_base64: RegExp;
declare const md5_base64url: RegExp;
declare const sha1_hex: RegExp;
declare const sha1_base64: RegExp;
declare const sha1_base64url: RegExp;
declare const sha256_hex: RegExp;
declare const sha256_base64: RegExp;
declare const sha256_base64url: RegExp;
declare const sha384_hex: RegExp;
declare const sha384_base64: RegExp;
declare const sha384_base64url: RegExp;
declare const sha512_hex: RegExp;
declare const sha512_base64: RegExp;
declare const sha512_base64url: RegExp;
declare function _default(): {
	localeError: $ZodErrorMap;
};
declare function _default$1(): {
	localeError: $ZodErrorMap;
};
declare function _default$2(): {
	localeError: $ZodErrorMap;
};
declare function _default$3(): {
	localeError: $ZodErrorMap;
};
declare function _default$4(): {
	localeError: $ZodErrorMap;
};
declare function _default$5(): {
	localeError: $ZodErrorMap;
};
declare function _default$6(): {
	localeError: $ZodErrorMap;
};
declare function _default$7(): {
	localeError: $ZodErrorMap;
};
declare function _default$8(): {
	localeError: $ZodErrorMap;
};
declare function _default$9(): {
	localeError: $ZodErrorMap;
};
declare function _default$10(): {
	localeError: $ZodErrorMap;
};
declare function _default$11(): {
	localeError: $ZodErrorMap;
};
declare function _default$12(): {
	localeError: $ZodErrorMap;
};
declare function _default$13(): {
	localeError: $ZodErrorMap;
};
declare function _default$14(): {
	localeError: $ZodErrorMap;
};
declare function _default$15(): {
	localeError: $ZodErrorMap;
};
declare function _default$16(): {
	localeError: $ZodErrorMap;
};
declare function _default$17(): {
	localeError: $ZodErrorMap;
};
declare function _default$18(): {
	localeError: $ZodErrorMap;
};
declare function _default$19(): {
	localeError: $ZodErrorMap;
};
declare function _default$20(): {
	localeError: $ZodErrorMap;
};
declare function _default$21(): {
	localeError: $ZodErrorMap;
};
declare function _default$22(): {
	localeError: $ZodErrorMap;
};
declare function _default$23(): {
	localeError: $ZodErrorMap;
};
declare function _default$24(): {
	localeError: $ZodErrorMap;
};
declare function _default$25(): {
	localeError: $ZodErrorMap;
};
declare function _default$26(): {
	localeError: $ZodErrorMap;
};
declare function _default$27(): {
	localeError: $ZodErrorMap;
};
declare function _default$28(): {
	localeError: $ZodErrorMap;
};
declare function _default$29(): {
	localeError: $ZodErrorMap;
};
declare function _default$30(): {
	localeError: $ZodErrorMap;
};
declare function _default$31(): {
	localeError: $ZodErrorMap;
};
declare function _default$32(): {
	localeError: $ZodErrorMap;
};
declare function _default$33(): {
	localeError: $ZodErrorMap;
};
declare function _default$34(): {
	localeError: $ZodErrorMap;
};
declare function _default$35(): {
	localeError: $ZodErrorMap;
};
declare function _default$36(): {
	localeError: $ZodErrorMap;
};
declare function _default$37(): {
	localeError: $ZodErrorMap;
};
declare function _default$38(): {
	localeError: $ZodErrorMap;
};
declare function _default$39(): {
	localeError: $ZodErrorMap;
};
declare function _default$40(): {
	localeError: $ZodErrorMap;
};
declare function _default$41(): {
	localeError: $ZodErrorMap;
};
declare function _default$42(): {
	localeError: $ZodErrorMap;
};
declare function _default$43(): {
	localeError: $ZodErrorMap;
};
declare function _default$44(): {
	localeError: $ZodErrorMap;
};
declare function _default$45(): {
	localeError: $ZodErrorMap;
};
declare function _default$46(): {
	localeError: $ZodErrorMap;
};
declare const $output: unique symbol;
type $output = typeof $output;
declare const $input: unique symbol;
type $input = typeof $input;
type $replace<Meta, S extends $ZodType> = Meta extends $output ? output<S> : Meta extends $input ? input<S> : Meta extends (infer M)[] ? $replace<M, S>[] : Meta extends (...args: infer P) => infer R ? (...args: {
	[K in keyof P]: $replace<P[K], S>;
}) => $replace<R, S> : Meta extends object ? {
	[K in keyof Meta]: $replace<Meta[K], S>;
} : Meta;
type MetadataType = object | undefined;
declare class $ZodRegistry<Meta extends MetadataType = MetadataType, Schema extends $ZodType = $ZodType> {
	_meta: Meta;
	_schema: Schema;
	_map: WeakMap<Schema, $replace<Meta, Schema>>;
	_idmap: Map<string, Schema>;
	add<S extends Schema>(schema: S, ..._meta: undefined extends Meta ? [
		$replace<Meta, S>?
	] : [
		$replace<Meta, S>
	]): this;
	clear(): this;
	remove(schema: Schema): this;
	get<S extends Schema>(schema: S): $replace<Meta, S> | undefined;
	has(schema: Schema): boolean;
}
interface JSONSchemaMeta {
	id?: string | undefined;
	title?: string | undefined;
	description?: string | undefined;
	deprecated?: boolean | undefined;
	[k: string]: unknown;
}
interface GlobalMeta extends JSONSchemaMeta {
}
declare function registry<T extends MetadataType = MetadataType, S extends $ZodType = $ZodType>(): $ZodRegistry<T, S>;
declare const globalRegistry: $ZodRegistry<GlobalMeta>;
type ModeWriter = (doc: Doc, modes: {
	execution: "sync" | "async";
}) => void;
declare class Doc {
	args: string[];
	content: string[];
	indent: number;
	constructor(args?: string[]);
	indented(fn: (doc: Doc) => void): void;
	write(fn: ModeWriter): void;
	write(line: string): void;
	compile(): any;
}
type Params<T extends schemas.$ZodType | $ZodCheck, IssueTypes extends $ZodIssueBase, OmitKeys extends keyof T["_zod"]["def"] = never> = util.Flatten<Partial<util.EmptyToNever<Omit<T["_zod"]["def"], OmitKeys> & ([
	IssueTypes
] extends [
	never
] ? {} : {
	error?: string | $ZodErrorMap<IssueTypes> | undefined;
	/** @deprecated This parameter is deprecated. Use `error` instead. */
	message?: string | undefined;
})>>>;
type TypeParams<T extends schemas.$ZodType = schemas.$ZodType & {
	_isst: never;
}, AlsoOmit extends Exclude<keyof T["_zod"]["def"], "type" | "checks" | "error"> = never> = Params<T, NonNullable<T["_zod"]["isst"]>, "type" | "checks" | "error" | AlsoOmit>;
type CheckParams<T extends $ZodCheck = $ZodCheck, // & { _issc: never },
AlsoOmit extends Exclude<keyof T["_zod"]["def"], "check" | "error"> = never> = Params<T, NonNullable<T["_zod"]["issc"]>, "check" | "error" | AlsoOmit>;
type StringFormatParams<T extends schemas.$ZodStringFormat = schemas.$ZodStringFormat, AlsoOmit extends Exclude<keyof T["_zod"]["def"], "type" | "coerce" | "checks" | "error" | "check" | "format"> = never> = Params<T, NonNullable<T["_zod"]["isst"] | T["_zod"]["issc"]>, "type" | "coerce" | "checks" | "error" | "check" | "format" | AlsoOmit>;
type CheckStringFormatParams<T extends schemas.$ZodStringFormat = schemas.$ZodStringFormat, AlsoOmit extends Exclude<keyof T["_zod"]["def"], "type" | "coerce" | "checks" | "error" | "check" | "format"> = never> = Params<T, NonNullable<T["_zod"]["issc"]>, "type" | "coerce" | "checks" | "error" | "check" | "format" | AlsoOmit>;
type CheckTypeParams<T extends schemas.$ZodType & $ZodCheck = schemas.$ZodType & $ZodCheck, AlsoOmit extends Exclude<keyof T["_zod"]["def"], "type" | "checks" | "error" | "check"> = never> = Params<T, NonNullable<T["_zod"]["isst"] | T["_zod"]["issc"]>, "type" | "checks" | "error" | "check" | AlsoOmit>;
type $ZodStringParams = TypeParams<schemas.$ZodString<string>, "coerce">;
declare function _string<T extends schemas.$ZodString>(Class: util.SchemaClass<T>, params?: string | $ZodStringParams): T;
declare function _coercedString<T extends schemas.$ZodString>(Class: util.SchemaClass<T>, params?: string | $ZodStringParams): T;
type $ZodStringFormatParams = CheckTypeParams<schemas.$ZodStringFormat, "format" | "coerce" | "when" | "pattern">;
type $ZodCheckStringFormatParams = CheckParams<$ZodCheckStringFormat, "format">;
type $ZodEmailParams = StringFormatParams<schemas.$ZodEmail, "when">;
type $ZodCheckEmailParams = CheckStringFormatParams<schemas.$ZodEmail, "when">;
declare function _email<T extends schemas.$ZodEmail>(Class: util.SchemaClass<T>, params?: string | $ZodEmailParams | $ZodCheckEmailParams): T;
type $ZodGUIDParams = StringFormatParams<schemas.$ZodGUID, "pattern" | "when">;
type $ZodCheckGUIDParams = CheckStringFormatParams<schemas.$ZodGUID, "pattern" | "when">;
declare function _guid<T extends schemas.$ZodGUID>(Class: util.SchemaClass<T>, params?: string | $ZodGUIDParams | $ZodCheckGUIDParams): T;
type $ZodUUIDParams = StringFormatParams<schemas.$ZodUUID, "pattern" | "when">;
type $ZodCheckUUIDParams = CheckStringFormatParams<schemas.$ZodUUID, "pattern" | "when">;
declare function _uuid<T extends schemas.$ZodUUID>(Class: util.SchemaClass<T>, params?: string | $ZodUUIDParams | $ZodCheckUUIDParams): T;
type $ZodUUIDv4Params = StringFormatParams<schemas.$ZodUUID, "pattern" | "when">;
type $ZodCheckUUIDv4Params = CheckStringFormatParams<schemas.$ZodUUID, "pattern" | "when">;
declare function _uuidv4<T extends schemas.$ZodUUID>(Class: util.SchemaClass<T>, params?: string | $ZodUUIDv4Params | $ZodCheckUUIDv4Params): T;
type $ZodUUIDv6Params = StringFormatParams<schemas.$ZodUUID, "pattern" | "when">;
type $ZodCheckUUIDv6Params = CheckStringFormatParams<schemas.$ZodUUID, "pattern" | "when">;
declare function _uuidv6<T extends schemas.$ZodUUID>(Class: util.SchemaClass<T>, params?: string | $ZodUUIDv6Params | $ZodCheckUUIDv6Params): T;
type $ZodUUIDv7Params = StringFormatParams<schemas.$ZodUUID, "pattern" | "when">;
type $ZodCheckUUIDv7Params = CheckStringFormatParams<schemas.$ZodUUID, "pattern" | "when">;
declare function _uuidv7<T extends schemas.$ZodUUID>(Class: util.SchemaClass<T>, params?: string | $ZodUUIDv7Params | $ZodCheckUUIDv7Params): T;
type $ZodURLParams = StringFormatParams<schemas.$ZodURL, "when">;
type $ZodCheckURLParams = CheckStringFormatParams<schemas.$ZodURL, "when">;
declare function _url<T extends schemas.$ZodURL>(Class: util.SchemaClass<T>, params?: string | $ZodURLParams | $ZodCheckURLParams): T;
type $ZodEmojiParams = StringFormatParams<schemas.$ZodEmoji, "when">;
type $ZodCheckEmojiParams = CheckStringFormatParams<schemas.$ZodEmoji, "when">;
declare function _emoji<T extends schemas.$ZodEmoji>(Class: util.SchemaClass<T>, params?: string | $ZodEmojiParams | $ZodCheckEmojiParams): T;
type $ZodNanoIDParams = StringFormatParams<schemas.$ZodNanoID, "when">;
type $ZodCheckNanoIDParams = CheckStringFormatParams<schemas.$ZodNanoID, "when">;
declare function _nanoid<T extends schemas.$ZodNanoID>(Class: util.SchemaClass<T>, params?: string | $ZodNanoIDParams | $ZodCheckNanoIDParams): T;
type $ZodCUIDParams = StringFormatParams<schemas.$ZodCUID, "when">;
type $ZodCheckCUIDParams = CheckStringFormatParams<schemas.$ZodCUID, "when">;
declare function _cuid<T extends schemas.$ZodCUID>(Class: util.SchemaClass<T>, params?: string | $ZodCUIDParams | $ZodCheckCUIDParams): T;
type $ZodCUID2Params = StringFormatParams<schemas.$ZodCUID2, "when">;
type $ZodCheckCUID2Params = CheckStringFormatParams<schemas.$ZodCUID2, "when">;
declare function _cuid2<T extends schemas.$ZodCUID2>(Class: util.SchemaClass<T>, params?: string | $ZodCUID2Params | $ZodCheckCUID2Params): T;
type $ZodULIDParams = StringFormatParams<schemas.$ZodULID, "when">;
type $ZodCheckULIDParams = CheckStringFormatParams<schemas.$ZodULID, "when">;
declare function _ulid<T extends schemas.$ZodULID>(Class: util.SchemaClass<T>, params?: string | $ZodULIDParams | $ZodCheckULIDParams): T;
type $ZodXIDParams = StringFormatParams<schemas.$ZodXID, "when">;
type $ZodCheckXIDParams = CheckStringFormatParams<schemas.$ZodXID, "when">;
declare function _xid<T extends schemas.$ZodXID>(Class: util.SchemaClass<T>, params?: string | $ZodXIDParams | $ZodCheckXIDParams): T;
type $ZodKSUIDParams = StringFormatParams<schemas.$ZodKSUID, "when">;
type $ZodCheckKSUIDParams = CheckStringFormatParams<schemas.$ZodKSUID, "when">;
declare function _ksuid<T extends schemas.$ZodKSUID>(Class: util.SchemaClass<T>, params?: string | $ZodKSUIDParams | $ZodCheckKSUIDParams): T;
type $ZodIPv4Params = StringFormatParams<schemas.$ZodIPv4, "pattern" | "when" | "version">;
type $ZodCheckIPv4Params = CheckStringFormatParams<schemas.$ZodIPv4, "pattern" | "when" | "version">;
declare function _ipv4<T extends schemas.$ZodIPv4>(Class: util.SchemaClass<T>, params?: string | $ZodIPv4Params | $ZodCheckIPv4Params): T;
type $ZodIPv6Params = StringFormatParams<schemas.$ZodIPv6, "pattern" | "when" | "version">;
type $ZodCheckIPv6Params = CheckStringFormatParams<schemas.$ZodIPv6, "pattern" | "when" | "version">;
declare function _ipv6<T extends schemas.$ZodIPv6>(Class: util.SchemaClass<T>, params?: string | $ZodIPv6Params | $ZodCheckIPv6Params): T;
type $ZodCIDRv4Params = StringFormatParams<schemas.$ZodCIDRv4, "pattern" | "when">;
type $ZodCheckCIDRv4Params = CheckStringFormatParams<schemas.$ZodCIDRv4, "pattern" | "when">;
declare function _cidrv4<T extends schemas.$ZodCIDRv4>(Class: util.SchemaClass<T>, params?: string | $ZodCIDRv4Params | $ZodCheckCIDRv4Params): T;
type $ZodCIDRv6Params = StringFormatParams<schemas.$ZodCIDRv6, "pattern" | "when">;
type $ZodCheckCIDRv6Params = CheckStringFormatParams<schemas.$ZodCIDRv6, "pattern" | "when">;
declare function _cidrv6<T extends schemas.$ZodCIDRv6>(Class: util.SchemaClass<T>, params?: string | $ZodCIDRv6Params | $ZodCheckCIDRv6Params): T;
type $ZodBase64Params = StringFormatParams<schemas.$ZodBase64, "pattern" | "when">;
type $ZodCheckBase64Params = CheckStringFormatParams<schemas.$ZodBase64, "pattern" | "when">;
declare function _base64<T extends schemas.$ZodBase64>(Class: util.SchemaClass<T>, params?: string | $ZodBase64Params | $ZodCheckBase64Params): T;
type $ZodBase64URLParams = StringFormatParams<schemas.$ZodBase64URL, "pattern" | "when">;
type $ZodCheckBase64URLParams = CheckStringFormatParams<schemas.$ZodBase64URL, "pattern" | "when">;
declare function _base64url<T extends schemas.$ZodBase64URL>(Class: util.SchemaClass<T>, params?: string | $ZodBase64URLParams | $ZodCheckBase64URLParams): T;
type $ZodE164Params = StringFormatParams<schemas.$ZodE164, "when">;
type $ZodCheckE164Params = CheckStringFormatParams<schemas.$ZodE164, "when">;
declare function _e164<T extends schemas.$ZodE164>(Class: util.SchemaClass<T>, params?: string | $ZodE164Params | $ZodCheckE164Params): T;
type $ZodJWTParams = StringFormatParams<schemas.$ZodJWT, "pattern" | "when">;
type $ZodCheckJWTParams = CheckStringFormatParams<schemas.$ZodJWT, "pattern" | "when">;
declare function _jwt<T extends schemas.$ZodJWT>(Class: util.SchemaClass<T>, params?: string | $ZodJWTParams | $ZodCheckJWTParams): T;
declare const TimePrecision: {
	readonly Any: null;
	readonly Minute: -1;
	readonly Second: 0;
	readonly Millisecond: 3;
	readonly Microsecond: 6;
};
type $ZodISODateTimeParams = StringFormatParams<schemas.$ZodISODateTime, "pattern" | "when">;
type $ZodCheckISODateTimeParams = CheckStringFormatParams<schemas.$ZodISODateTime, "pattern" | "when">;
declare function _isoDateTime<T extends schemas.$ZodISODateTime>(Class: util.SchemaClass<T>, params?: string | $ZodISODateTimeParams | $ZodCheckISODateTimeParams): T;
type $ZodISODateParams = StringFormatParams<schemas.$ZodISODate, "pattern" | "when">;
type $ZodCheckISODateParams = CheckStringFormatParams<schemas.$ZodISODate, "pattern" | "when">;
declare function _isoDate<T extends schemas.$ZodISODate>(Class: util.SchemaClass<T>, params?: string | $ZodISODateParams | $ZodCheckISODateParams): T;
type $ZodISOTimeParams = StringFormatParams<schemas.$ZodISOTime, "pattern" | "when">;
type $ZodCheckISOTimeParams = CheckStringFormatParams<schemas.$ZodISOTime, "pattern" | "when">;
declare function _isoTime<T extends schemas.$ZodISOTime>(Class: util.SchemaClass<T>, params?: string | $ZodISOTimeParams | $ZodCheckISOTimeParams): T;
type $ZodISODurationParams = StringFormatParams<schemas.$ZodISODuration, "when">;
type $ZodCheckISODurationParams = CheckStringFormatParams<schemas.$ZodISODuration, "when">;
declare function _isoDuration<T extends schemas.$ZodISODuration>(Class: util.SchemaClass<T>, params?: string | $ZodISODurationParams | $ZodCheckISODurationParams): T;
type $ZodNumberParams = TypeParams<schemas.$ZodNumber<number>, "coerce">;
type $ZodNumberFormatParams = CheckTypeParams<schemas.$ZodNumberFormat, "format" | "coerce">;
type $ZodCheckNumberFormatParams = CheckParams<$ZodCheckNumberFormat, "format" | "when">;
declare function _number<T extends schemas.$ZodNumber>(Class: util.SchemaClass<T>, params?: string | $ZodNumberParams): T;
declare function _coercedNumber<T extends schemas.$ZodNumber>(Class: util.SchemaClass<T>, params?: string | $ZodNumberParams): T;
declare function _int<T extends schemas.$ZodNumberFormat>(Class: util.SchemaClass<T>, params?: string | $ZodCheckNumberFormatParams): T;
declare function _float32<T extends schemas.$ZodNumberFormat>(Class: util.SchemaClass<T>, params?: string | $ZodCheckNumberFormatParams): T;
declare function _float64<T extends schemas.$ZodNumberFormat>(Class: util.SchemaClass<T>, params?: string | $ZodCheckNumberFormatParams): T;
declare function _int32<T extends schemas.$ZodNumberFormat>(Class: util.SchemaClass<T>, params?: string | $ZodCheckNumberFormatParams): T;
declare function _uint32<T extends schemas.$ZodNumberFormat>(Class: util.SchemaClass<T>, params?: string | $ZodCheckNumberFormatParams): T;
type $ZodBooleanParams = TypeParams<schemas.$ZodBoolean<boolean>, "coerce">;
declare function _boolean<T extends schemas.$ZodBoolean>(Class: util.SchemaClass<T>, params?: string | $ZodBooleanParams): T;
declare function _coercedBoolean<T extends schemas.$ZodBoolean>(Class: util.SchemaClass<T>, params?: string | $ZodBooleanParams): T;
type $ZodBigIntParams = TypeParams<schemas.$ZodBigInt<bigint>>;
type $ZodBigIntFormatParams = CheckTypeParams<schemas.$ZodBigIntFormat, "format" | "coerce">;
type $ZodCheckBigIntFormatParams = CheckParams<$ZodCheckBigIntFormat, "format" | "when">;
declare function _bigint<T extends schemas.$ZodBigInt>(Class: util.SchemaClass<T>, params?: string | $ZodBigIntParams): T;
declare function _coercedBigint<T extends schemas.$ZodBigInt>(Class: util.SchemaClass<T>, params?: string | $ZodBigIntParams): T;
declare function _int64<T extends schemas.$ZodBigIntFormat>(Class: util.SchemaClass<T>, params?: string | $ZodBigIntFormatParams): T;
declare function _uint64<T extends schemas.$ZodBigIntFormat>(Class: util.SchemaClass<T>, params?: string | $ZodBigIntFormatParams): T;
type $ZodSymbolParams = TypeParams<schemas.$ZodSymbol>;
declare function _symbol<T extends schemas.$ZodSymbol>(Class: util.SchemaClass<T>, params?: string | $ZodSymbolParams): T;
type $ZodUndefinedParams = TypeParams<schemas.$ZodUndefined>;
declare function _undefined$1<T extends schemas.$ZodUndefined>(Class: util.SchemaClass<T>, params?: string | $ZodUndefinedParams): T;
type $ZodNullParams = TypeParams<schemas.$ZodNull>;
declare function _null$1<T extends schemas.$ZodNull>(Class: util.SchemaClass<T>, params?: string | $ZodNullParams): T;
type $ZodAnyParams = TypeParams<schemas.$ZodAny>;
declare function _any<T extends schemas.$ZodAny>(Class: util.SchemaClass<T>): T;
type $ZodUnknownParams = TypeParams<schemas.$ZodUnknown>;
declare function _unknown<T extends schemas.$ZodUnknown>(Class: util.SchemaClass<T>): T;
type $ZodNeverParams = TypeParams<schemas.$ZodNever>;
declare function _never<T extends schemas.$ZodNever>(Class: util.SchemaClass<T>, params?: string | $ZodNeverParams): T;
type $ZodVoidParams = TypeParams<schemas.$ZodVoid>;
declare function _void<T extends schemas.$ZodVoid>(Class: util.SchemaClass<T>, params?: string | $ZodVoidParams): T;
type $ZodDateParams = TypeParams<schemas.$ZodDate, "coerce">;
declare function _date<T extends schemas.$ZodDate>(Class: util.SchemaClass<T>, params?: string | $ZodDateParams): T;
declare function _coercedDate<T extends schemas.$ZodDate>(Class: util.SchemaClass<T>, params?: string | $ZodDateParams): T;
type $ZodNaNParams = TypeParams<schemas.$ZodNaN>;
declare function _nan<T extends schemas.$ZodNaN>(Class: util.SchemaClass<T>, params?: string | $ZodNaNParams): T;
type $ZodCheckLessThanParams = CheckParams<$ZodCheckLessThan, "inclusive" | "value" | "when">;
declare function _lt(value: util.Numeric, params?: string | $ZodCheckLessThanParams): $ZodCheckLessThan<util.Numeric>;
declare function _lte(value: util.Numeric, params?: string | $ZodCheckLessThanParams): $ZodCheckLessThan<util.Numeric>;
type $ZodCheckGreaterThanParams = CheckParams<$ZodCheckGreaterThan, "inclusive" | "value" | "when">;
declare function _gt(value: util.Numeric, params?: string | $ZodCheckGreaterThanParams): $ZodCheckGreaterThan;
declare function _gte(value: util.Numeric, params?: string | $ZodCheckGreaterThanParams): $ZodCheckGreaterThan;
declare function _positive(params?: string | $ZodCheckGreaterThanParams): $ZodCheckGreaterThan;
declare function _negative(params?: string | $ZodCheckLessThanParams): $ZodCheckLessThan;
declare function _nonpositive(params?: string | $ZodCheckLessThanParams): $ZodCheckLessThan;
declare function _nonnegative(params?: string | $ZodCheckGreaterThanParams): $ZodCheckGreaterThan;
type $ZodCheckMultipleOfParams = CheckParams<$ZodCheckMultipleOf, "value" | "when">;
declare function _multipleOf(value: number | bigint, params?: string | $ZodCheckMultipleOfParams): $ZodCheckMultipleOf;
type $ZodCheckMaxSizeParams = CheckParams<$ZodCheckMaxSize, "maximum" | "when">;
declare function _maxSize(maximum: number, params?: string | $ZodCheckMaxSizeParams): $ZodCheckMaxSize<util.HasSize>;
type $ZodCheckMinSizeParams = CheckParams<$ZodCheckMinSize, "minimum" | "when">;
declare function _minSize(minimum: number, params?: string | $ZodCheckMinSizeParams): $ZodCheckMinSize<util.HasSize>;
type $ZodCheckSizeEqualsParams = CheckParams<$ZodCheckSizeEquals, "size" | "when">;
declare function _size(size: number, params?: string | $ZodCheckSizeEqualsParams): $ZodCheckSizeEquals<util.HasSize>;
type $ZodCheckMaxLengthParams = CheckParams<$ZodCheckMaxLength, "maximum" | "when">;
declare function _maxLength(maximum: number, params?: string | $ZodCheckMaxLengthParams): $ZodCheckMaxLength<util.HasLength>;
type $ZodCheckMinLengthParams = CheckParams<$ZodCheckMinLength, "minimum" | "when">;
declare function _minLength(minimum: number, params?: string | $ZodCheckMinLengthParams): $ZodCheckMinLength<util.HasLength>;
type $ZodCheckLengthEqualsParams = CheckParams<$ZodCheckLengthEquals, "length" | "when">;
declare function _length(length: number, params?: string | $ZodCheckLengthEqualsParams): $ZodCheckLengthEquals<util.HasLength>;
type $ZodCheckRegexParams = CheckParams<$ZodCheckRegex, "format" | "pattern" | "when">;
declare function _regex(pattern: RegExp, params?: string | $ZodCheckRegexParams): $ZodCheckRegex;
type $ZodCheckLowerCaseParams = CheckParams<$ZodCheckLowerCase, "format" | "when">;
declare function _lowercase(params?: string | $ZodCheckLowerCaseParams): $ZodCheckLowerCase;
type $ZodCheckUpperCaseParams = CheckParams<$ZodCheckUpperCase, "format" | "when">;
declare function _uppercase(params?: string | $ZodCheckUpperCaseParams): $ZodCheckUpperCase;
type $ZodCheckIncludesParams = CheckParams<$ZodCheckIncludes, "includes" | "format" | "when" | "pattern">;
declare function _includes(includes: string, params?: string | $ZodCheckIncludesParams): $ZodCheckIncludes;
type $ZodCheckStartsWithParams = CheckParams<$ZodCheckStartsWith, "prefix" | "format" | "when" | "pattern">;
declare function _startsWith(prefix: string, params?: string | $ZodCheckStartsWithParams): $ZodCheckStartsWith;
type $ZodCheckEndsWithParams = CheckParams<$ZodCheckEndsWith, "suffix" | "format" | "pattern" | "when">;
declare function _endsWith(suffix: string, params?: string | $ZodCheckEndsWithParams): $ZodCheckEndsWith;
type $ZodCheckPropertyParams = CheckParams<$ZodCheckProperty, "property" | "schema" | "when">;
declare function _property<K extends string, T extends schemas.$ZodType>(property: K, schema: T, params?: string | $ZodCheckPropertyParams): $ZodCheckProperty<{
	[k in K]: output<T>;
}>;
type $ZodCheckMimeTypeParams = CheckParams<$ZodCheckMimeType, "mime" | "when">;
declare function _mime(types: util.MimeTypes[], params?: string | $ZodCheckMimeTypeParams): $ZodCheckMimeType;
declare function _overwrite<T>(tx: (input: T) => T): $ZodCheckOverwrite<T>;
declare function _normalize(form?: "NFC" | "NFD" | "NFKC" | "NFKD" | (string & {})): $ZodCheckOverwrite<string>;
declare function _trim(): $ZodCheckOverwrite<string>;
declare function _toLowerCase(): $ZodCheckOverwrite<string>;
declare function _toUpperCase(): $ZodCheckOverwrite<string>;
type $ZodArrayParams = TypeParams<schemas.$ZodArray, "element">;
declare function _array<T extends schemas.$ZodType>(Class: util.SchemaClass<schemas.$ZodArray>, element: T, params?: string | $ZodArrayParams): schemas.$ZodArray<T>;
type $ZodObjectParams = TypeParams<schemas.$ZodObject, "shape" | "catchall">;
type $ZodUnionParams = TypeParams<schemas.$ZodUnion, "options">;
declare function _union<const T extends readonly schemas.$ZodObject[]>(Class: util.SchemaClass<schemas.$ZodUnion>, options: T, params?: string | $ZodUnionParams): schemas.$ZodUnion<T>;
interface $ZodTypeDiscriminableInternals extends schemas.$ZodTypeInternals {
	propValues: util.PropValues;
}
interface $ZodTypeDiscriminable extends schemas.$ZodType {
	_zod: $ZodTypeDiscriminableInternals;
}
type $ZodDiscriminatedUnionParams = TypeParams<schemas.$ZodDiscriminatedUnion, "options" | "discriminator">;
declare function _discriminatedUnion<Types extends [
	$ZodTypeDiscriminable,
	...$ZodTypeDiscriminable[]
], Disc extends string>(Class: util.SchemaClass<schemas.$ZodDiscriminatedUnion>, discriminator: Disc, options: Types, params?: string | $ZodDiscriminatedUnionParams): schemas.$ZodDiscriminatedUnion<Types, Disc>;
type $ZodIntersectionParams = TypeParams<schemas.$ZodIntersection, "left" | "right">;
declare function _intersection<T extends schemas.$ZodObject, U extends schemas.$ZodObject>(Class: util.SchemaClass<schemas.$ZodIntersection>, left: T, right: U): schemas.$ZodIntersection<T, U>;
type $ZodTupleParams = TypeParams<schemas.$ZodTuple, "items" | "rest">;
declare function _tuple<T extends readonly [
	schemas.$ZodType,
	...schemas.$ZodType[]
]>(Class: util.SchemaClass<schemas.$ZodTuple>, items: T, params?: string | $ZodTupleParams): schemas.$ZodTuple<T, null>;
declare function _tuple<T extends readonly [
	schemas.$ZodType,
	...schemas.$ZodType[]
], Rest extends schemas.$ZodType>(Class: util.SchemaClass<schemas.$ZodTuple>, items: T, rest: Rest, params?: string | $ZodTupleParams): schemas.$ZodTuple<T, Rest>;
type $ZodRecordParams = TypeParams<schemas.$ZodRecord, "keyType" | "valueType">;
declare function _record<Key extends schemas.$ZodRecordKey, Value extends schemas.$ZodObject>(Class: util.SchemaClass<schemas.$ZodRecord>, keyType: Key, valueType: Value, params?: string | $ZodRecordParams): schemas.$ZodRecord<Key, Value>;
type $ZodMapParams = TypeParams<schemas.$ZodMap, "keyType" | "valueType">;
declare function _map<Key extends schemas.$ZodObject, Value extends schemas.$ZodObject>(Class: util.SchemaClass<schemas.$ZodMap>, keyType: Key, valueType: Value, params?: string | $ZodMapParams): schemas.$ZodMap<Key, Value>;
type $ZodSetParams = TypeParams<schemas.$ZodSet, "valueType">;
declare function _set<Value extends schemas.$ZodObject>(Class: util.SchemaClass<schemas.$ZodSet>, valueType: Value, params?: string | $ZodSetParams): schemas.$ZodSet<Value>;
type $ZodEnumParams = TypeParams<schemas.$ZodEnum, "entries">;
declare function _enum<const T extends string[]>(Class: util.SchemaClass<schemas.$ZodEnum>, values: T, params?: string | $ZodEnumParams): schemas.$ZodEnum<util.ToEnum<T[number]>>;
declare function _enum<T extends util.EnumLike>(Class: util.SchemaClass<schemas.$ZodEnum>, entries: T, params?: string | $ZodEnumParams): schemas.$ZodEnum<T>;
declare function _nativeEnum<T extends util.EnumLike>(Class: util.SchemaClass<schemas.$ZodEnum>, entries: T, params?: string | $ZodEnumParams): schemas.$ZodEnum<T>;
type $ZodLiteralParams = TypeParams<schemas.$ZodLiteral, "values">;
declare function _literal<const T extends Array<util.Literal>>(Class: util.SchemaClass<schemas.$ZodLiteral>, value: T, params?: string | $ZodLiteralParams): schemas.$ZodLiteral<T[number]>;
declare function _literal<const T extends util.Literal>(Class: util.SchemaClass<schemas.$ZodLiteral>, value: T, params?: string | $ZodLiteralParams): schemas.$ZodLiteral<T>;
type $ZodFileParams = TypeParams<schemas.$ZodFile>;
declare function _file(Class: util.SchemaClass<schemas.$ZodFile>, params?: string | $ZodFileParams): schemas.$ZodFile;
type $ZodTransformParams = TypeParams<schemas.$ZodTransform, "transform">;
declare function _transform<I = unknown, O = I>(Class: util.SchemaClass<schemas.$ZodTransform>, fn: (input: I, ctx?: schemas.ParsePayload) => O): schemas.$ZodTransform<Awaited<O>, I>;
type $ZodOptionalParams = TypeParams<schemas.$ZodOptional, "innerType">;
declare function _optional<T extends schemas.$ZodObject>(Class: util.SchemaClass<schemas.$ZodOptional>, innerType: T): schemas.$ZodOptional<T>;
type $ZodNullableParams = TypeParams<schemas.$ZodNullable, "innerType">;
declare function _nullable<T extends schemas.$ZodObject>(Class: util.SchemaClass<schemas.$ZodNullable>, innerType: T): schemas.$ZodNullable<T>;
type $ZodDefaultParams = TypeParams<schemas.$ZodDefault, "innerType" | "defaultValue">;
declare function _default$47<T extends schemas.$ZodObject>(Class: util.SchemaClass<schemas.$ZodDefault>, innerType: T, defaultValue: util.NoUndefined<output<T>> | (() => util.NoUndefined<output<T>>)): schemas.$ZodDefault<T>;
type $ZodNonOptionalParams = TypeParams<schemas.$ZodNonOptional, "innerType">;
declare function _nonoptional<T extends schemas.$ZodObject>(Class: util.SchemaClass<schemas.$ZodNonOptional>, innerType: T, params?: string | $ZodNonOptionalParams): schemas.$ZodNonOptional<T>;
type $ZodSuccessParams = TypeParams<schemas.$ZodSuccess, "innerType">;
declare function _success<T extends schemas.$ZodObject>(Class: util.SchemaClass<schemas.$ZodSuccess>, innerType: T): schemas.$ZodSuccess<T>;
type $ZodCatchParams = TypeParams<schemas.$ZodCatch, "innerType" | "catchValue">;
declare function _catch<T extends schemas.$ZodObject>(Class: util.SchemaClass<schemas.$ZodCatch>, innerType: T, catchValue: output<T> | ((ctx: schemas.$ZodCatchCtx) => output<T>)): schemas.$ZodCatch<T>;
type $ZodPipeParams = TypeParams<schemas.$ZodPipe, "in" | "out">;
declare function _pipe<const A extends schemas.$ZodType, B extends schemas.$ZodType<unknown, output<A>> = schemas.$ZodType<unknown, output<A>>>(Class: util.SchemaClass<schemas.$ZodPipe>, in_: A, out: B | schemas.$ZodType<unknown, output<A>>): schemas.$ZodPipe<A, B>;
type $ZodReadonlyParams = TypeParams<schemas.$ZodReadonly, "innerType">;
declare function _readonly<T extends schemas.$ZodObject>(Class: util.SchemaClass<schemas.$ZodReadonly>, innerType: T): schemas.$ZodReadonly<T>;
type $ZodTemplateLiteralParams = TypeParams<schemas.$ZodTemplateLiteral, "parts">;
declare function _templateLiteral<const Parts extends schemas.$ZodTemplateLiteralPart[]>(Class: util.SchemaClass<schemas.$ZodTemplateLiteral>, parts: Parts, params?: string | $ZodTemplateLiteralParams): schemas.$ZodTemplateLiteral<schemas.$PartsToTemplateLiteral<Parts>>;
type $ZodLazyParams = TypeParams<schemas.$ZodLazy, "getter">;
declare function _lazy<T extends schemas.$ZodType>(Class: util.SchemaClass<schemas.$ZodLazy>, getter: () => T): schemas.$ZodLazy<T>;
type $ZodPromiseParams = TypeParams<schemas.$ZodPromise, "innerType">;
declare function _promise<T extends schemas.$ZodObject>(Class: util.SchemaClass<schemas.$ZodPromise>, innerType: T): schemas.$ZodPromise<T>;
type $ZodCustomParams = CheckTypeParams<schemas.$ZodCustom, "fn">;
declare function _custom<O = unknown, I = O>(Class: util.SchemaClass<schemas.$ZodCustom>, fn: (data: O) => unknown, _params: string | $ZodCustomParams | undefined): schemas.$ZodCustom<O, I>;
declare function _refine<O = unknown, I = O>(Class: util.SchemaClass<schemas.$ZodCustom>, fn: (data: O) => unknown, _params: string | $ZodCustomParams | undefined): schemas.$ZodCustom<O, I>;
type $ZodSuperRefineIssue<T extends $ZodIssueBase = $ZodIssue> = T extends any ? RawIssue$1<T> : never;
type RawIssue$1<T extends $ZodIssueBase> = T extends any ? util.Flatten<util.MakePartial<T, "message" | "path"> & {
	/** The schema or check that originated this issue. */
	readonly inst?: schemas.$ZodType | $ZodCheck;
	/** If `true`, Zod will execute subsequent checks/refinements instead of immediately aborting */
	readonly continue?: boolean | undefined;
} & Record<string, unknown>> : never;
interface $RefinementCtx<T = unknown> extends schemas.ParsePayload<T> {
	addIssue(arg: string | $ZodSuperRefineIssue): void;
}
declare function _superRefine<T>(fn: (arg: T, payload: $RefinementCtx<T>) => void | Promise<void>): $ZodCheck<T>;
declare function _check<O = unknown>(fn: schemas.CheckFn<O>, params?: string | $ZodCustomParams): $ZodCheck<O>;
interface $ZodStringBoolParams extends TypeParams {
	truthy?: string[];
	falsy?: string[];
	/**
	 * Options: `"sensitive"`, `"insensitive"`
	 *
	 * @default `"insensitive"`
	 */
	case?: "sensitive" | "insensitive" | undefined;
}
declare function _stringbool(Classes: {
	Codec?: typeof schemas.$ZodCodec;
	Boolean?: typeof schemas.$ZodBoolean;
	String?: typeof schemas.$ZodString;
}, _params?: string | $ZodStringBoolParams): schemas.$ZodCodec<schemas.$ZodString, schemas.$ZodBoolean>;
declare function _stringFormat<Format extends string>(Class: typeof schemas.$ZodCustomStringFormat, format: Format, fnOrRegex: ((arg: string) => util.MaybeAsync<unknown>) | RegExp, _params?: string | $ZodStringFormatParams): schemas.$ZodCustomStringFormat<Format>;
type Schema = ObjectSchema | ArraySchema | StringSchema | NumberSchema | IntegerSchema | BooleanSchema | NullSchema;
type _JSONSchema = boolean | JSONSchema;
type JSONSchema = {
	[k: string]: unknown;
	$schema?: "https://json-schema.org/draft/2020-12/schema" | "http://json-schema.org/draft-07/schema#" | "http://json-schema.org/draft-04/schema#";
	$id?: string;
	$anchor?: string;
	$ref?: string;
	$dynamicRef?: string;
	$dynamicAnchor?: string;
	$vocabulary?: Record<string, boolean>;
	$comment?: string;
	$defs?: Record<string, JSONSchema>;
	type?: "object" | "array" | "string" | "number" | "boolean" | "null" | "integer";
	additionalItems?: _JSONSchema;
	unevaluatedItems?: _JSONSchema;
	prefixItems?: _JSONSchema[];
	items?: _JSONSchema | _JSONSchema[];
	contains?: _JSONSchema;
	additionalProperties?: _JSONSchema;
	unevaluatedProperties?: _JSONSchema;
	properties?: Record<string, _JSONSchema>;
	patternProperties?: Record<string, _JSONSchema>;
	dependentSchemas?: Record<string, _JSONSchema>;
	propertyNames?: _JSONSchema;
	if?: _JSONSchema;
	then?: _JSONSchema;
	else?: _JSONSchema;
	allOf?: JSONSchema[];
	anyOf?: JSONSchema[];
	oneOf?: JSONSchema[];
	not?: _JSONSchema;
	multipleOf?: number;
	maximum?: number;
	exclusiveMaximum?: number | boolean;
	minimum?: number;
	exclusiveMinimum?: number | boolean;
	maxLength?: number;
	minLength?: number;
	pattern?: string;
	maxItems?: number;
	minItems?: number;
	uniqueItems?: boolean;
	maxContains?: number;
	minContains?: number;
	maxProperties?: number;
	minProperties?: number;
	required?: string[];
	dependentRequired?: Record<string, string[]>;
	enum?: Array<string | number | boolean | null>;
	const?: string | number | boolean | null;
	id?: string;
	title?: string;
	description?: string;
	default?: unknown;
	deprecated?: boolean;
	readOnly?: boolean;
	writeOnly?: boolean;
	nullable?: boolean;
	examples?: unknown[];
	format?: string;
	contentMediaType?: string;
	contentEncoding?: string;
	contentSchema?: JSONSchema;
	_prefault?: unknown;
};
type BaseSchema = JSONSchema;
interface ObjectSchema extends JSONSchema {
	type: "object";
}
interface ArraySchema extends JSONSchema {
	type: "array";
}
interface StringSchema extends JSONSchema {
	type: "string";
}
interface NumberSchema extends JSONSchema {
	type: "number";
}
interface IntegerSchema extends JSONSchema {
	type: "integer";
}
interface BooleanSchema extends JSONSchema {
	type: "boolean";
}
interface NullSchema extends JSONSchema {
	type: "null";
}
interface JSONSchemaGeneratorParams {
	/** A registry used to look up metadata for each schema. Any schema with an `id` property will be extracted as a $def.
	 *  @default globalRegistry */
	metadata?: $ZodRegistry<Record<string, any>>;
	/** The JSON Schema version to target.
	 * - `"draft-2020-12"` — Default. JSON Schema Draft 2020-12
	 * - `"draft-7"` — JSON Schema Draft 7
	 * - `"draft-4"` — JSON Schema Draft 4
	 * - `"openapi-3.0"` — OpenAPI 3.0 Schema Object */
	target?: "draft-4" | "draft-7" | "draft-2020-12" | "openapi-3.0";
	/** How to handle unrepresentable types.
	 * - `"throw"` — Default. Unrepresentable types throw an error
	 * - `"any"` — Unrepresentable types become `{}` */
	unrepresentable?: "throw" | "any";
	/** Arbitrary custom logic that can be used to modify the generated JSON Schema. */
	override?: (ctx: {
		zodSchema: schemas.$ZodTypes;
		jsonSchema: JSONSchema$1.BaseSchema;
		path: (string | number)[];
	}) => void;
	/** Whether to extract the `"input"` or `"output"` type. Relevant to transforms, Error converting schema to JSONz, defaults, coerced primitives, etc.
	 * - `"output"` — Default. Convert the output schema.
	 * - `"input"` — Convert the input schema. */
	io?: "input" | "output";
}
interface ProcessParams {
	schemaPath: schemas.$ZodType[];
	path: (string | number)[];
}
interface EmitParams {
	/** How to handle cycles.
	 * - `"ref"` — Default. Cycles will be broken using $defs
	 * - `"throw"` — Cycles will throw an error if encountered */
	cycles?: "ref" | "throw";
	reused?: "ref" | "inline";
	external?: {
		/**  */
		registry: $ZodRegistry<{
			id?: string | undefined;
		}>;
		uri?: ((id: string) => string) | undefined;
		defs: Record<string, JSONSchema$1.BaseSchema>;
	} | undefined;
}
interface Seen {
	/** JSON Schema result for this Zod schema */
	schema: JSONSchema$1.BaseSchema;
	/** A cached version of the schema that doesn't get overwritten during ref resolution */
	def?: JSONSchema$1.BaseSchema;
	defId?: string | undefined;
	/** Number of times this schema was encountered during traversal */
	count: number;
	/** Cycle path */
	cycle?: (string | number)[] | undefined;
	isParent?: boolean | undefined;
	ref?: schemas.$ZodType | undefined | null;
	/** JSON Schema property path for this schema */
	path?: (string | number)[] | undefined;
}
declare class JSONSchemaGenerator {
	metadataRegistry: $ZodRegistry<Record<string, any>>;
	target: "draft-4" | "draft-7" | "draft-2020-12" | "openapi-3.0";
	unrepresentable: "throw" | "any";
	override: (ctx: {
		zodSchema: schemas.$ZodTypes;
		jsonSchema: JSONSchema$1.BaseSchema;
		path: (string | number)[];
	}) => void;
	io: "input" | "output";
	counter: number;
	seen: Map<schemas.$ZodType, Seen>;
	constructor(params?: JSONSchemaGeneratorParams);
	process(schema: schemas.$ZodType, _params?: ProcessParams): JSONSchema$1.BaseSchema;
	emit(schema: schemas.$ZodType, _params?: EmitParams): JSONSchema$1.BaseSchema;
}
interface ToJSONSchemaParams extends Omit<JSONSchemaGeneratorParams & EmitParams, "external"> {
}
interface RegistryToJSONSchemaParams extends Omit<JSONSchemaGeneratorParams & EmitParams, "external"> {
	uri?: (id: string) => string;
}
declare function toJSONSchema(schema: schemas.$ZodType, _params?: ToJSONSchemaParams): JSONSchema$1.BaseSchema;
declare function toJSONSchema(registry: $ZodRegistry<{
	id?: string | undefined;
}>, _params?: RegistryToJSONSchemaParams): {
	schemas: Record<string, JSONSchema$1.BaseSchema>;
};
type ZodIssue = core.$ZodIssue;
interface ZodError<T = unknown> extends $ZodError<T> {
	/** @deprecated Use the `z.treeifyError(err)` function instead. */
	format(): core.$ZodFormattedError<T>;
	format<U>(mapper: (issue: core.$ZodIssue) => U): core.$ZodFormattedError<T, U>;
	/** @deprecated Use the `z.treeifyError(err)` function instead. */
	flatten(): core.$ZodFlattenedError<T>;
	flatten<U>(mapper: (issue: core.$ZodIssue) => U): core.$ZodFlattenedError<T, U>;
	/** @deprecated Push directly to `.issues` instead. */
	addIssue(issue: core.$ZodIssue): void;
	/** @deprecated Push directly to `.issues` instead. */
	addIssues(issues: core.$ZodIssue[]): void;
	/** @deprecated Check `err.issues.length === 0` instead. */
	isEmpty: boolean;
}
declare const ZodError: core.$constructor<ZodError>;
declare const ZodRealError: core.$constructor<ZodError>;
type IssueData = core.$ZodRawIssue;
type ZodSafeParseResult<T> = ZodSafeParseSuccess<T> | ZodSafeParseError<T>;
type ZodSafeParseSuccess<T> = {
	success: true;
	data: T;
	error?: never;
};
type ZodSafeParseError<T> = {
	success: false;
	data?: never;
	error: ZodError<T>;
};
declare const parse$1: <T extends core.$ZodType>(schema: T, value: unknown, _ctx?: core.ParseContext<core.$ZodIssue>, _params?: {
	callee?: core.util.AnyFunc;
	Err?: core.$ZodErrorClass;
}) => core.output<T>;
declare const parseAsync$1: <T extends core.$ZodType>(schema: T, value: unknown, _ctx?: core.ParseContext<core.$ZodIssue>, _params?: {
	callee?: core.util.AnyFunc;
	Err?: core.$ZodErrorClass;
}) => Promise<core.output<T>>;
declare const safeParse$1: <T extends core.$ZodType>(schema: T, value: unknown, _ctx?: core.ParseContext<core.$ZodIssue>) => ZodSafeParseResult<core.output<T>>;
declare const safeParseAsync$1: <T extends core.$ZodType>(schema: T, value: unknown, _ctx?: core.ParseContext<core.$ZodIssue>) => Promise<ZodSafeParseResult<core.output<T>>>;
declare const encode$1: <T extends core.$ZodType>(schema: T, value: core.output<T>, _ctx?: core.ParseContext<core.$ZodIssue>) => core.input<T>;
declare const decode$1: <T extends core.$ZodType>(schema: T, value: core.input<T>, _ctx?: core.ParseContext<core.$ZodIssue>) => core.output<T>;
declare const encodeAsync$1: <T extends core.$ZodType>(schema: T, value: core.output<T>, _ctx?: core.ParseContext<core.$ZodIssue>) => Promise<core.input<T>>;
declare const decodeAsync$1: <T extends core.$ZodType>(schema: T, value: core.input<T>, _ctx?: core.ParseContext<core.$ZodIssue>) => Promise<core.output<T>>;
declare const safeEncode$1: <T extends core.$ZodType>(schema: T, value: core.output<T>, _ctx?: core.ParseContext<core.$ZodIssue>) => ZodSafeParseResult<core.input<T>>;
declare const safeDecode$1: <T extends core.$ZodType>(schema: T, value: core.input<T>, _ctx?: core.ParseContext<core.$ZodIssue>) => ZodSafeParseResult<core.output<T>>;
declare const safeEncodeAsync$1: <T extends core.$ZodType>(schema: T, value: core.output<T>, _ctx?: core.ParseContext<core.$ZodIssue>) => Promise<ZodSafeParseResult<core.input<T>>>;
declare const safeDecodeAsync$1: <T extends core.$ZodType>(schema: T, value: core.input<T>, _ctx?: core.ParseContext<core.$ZodIssue>) => Promise<ZodSafeParseResult<core.output<T>>>;
interface ZodType<out Output = unknown, out Input = unknown, out Internals extends core.$ZodTypeInternals<Output, Input> = core.$ZodTypeInternals<Output, Input>> extends core.$ZodType<Output, Input, Internals> {
	def: Internals["def"];
	type: Internals["def"]["type"];
	/** @deprecated Use `.def` instead. */
	_def: Internals["def"];
	/** @deprecated Use `z.output<typeof schema>` instead. */
	_output: Internals["output"];
	/** @deprecated Use `z.input<typeof schema>` instead. */
	_input: Internals["input"];
	check(...checks: (core.CheckFn<core.output<this>> | core.$ZodCheck<core.output<this>>)[]): this;
	clone(def?: Internals["def"], params?: {
		parent: boolean;
	}): this;
	register<R extends core.$ZodRegistry>(registry: R, ...meta: this extends R["_schema"] ? undefined extends R["_meta"] ? [
		core.$replace<R["_meta"], this>?
	] : [
		core.$replace<R["_meta"], this>
	] : [
		"Incompatible schema"
	]): this;
	brand<T extends PropertyKey = PropertyKey>(value?: T): PropertyKey extends T ? this : core.$ZodBranded<this, T>;
	parse(data: unknown, params?: core.ParseContext<core.$ZodIssue>): core.output<this>;
	safeParse(data: unknown, params?: core.ParseContext<core.$ZodIssue>): ZodSafeParseResult<core.output<this>>;
	parseAsync(data: unknown, params?: core.ParseContext<core.$ZodIssue>): Promise<core.output<this>>;
	safeParseAsync(data: unknown, params?: core.ParseContext<core.$ZodIssue>): Promise<ZodSafeParseResult<core.output<this>>>;
	spa: (data: unknown, params?: core.ParseContext<core.$ZodIssue>) => Promise<ZodSafeParseResult<core.output<this>>>;
	encode(data: core.output<this>, params?: core.ParseContext<core.$ZodIssue>): core.input<this>;
	decode(data: core.input<this>, params?: core.ParseContext<core.$ZodIssue>): core.output<this>;
	encodeAsync(data: core.output<this>, params?: core.ParseContext<core.$ZodIssue>): Promise<core.input<this>>;
	decodeAsync(data: core.input<this>, params?: core.ParseContext<core.$ZodIssue>): Promise<core.output<this>>;
	safeEncode(data: core.output<this>, params?: core.ParseContext<core.$ZodIssue>): ZodSafeParseResult<core.input<this>>;
	safeDecode(data: core.input<this>, params?: core.ParseContext<core.$ZodIssue>): ZodSafeParseResult<core.output<this>>;
	safeEncodeAsync(data: core.output<this>, params?: core.ParseContext<core.$ZodIssue>): Promise<ZodSafeParseResult<core.input<this>>>;
	safeDecodeAsync(data: core.input<this>, params?: core.ParseContext<core.$ZodIssue>): Promise<ZodSafeParseResult<core.output<this>>>;
	refine(check: (arg: core.output<this>) => unknown | Promise<unknown>, params?: string | core.$ZodCustomParams): this;
	superRefine(refinement: (arg: core.output<this>, ctx: core.$RefinementCtx<core.output<this>>) => void | Promise<void>): this;
	overwrite(fn: (x: core.output<this>) => core.output<this>): this;
	optional(): ZodOptional<this>;
	nonoptional(params?: string | core.$ZodNonOptionalParams): ZodNonOptional<this>;
	nullable(): ZodNullable<this>;
	nullish(): ZodOptional<ZodNullable<this>>;
	default(def: util.NoUndefined<core.output<this>>): ZodDefault<this>;
	default(def: () => util.NoUndefined<core.output<this>>): ZodDefault<this>;
	prefault(def: () => core.input<this>): ZodPrefault<this>;
	prefault(def: core.input<this>): ZodPrefault<this>;
	array(): ZodArray<this>;
	or<T extends core.SomeType>(option: T): ZodUnion<[
		this,
		T
	]>;
	and<T extends core.SomeType>(incoming: T): ZodIntersection<this, T>;
	transform<NewOut>(transform: (arg: core.output<this>, ctx: core.$RefinementCtx<core.output<this>>) => NewOut | Promise<NewOut>): ZodPipe<this, ZodTransform<Awaited<NewOut>, core.output<this>>>;
	catch(def: core.output<this>): ZodCatch<this>;
	catch(def: (ctx: core.$ZodCatchCtx) => core.output<this>): ZodCatch<this>;
	pipe<T extends core.$ZodType<any, core.output<this>>>(target: T | core.$ZodType<any, core.output<this>>): ZodPipe<this, T>;
	readonly(): ZodReadonly<this>;
	/** Returns a new instance that has been registered in `z.globalRegistry` with the specified description */
	describe(description: string): this;
	description?: string;
	/** Returns the metadata associated with this instance in `z.globalRegistry` */
	meta(): core.$replace<core.GlobalMeta, this> | undefined;
	/** Returns a new instance that has been registered in `z.globalRegistry` with the specified metadata */
	meta(data: core.$replace<core.GlobalMeta, this>): this;
	/** @deprecated Try safe-parsing `undefined` (this is what `isOptional` does internally):
	 *
	 * ```ts
	 * const schema = z.string().optional();
	 * const isOptional = schema.safeParse(undefined).success; // true
	 * ```
	 */
	isOptional(): boolean;
	/**
	 * @deprecated Try safe-parsing `null` (this is what `isNullable` does internally):
	 *
	 * ```ts
	 * const schema = z.string().nullable();
	 * const isNullable = schema.safeParse(null).success; // true
	 * ```
	 */
	isNullable(): boolean;
}
interface _ZodType<out Internals extends core.$ZodTypeInternals = core.$ZodTypeInternals> extends ZodType<any, any, Internals> {
}
declare const ZodType: core.$constructor<ZodType>;
interface _ZodString<T extends core.$ZodStringInternals<unknown> = core.$ZodStringInternals<unknown>> extends _ZodType<T> {
	format: string | null;
	minLength: number | null;
	maxLength: number | null;
	regex(regex: RegExp, params?: string | core.$ZodCheckRegexParams): this;
	includes(value: string, params?: core.$ZodCheckIncludesParams): this;
	startsWith(value: string, params?: string | core.$ZodCheckStartsWithParams): this;
	endsWith(value: string, params?: string | core.$ZodCheckEndsWithParams): this;
	min(minLength: number, params?: string | core.$ZodCheckMinLengthParams): this;
	max(maxLength: number, params?: string | core.$ZodCheckMaxLengthParams): this;
	length(len: number, params?: string | core.$ZodCheckLengthEqualsParams): this;
	nonempty(params?: string | core.$ZodCheckMinLengthParams): this;
	lowercase(params?: string | core.$ZodCheckLowerCaseParams): this;
	uppercase(params?: string | core.$ZodCheckUpperCaseParams): this;
	trim(): this;
	normalize(form?: "NFC" | "NFD" | "NFKC" | "NFKD" | (string & {})): this;
	toLowerCase(): this;
	toUpperCase(): this;
}
declare const _ZodString: core.$constructor<_ZodString>;
interface ZodString extends _ZodString<core.$ZodStringInternals<string>> {
	/** @deprecated Use `z.email()` instead. */
	email(params?: string | core.$ZodCheckEmailParams): this;
	/** @deprecated Use `z.url()` instead. */
	url(params?: string | core.$ZodCheckURLParams): this;
	/** @deprecated Use `z.jwt()` instead. */
	jwt(params?: string | core.$ZodCheckJWTParams): this;
	/** @deprecated Use `z.emoji()` instead. */
	emoji(params?: string | core.$ZodCheckEmojiParams): this;
	/** @deprecated Use `z.guid()` instead. */
	guid(params?: string | core.$ZodCheckGUIDParams): this;
	/** @deprecated Use `z.uuid()` instead. */
	uuid(params?: string | core.$ZodCheckUUIDParams): this;
	/** @deprecated Use `z.uuid()` instead. */
	uuidv4(params?: string | core.$ZodCheckUUIDParams): this;
	/** @deprecated Use `z.uuid()` instead. */
	uuidv6(params?: string | core.$ZodCheckUUIDParams): this;
	/** @deprecated Use `z.uuid()` instead. */
	uuidv7(params?: string | core.$ZodCheckUUIDParams): this;
	/** @deprecated Use `z.nanoid()` instead. */
	nanoid(params?: string | core.$ZodCheckNanoIDParams): this;
	/** @deprecated Use `z.guid()` instead. */
	guid(params?: string | core.$ZodCheckGUIDParams): this;
	/** @deprecated Use `z.cuid()` instead. */
	cuid(params?: string | core.$ZodCheckCUIDParams): this;
	/** @deprecated Use `z.cuid2()` instead. */
	cuid2(params?: string | core.$ZodCheckCUID2Params): this;
	/** @deprecated Use `z.ulid()` instead. */
	ulid(params?: string | core.$ZodCheckULIDParams): this;
	/** @deprecated Use `z.base64()` instead. */
	base64(params?: string | core.$ZodCheckBase64Params): this;
	/** @deprecated Use `z.base64url()` instead. */
	base64url(params?: string | core.$ZodCheckBase64URLParams): this;
	/** @deprecated Use `z.xid()` instead. */
	xid(params?: string | core.$ZodCheckXIDParams): this;
	/** @deprecated Use `z.ksuid()` instead. */
	ksuid(params?: string | core.$ZodCheckKSUIDParams): this;
	/** @deprecated Use `z.ipv4()` instead. */
	ipv4(params?: string | core.$ZodCheckIPv4Params): this;
	/** @deprecated Use `z.ipv6()` instead. */
	ipv6(params?: string | core.$ZodCheckIPv6Params): this;
	/** @deprecated Use `z.cidrv4()` instead. */
	cidrv4(params?: string | core.$ZodCheckCIDRv4Params): this;
	/** @deprecated Use `z.cidrv6()` instead. */
	cidrv6(params?: string | core.$ZodCheckCIDRv6Params): this;
	/** @deprecated Use `z.e164()` instead. */
	e164(params?: string | core.$ZodCheckE164Params): this;
	/** @deprecated Use `z.iso.datetime()` instead. */
	datetime(params?: string | core.$ZodCheckISODateTimeParams): this;
	/** @deprecated Use `z.iso.date()` instead. */
	date(params?: string | core.$ZodCheckISODateParams): this;
	/** @deprecated Use `z.iso.time()` instead. */
	time(params?: string | core.$ZodCheckISOTimeParams): this;
	/** @deprecated Use `z.iso.duration()` instead. */
	duration(params?: string | core.$ZodCheckISODurationParams): this;
}
declare const ZodString: core.$constructor<ZodString>;
declare function string$1(params?: string | core.$ZodStringParams): ZodString;
declare function string$1<T extends string>(params?: string | core.$ZodStringParams): core.$ZodType<T, T>;
interface ZodStringFormat<Format extends string = string> extends _ZodString<core.$ZodStringFormatInternals<Format>> {
}
declare const ZodStringFormat: core.$constructor<ZodStringFormat>;
interface ZodEmail extends ZodStringFormat<"email"> {
	_zod: core.$ZodEmailInternals;
}
declare const ZodEmail: core.$constructor<ZodEmail>;
declare function email$1(params?: string | core.$ZodEmailParams): ZodEmail;
interface ZodGUID extends ZodStringFormat<"guid"> {
	_zod: core.$ZodGUIDInternals;
}
declare const ZodGUID: core.$constructor<ZodGUID>;
declare function guid$1(params?: string | core.$ZodGUIDParams): ZodGUID;
interface ZodUUID extends ZodStringFormat<"uuid"> {
	_zod: core.$ZodUUIDInternals;
}
declare const ZodUUID: core.$constructor<ZodUUID>;
declare function uuid$1(params?: string | core.$ZodUUIDParams): ZodUUID;
declare function uuidv4(params?: string | core.$ZodUUIDv4Params): ZodUUID;
declare function uuidv6(params?: string | core.$ZodUUIDv6Params): ZodUUID;
declare function uuidv7(params?: string | core.$ZodUUIDv7Params): ZodUUID;
interface ZodURL extends ZodStringFormat<"url"> {
	_zod: core.$ZodURLInternals;
}
declare const ZodURL: core.$constructor<ZodURL>;
declare function url(params?: string | core.$ZodURLParams): ZodURL;
declare function httpUrl(params?: string | Omit<core.$ZodURLParams, "protocol" | "hostname">): ZodURL;
interface ZodEmoji extends ZodStringFormat<"emoji"> {
	_zod: core.$ZodEmojiInternals;
}
declare const ZodEmoji: core.$constructor<ZodEmoji>;
declare function emoji$1(params?: string | core.$ZodEmojiParams): ZodEmoji;
interface ZodNanoID extends ZodStringFormat<"nanoid"> {
	_zod: core.$ZodNanoIDInternals;
}
declare const ZodNanoID: core.$constructor<ZodNanoID>;
declare function nanoid$1(params?: string | core.$ZodNanoIDParams): ZodNanoID;
interface ZodCUID extends ZodStringFormat<"cuid"> {
	_zod: core.$ZodCUIDInternals;
}
declare const ZodCUID: core.$constructor<ZodCUID>;
declare function cuid$1(params?: string | core.$ZodCUIDParams): ZodCUID;
interface ZodCUID2 extends ZodStringFormat<"cuid2"> {
	_zod: core.$ZodCUID2Internals;
}
declare const ZodCUID2: core.$constructor<ZodCUID2>;
declare function cuid2$1(params?: string | core.$ZodCUID2Params): ZodCUID2;
interface ZodULID extends ZodStringFormat<"ulid"> {
	_zod: core.$ZodULIDInternals;
}
declare const ZodULID: core.$constructor<ZodULID>;
declare function ulid$1(params?: string | core.$ZodULIDParams): ZodULID;
interface ZodXID extends ZodStringFormat<"xid"> {
	_zod: core.$ZodXIDInternals;
}
declare const ZodXID: core.$constructor<ZodXID>;
declare function xid$1(params?: string | core.$ZodXIDParams): ZodXID;
interface ZodKSUID extends ZodStringFormat<"ksuid"> {
	_zod: core.$ZodKSUIDInternals;
}
declare const ZodKSUID: core.$constructor<ZodKSUID>;
declare function ksuid$1(params?: string | core.$ZodKSUIDParams): ZodKSUID;
interface ZodIPv4 extends ZodStringFormat<"ipv4"> {
	_zod: core.$ZodIPv4Internals;
}
declare const ZodIPv4: core.$constructor<ZodIPv4>;
declare function ipv4$1(params?: string | core.$ZodIPv4Params): ZodIPv4;
interface ZodIPv6 extends ZodStringFormat<"ipv6"> {
	_zod: core.$ZodIPv6Internals;
}
declare const ZodIPv6: core.$constructor<ZodIPv6>;
declare function ipv6$1(params?: string | core.$ZodIPv6Params): ZodIPv6;
interface ZodCIDRv4 extends ZodStringFormat<"cidrv4"> {
	_zod: core.$ZodCIDRv4Internals;
}
declare const ZodCIDRv4: core.$constructor<ZodCIDRv4>;
declare function cidrv4$1(params?: string | core.$ZodCIDRv4Params): ZodCIDRv4;
interface ZodCIDRv6 extends ZodStringFormat<"cidrv6"> {
	_zod: core.$ZodCIDRv6Internals;
}
declare const ZodCIDRv6: core.$constructor<ZodCIDRv6>;
declare function cidrv6$1(params?: string | core.$ZodCIDRv6Params): ZodCIDRv6;
interface ZodBase64 extends ZodStringFormat<"base64"> {
	_zod: core.$ZodBase64Internals;
}
declare const ZodBase64: core.$constructor<ZodBase64>;
declare function base64$1(params?: string | core.$ZodBase64Params): ZodBase64;
interface ZodBase64URL extends ZodStringFormat<"base64url"> {
	_zod: core.$ZodBase64URLInternals;
}
declare const ZodBase64URL: core.$constructor<ZodBase64URL>;
declare function base64url$1(params?: string | core.$ZodBase64URLParams): ZodBase64URL;
interface ZodE164 extends ZodStringFormat<"e164"> {
	_zod: core.$ZodE164Internals;
}
declare const ZodE164: core.$constructor<ZodE164>;
declare function e164$1(params?: string | core.$ZodE164Params): ZodE164;
interface ZodJWT extends ZodStringFormat<"jwt"> {
	_zod: core.$ZodJWTInternals;
}
declare const ZodJWT: core.$constructor<ZodJWT>;
declare function jwt(params?: string | core.$ZodJWTParams): ZodJWT;
interface ZodCustomStringFormat<Format extends string = string> extends ZodStringFormat<Format>, core.$ZodCustomStringFormat<Format> {
	_zod: core.$ZodCustomStringFormatInternals<Format>;
}
declare const ZodCustomStringFormat: core.$constructor<ZodCustomStringFormat>;
declare function stringFormat<Format extends string>(format: Format, fnOrRegex: ((arg: string) => util.MaybeAsync<unknown>) | RegExp, _params?: string | core.$ZodStringFormatParams): ZodCustomStringFormat<Format>;
declare function hostname$1(_params?: string | core.$ZodStringFormatParams): ZodCustomStringFormat<"hostname">;
declare function hex$1(_params?: string | core.$ZodStringFormatParams): ZodCustomStringFormat<"hex">;
declare function hash<Alg extends util.HashAlgorithm, Enc extends util.HashEncoding = "hex">(alg: Alg, params?: {
	enc?: Enc;
} & core.$ZodStringFormatParams): ZodCustomStringFormat<`${Alg}_${Enc}`>;
interface _ZodNumber<Internals extends core.$ZodNumberInternals = core.$ZodNumberInternals> extends _ZodType<Internals> {
	gt(value: number, params?: string | core.$ZodCheckGreaterThanParams): this;
	/** Identical to .min() */
	gte(value: number, params?: string | core.$ZodCheckGreaterThanParams): this;
	min(value: number, params?: string | core.$ZodCheckGreaterThanParams): this;
	lt(value: number, params?: string | core.$ZodCheckLessThanParams): this;
	/** Identical to .max() */
	lte(value: number, params?: string | core.$ZodCheckLessThanParams): this;
	max(value: number, params?: string | core.$ZodCheckLessThanParams): this;
	/** Consider `z.int()` instead. This API is considered *legacy*; it will never be removed but a better alternative exists. */
	int(params?: string | core.$ZodCheckNumberFormatParams): this;
	/** @deprecated This is now identical to `.int()`. Only numbers in the safe integer range are accepted. */
	safe(params?: string | core.$ZodCheckNumberFormatParams): this;
	positive(params?: string | core.$ZodCheckGreaterThanParams): this;
	nonnegative(params?: string | core.$ZodCheckGreaterThanParams): this;
	negative(params?: string | core.$ZodCheckLessThanParams): this;
	nonpositive(params?: string | core.$ZodCheckLessThanParams): this;
	multipleOf(value: number, params?: string | core.$ZodCheckMultipleOfParams): this;
	/** @deprecated Use `.multipleOf()` instead. */
	step(value: number, params?: string | core.$ZodCheckMultipleOfParams): this;
	/** @deprecated In v4 and later, z.number() does not allow infinite values by default. This is a no-op. */
	finite(params?: unknown): this;
	minValue: number | null;
	maxValue: number | null;
	/** @deprecated Check the `format` property instead.  */
	isInt: boolean;
	/** @deprecated Number schemas no longer accept infinite values, so this always returns `true`. */
	isFinite: boolean;
	format: string | null;
}
interface ZodNumber extends _ZodNumber<core.$ZodNumberInternals<number>> {
}
declare const ZodNumber: core.$constructor<ZodNumber>;
declare function number$1(params?: string | core.$ZodNumberParams): ZodNumber;
interface ZodNumberFormat extends ZodNumber {
	_zod: core.$ZodNumberFormatInternals;
}
declare const ZodNumberFormat: core.$constructor<ZodNumberFormat>;
interface ZodInt extends ZodNumberFormat {
}
declare function int(params?: string | core.$ZodCheckNumberFormatParams): ZodInt;
interface ZodFloat32 extends ZodNumberFormat {
}
declare function float32(params?: string | core.$ZodCheckNumberFormatParams): ZodFloat32;
interface ZodFloat64 extends ZodNumberFormat {
}
declare function float64(params?: string | core.$ZodCheckNumberFormatParams): ZodFloat64;
interface ZodInt32 extends ZodNumberFormat {
}
declare function int32(params?: string | core.$ZodCheckNumberFormatParams): ZodInt32;
interface ZodUInt32 extends ZodNumberFormat {
}
declare function uint32(params?: string | core.$ZodCheckNumberFormatParams): ZodUInt32;
interface _ZodBoolean<T extends core.$ZodBooleanInternals = core.$ZodBooleanInternals> extends _ZodType<T> {
}
interface ZodBoolean extends _ZodBoolean<core.$ZodBooleanInternals<boolean>> {
}
declare const ZodBoolean: core.$constructor<ZodBoolean>;
declare function boolean$1(params?: string | core.$ZodBooleanParams): ZodBoolean;
interface _ZodBigInt<T extends core.$ZodBigIntInternals = core.$ZodBigIntInternals> extends _ZodType<T> {
	gte(value: bigint, params?: string | core.$ZodCheckGreaterThanParams): this;
	/** Alias of `.gte()` */
	min(value: bigint, params?: string | core.$ZodCheckGreaterThanParams): this;
	gt(value: bigint, params?: string | core.$ZodCheckGreaterThanParams): this;
	/** Alias of `.lte()` */
	lte(value: bigint, params?: string | core.$ZodCheckLessThanParams): this;
	max(value: bigint, params?: string | core.$ZodCheckLessThanParams): this;
	lt(value: bigint, params?: string | core.$ZodCheckLessThanParams): this;
	positive(params?: string | core.$ZodCheckGreaterThanParams): this;
	negative(params?: string | core.$ZodCheckLessThanParams): this;
	nonpositive(params?: string | core.$ZodCheckLessThanParams): this;
	nonnegative(params?: string | core.$ZodCheckGreaterThanParams): this;
	multipleOf(value: bigint, params?: string | core.$ZodCheckMultipleOfParams): this;
	minValue: bigint | null;
	maxValue: bigint | null;
	format: string | null;
}
interface ZodBigInt extends _ZodBigInt<core.$ZodBigIntInternals<bigint>> {
}
declare const ZodBigInt: core.$constructor<ZodBigInt>;
declare function bigint$1(params?: string | core.$ZodBigIntParams): ZodBigInt;
interface ZodBigIntFormat extends ZodBigInt {
	_zod: core.$ZodBigIntFormatInternals;
}
declare const ZodBigIntFormat: core.$constructor<ZodBigIntFormat>;
declare function int64(params?: string | core.$ZodBigIntFormatParams): ZodBigIntFormat;
declare function uint64(params?: string | core.$ZodBigIntFormatParams): ZodBigIntFormat;
interface ZodSymbol extends _ZodType<core.$ZodSymbolInternals> {
}
declare const ZodSymbol: core.$constructor<ZodSymbol>;
declare function symbol(params?: string | core.$ZodSymbolParams): ZodSymbol;
interface ZodUndefined extends _ZodType<core.$ZodUndefinedInternals> {
}
declare const ZodUndefined: core.$constructor<ZodUndefined>;
declare function _undefined$2(params?: string | core.$ZodUndefinedParams): ZodUndefined;
interface ZodNull extends _ZodType<core.$ZodNullInternals> {
}
declare const ZodNull: core.$constructor<ZodNull>;
declare function _null$2(params?: string | core.$ZodNullParams): ZodNull;
interface ZodAny extends _ZodType<core.$ZodAnyInternals> {
}
declare const ZodAny: core.$constructor<ZodAny>;
declare function any(): ZodAny;
interface ZodUnknown extends _ZodType<core.$ZodUnknownInternals> {
}
declare const ZodUnknown: core.$constructor<ZodUnknown>;
declare function unknown(): ZodUnknown;
interface ZodNever extends _ZodType<core.$ZodNeverInternals> {
}
declare const ZodNever: core.$constructor<ZodNever>;
declare function never(params?: string | core.$ZodNeverParams): ZodNever;
interface ZodVoid extends _ZodType<core.$ZodVoidInternals> {
}
declare const ZodVoid: core.$constructor<ZodVoid>;
declare function _void$1(params?: string | core.$ZodVoidParams): ZodVoid;
interface _ZodDate<T extends core.$ZodDateInternals = core.$ZodDateInternals> extends _ZodType<T> {
	min(value: number | Date, params?: string | core.$ZodCheckGreaterThanParams): this;
	max(value: number | Date, params?: string | core.$ZodCheckLessThanParams): this;
	/** @deprecated Not recommended. */
	minDate: Date | null;
	/** @deprecated Not recommended. */
	maxDate: Date | null;
}
interface ZodDate extends _ZodDate<core.$ZodDateInternals<Date>> {
}
declare const ZodDate: core.$constructor<ZodDate>;
declare function date$1(params?: string | core.$ZodDateParams): ZodDate;
interface ZodArray<T extends core.SomeType = core.$ZodType> extends _ZodType<core.$ZodArrayInternals<T>>, core.$ZodArray<T> {
	element: T;
	min(minLength: number, params?: string | core.$ZodCheckMinLengthParams): this;
	nonempty(params?: string | core.$ZodCheckMinLengthParams): this;
	max(maxLength: number, params?: string | core.$ZodCheckMaxLengthParams): this;
	length(len: number, params?: string | core.$ZodCheckLengthEqualsParams): this;
	unwrap(): T;
}
declare const ZodArray: core.$constructor<ZodArray>;
declare function array<T extends core.SomeType>(element: T, params?: string | core.$ZodArrayParams): ZodArray<T>;
declare function keyof<T extends ZodObject>(schema: T): ZodEnum<util.KeysEnum<T["_zod"]["output"]>>;
type SafeExtendShape<Base extends core.$ZodShape, Ext extends core.$ZodLooseShape> = {
	[K in keyof Ext]: K extends keyof Base ? core.output<Ext[K]> extends core.output<Base[K]> ? core.input<Ext[K]> extends core.input<Base[K]> ? Ext[K] : never : never : Ext[K];
};
interface ZodObject<
/** @ts-ignore Cast variance */
out Shape extends core.$ZodShape = core.$ZodLooseShape, out Config extends core.$ZodObjectConfig = core.$strip> extends _ZodType<core.$ZodObjectInternals<Shape, Config>>, core.$ZodObject<Shape, Config> {
	shape: Shape;
	keyof(): ZodEnum<util.ToEnum<keyof Shape & string>>;
	/** Define a schema to validate all unrecognized keys. This overrides the existing strict/loose behavior. */
	catchall<T extends core.SomeType>(schema: T): ZodObject<Shape, core.$catchall<T>>;
	/** @deprecated Use `z.looseObject()` or `.loose()` instead. */
	passthrough(): ZodObject<Shape, core.$loose>;
	/** Consider `z.looseObject(A.shape)` instead */
	loose(): ZodObject<Shape, core.$loose>;
	/** Consider `z.strictObject(A.shape)` instead */
	strict(): ZodObject<Shape, core.$strict>;
	/** This is the default behavior. This method call is likely unnecessary. */
	strip(): ZodObject<Shape, core.$strip>;
	extend<U extends core.$ZodLooseShape>(shape: U): ZodObject<util.Extend<Shape, U>, Config>;
	safeExtend<U extends core.$ZodLooseShape>(shape: SafeExtendShape<Shape, U> & Partial<Record<keyof Shape, core.SomeType>>): ZodObject<util.Extend<Shape, U>, Config>;
	/**
	 * @deprecated Use [`A.extend(B.shape)`](https://zod.dev/api?id=extend) instead.
	 */
	merge<U extends ZodObject>(other: U): ZodObject<util.Extend<Shape, U["shape"]>, U["_zod"]["config"]>;
	pick<M extends util.Mask<keyof Shape>>(mask: M): ZodObject<util.Flatten<Pick<Shape, Extract<keyof Shape, keyof M>>>, Config>;
	omit<M extends util.Mask<keyof Shape>>(mask: M): ZodObject<util.Flatten<Omit<Shape, Extract<keyof Shape, keyof M>>>, Config>;
	partial(): ZodObject<{
		[k in keyof Shape]: ZodOptional<Shape[k]>;
	}, Config>;
	partial<M extends util.Mask<keyof Shape>>(mask: M): ZodObject<{
		[k in keyof Shape]: k extends keyof M ? ZodOptional<Shape[k]> : Shape[k];
	}, Config>;
	required(): ZodObject<{
		[k in keyof Shape]: ZodNonOptional<Shape[k]>;
	}, Config>;
	required<M extends util.Mask<keyof Shape>>(mask: M): ZodObject<{
		[k in keyof Shape]: k extends keyof M ? ZodNonOptional<Shape[k]> : Shape[k];
	}, Config>;
}
declare const ZodObject: core.$constructor<ZodObject>;
declare function object<T extends core.$ZodLooseShape = Partial<Record<never, core.SomeType>>>(shape?: T, params?: string | core.$ZodObjectParams): ZodObject<util.Writeable<T>, core.$strip>;
declare function strictObject<T extends core.$ZodLooseShape>(shape: T, params?: string | core.$ZodObjectParams): ZodObject<T, core.$strict>;
declare function looseObject<T extends core.$ZodLooseShape>(shape: T, params?: string | core.$ZodObjectParams): ZodObject<T, core.$loose>;
interface ZodUnion<T extends readonly core.SomeType[] = readonly core.$ZodType[]> extends _ZodType<core.$ZodUnionInternals<T>>, core.$ZodUnion<T> {
	options: T;
}
declare const ZodUnion: core.$constructor<ZodUnion>;
declare function union<const T extends readonly core.SomeType[]>(options: T, params?: string | core.$ZodUnionParams): ZodUnion<T>;
interface ZodDiscriminatedUnion<Options extends readonly core.SomeType[] = readonly core.$ZodType[], Disc extends string = string> extends ZodUnion<Options>, core.$ZodDiscriminatedUnion<Options, Disc> {
	_zod: core.$ZodDiscriminatedUnionInternals<Options, Disc>;
	def: core.$ZodDiscriminatedUnionDef<Options, Disc>;
}
declare const ZodDiscriminatedUnion: core.$constructor<ZodDiscriminatedUnion>;
declare function discriminatedUnion<Types extends readonly [
	core.$ZodTypeDiscriminable,
	...core.$ZodTypeDiscriminable[]
], Disc extends string>(discriminator: Disc, options: Types, params?: string | core.$ZodDiscriminatedUnionParams): ZodDiscriminatedUnion<Types, Disc>;
interface ZodIntersection<A extends core.SomeType = core.$ZodType, B extends core.SomeType = core.$ZodType> extends _ZodType<core.$ZodIntersectionInternals<A, B>>, core.$ZodIntersection<A, B> {
}
declare const ZodIntersection: core.$constructor<ZodIntersection>;
declare function intersection<T extends core.SomeType, U extends core.SomeType>(left: T, right: U): ZodIntersection<T, U>;
interface ZodTuple<T extends util.TupleItems = readonly core.$ZodType[], Rest extends core.SomeType | null = core.$ZodType | null> extends _ZodType<core.$ZodTupleInternals<T, Rest>>, core.$ZodTuple<T, Rest> {
	rest<Rest extends core.SomeType = core.$ZodType>(rest: Rest): ZodTuple<T, Rest>;
}
declare const ZodTuple: core.$constructor<ZodTuple>;
declare function tuple<T extends readonly [
	core.SomeType,
	...core.SomeType[]
]>(items: T, params?: string | core.$ZodTupleParams): ZodTuple<T, null>;
declare function tuple<T extends readonly [
	core.SomeType,
	...core.SomeType[]
], Rest extends core.SomeType>(items: T, rest: Rest, params?: string | core.$ZodTupleParams): ZodTuple<T, Rest>;
declare function tuple(items: [
], params?: string | core.$ZodTupleParams): ZodTuple<[
], null>;
interface ZodRecord<Key extends core.$ZodRecordKey = core.$ZodRecordKey, Value extends core.SomeType = core.$ZodType> extends _ZodType<core.$ZodRecordInternals<Key, Value>>, core.$ZodRecord<Key, Value> {
	keyType: Key;
	valueType: Value;
}
declare const ZodRecord: core.$constructor<ZodRecord>;
declare function record<Key extends core.$ZodRecordKey, Value extends core.SomeType>(keyType: Key, valueType: Value, params?: string | core.$ZodRecordParams): ZodRecord<Key, Value>;
declare function partialRecord<Key extends core.$ZodRecordKey, Value extends core.SomeType>(keyType: Key, valueType: Value, params?: string | core.$ZodRecordParams): ZodRecord<Key & core.$partial, Value>;
interface ZodMap<Key extends core.SomeType = core.$ZodType, Value extends core.SomeType = core.$ZodType> extends _ZodType<core.$ZodMapInternals<Key, Value>>, core.$ZodMap<Key, Value> {
	keyType: Key;
	valueType: Value;
}
declare const ZodMap: core.$constructor<ZodMap>;
declare function map<Key extends core.SomeType, Value extends core.SomeType>(keyType: Key, valueType: Value, params?: string | core.$ZodMapParams): ZodMap<Key, Value>;
interface ZodSet<T extends core.SomeType = core.$ZodType> extends _ZodType<core.$ZodSetInternals<T>>, core.$ZodSet<T> {
	min(minSize: number, params?: string | core.$ZodCheckMinSizeParams): this;
	nonempty(params?: string | core.$ZodCheckMinSizeParams): this;
	max(maxSize: number, params?: string | core.$ZodCheckMaxSizeParams): this;
	size(size: number, params?: string | core.$ZodCheckSizeEqualsParams): this;
}
declare const ZodSet: core.$constructor<ZodSet>;
declare function set<Value extends core.SomeType>(valueType: Value, params?: string | core.$ZodSetParams): ZodSet<Value>;
interface ZodEnum<
/** @ts-ignore Cast variance */
out T extends util.EnumLike = util.EnumLike> extends _ZodType<core.$ZodEnumInternals<T>>, core.$ZodEnum<T> {
	enum: T;
	options: Array<T[keyof T]>;
	extract<const U extends readonly (keyof T)[]>(values: U, params?: string | core.$ZodEnumParams): ZodEnum<util.Flatten<Pick<T, U[number]>>>;
	exclude<const U extends readonly (keyof T)[]>(values: U, params?: string | core.$ZodEnumParams): ZodEnum<util.Flatten<Omit<T, U[number]>>>;
}
declare const ZodEnum: core.$constructor<ZodEnum>;
declare function _enum$1<const T extends readonly string[]>(values: T, params?: string | core.$ZodEnumParams): ZodEnum<util.ToEnum<T[number]>>;
declare function _enum$1<const T extends util.EnumLike>(entries: T, params?: string | core.$ZodEnumParams): ZodEnum<T>;
declare function nativeEnum<T extends util.EnumLike>(entries: T, params?: string | core.$ZodEnumParams): ZodEnum<T>;
interface ZodLiteral<T extends util.Literal = util.Literal> extends _ZodType<core.$ZodLiteralInternals<T>>, core.$ZodLiteral<T> {
	values: Set<T>;
	/** @legacy Use `.values` instead. Accessing this property will throw an error if the literal accepts multiple values. */
	value: T;
}
declare const ZodLiteral: core.$constructor<ZodLiteral>;
declare function literal<const T extends ReadonlyArray<util.Literal>>(value: T, params?: string | core.$ZodLiteralParams): ZodLiteral<T[number]>;
declare function literal<const T extends util.Literal>(value: T, params?: string | core.$ZodLiteralParams): ZodLiteral<T>;
interface ZodFile extends _ZodType<core.$ZodFileInternals>, core.$ZodFile {
	min(size: number, params?: string | core.$ZodCheckMinSizeParams): this;
	max(size: number, params?: string | core.$ZodCheckMaxSizeParams): this;
	mime(types: util.MimeTypes | Array<util.MimeTypes>, params?: string | core.$ZodCheckMimeTypeParams): this;
}
declare const ZodFile: core.$constructor<ZodFile>;
declare function file(params?: string | core.$ZodFileParams): ZodFile;
interface ZodTransform<O = unknown, I = unknown> extends _ZodType<core.$ZodTransformInternals<O, I>>, core.$ZodTransform<O, I> {
}
declare const ZodTransform: core.$constructor<ZodTransform>;
declare function transform<I = unknown, O = I>(fn: (input: I, ctx: core.ParsePayload) => O): ZodTransform<Awaited<O>, I>;
interface ZodOptional<T extends core.SomeType = core.$ZodType> extends _ZodType<core.$ZodOptionalInternals<T>>, core.$ZodOptional<T> {
	unwrap(): T;
}
declare const ZodOptional: core.$constructor<ZodOptional>;
declare function optional<T extends core.SomeType>(innerType: T): ZodOptional<T>;
interface ZodNullable<T extends core.SomeType = core.$ZodType> extends _ZodType<core.$ZodNullableInternals<T>>, core.$ZodNullable<T> {
	unwrap(): T;
}
declare const ZodNullable: core.$constructor<ZodNullable>;
declare function nullable<T extends core.SomeType>(innerType: T): ZodNullable<T>;
declare function nullish$1<T extends core.SomeType>(innerType: T): ZodOptional<ZodNullable<T>>;
interface ZodDefault<T extends core.SomeType = core.$ZodType> extends _ZodType<core.$ZodDefaultInternals<T>>, core.$ZodDefault<T> {
	unwrap(): T;
	/** @deprecated Use `.unwrap()` instead. */
	removeDefault(): T;
}
declare const ZodDefault: core.$constructor<ZodDefault>;
declare function _default$48<T extends core.SomeType>(innerType: T, defaultValue: util.NoUndefined<core.output<T>> | (() => util.NoUndefined<core.output<T>>)): ZodDefault<T>;
interface ZodPrefault<T extends core.SomeType = core.$ZodType> extends _ZodType<core.$ZodPrefaultInternals<T>>, core.$ZodPrefault<T> {
	unwrap(): T;
}
declare const ZodPrefault: core.$constructor<ZodPrefault>;
declare function prefault<T extends core.SomeType>(innerType: T, defaultValue: core.input<T> | (() => core.input<T>)): ZodPrefault<T>;
interface ZodNonOptional<T extends core.SomeType = core.$ZodType> extends _ZodType<core.$ZodNonOptionalInternals<T>>, core.$ZodNonOptional<T> {
	unwrap(): T;
}
declare const ZodNonOptional: core.$constructor<ZodNonOptional>;
declare function nonoptional<T extends core.SomeType>(innerType: T, params?: string | core.$ZodNonOptionalParams): ZodNonOptional<T>;
interface ZodSuccess<T extends core.SomeType = core.$ZodType> extends _ZodType<core.$ZodSuccessInternals<T>>, core.$ZodSuccess<T> {
	unwrap(): T;
}
declare const ZodSuccess: core.$constructor<ZodSuccess>;
declare function success<T extends core.SomeType>(innerType: T): ZodSuccess<T>;
interface ZodCatch<T extends core.SomeType = core.$ZodType> extends _ZodType<core.$ZodCatchInternals<T>>, core.$ZodCatch<T> {
	unwrap(): T;
	/** @deprecated Use `.unwrap()` instead. */
	removeCatch(): T;
}
declare const ZodCatch: core.$constructor<ZodCatch>;
declare function _catch$1<T extends core.SomeType>(innerType: T, catchValue: core.output<T> | ((ctx: core.$ZodCatchCtx) => core.output<T>)): ZodCatch<T>;
interface ZodNaN extends _ZodType<core.$ZodNaNInternals>, core.$ZodNaN {
}
declare const ZodNaN: core.$constructor<ZodNaN>;
declare function nan(params?: string | core.$ZodNaNParams): ZodNaN;
interface ZodPipe<A extends core.SomeType = core.$ZodType, B extends core.SomeType = core.$ZodType> extends _ZodType<core.$ZodPipeInternals<A, B>>, core.$ZodPipe<A, B> {
	in: A;
	out: B;
}
declare const ZodPipe: core.$constructor<ZodPipe>;
declare function pipe<const A extends core.SomeType, B extends core.$ZodType<unknown, core.output<A>> = core.$ZodType<unknown, core.output<A>>>(in_: A, out: B | core.$ZodType<unknown, core.output<A>>): ZodPipe<A, B>;
interface ZodCodec<A extends core.SomeType = core.$ZodType, B extends core.SomeType = core.$ZodType> extends ZodPipe<A, B>, core.$ZodCodec<A, B> {
	_zod: core.$ZodCodecInternals<A, B>;
	def: core.$ZodCodecDef<A, B>;
}
declare const ZodCodec: core.$constructor<ZodCodec>;
declare function codec<const A extends core.SomeType, B extends core.SomeType = core.$ZodType>(in_: A, out: B, params: {
	decode: (value: core.output<A>, payload: core.ParsePayload<core.output<A>>) => core.util.MaybeAsync<core.input<B>>;
	encode: (value: core.input<B>, payload: core.ParsePayload<core.input<B>>) => core.util.MaybeAsync<core.output<A>>;
}): ZodCodec<A, B>;
interface ZodReadonly<T extends core.SomeType = core.$ZodType> extends _ZodType<core.$ZodReadonlyInternals<T>>, core.$ZodReadonly<T> {
	unwrap(): T;
}
declare const ZodReadonly: core.$constructor<ZodReadonly>;
declare function readonly<T extends core.SomeType>(innerType: T): ZodReadonly<T>;
interface ZodTemplateLiteral<Template extends string = string> extends _ZodType<core.$ZodTemplateLiteralInternals<Template>>, core.$ZodTemplateLiteral<Template> {
}
declare const ZodTemplateLiteral: core.$constructor<ZodTemplateLiteral>;
declare function templateLiteral<const Parts extends core.$ZodTemplateLiteralPart[]>(parts: Parts, params?: string | core.$ZodTemplateLiteralParams): ZodTemplateLiteral<core.$PartsToTemplateLiteral<Parts>>;
interface ZodLazy<T extends core.SomeType = core.$ZodType> extends _ZodType<core.$ZodLazyInternals<T>>, core.$ZodLazy<T> {
	unwrap(): T;
}
declare const ZodLazy: core.$constructor<ZodLazy>;
declare function lazy<T extends core.SomeType>(getter: () => T): ZodLazy<T>;
interface ZodPromise<T extends core.SomeType = core.$ZodType> extends _ZodType<core.$ZodPromiseInternals<T>>, core.$ZodPromise<T> {
	unwrap(): T;
}
declare const ZodPromise: core.$constructor<ZodPromise>;
declare function promise<T extends core.SomeType>(innerType: T): ZodPromise<T>;
interface ZodFunction<Args extends core.$ZodFunctionIn = core.$ZodFunctionIn, Returns extends core.$ZodFunctionOut = core.$ZodFunctionOut> extends _ZodType<core.$ZodFunctionInternals<Args, Returns>>, core.$ZodFunction<Args, Returns> {
	_def: core.$ZodFunctionDef<Args, Returns>;
	_input: core.$InferInnerFunctionType<Args, Returns>;
	_output: core.$InferOuterFunctionType<Args, Returns>;
	input<const Items extends util.TupleItems, const Rest extends core.$ZodFunctionOut = core.$ZodFunctionOut>(args: Items, rest?: Rest): ZodFunction<core.$ZodTuple<Items, Rest>, Returns>;
	input<NewArgs extends core.$ZodFunctionIn>(args: NewArgs): ZodFunction<NewArgs, Returns>;
	input(...args: any[]): ZodFunction<any, Returns>;
	output<NewReturns extends core.$ZodType>(output: NewReturns): ZodFunction<Args, NewReturns>;
}
declare const ZodFunction: core.$constructor<ZodFunction>;
declare function _function(): ZodFunction;
declare function _function<const In extends ReadonlyArray<core.$ZodType>>(params: {
	input: In;
}): ZodFunction<ZodTuple<In, null>, core.$ZodFunctionOut>;
declare function _function<const In extends ReadonlyArray<core.$ZodType>, const Out extends core.$ZodFunctionOut = core.$ZodFunctionOut>(params: {
	input: In;
	output: Out;
}): ZodFunction<ZodTuple<In, null>, Out>;
declare function _function<const In extends core.$ZodFunctionIn = core.$ZodFunctionIn>(params: {
	input: In;
}): ZodFunction<In, core.$ZodFunctionOut>;
declare function _function<const Out extends core.$ZodFunctionOut = core.$ZodFunctionOut>(params: {
	output: Out;
}): ZodFunction<core.$ZodFunctionIn, Out>;
declare function _function<In extends core.$ZodFunctionIn = core.$ZodFunctionIn, Out extends core.$ZodType = core.$ZodType>(params?: {
	input: In;
	output: Out;
}): ZodFunction<In, Out>;
interface ZodCustom<O = unknown, I = unknown> extends _ZodType<core.$ZodCustomInternals<O, I>>, core.$ZodCustom<O, I> {
}
declare const ZodCustom: core.$constructor<ZodCustom>;
declare function check<O = unknown>(fn: core.CheckFn<O>): core.$ZodCheck<O>;
declare function custom<O>(fn?: (data: unknown) => unknown, _params?: string | core.$ZodCustomParams | undefined): ZodCustom<O, O>;
declare function refine<T>(fn: (arg: NoInfer<T>) => util.MaybeAsync<unknown>, _params?: string | core.$ZodCustomParams): core.$ZodCheck<T>;
declare function superRefine<T>(fn: (arg: T, payload: core.$RefinementCtx<T>) => void | Promise<void>): core.$ZodCheck<T>;
type ZodInstanceOfParams = core.Params<ZodCustom, core.$ZodIssueCustom, "type" | "check" | "checks" | "fn" | "abort" | "error" | "params" | "path">;
declare function _instanceof<T extends typeof util.Class>(cls: T, params?: ZodInstanceOfParams): ZodCustom<InstanceType<T>, InstanceType<T>>;
declare const stringbool: (_params?: string | core.$ZodStringBoolParams) => ZodCodec<ZodString, ZodBoolean>;
type _ZodJSONSchema = ZodUnion<[
	ZodString,
	ZodNumber,
	ZodBoolean,
	ZodNull,
	ZodArray<ZodJSONSchema>,
	ZodRecord<ZodString, ZodJSONSchema>
]>;
type _ZodJSONSchemaInternals = _ZodJSONSchema["_zod"];
interface ZodJSONSchemaInternals extends _ZodJSONSchemaInternals {
	output: util.JSONType;
	input: util.JSONType;
}
interface ZodJSONSchema extends _ZodJSONSchema {
	_zod: ZodJSONSchemaInternals;
}
declare function json(params?: string | core.$ZodCustomParams): ZodJSONSchema;
declare function preprocess<A, U extends core.SomeType, B = unknown>(fn: (arg: B, ctx: core.$RefinementCtx) => A, schema: U): ZodPipe<ZodTransform<A, B>, U>;
declare const ZodIssueCode: {
	readonly invalid_type: "invalid_type";
	readonly too_big: "too_big";
	readonly too_small: "too_small";
	readonly invalid_format: "invalid_format";
	readonly not_multiple_of: "not_multiple_of";
	readonly unrecognized_keys: "unrecognized_keys";
	readonly invalid_union: "invalid_union";
	readonly invalid_key: "invalid_key";
	readonly invalid_element: "invalid_element";
	readonly invalid_value: "invalid_value";
	readonly custom: "custom";
};
type inferFlattenedErrors<T extends core.$ZodType, U = string> = core.$ZodFlattenedError<core.output<T>, U>;
type inferFormattedError<T extends core.$ZodType<any, any>, U = string> = core.$ZodFormattedError<core.output<T>, U>;
type BRAND<T extends string | number | symbol = string | number | symbol> = {
	[core.$brand]: {
		[k in T]: true;
	};
};
declare function setErrorMap(map: core.$ZodErrorMap): void;
declare function getErrorMap(): core.$ZodErrorMap<core.$ZodIssue> | undefined;
type ZodRawShape = core.$ZodShape;
declare enum ZodFirstPartyTypeKind {
}
interface ZodISODateTime extends schemas$1.ZodStringFormat {
	_zod: core.$ZodISODateTimeInternals;
}
declare const ZodISODateTime: core.$constructor<ZodISODateTime>;
declare function datetime$1(params?: string | core.$ZodISODateTimeParams): ZodISODateTime;
interface ZodISODate extends schemas$1.ZodStringFormat {
	_zod: core.$ZodISODateInternals;
}
declare const ZodISODate: core.$constructor<ZodISODate>;
declare function date$2(params?: string | core.$ZodISODateParams): ZodISODate;
interface ZodISOTime extends schemas$1.ZodStringFormat {
	_zod: core.$ZodISOTimeInternals;
}
declare const ZodISOTime: core.$constructor<ZodISOTime>;
declare function time$1(params?: string | core.$ZodISOTimeParams): ZodISOTime;
interface ZodISODuration extends schemas$1.ZodStringFormat {
	_zod: core.$ZodISODurationInternals;
}
declare const ZodISODuration: core.$constructor<ZodISODuration>;
declare function duration$1(params?: string | core.$ZodISODurationParams): ZodISODuration;
interface ZodCoercedString<T = unknown> extends schemas$1._ZodString<core.$ZodStringInternals<T>> {
}
declare function string$2<T = unknown>(params?: string | core.$ZodStringParams): ZodCoercedString<T>;
interface ZodCoercedNumber<T = unknown> extends schemas$1._ZodNumber<core.$ZodNumberInternals<T>> {
}
declare function number$2<T = unknown>(params?: string | core.$ZodNumberParams): ZodCoercedNumber<T>;
interface ZodCoercedBoolean<T = unknown> extends schemas$1._ZodBoolean<core.$ZodBooleanInternals<T>> {
}
declare function boolean$2<T = unknown>(params?: string | core.$ZodBooleanParams): ZodCoercedBoolean<T>;
interface ZodCoercedBigInt<T = unknown> extends schemas$1._ZodBigInt<core.$ZodBigIntInternals<T>> {
}
declare function bigint$2<T = unknown>(params?: string | core.$ZodBigIntParams): ZodCoercedBigInt<T>;
interface ZodCoercedDate<T = unknown> extends schemas$1._ZodDate<core.$ZodDateInternals<T>> {
}
declare function date$3<T = unknown>(params?: string | core.$ZodDateParams): ZodCoercedDate<T>;
declare class EntityMesh extends Mesh {
	userData: {
		entityId: string | number;
	};
}
type ImageStyle = {
	/**
	 * Attempt to keep the image facing the camera as much as possible
	 */
	flipImageToFaceCamera?: boolean;
	/**
	 * url of the image
	 */
	url: string;
};
type ImageProperties = {
	width: number;
	height: number;
	rotation?: number;
	verticalOffset?: number;
};
type ImageState = {
	readonly id: string | number;
	readonly type: "image";
	/**
	 * The position of the image in [lon, lat]
	 */
	readonly position: Position$1;
	/**
	 * The offset of the image in the z direction
	 */
	readonly verticalOffset: number;
	/**
	 * Whether the image is visible
	 */
	visible: boolean;
	width: number;
	height: number;
	rotation: number;
	/**
	 * Attempt to keep the image facing the camera as much as possible
	 */
	flipImageToFaceCamera: boolean;
	/**
	 * The opacity of the image
	 */
	opacity: number;
};
declare class ImageComponent {
	mesh: Geometry3DObject3D;
	imageMesh?: EntityMesh;
	outline?: LineSegments;
	readonly type = "image";
	instanceIndex: number;
	geometry?: PlaneGeometry;
	material?: MeshLambertMaterial;
	feature: Feature$1<Point$1, ImageProperties>;
	constructor(feature: Feature$1<Point$1, ImageProperties>);
	get visible(): boolean;
	set visible(visible: boolean);
	position: Vector3;
}
declare class EntityBatchedMesh extends BatchedMesh {
	type: "entityBatchedMesh";
	userData: {
		entities: {
			[key: number]: string | number;
		};
		detached?: boolean;
	};
}
type MeshComponentProperties = {
	id: string;
	image?: ImageProperties & {
		position: Position;
		path: string;
	};
	textArea?: BaseTextAreaProperties & {
		position: Position;
	};
	textures?: EnterpriseTexture[];
	bevel?: BevelState;
};
type GeometryState = {
	readonly id: string | number;
	readonly type: "geometry";
	/**
	 * The position of the geometry in [lon, lat]
	 */
	readonly position: Position$1;
	/**
	 * The parent group of the geometry
	 */
	readonly parent: EntityId<GeometryGroupState>;
	/**
	 * Whether the geometry is visible. This is independent of the visibility of the children, but will affect the visibility of the children if set to false.
	 */
	visible: boolean;
	/**
	 * The initial color of the geometry. This is used to reset the color of the geometry to its initial value.
	 */
	initialColor: string;
	/**
	 * The color of the geometry
	 */
	color: string;
	/**
	 * The initial top color of the geometry. This is used to reset the top color of the geometry to its initial value.
	 */
	initialTopColor?: string;
	/**
	 * The color of geometry faces that are facing up
	 */
	topColor?: string;
	/**
	 * The color of the geometry when hovered over with a mouse
	 */
	hoverColor?: string;
	/**
	 * Whether the geometry is interactive, which means it can be hovered over and clicked on.
	 *
	 * @example
	 * ```javascript
	 * 	renderer.on('click', ({ geometry }) => {});
	 * ```
	 */
	interactive: boolean;
	/**
	 * Whether the geometry is outlined with a 30% darkened color. This effect adds lines around the geometry to make it stand out.
	 */
	outline: boolean;
	/**
	 * Show geometry image if present
	 */
	showImage: boolean;
	/**
	 * Attempt to keep the image facing the camera as much as possible
	 */
	flipImageToFaceCamera: boolean;
	/**
	 * Whether the anchored image should collide with other images.
	 */
	enableImageCollisions: boolean;
	/**
	 * Whether the geometry should emit an event when focused on by the center of the camera
	 */
	focusable: boolean;
	/**
	 * The opacity of the geometry
	 */
	opacity: number;
	/**
	 * The height of the geometry
	 */
	height: number;
	/**
	 * The texture URL of the geometry
	 */
	texture?: string;
	/**
	 * The top texture URL of the geometry
	 */
	topTexture?: string;
	/**
	 * Whether the geometry is currently in hover state or not
	 */
	hovered: boolean;
	/**
	 * The render order of the geometry
	 */
	renderOrder?: number;
	/**
	 * The altitude of the geometry element in meters.
	 */
	altitude: number;
	/**
	 * The shading of the geometry
	 */
	shading?: Shading;
	/**
	 * The side of the geometry
	 */
	side?: MaterialSide;
	/**
	 * Bevel configuration for extruded shapes.
	 */
	bevel?: BevelState;
	/**
	 * TODO: it's annoying that we have to store these here just so that they can be applied from mappedin-js. Let's think about a better way to do this.
	 */
	/**
	 * Whether the geometry has a border
	 */
	borderVisible: boolean;
	/**
	 * The color of the border
	 */
	borderColor?: string;
	/**
	 * The width of the border
	 */
	borderWidth?: number;
};
declare class MeshComponent {
	#private;
	mesh?: EntityBatchedMesh;
	imageMesh?: Mesh;
	/**
	 * holds a pointer to space label text if the polygon has label active.
	 */
	textMesh?: Text;
	textEntityId?: string;
	readonly type = "geometry";
	dirty: boolean;
	shouldDetach: boolean;
	detached: boolean;
	instanceIndex: number;
	geometry?: BufferGeometry;
	batchedProps?: {
		range: BatchedMeshGeometryRange;
		positionCount: number;
		geometryId: number;
	};
	material?: BatchedStandardMaterial;
	feature: Feature$1<Polygon$1 | LineString | MultiPolygon$1 | MultiLineString, MeshComponentProperties>;
	currentHeight: number;
	constructor(feature: Feature$1<Polygon$1 | LineString | MultiPolygon$1 | MultiLineString, MeshComponentProperties>);
	get visible(): boolean;
	set visible(visible: boolean);
	get renderOrder(): number;
	set renderOrder(value: number);
	color: Color;
	topColor: Color;
	setColor(color: string, topColor: string): void;
	getColor(): {
		color: Color;
		topColor: Color;
	} | undefined;
	position: Vector3;
	altitude: number;
	get opacity(): number;
	set opacity(value: number);
	get featureBbox(): BBox;
}
type ModelState = {
	readonly id: string;
	readonly type: "model";
	/**
	 * The parent container of the marker
	 */
	readonly parent?: EntityId<GeometryGroupState> | string | number;
	/**
	 * The position of the model in [lon, lat]
	 */
	readonly position: Position$1;
	/**
	 * Whether the model is interactive, which means it can be hovered over and clicked on.
	 *
	 * @example
	 * ```javascript
	 * 	renderer.on('click', ({ geometry }) => {});
	 * ```
	 */
	interactive: boolean;
} & Partial<Omit<ModelStyle, "rotation" | "scale">> & Pick<ModelStyle, "rotation" | "scale">;
/**
 * initialize model state
 * @interface
 */
export type InitializeModelState = Omit<Partial<ModelState>, "id" | "type" | "parent" | "position">;
type UpdateModelState = Omit<InitializeModelState, "url"> & {
	position?: Position$1;
};
declare class ModelComponent {
	#private;
	mesh?: Geometry3DObject3D | Group;
	readonly type = "model";
	positionDirty: boolean;
	outline?: LineSegments;
	geometry?: Object3D;
	material?: BatchedStandardMaterial;
	feature: Feature$1<Point$1, ModelProperties>;
	instanceIndex?: number;
	constructor(feature: Feature$1<Point$1, ModelProperties>);
	get visible(): boolean;
	set visible(value: boolean);
	setOpacity(): void;
	color: Color;
	setColor(): void;
	clippingPlane?: Plane;
	position: Vector3;
	get altitude(): number;
	set altitude(value: number);
	getRotation(): number[] | undefined;
	setRotation(value: [
		number,
		number,
		number
	]): void;
	getScale(): number[] | undefined;
	setScale(value: [
		number,
		number,
		number
	]): void;
	get opacity(): number;
	set opacity(value: number);
	get renderOrder(): number;
	set renderOrder(value: number);
	get visibleThroughGeometry(): boolean;
	set visibleThroughGeometry(value: boolean);
}
type PathProperties = {
	/**
	 * The parentId of the point. The point will be anchored to the altitude of this parent group container.
	 */
	parentId?: EntityId<GroupContainerState> | string | null;
};
type PathUpdateState = Omit<Partial<PathState>, "id" | "type">;
type PathState = {
	readonly id: string | number;
	readonly type: "path";
	/**
	 * The position of the path in [lon, lat]
	 */
	readonly position: Position$1;
	/**
	 * How much the path hovers above the floor plane in meters.
	 */
	verticalOffset?: number;
	/**
	 * Whether the path is visible.
	 */
	visible: boolean;
	/**
	 * Whether the path is interactive, which means it can be hovered over and clicked on.
	 *
	 * @example
	 * ```javascript
	 * 	renderer.on('click', ({ geometry }) => {});
	 * ```
	 */
	interactive?: boolean;
	/**
	 * The fraction of the path that has been drawn. This can be used to animate the drawing of the path.
	 * Note: use values between 0 and 1.
	 */
	completeFraction: number;
	/**
	 * The color of the path.
	 */
	color: string;
	/**
	 * The accent color of the path. When arrows are visible, it is applied to them
	 */
	accentColor: string;
	/**
	 * Display Arrows on Path to indicate direction
	 */
	displayArrowsOnPath: boolean;
	/**
	 * Arrows on path should animate to indicate direction
	 */
	animateArrowsOnPath: boolean;
	/**
	 * The width of the path in meters. Can be a number or an {@link Interpolation}.
	 */
	width: number | Interpolation<"zoom-level", number[]>;
	/**
	 * The fraction of the path that should be highlighted. This can be used to animate the highlight.
	 * @default 0
	 */
	highlightStartFraction: number;
	highlightEndFraction: number;
	highlightColor: string;
	highlightWidthMultiplier: number;
	highlightCompleteFraction: number;
};
type AddPathOptions = {
	/**
	 * Whether the Path should be clickable.
	 * @default false
	 */
	interactive?: boolean;
	/**
	 * @internal
	 */
	id?: string | number;
	/**
	 * The width of the path.
	 *
	 * @default Interpolation { on: 'zoom-level', input: [17, 22], output: [0.8, 0.4] }
	 */
	width?: number | Interpolation<"zoom-level", number[]>;
	/**
	 * The color of the path.
	 */
	color?: string;
	/**
	 * The accent color of the path. When arrows are visible, it is applied to them
	 */
	accentColor?: string;
	/**
	 * Display Arrows on Path to indicate direction
	 */
	displayArrowsOnPath?: boolean;
	/**
	 * Arrows on path should animate to indicate direction
	 */
	animateArrowsOnPath?: boolean;
	/**
	 * Whether the path should be visible through geometry.
	 */
	visibleThroughGeometry?: boolean;
	/**
	 * Whether the path should be dashed.
	 */
	dashed?: boolean;
	/**
	 * How much the path hovers above the floor plane in meters.
	 */
	verticalOffset?: number;
	/**
	 * The fraction of the path that should be highlighted. This can be used to animate the highlight.
	 * @default 0
	 */
	highlightStartFraction?: number;
	highlightEndFraction?: number;
	highlightColor?: string;
	highlightWidthMultiplier?: number;
	highlightCompleteFraction?: number;
};
declare class PathComponent {
	#private;
	readonly type = "path";
	mesh: PatMeshContainer;
	material?: PathMaterial;
	geometry?: BufferGeometry;
	outline?: LineSegments;
	feature: FeatureCollection$1<Point$1, PathProperties>;
	options: AddPathOptions;
	width: number | Interpolation<"zoom-level", number[]>;
	breakpoint: number;
	altitudeBreakpoints?: number[];
	accentColor: string;
	completeFraction: number;
	altitudeAdjustment: number;
	displayArrowsOnPath: boolean;
	animateArrowsOnPath: boolean;
	visibleThroughGeometry: boolean;
	highlightStartFraction: number;
	highlightEndFraction: number;
	highlightCompleteFraction: number;
	highlightWidthMultiplier: number;
	highlightColor: string;
	dashed: boolean;
	/**
	 * If the path is vertical it will be rebuilt whenever altitudeDirty = true. This will be set during the first render of the path.
	 */
	isVertical: boolean;
	dirty: boolean;
	materialDirty: boolean;
	constructor(feature: FeatureCollection$1<Point$1, PathProperties>, options?: AddPathOptions);
	setColor(): void;
	setOpacity(): void;
	set visible(visible: boolean);
	get visible(): boolean;
	position: Vector3;
	get altitude(): number;
	set altitude(value: number);
	set complete(value: number);
}
type ShapeState = {
	/**
	 * The unique identifier of the shape.
	 */
	readonly id: string;
	/**
	 * The type of the shape, which is always 'custom-geometry'.
	 */
	readonly type: "custom-geometry";
	/**
	 * The position of the geometry in [longitude, latitude].
	 */
	readonly position: Position$1;
	/**
	 * Whether the geometry is visible.
	 */
	visible?: boolean;
	/**
	 * The altitude of the geometry, in meters.
	 */
	altitude?: number;
	/**
	 * The color of the shape.
	 */
	color: string;
	/**
	 * The opacity of the shape.
	 */
	opacity: number;
	/**
	 * The parent container of the geometry.
	 */
	readonly parent: EntityId<GroupContainerState> | string | number;
	/**
	 * Whether the geometry is interactive.
	 */
	interactive?: boolean;
};
type CustomGeometryBuilder = {
	/**
	 * A setup function that is called once when the geometry is created
	 */
	setup: (object: Object3D) => void;
	/**
	 *  An update function that is called every render frame.
	 *
	 *  Note: do not create new objects in this function, and only update the object's children
	 *  Note 2: calling `render` or `setState` in this method will result in a render loop, so avoid if possible
	 */
	update: (object: Object3D) => void;
};
declare class CustomGeometryComponent {
	#private;
	mesh: Geometry3DObject3D;
	readonly type = "custom-geometry";
	dirty: boolean;
	feature: Feature$1<Point$1>;
	builder: CustomGeometryBuilder;
	outline?: LineSegments;
	constructor(feature: Feature$1<Point$1>, builder: CustomGeometryBuilder);
	get visible(): boolean;
	set visible(value: boolean);
	set opacity(value: number);
	get opacity(): number;
	color: Color;
	setColor(color: string): void;
	get position(): import("three").Vector3;
	get altitude(): number;
	set altitude(value: number);
	get renderOrder(): number;
	set renderOrder(value: number);
}
type Text3DState = {
	readonly id: string | number;
	readonly type: "text3d";
	/**
	 * The position of the Text3D in [lon, lat, altitude]
	 */
	readonly position: Position$1;
	/**
	 * Whether the Text3D is visible
	 */
	visible: boolean;
	/**
	 * Attempt to keep the Text3D facing the camera as much as possible
	 */
	flipToFaceCamera: boolean;
	/**
	 * Content of the text3d
	 */
	content: string;
} & Text3DStyle;
/**
 * @interface
 */
export type InitializeText3DState = Partial<Omit<Text3DState, "id" | "type">>;
type UpdatableText3DState = Omit<InitializeText3DState, "margin" | "position" | "content">;
type Text3DProperties = {
	id: string;
	content: string;
	textArea?: MeshComponentProperties["textArea"];
};
export type AddText3DOptions = {
	appearance?: Partial<InitializeText3DState>;
};
declare class Text3DComponent {
	mesh: Geometry3DObject3D;
	textMesh?: Text;
	readonly type = "text3d";
	feature: Feature$1<Point$1, Text3DProperties | (FloorTextCommonProperties & {
		verticalOffset: number;
	})>;
	constructor(feature: Feature$1<Point$1, Text3DProperties | (FloorTextCommonProperties & {
		verticalOffset: number;
	})>);
	get visible(): boolean;
	set visible(visible: boolean);
	parent?: GroupContainerObject3D;
	batchedText?: BatchedText;
	/**
	 * if this Text3DComponent is a polygon label, populate this id with the polygon entity id
	 * This id is used to prevent drawing text for the same polygon.
	 */
	polygonEntityId?: string;
}
type Outline = {
	color: string;
	dirty: boolean;
	enabled: boolean;
	edgeColors?: BufferAttribute;
	ranges?: {
		start: number;
		count: number;
	};
	geometry?: BufferGeometry;
	currentOpacity: number;
	currentColor: [
		number,
		number,
		number
	];
	topFaceVerticesIndices?: number[];
	visible: boolean;
};
declare class OutlineComponent implements Outline {
	#private;
	color: string;
	dirty: boolean;
	/** Controls whether the outline should be updated in the renderer */
	enabled: boolean;
	edgeColors?: BufferAttribute;
	edgeVisibility?: BufferAttribute;
	geometry?: BufferGeometry;
	ranges?: {
		start: number;
		count: number;
	};
	topFaceVerticesIndices?: number[];
	get currentOpacity(): number;
	/**
	 * Sets the visibility of the outline.
	 */
	set visible(visible: boolean);
	/**
	 * Gets the visibility of the outline.
	 */
	get visible(): boolean;
	get currentColor(): [
		number,
		number,
		number
	];
	constructor(color: string);
}
declare class FocusableComponent {
	focusMesh?: Mesh;
	dirty: boolean;
}
type TextureStyle = {
	texture?: SingleTexture;
	topTexture?: SingleTexture;
	showTexture: boolean;
	showTopTexture: boolean;
	textureInstance?: Texture;
	topTextureInstance?: Texture;
	dirty: boolean;
};
type SingleTexture = {
	repeat?: {
		u: number;
		v: number;
	};
	offset?: {
		u: number;
		v: number;
	};
	rotation?: number;
	path: string;
	surface?: "inside" | "outside" | "both";
	bounds?: [
		number,
		number,
		number,
		number
	];
};
declare class TextureComponent implements TextureStyle {
	texture?: SingleTexture;
	topTexture?: SingleTexture;
	showTexture: boolean;
	showTopTexture: boolean;
	textureInstance?: Texture;
	topTextureInstance?: Texture;
	dirty: boolean;
	constructor(texture?: SingleTexture | string, topTexture?: SingleTexture | string);
}
type Border = {
	dirty: boolean;
	visible: boolean;
	mesh?: Object3D;
	needsRebuild: boolean;
};
declare class BorderComponent implements Border {
	dirty: boolean;
	needsRebuild: boolean;
	set visible(visible: boolean);
	get visible(): boolean;
	mesh?: Object3D;
}
type ClippingPlane = {
	dirty: boolean;
	verticalOffset: number;
	plane?: Plane;
	holeFillMesh?: Mesh;
	topColor?: string;
	needsRebuild: boolean;
	topVisible?: boolean;
};
declare class ClippingPlaneComponent implements ClippingPlane {
	dirty: boolean;
	needsRebuild: boolean;
	verticalOffset: number;
	plane?: Plane;
	holeFillMesh?: Mesh;
	topColor?: string;
	topVisible: boolean;
}
type Geometry3DObjectTypes = "geometry" | "path" | "model" | "custom-geometry" | "image" | "text3d";
declare class Geometry3DObject3D extends Object3D {
	type: Geometry3DObjectTypes;
	userData: {
		entityId: string;
		/**
		 * TODO: remove this when proper instancing is handled
		 */
		isSingleModel?: boolean;
		type: Geometry3DObjectTypes;
	};
	/**
	 * Custom raycast implementation for model objects only.
	 * This selectively enables recursive raycasting just for models, which have complex hierarchies,
	 * while avoiding the performance cost of recursive raycasting for other object types.
	 */
	raycast(raycaster: Raycaster, intersects: any[]): void;
}
type PathMaterial = ShaderMaterial & {
	uniforms: PathUniforms;
};
type PathMesh = Mesh<TubeGeometry, PathMaterial, Object3DEventMap>;
declare class PatMeshContainer extends Geometry3DObject3D {
	children: [
		PathMesh,
		PathMesh
	];
}
type MeshComponentTypes = MeshComponent | PathComponent | ModelComponent | CustomGeometryComponent | Text3DComponent | ImageComponent;
type MappedComponentType<M> = M extends MeshComponent ? "geometry" : M extends PathComponent ? "path" : M extends ModelComponent ? "model" : M extends CustomGeometryComponent ? "custom-geometry" : M extends ImageComponent ? "image" : M extends Text3DComponent ? "text3d" : never;
declare class Geometry3D<M extends MeshComponentTypes = MeshComponent, S extends StyleComponent | Text3DStyleComponent | ModelStyleComponnet = StyleComponent, I extends InteractionComponent = InteractionComponent, T extends MappedComponentType<M> = MappedComponentType<M>, O extends OutlineComponent | undefined = OutlineComponent | undefined, F extends FocusableComponent | undefined = FocusableComponent | undefined, TX extends TextureComponent | undefined = TextureComponent | undefined, B extends BorderComponent | undefined = BorderComponent | undefined, C extends ClippingPlaneComponent | undefined = ClippingPlaneComponent | undefined> {
	id: string | number;
	components: [
		M,
		S,
		I?,
		O?,
		F?,
		B?,
		TX?,
		C?
	];
	/**
	 * Parent geometry group ID
	 */
	parentId?: string | number;
	get object3d(): M["mesh"];
	get parentObject3D(): GroupContainerObject3D | GeometryGroupObject3D | null;
	get type(): T;
	entities2D: Map<string | number, Geometry2D>;
	constructor(meshComponent: M, styleComponent: S);
	/** Attaching a 2D entity to the 3D entity so it will follow the style changes */
	attach(entity: Geometry2D): void;
	detach(entity: Geometry2D): void;
	removeAllEntities(): void;
}
type TextGeometry3D = Geometry3D<Text3DComponent, Text3DStyleComponent, InteractionComponent, "text3d">;
type CustomGeometry3D = Geometry3D<CustomGeometryComponent, StyleComponent, InteractionComponent, "custom-geometry">;
type ModelGeometry3D = Geometry3D<ModelComponent, ModelStyleComponnet, InteractionComponent, "model">;
type PathGeometry3D = Geometry3D<PathComponent, StyleComponent, InteractionComponent, "path">;
type ImageGeometry3D = Geometry3D<ImageComponent, StyleComponent, InteractionComponent, "image">;
type MeshGeometry3D = Geometry3D<MeshComponent, StyleComponent, InteractionComponent, "geometry">;
type Geometry3DTypes = TextGeometry3D | CustomGeometry3D | PathGeometry3D | ImageGeometry3D | MeshGeometry3D | ModelGeometry3D;
interface PathUniforms {
	vertexes: {
		type: "f";
		value: number;
	};
	resolution: {
		type: "v2";
		value: Vector2;
	};
	cameraParameters: {
		type: "v2";
		value: Vector2;
	};
	complete: {
		type: "f";
		value: number;
	};
	color: {
		type: "c";
		value: Color;
	};
	pathLength: {
		type: "f";
		value: number;
	};
	nearRadius: {
		type: "f";
		value: number;
	};
	farRadius: {
		type: "f";
		value: number;
	};
	nearZoom: {
		type: "f";
		value: number;
	};
	farZoom: {
		type: "f";
		value: number;
	};
	pulseColor: {
		type: "c";
		value: Color;
	};
	pulse: {
		type: "f";
		value: number;
	};
	pulseLength: {
		type: "f";
		value: number;
	};
	pathIsVertical: {
		type: "b";
		value: boolean;
	};
	arrowAnimationTimer: {
		type: "f";
		value: number;
	};
	arrowTexture: {
		type: "t";
		value: Texture;
	};
	displayArrowsOnPath: {
		type: "b";
		value: boolean;
	};
	showPulse: {
		type: "b";
		value: boolean;
	};
	opacityMultiplier: {
		type: "f";
		value: number;
	};
	dashed: {
		type: "b";
		value: boolean;
	};
	highlightStartFraction: {
		type: "f";
		value: number;
	};
	highlightEndFraction: {
		type: "f";
		value: number;
	};
	highlightCompleteFraction: {
		type: "f";
		value: number;
	};
	highlightColor: {
		type: "c";
		value: Color;
	};
	highlightWidthMultiplier: {
		type: "f";
		value: number;
	};
}
/**
 * Generic PubSub class implementing the Publish-Subscribe pattern for event handling.
 *
 * @template EVENT_PAYLOAD - The type of the event payload.
 * @template EVENT - The type of the event.
 */
export declare class PubSub<EVENT_PAYLOAD, EVENT extends keyof EVENT_PAYLOAD = keyof EVENT_PAYLOAD> {
	/**
	 * @private
	 * @internal
	 */
	private _subscribers;
	/**
	 * @private
	 * @internal
	 */
	private _destroyed;
	/**
	 * @private
	 * @internal
	 */
	publish<EVENT_NAME extends EVENT>(eventName: EVENT_NAME, data?: EVENT_PAYLOAD[EVENT_NAME]): void;
	/**
	 * Subscribe a function to an event.
	 *
	 * @param eventName An event name which, when fired, will call the provided
	 * function.
	 * @param fn A callback that gets called when the corresponding event is fired. The
	 * callback will get passed an argument with a type that's one of event payloads.
	 * @example
	 * // Subscribe to the 'click' event
	 * const handler = (event) => {
	 *  const { coordinate } = event;
	 *  const { latitude, longitude } = coordinate;
	 * 	console.log(`Map was clicked at ${latitude}, ${longitude}`);
	 * };
	 * map.on('click', handler);
	 */
	on<EVENT_NAME extends EVENT>(eventName: EVENT_NAME, fn: (payload: EVENT_PAYLOAD[EVENT_NAME] extends {
		data: null;
	} ? EVENT_PAYLOAD[EVENT_NAME]["data"] : EVENT_PAYLOAD[EVENT_NAME]) => void): void;
	/**
	 * Unsubscribe a function previously subscribed with {@link on}
	 *
	 * @param eventName An event name to which the provided function was previously
	 * subscribed.
	 * @param fn A function that was previously passed to {@link on}. The function must
	 * have the same reference as the function that was subscribed.
	 * @example
	 * // Unsubscribe from the 'click' event
	 * const handler = (event) => {
	 * 	console.log('Map was clicked', event);
	 * };
	 * map.off('click', handler);
	 */
	off<EVENT_NAME extends EVENT>(eventName: EVENT_NAME, fn: (payload: EVENT_PAYLOAD[EVENT_NAME] extends {
		data: null;
	} ? EVENT_PAYLOAD[EVENT_NAME]["data"] : EVENT_PAYLOAD[EVENT_NAME]) => void): void;
	/**
	 * @private
	 * @internal
	 */
	destroy(): void;
}
type TRendererOptions = Partial<{
	canvas: HTMLCanvasElement | OffscreenCanvas;
	antialias: boolean;
	backgroundColor: string;
	backgroundAlpha: number;
	alpha: boolean;
	onWebGLRendererError: (e: Error) => void;
	xRayPath: boolean;
	onWebGLContextCreationError: (e: Event) => void;
	onWebGLContextLost: (e: Event) => void;
	onWebGLContextRestored: (e: Event) => void;
}>;
declare class Renderer {
	backgroundAlpha: number;
	backgroundColor: Color;
	width: number;
	height: number;
	options: TRendererOptions;
	renderer?: WebGLRenderer;
	constructor(renderOptions: TRendererOptions);
	/**
	 * Dispose of the renderer and its buffers.
	 */
	destroy(): void;
	enabledLayers: Set<number>;
	/**
	 * Re-render the scene, depending on which parts of the scene have been
	 * invalidated.
	 *
	 * @method render
	 * @param renderTarget {null or WebGLRenderTarget}
	 * @param scene {Scene}
	 * @param sceneCamera {Camera}
	 */
	render(scene: Scene, sceneCamera: Camera): void;
	clear(): void;
	/**
	 * Set the size of the renderer, composer, and all its internal buffers.
	 *
	 * @method setBufferSize
	 * @param width {number}
	 * @param height {number}
	 */
	setBufferSize(width: number, height: number): void;
	/**
	 * Set the color and opacity that will be drawn behind the scene.
	 *
	 * @method setBackgroundColor
	 * @param color {Color}
	 * @param alpha {number}
	 */
	setBackgroundColor(color: any, alpha: any): void;
	domElement(): HTMLCanvasElement | undefined;
	handleWebGLContextCreationError: (event: Event) => void;
	handleWebGLContextLost: (event: Event) => void;
	handleWebGLContextRestored: (event: Event) => void;
}
type Point2D<T = unknown> = [
	number,
	number,
	T?
];
declare class Rectangle<T = unknown> {
	/**
	 * The x-coordinate of the rectangle.
	 */
	readonly x: number;
	/**
	 * The y-coordinate of the rectangle.
	 */
	readonly y: number;
	/**
	 * The width of the rectangle.
	 */
	readonly w: number;
	/**
	 * The height of the rectangle.
	 */
	readonly h: number;
	/**
	 * The user data associated with this rectangle.
	 */
	userData: T;
	/**
	 * Creates an instance of Rectangle.
	 *
	 * @param {number} x - The x-coordinate of the rectangle.
	 * @param {number} y - The y-coordinate of the rectangle.
	 * @param {number} w - The width of the rectangle.
	 * @param {number} h - The height of the rectangle.
	 * @param {T} [userData] - The user data associated with this rectangle.
	 */
	constructor(x: number, y: number, w: number, h: number, userData?: T);
	/**
	 * Checks if this rectangle contains the given rectangle entirely.
	 *
	 * @param {Rectangle} rectangle - The rectangle to check.
	 * @returns {boolean} Whether this rectangle contains the given rectangle.
	 */
	contains(rectangle: Rectangle<T>): boolean;
	/**
	 * Checks if this rectangle intersects with the given rectangle.
	 *
	 * @param {Rectangle} rectangle - The rectangle to check.
	 * @returns {boolean} Whether this rectangle intersects with the given rectangle.
	 */
	intersects(rectangle: Rectangle): boolean;
	/**
	 * Checks if this rectangle intersects with the given point.
	 *
	 * @param {Point2D} point - The point to check.
	 * @returns {boolean} Whether this rectangle intersects with the given point.
	 */
	intersectsPoint(point: Point2D): boolean;
	/**
	 * Draws the rectangle on the given canvas context.
	 *
	 * @param {CanvasRenderingContext2D} context - The canvas context to draw on.
	 */
	draw(context: CanvasRenderingContext2D): void;
}
declare class QuadTree<T = unknown> {
	/**
	 * The top-left quadrant of this QuadTree.
	 */
	topLeft: QuadTree<T>;
	/**
	 * The top-right quadrant of this QuadTree.
	 */
	topRight: QuadTree<T>;
	/**
	 * The bottom-left quadrant of this QuadTree.
	 */
	bottomLeft: QuadTree<T>;
	/**
	 * The bottom-right quadrant of this QuadTree.
	 */
	bottomRight: QuadTree<T>;
	/**
	 * Whether this QuadTree has been subdivided.
	 */
	divided: boolean;
	/**
	 * The boundary of this QuadTree.
	 */
	readonly boundary: Rectangle<T>;
	/**
	 * The maximum number of objects a QuadTree node can hold before subdividing.
	 */
	capacity: number;
	/**
	 * The list of objects in this QuadTree node.
	 */
	readonly objects: Rectangle<T>[];
	/**
	 * The parent QuadTree node.
	 */
	readonly parent?: QuadTree<T>;
	/**
	 * Creates an instance of QuadTree.
	 *
	 * @param {Rectangle<T>} boundary - The boundary of this QuadTree.
	 * @param {QuadTree<T>} [parent] - The parent QuadTree node.
	 */
	constructor(boundary: Rectangle<T>, parent?: QuadTree<T>);
	/**
	 * Gets the total number of objects in this QuadTree.
	 *
	 * @returns {number} The total number of objects.
	 */
	getSize(): number;
	/**
	 * Subdivides this QuadTree into four quadrants.
	 */
	subdivide(): void;
	/**
	 * Queries this QuadTree for rectangles that intersect the given rectangle.
	 *
	 * @param {Rectangle} rectangle - The rectangle to query.
	 * @returns {Rectangle<T>[]} The list of intersecting rectangles.
	 */
	queryRect(rectangle: Rectangle): Rectangle<T>[];
	/**
	 * Queries this QuadTree for rectangles that contain the given point.
	 *
	 * @param {Point2D} point - The point to query.
	 * @returns {Rectangle<T>[]} The list of rectangles containing the point.
	 */
	queryPoint(point: Point2D): Rectangle<T>[];
	/**
	 * Inserts a rectangle into this QuadTree.
	 *
	 * @param {Rectangle<T>} rectangle - The rectangle to insert.
	 * @returns {boolean} Whether the rectangle was successfully inserted.
	 */
	insert(rectangle: Rectangle<T>): boolean;
	/**
	 * Draws all objects in this QuadTree on the given canvas context.
	 *
	 * @param {CanvasRenderingContext2D} context - The canvas context to draw on.
	 */
	drawObjects(context: CanvasRenderingContext2D): void;
	/**
	 * Draws the boundary of this QuadTree on the given canvas context.
	 *
	 * @param {CanvasRenderingContext2D} context - The canvas context to draw on.
	 */
	draw(context: CanvasRenderingContext2D): void;
}
export declare enum E_SDK_LOG_LEVEL {
	LOG = 0,
	WARN = 1,
	ERROR = 2,
	SILENT = 3
}
export declare function setLoggerLevel(level: E_SDK_LOG_LEVEL): void;
/**
 * @internal
 */
export declare class MappedinError extends Error {
	constructor(message: string, label?: string);
}
/**
 * @internal
 */
export declare class MappedinRenderError extends MappedinError {
	constructor(message: string, label?: string);
}
declare const EASING_CURVES: readonly [
	"ease-in",
	"ease-out",
	"ease-in-out",
	"linear"
];
type EasingCurve = (typeof EASING_CURVES)[number];
type ExpiryData = {
	cacheControl?: string | null;
	expires?: Date | string | null;
};
type RequestParameters = {
	/**
	 * The URL to be requested.
	 */
	url: string;
	/**
	 * The headers to be sent with the request.
	 */
	headers?: any;
	/**
	 * Request method `'GET' | 'POST' | 'PUT'`.
	 */
	method?: "GET" | "POST" | "PUT";
	/**
	 * Request body.
	 */
	body?: string;
	/**
	 * Response body type to be returned.
	 */
	type?: "string" | "json" | "arrayBuffer" | "image";
	/**
	 * `'same-origin'|'include'` Use 'include' to send cookies with cross-origin requests.
	 */
	credentials?: "same-origin" | "include";
	/**
	 * If `true`, Resource Timing API information will be collected for these transformed requests and returned in a resourceTiming property of relevant data events.
	 */
	collectResourceTiming?: boolean;
	/**
	 * Parameters supported only by browser fetch API. Property of the Request interface contains the cache mode of the request. It controls how the request will interact with the browser's HTTP cache. (https://developer.mozilla.org/en-US/docs/Web/API/Request/cache)
	 */
	cache?: RequestCache;
};
type GetResourceResponse<T> = ExpiryData & {
	data: T;
};
type SerializedObject<S extends Serialized = any> = {
	[_: string]: S;
};
type Serialized = null | void | boolean | number | string | Boolean | Number | String | Date | RegExp | ArrayBuffer | ArrayBufferView | ImageData | ImageBitmap | Blob | Array<Serialized> | SerializedObject;
declare class ThrottledInvoker {
	_channel: MessageChannel;
	_triggered: boolean;
	_methodToThrottle: Function;
	constructor(methodToThrottle: Function);
	trigger(): void;
	remove(): void;
}
declare const viewTypes: {
	Int8: Int8ArrayConstructor;
	Uint8: Uint8ArrayConstructor;
	Int16: Int16ArrayConstructor;
	Uint16: Uint16ArrayConstructor;
	Int32: Int32ArrayConstructor;
	Uint32: Uint32ArrayConstructor;
	Float32: Float32ArrayConstructor;
};
type ViewType = keyof typeof viewTypes;
declare class Struct {
	_pos1: number;
	_pos2: number;
	_pos4: number;
	_pos8: number;
	readonly _structArray: StructArray;
	size: number;
	/**
	 * @param structArray - The StructArray the struct is stored in
	 * @param index - The index of the struct in the StructArray.
	 */
	constructor(structArray: StructArray, index: number);
}
type StructArrayMember = {
	name: string;
	type: ViewType;
	components: number;
	offset: number;
};
type SerializedStructArray = {
	length: number;
	arrayBuffer: ArrayBuffer;
};
declare abstract class StructArray {
	capacity: number;
	length: number;
	isTransferred: boolean;
	arrayBuffer: ArrayBuffer;
	uint8: Uint8Array;
	members: Array<StructArrayMember>;
	bytesPerElement: number;
	abstract emplaceBack(...v: number[]): any;
	abstract emplace(i: number, ...v: number[]): any;
	constructor();
	/**
	 * Serialize a StructArray instance.  Serializes both the raw data and the
	 * metadata needed to reconstruct the StructArray base class during
	 * deserialization.
	 */
	static serialize(array: StructArray, transferables?: Array<Transferable>): SerializedStructArray;
	static deserialize(input: SerializedStructArray): any;
	/**
	 * Resize the array to discard unused capacity.
	 */
	_trim(): void;
	/**
	 * Resets the length of the array to 0 without de-allocating capacity.
	 */
	clear(): void;
	/**
	 * Resize the array.
	 * If `n` is greater than the current length then additional elements with undefined values are added.
	 * If `n` is less than the current length then the array will be reduced to the first `n` elements.
	 * @param n - The new size of the array.
	 */
	resize(n: number): void;
	/**
	 * Indicate a planned increase in size, so that any necessary allocation may
	 * be done once, ahead of time.
	 * @param n - The expected size of the array.
	 */
	reserve(n: number): void;
	/**
	 * Create TypedArray views for the current ArrayBuffer.
	 */
	_refreshViews(): void;
}
declare class StructArrayLayout2i4 extends StructArray {
	uint8: Uint8Array;
	int16: Int16Array;
	_refreshViews(): void;
	emplaceBack(v0: number, v1: number): number;
	emplace(i: number, v0: number, v1: number): number;
}
declare class StructArrayLayout3i6 extends StructArray {
	uint8: Uint8Array;
	int16: Int16Array;
	_refreshViews(): void;
	emplaceBack(v0: number, v1: number, v2: number): number;
	emplace(i: number, v0: number, v1: number, v2: number): number;
}
declare class StructArrayLayout2i4i12 extends StructArray {
	uint8: Uint8Array;
	int16: Int16Array;
	_refreshViews(): void;
	emplaceBack(v0: number, v1: number, v2: number, v3: number, v4: number, v5: number): number;
	emplace(i: number, v0: number, v1: number, v2: number, v3: number, v4: number, v5: number): number;
}
declare class StructArrayLayout2i4ub8 extends StructArray {
	uint8: Uint8Array;
	int16: Int16Array;
	_refreshViews(): void;
	emplaceBack(v0: number, v1: number, v2: number, v3: number, v4: number, v5: number): number;
	emplace(i: number, v0: number, v1: number, v2: number, v3: number, v4: number, v5: number): number;
}
declare class StructArrayLayout2f8 extends StructArray {
	uint8: Uint8Array;
	float32: Float32Array;
	_refreshViews(): void;
	emplaceBack(v0: number, v1: number): number;
	emplace(i: number, v0: number, v1: number): number;
}
declare class StructArrayLayout4i4ui4i24 extends StructArray {
	uint8: Uint8Array;
	int16: Int16Array;
	uint16: Uint16Array;
	_refreshViews(): void;
	emplaceBack(v0: number, v1: number, v2: number, v3: number, v4: number, v5: number, v6: number, v7: number, v8: number, v9: number, v10: number, v11: number): number;
	emplace(i: number, v0: number, v1: number, v2: number, v3: number, v4: number, v5: number, v6: number, v7: number, v8: number, v9: number, v10: number, v11: number): number;
}
declare class StructArrayLayout3f12 extends StructArray {
	uint8: Uint8Array;
	float32: Float32Array;
	_refreshViews(): void;
	emplaceBack(v0: number, v1: number, v2: number): number;
	emplace(i: number, v0: number, v1: number, v2: number): number;
}
declare class StructArrayLayout1ul4 extends StructArray {
	uint8: Uint8Array;
	uint32: Uint32Array;
	_refreshViews(): void;
	emplaceBack(v0: number): number;
	emplace(i: number, v0: number): number;
}
declare class StructArrayLayout6i1ul2ui20 extends StructArray {
	uint8: Uint8Array;
	int16: Int16Array;
	uint32: Uint32Array;
	uint16: Uint16Array;
	_refreshViews(): void;
	emplaceBack(v0: number, v1: number, v2: number, v3: number, v4: number, v5: number, v6: number, v7: number, v8: number): number;
	emplace(i: number, v0: number, v1: number, v2: number, v3: number, v4: number, v5: number, v6: number, v7: number, v8: number): number;
}
declare class StructArrayLayout2ub2f2i16 extends StructArray {
	uint8: Uint8Array;
	float32: Float32Array;
	int16: Int16Array;
	_refreshViews(): void;
	emplaceBack(v0: number, v1: number, v2: number, v3: number, v4: number, v5: number): number;
	emplace(i: number, v0: number, v1: number, v2: number, v3: number, v4: number, v5: number): number;
}
declare class StructArrayLayout3ui6 extends StructArray {
	uint8: Uint8Array;
	uint16: Uint16Array;
	_refreshViews(): void;
	emplaceBack(v0: number, v1: number, v2: number): number;
	emplace(i: number, v0: number, v1: number, v2: number): number;
}
declare class StructArrayLayout2i2ui3ul3ui2f3ub1ul1i48 extends StructArray {
	uint8: Uint8Array;
	int16: Int16Array;
	uint16: Uint16Array;
	uint32: Uint32Array;
	float32: Float32Array;
	_refreshViews(): void;
	emplaceBack(v0: number, v1: number, v2: number, v3: number, v4: number, v5: number, v6: number, v7: number, v8: number, v9: number, v10: number, v11: number, v12: number, v13: number, v14: number, v15: number, v16: number): number;
	emplace(i: number, v0: number, v1: number, v2: number, v3: number, v4: number, v5: number, v6: number, v7: number, v8: number, v9: number, v10: number, v11: number, v12: number, v13: number, v14: number, v15: number, v16: number): number;
}
declare class StructArrayLayout8i15ui1ul2f2ui64 extends StructArray {
	uint8: Uint8Array;
	int16: Int16Array;
	uint16: Uint16Array;
	uint32: Uint32Array;
	float32: Float32Array;
	_refreshViews(): void;
	emplaceBack(v0: number, v1: number, v2: number, v3: number, v4: number, v5: number, v6: number, v7: number, v8: number, v9: number, v10: number, v11: number, v12: number, v13: number, v14: number, v15: number, v16: number, v17: number, v18: number, v19: number, v20: number, v21: number, v22: number, v23: number, v24: number, v25: number, v26: number, v27: number): number;
	emplace(i: number, v0: number, v1: number, v2: number, v3: number, v4: number, v5: number, v6: number, v7: number, v8: number, v9: number, v10: number, v11: number, v12: number, v13: number, v14: number, v15: number, v16: number, v17: number, v18: number, v19: number, v20: number, v21: number, v22: number, v23: number, v24: number, v25: number, v26: number, v27: number): number;
}
declare class StructArrayLayout1f4 extends StructArray {
	uint8: Uint8Array;
	float32: Float32Array;
	_refreshViews(): void;
	emplaceBack(v0: number): number;
	emplace(i: number, v0: number): number;
}
declare class StructArrayLayout1ui2f12 extends StructArray {
	uint8: Uint8Array;
	uint16: Uint16Array;
	float32: Float32Array;
	_refreshViews(): void;
	emplaceBack(v0: number, v1: number, v2: number): number;
	emplace(i: number, v0: number, v1: number, v2: number): number;
}
declare class StructArrayLayout1ul2ui8 extends StructArray {
	uint8: Uint8Array;
	uint32: Uint32Array;
	uint16: Uint16Array;
	_refreshViews(): void;
	emplaceBack(v0: number, v1: number, v2: number): number;
	emplace(i: number, v0: number, v1: number, v2: number): number;
}
declare class StructArrayLayout2ui4 extends StructArray {
	uint8: Uint8Array;
	uint16: Uint16Array;
	_refreshViews(): void;
	emplaceBack(v0: number, v1: number): number;
	emplace(i: number, v0: number, v1: number): number;
}
declare class StructArrayLayout1ui2 extends StructArray {
	uint8: Uint8Array;
	uint16: Uint16Array;
	_refreshViews(): void;
	emplaceBack(v0: number): number;
	emplace(i: number, v0: number): number;
}
declare class CollisionBoxStruct extends Struct {
	_structArray: CollisionBoxArray;
	get anchorPointX(): number;
	get anchorPointY(): number;
	get x1(): number;
	get y1(): number;
	get x2(): number;
	get y2(): number;
	get featureIndex(): number;
	get sourceLayerIndex(): number;
	get bucketIndex(): number;
	get anchorPoint(): Point;
}
declare class CollisionBoxArray extends StructArrayLayout6i1ul2ui20 {
	/**
	 * Return the CollisionBoxStruct at the given location in the array.
	 * @param index - The index of the element.
	 */
	get(index: number): CollisionBoxStruct;
}
declare class PlacedSymbolStruct extends Struct {
	_structArray: PlacedSymbolArray;
	get anchorX(): number;
	get anchorY(): number;
	get glyphStartIndex(): number;
	get numGlyphs(): number;
	get vertexStartIndex(): number;
	get lineStartIndex(): number;
	get lineLength(): number;
	get segment(): number;
	get lowerSize(): number;
	get upperSize(): number;
	get lineOffsetX(): number;
	get lineOffsetY(): number;
	get writingMode(): number;
	get placedOrientation(): number;
	set placedOrientation(x: number);
	get hidden(): number;
	set hidden(x: number);
	get crossTileID(): number;
	set crossTileID(x: number);
	get associatedIconIndex(): number;
}
declare class PlacedSymbolArray extends StructArrayLayout2i2ui3ul3ui2f3ub1ul1i48 {
	/**
	 * Return the PlacedSymbolStruct at the given location in the array.
	 * @param index - The index of the element.
	 */
	get(index: number): PlacedSymbolStruct;
}
declare class SymbolInstanceStruct extends Struct {
	_structArray: SymbolInstanceArray;
	get anchorX(): number;
	get anchorY(): number;
	get rightJustifiedTextSymbolIndex(): number;
	get centerJustifiedTextSymbolIndex(): number;
	get leftJustifiedTextSymbolIndex(): number;
	get verticalPlacedTextSymbolIndex(): number;
	get placedIconSymbolIndex(): number;
	get verticalPlacedIconSymbolIndex(): number;
	get key(): number;
	get textBoxStartIndex(): number;
	get textBoxEndIndex(): number;
	get verticalTextBoxStartIndex(): number;
	get verticalTextBoxEndIndex(): number;
	get iconBoxStartIndex(): number;
	get iconBoxEndIndex(): number;
	get verticalIconBoxStartIndex(): number;
	get verticalIconBoxEndIndex(): number;
	get featureIndex(): number;
	get numHorizontalGlyphVertices(): number;
	get numVerticalGlyphVertices(): number;
	get numIconVertices(): number;
	get numVerticalIconVertices(): number;
	get useRuntimeCollisionCircles(): number;
	get crossTileID(): number;
	set crossTileID(x: number);
	get textBoxScale(): number;
	get collisionCircleDiameter(): number;
	get textAnchorOffsetStartIndex(): number;
	get textAnchorOffsetEndIndex(): number;
}
type SymbolInstance = SymbolInstanceStruct;
declare class SymbolInstanceArray extends StructArrayLayout8i15ui1ul2f2ui64 {
	/**
	 * Return the SymbolInstanceStruct at the given location in the array.
	 * @param index - The index of the element.
	 */
	get(index: number): SymbolInstanceStruct;
}
declare class GlyphOffsetArray extends StructArrayLayout1f4 {
	getoffsetX(index: number): number;
}
declare class SymbolLineVertexArray extends StructArrayLayout3i6 {
	getx(index: number): number;
	gety(index: number): number;
	gettileUnitDistanceFromAnchor(index: number): number;
}
declare class TextAnchorOffsetStruct extends Struct {
	_structArray: TextAnchorOffsetArray;
	get textAnchor(): number;
	get textOffset0(): number;
	get textOffset1(): number;
}
type TextAnchorOffset = TextAnchorOffsetStruct;
declare class TextAnchorOffsetArray extends StructArrayLayout1ui2f12 {
	/**
	 * Return the TextAnchorOffsetStruct at the given location in the array.
	 * @param index - The index of the element.
	 */
	get(index: number): TextAnchorOffsetStruct;
}
declare class FeatureIndexStruct extends Struct {
	_structArray: FeatureIndexArray;
	get featureIndex(): number;
	get sourceLayerIndex(): number;
	get bucketIndex(): number;
}
declare class FeatureIndexArray extends StructArrayLayout1ul2ui8 {
	/**
	 * Return the FeatureIndexStruct at the given location in the array.
	 * @param index - The index of the element.
	 */
	get(index: number): FeatureIndexStruct;
}
declare class PosArray extends StructArrayLayout2i4 {
}
declare class CircleLayoutArray extends StructArrayLayout2i4 {
}
declare class FillLayoutArray extends StructArrayLayout2i4 {
}
declare class FillExtrusionLayoutArray extends StructArrayLayout2i4i12 {
}
declare class LineLayoutArray extends StructArrayLayout2i4ub8 {
}
declare class LineExtLayoutArray extends StructArrayLayout2f8 {
}
declare class SymbolLayoutArray extends StructArrayLayout4i4ui4i24 {
}
declare class SymbolDynamicLayoutArray extends StructArrayLayout3f12 {
}
declare class SymbolOpacityArray extends StructArrayLayout1ul4 {
}
declare class CollisionVertexArray extends StructArrayLayout2ub2f2i16 {
}
declare class TriangleIndexArray extends StructArrayLayout3ui6 {
}
declare class LineIndexArray extends StructArrayLayout2ui4 {
}
declare class LineStripIndexArray extends StructArrayLayout1ui2 {
}
type LngLatLike = LngLat | {
	lng: number;
	lat: number;
} | {
	lon: number;
	lat: number;
} | [
	number,
	number
];
declare class LngLat {
	/**
	 * Longitude, measured in degrees.
	 */
	lng: number;
	/**
	 * Latitude, measured in degrees.
	 */
	lat: number;
	/**
	 * @param lng - Longitude, measured in degrees.
	 * @param lat - Latitude, measured in degrees.
	 */
	constructor(lng: number, lat: number);
	/**
	 * Returns a new `LngLat` object whose longitude is wrapped to the range (-180, 180).
	 *
	 * @returns The wrapped `LngLat` object.
	 * @example
	 * ```ts
	 * let ll = new LngLat(286.0251, 40.7736);
	 * let wrapped = ll.wrap();
	 * wrapped.lng; // = -73.9749
	 * ```
	 */
	wrap(): LngLat;
	/**
	 * Returns the coordinates represented as an array of two numbers.
	 *
	 * @returns The coordinates represented as an array of longitude and latitude.
	 * @example
	 * ```ts
	 * let ll = new LngLat(-73.9749, 40.7736);
	 * ll.toArray(); // = [-73.9749, 40.7736]
	 * ```
	 */
	toArray(): [
		number,
		number
	];
	/**
	 * Returns the coordinates represent as a string.
	 *
	 * @returns The coordinates represented as a string of the format `'LngLat(lng, lat)'`.
	 * @example
	 * ```ts
	 * let ll = new LngLat(-73.9749, 40.7736);
	 * ll.toString(); // = "LngLat(-73.9749, 40.7736)"
	 * ```
	 */
	toString(): string;
	/**
	 * Returns the approximate distance between a pair of coordinates in meters
	 * Uses the Haversine Formula (from R.W. Sinnott, "Virtues of the Haversine", Sky and Telescope, vol. 68, no. 2, 1984, p. 159)
	 *
	 * @param lngLat - coordinates to compute the distance to
	 * @returns Distance in meters between the two coordinates.
	 * @example
	 * ```ts
	 * let new_york = new LngLat(-74.0060, 40.7128);
	 * let los_angeles = new LngLat(-118.2437, 34.0522);
	 * new_york.distanceTo(los_angeles); // = 3935751.690893987, "true distance" using a non-spherical approximation is ~3966km
	 * ```
	 */
	distanceTo(lngLat: LngLat): number;
	/**
	 * Converts an array of two numbers or an object with `lng` and `lat` or `lon` and `lat` properties
	 * to a `LngLat` object.
	 *
	 * If a `LngLat` object is passed in, the function returns it unchanged.
	 *
	 * @param input - An array of two numbers or object to convert, or a `LngLat` object to return.
	 * @returns A new `LngLat` object, if a conversion occurred, or the original `LngLat` object.
	 * @example
	 * ```ts
	 * let arr = [-73.9749, 40.7736];
	 * let ll = LngLat.convert(arr);
	 * ll;   // = LngLat {lng: -73.9749, lat: 40.7736}
	 * ```
	 */
	static convert(input: LngLatLike): LngLat;
}
declare class MercatorCoordinate implements IMercatorCoordinate {
	x: number;
	y: number;
	z: number;
	/**
	 * @param x - The x component of the position.
	 * @param y - The y component of the position.
	 * @param z - The z component of the position.
	 */
	constructor(x: number, y: number, z?: number);
	/**
	 * Project a `LngLat` to a `MercatorCoordinate`.
	 *
	 * @param lngLatLike - The location to project.
	 * @param altitude - The altitude in meters of the position.
	 * @returns The projected mercator coordinate.
	 * @example
	 * ```ts
	 * let coord = MercatorCoordinate.fromLngLat({ lng: 0, lat: 0}, 0);
	 * coord; // MercatorCoordinate(0.5, 0.5, 0)
	 * ```
	 */
	static fromLngLat(lngLatLike: LngLatLike, altitude?: number): MercatorCoordinate;
	/**
	 * Returns the `LngLat` for the coordinate.
	 *
	 * @returns The `LngLat` object.
	 * @example
	 * ```ts
	 * let coord = new MercatorCoordinate(0.5, 0.5, 0);
	 * let lngLat = coord.toLngLat(); // LngLat(0, 0)
	 * ```
	 */
	toLngLat(): LngLat;
	/**
	 * Returns the altitude in meters of the coordinate.
	 *
	 * @returns The altitude in meters.
	 * @example
	 * ```ts
	 * let coord = new MercatorCoordinate(0, 0, 0.02);
	 * coord.toAltitude(); // 6914.281956295339
	 * ```
	 */
	toAltitude(): number;
	/**
	 * Returns the distance of 1 meter in `MercatorCoordinate` units at this latitude.
	 *
	 * For coordinates in real world units using meters, this naturally provides the scale
	 * to transform into `MercatorCoordinate`s.
	 *
	 * @returns Distance of 1 meter in `MercatorCoordinate` units.
	 */
	meterInMercatorCoordinateUnits(): number;
}
declare class CanonicalTileID implements ICanonicalTileID {
	z: number;
	x: number;
	y: number;
	key: string;
	constructor(z: number, x: number, y: number);
	equals(id: ICanonicalTileID): boolean;
	url(urls: Array<string>, pixelRatio: number, scheme?: string | null): string;
	isChildOf(parent: ICanonicalTileID): boolean;
	getTilePoint(coord: IMercatorCoordinate): Point;
	toString(): string;
}
declare class UnwrappedTileID {
	wrap: number;
	canonical: CanonicalTileID;
	key: string;
	constructor(wrap: number, canonical: CanonicalTileID);
}
declare class OverscaledTileID {
	overscaledZ: number;
	wrap: number;
	canonical: CanonicalTileID;
	key: string;
	/**
	 * This matrix is used during terrain's render-to-texture stage only.
	 * If the render-to-texture stage is active, this matrix will be present
	 * and should be used, otherwise this matrix will be null.
	 * The matrix should be float32 in order to avoid slow WebGL calls in Chrome.
	 */
	terrainRttPosMatrix32f: mat4 | null;
	constructor(overscaledZ: number, wrap: number, z: number, x: number, y: number);
	clone(): OverscaledTileID;
	equals(id: OverscaledTileID): boolean;
	scaledTo(targetZ: number): OverscaledTileID;
	calculateScaledKey(targetZ: number, withWrap: boolean): string;
	isChildOf(parent: OverscaledTileID): boolean;
	children(sourceMaxZoom: number): OverscaledTileID[];
	isLessThan(rhs: OverscaledTileID): boolean;
	wrapped(): OverscaledTileID;
	unwrapTo(wrap: number): OverscaledTileID;
	overscaleFactor(): number;
	toUnwrapped(): UnwrappedTileID;
	toString(): string;
	getTilePoint(coord: MercatorCoordinate): Point;
}
type Listener = (a: any) => any;
type Listeners = {
	[_: string]: Array<Listener>;
};
declare class Event$1 {
	readonly type: string;
	constructor(type: string, data?: any);
}
declare class Evented {
	_listeners: Listeners;
	_oneTimeListeners: Listeners;
	_eventedParent: Evented;
	_eventedParentData: any | (() => any);
	/**
	 * Adds a listener to a specified event type.
	 *
	 * @param type - The event type to add a listen for.
	 * @param listener - The function to be called when the event is fired.
	 * The listener function is called with the data object passed to `fire`,
	 * extended with `target` and `type` properties.
	 */
	on(type: string, listener: Listener): Subscription;
	/**
	 * Removes a previously registered event listener.
	 *
	 * @param type - The event type to remove listeners for.
	 * @param listener - The listener function to remove.
	 */
	off(type: string, listener: Listener): this;
	/**
	 * Adds a listener that will be called only once to a specified event type.
	 *
	 * The listener will be called first time the event fires after the listener is registered.
	 *
	 * @param type - The event type to listen for.
	 * @param listener - The function to be called when the event is fired the first time.
	 * @returns `this` or a promise if a listener is not provided
	 */
	once(type: string, listener?: Listener): this | Promise<any>;
	fire(event: Event$1 | string, properties?: any): this;
	/**
	 * Returns a true if this instance of Evented or any forwardeed instances of Evented have a listener for the specified type.
	 *
	 * @param type - The event type
	 * @returns `true` if there is at least one registered listener for specified event type, `false` otherwise
	 */
	listens(type: string): boolean;
	/**
	 * Bubble all events fired by this instance of Evented to this parent instance of Evented.
	 */
	setEventedParent(parent?: Evented | null, data?: any | (() => any)): this;
}
declare class ZoomHistory {
	lastZoom: number;
	lastFloorZoom: number;
	lastIntegerZoom: number;
	lastIntegerZoomTime: number;
	first: boolean;
	constructor();
	update(z: number, now: number): boolean;
}
type CrossfadeParameters = {
	fromScale: number;
	toScale: number;
	t: number;
};
declare class EvaluationParameters {
	zoom: number;
	now: number;
	fadeDuration: number;
	zoomHistory: ZoomHistory;
	transition: TransitionSpecification;
	globalState: Record<string, any>;
	constructor(zoom: number, options?: any);
	isSupportedScript(str: string): boolean;
	crossFadingFactor(): number;
	getCrossfadeParameters(): CrossfadeParameters;
}
type TimePoint = number;
type CrossFaded<T> = {
	to: T;
	from: T;
};
interface Property<T, R> {
	specification: StylePropertySpecification;
	possiblyEvaluate(value: PropertyValue<T, R>, parameters: EvaluationParameters, canonical?: CanonicalTileID, availableImages?: Array<string>): R;
	interpolate(a: R, b: R, t: number): R;
}
declare class PropertyValue<T, R> {
	property: Property<T, R>;
	value: PropertyValueSpecification<T> | void;
	expression: StylePropertyExpression;
	constructor(property: Property<T, R>, value: PropertyValueSpecification<T> | void);
	isDataDriven(): boolean;
	getGlobalStateRefs(): Set<string>;
	possiblyEvaluate(parameters: EvaluationParameters, canonical?: CanonicalTileID, availableImages?: Array<string>): R;
}
type TransitionParameters = {
	now: TimePoint;
	transition: TransitionSpecification;
};
declare class TransitionablePropertyValue<T, R> {
	property: Property<T, R>;
	value: PropertyValue<T, R>;
	transition: TransitionSpecification | void;
	constructor(property: Property<T, R>);
	transitioned(parameters: TransitionParameters, prior: TransitioningPropertyValue<T, R>): TransitioningPropertyValue<T, R>;
	untransitioned(): TransitioningPropertyValue<T, R>;
}
declare class Transitionable<Props> {
	_properties: Properties<Props>;
	_values: {
		[K in keyof Props]: TransitionablePropertyValue<any, unknown>;
	};
	constructor(properties: Properties<Props>);
	getValue<S extends keyof Props, T>(name: S): PropertyValueSpecification<T> | void;
	setValue<S extends keyof Props, T>(name: S, value: PropertyValueSpecification<T> | void): void;
	getTransition<S extends keyof Props>(name: S): TransitionSpecification | void;
	setTransition<S extends keyof Props>(name: S, value: TransitionSpecification | void): void;
	serialize(): any;
	transitioned(parameters: TransitionParameters, prior: Transitioning<Props>): Transitioning<Props>;
	untransitioned(): Transitioning<Props>;
}
declare class TransitioningPropertyValue<T, R> {
	property: Property<T, R>;
	value: PropertyValue<T, R>;
	prior: TransitioningPropertyValue<T, R>;
	begin: TimePoint;
	end: TimePoint;
	constructor(property: Property<T, R>, value: PropertyValue<T, R>, prior: TransitioningPropertyValue<T, R>, transition: TransitionSpecification, now: TimePoint);
	possiblyEvaluate(parameters: EvaluationParameters, canonical: CanonicalTileID, availableImages: Array<string>): R;
}
declare class Transitioning<Props> {
	_properties: Properties<Props>;
	_values: {
		[K in keyof Props]: PossiblyEvaluatedPropertyValue<unknown>;
	};
	constructor(properties: Properties<Props>);
	possiblyEvaluate(parameters: EvaluationParameters, canonical?: CanonicalTileID, availableImages?: Array<string>): PossiblyEvaluated<Props, any>;
	hasTransition(): boolean;
}
declare class Layout<Props> {
	_properties: Properties<Props>;
	_values: {
		[K in keyof Props]: PropertyValue<any, PossiblyEvaluatedPropertyValue<any>>;
	};
	constructor(properties: Properties<Props>);
	hasValue<S extends keyof Props>(name: S): boolean;
	getValue<S extends keyof Props>(name: S): any;
	setValue<S extends keyof Props>(name: S, value: any): void;
	serialize(): any;
	possiblyEvaluate(parameters: EvaluationParameters, canonical?: CanonicalTileID, availableImages?: Array<string>): PossiblyEvaluated<Props, any>;
}
type PossiblyEvaluatedValue<T> = {
	kind: "constant";
	value: T;
} | SourceExpression | CompositeExpression;
declare class PossiblyEvaluatedPropertyValue<T> {
	property: DataDrivenProperty<T>;
	value: PossiblyEvaluatedValue<T>;
	parameters: EvaluationParameters;
	constructor(property: DataDrivenProperty<T>, value: PossiblyEvaluatedValue<T>, parameters: EvaluationParameters);
	isConstant(): boolean;
	constantOr(value: T): T;
	evaluate(feature: Feature$2, featureState: FeatureState, canonical?: CanonicalTileID, availableImages?: Array<string>): T;
}
declare class PossiblyEvaluated<Props, PossibleEvaluatedProps> {
	_properties: Properties<Props>;
	_values: PossibleEvaluatedProps;
	constructor(properties: Properties<Props>);
	get<S extends keyof PossibleEvaluatedProps>(name: S): PossibleEvaluatedProps[S];
}
declare class DataConstantProperty<T> implements Property<T, T> {
	specification: StylePropertySpecification;
	constructor(specification: StylePropertySpecification);
	possiblyEvaluate(value: PropertyValue<T, T>, parameters: EvaluationParameters): T;
	interpolate(a: T, b: T, t: number): T;
}
declare class DataDrivenProperty<T> implements Property<T, PossiblyEvaluatedPropertyValue<T>> {
	specification: StylePropertySpecification;
	overrides: any;
	constructor(specification: StylePropertySpecification, overrides?: any);
	possiblyEvaluate(value: PropertyValue<T, PossiblyEvaluatedPropertyValue<T>>, parameters: EvaluationParameters, canonical?: CanonicalTileID, availableImages?: Array<string>): PossiblyEvaluatedPropertyValue<T>;
	interpolate(a: PossiblyEvaluatedPropertyValue<T>, b: PossiblyEvaluatedPropertyValue<T>, t: number): PossiblyEvaluatedPropertyValue<T>;
	evaluate(value: PossiblyEvaluatedValue<T>, parameters: EvaluationParameters, feature: Feature$2, featureState: FeatureState, canonical?: CanonicalTileID, availableImages?: Array<string>): T;
}
declare class CrossFadedDataDrivenProperty<T> extends DataDrivenProperty<CrossFaded<T>> {
	possiblyEvaluate(value: PropertyValue<CrossFaded<T>, PossiblyEvaluatedPropertyValue<CrossFaded<T>>>, parameters: EvaluationParameters, canonical?: CanonicalTileID, availableImages?: Array<string>): PossiblyEvaluatedPropertyValue<CrossFaded<T>>;
	evaluate(value: PossiblyEvaluatedValue<CrossFaded<T>>, globals: EvaluationParameters, feature: Feature$2, featureState: FeatureState, canonical?: CanonicalTileID, availableImages?: Array<string>): CrossFaded<T>;
	_calculate(min: T, mid: T, max: T, parameters: EvaluationParameters): CrossFaded<T>;
	interpolate(a: PossiblyEvaluatedPropertyValue<CrossFaded<T>>): PossiblyEvaluatedPropertyValue<CrossFaded<T>>;
}
declare class CrossFadedProperty<T> implements Property<T, CrossFaded<T>> {
	specification: StylePropertySpecification;
	constructor(specification: StylePropertySpecification);
	possiblyEvaluate(value: PropertyValue<T, CrossFaded<T>>, parameters: EvaluationParameters, canonical?: CanonicalTileID, availableImages?: Array<string>): CrossFaded<T>;
	_calculate(min: T, mid: T, max: T, parameters: EvaluationParameters): CrossFaded<T>;
	interpolate(a?: CrossFaded<T> | null): CrossFaded<T>;
}
declare class ColorRampProperty implements Property<Color$1, boolean> {
	specification: StylePropertySpecification;
	constructor(specification: StylePropertySpecification);
	possiblyEvaluate(value: PropertyValue<Color$1, boolean>, parameters: EvaluationParameters, canonical?: CanonicalTileID, availableImages?: Array<string>): boolean;
	interpolate(): boolean;
}
declare class Properties<Props> {
	properties: Props;
	defaultPropertyValues: {
		[K in keyof Props]: PropertyValue<unknown, any>;
	};
	defaultTransitionablePropertyValues: {
		[K in keyof Props]: TransitionablePropertyValue<unknown, unknown>;
	};
	defaultTransitioningPropertyValues: {
		[K in keyof Props]: TransitioningPropertyValue<unknown, unknown>;
	};
	defaultPossiblyEvaluatedValues: {
		[K in keyof Props]: PossiblyEvaluatedPropertyValue<unknown>;
	};
	overridableProperties: Array<string>;
	constructor(properties: Props);
}
type Size = {
	width: number;
	height: number;
};
type Point2D$1 = {
	x: number;
	y: number;
};
declare class AlphaImage {
	width: number;
	height: number;
	data: Uint8Array;
	constructor(size: Size, data?: Uint8Array | Uint8ClampedArray);
	resize(size: Size): void;
	clone(): AlphaImage;
	static copy(srcImg: AlphaImage, dstImg: AlphaImage, srcPt: Point2D$1, dstPt: Point2D$1, size: Size): void;
}
declare class RGBAImage {
	width: number;
	height: number;
	/**
	 * data must be a Uint8Array instead of Uint8ClampedArray because texImage2D does not support Uint8ClampedArray in all browsers.
	 */
	data: Uint8Array;
	constructor(size: Size, data?: Uint8Array | Uint8ClampedArray);
	resize(size: Size): void;
	replace(data: Uint8Array | Uint8ClampedArray, copy?: boolean): void;
	clone(): RGBAImage;
	static copy(srcImg: RGBAImage | ImageData, dstImg: RGBAImage, srcPt: Point2D$1, dstPt: Point2D$1, size: Size): void;
	setPixel(row: number, col: number, value: Color$1): void;
}
type SpriteOnDemandStyleImage = {
	width: number;
	height: number;
	x: number;
	y: number;
	context: CanvasRenderingContext2D;
};
type StyleImageData = {
	data: RGBAImage;
	version?: number;
	hasRenderCallback?: boolean;
	userImage?: StyleImageInterface;
	spriteData?: SpriteOnDemandStyleImage;
};
declare const enum TextFit {
	/**
	 * The image will be resized on the specified axis to tightly fit the content rectangle to target text.
	 * This is the same as not being defined.
	 */
	stretchOrShrink = "stretchOrShrink",
	/**
	 * The image will be resized on the specified axis to fit the content rectangle to the target text, but will not
	 * fall below the aspect ratio of the original content rectangle if the other axis is set to proportional.
	 */
	stretchOnly = "stretchOnly",
	/**
	 * The image will be resized on the specified axis to fit the content rectangle to the target text and
	 * will resize the other axis to maintain the aspect ratio of the content rectangle.
	 */
	proportional = "proportional"
}
type StyleImageMetadata = {
	/**
	 * The ratio of pixels in the image to physical pixels on the screen
	 */
	pixelRatio: number;
	/**
	 * Whether the image should be interpreted as an SDF image
	 */
	sdf: boolean;
	/**
	 * If `icon-text-fit` is used in a layer with this image, this option defines the part(s) of the image that can be stretched horizontally.
	 */
	stretchX?: Array<[
		number,
		number
	]>;
	/**
	 * If `icon-text-fit` is used in a layer with this image, this option defines the part(s) of the image that can be stretched vertically.
	 */
	stretchY?: Array<[
		number,
		number
	]>;
	/**
	 * If `icon-text-fit` is used in a layer with this image, this option defines the part of the image that can be covered by the content in `text-field`.
	 */
	content?: [
		number,
		number,
		number,
		number
	];
	/**
	 * If `icon-text-fit` is used in a layer with this image, this option defines constraints on the horizontal scaling of the image.
	 */
	textFitWidth?: TextFit;
	/**
	 * If `icon-text-fit` is used in a layer with this image, this option defines constraints on the vertical scaling of the image.
	 */
	textFitHeight?: TextFit;
};
type StyleImage = StyleImageData & StyleImageMetadata;
declare class IndexBuffer {
	context: Context;
	buffer: WebGLBuffer;
	dynamicDraw: boolean;
	constructor(context: Context, array: TriangleIndexArray | LineIndexArray | LineStripIndexArray, dynamicDraw?: boolean);
	bind(): void;
	updateData(array: StructArray): void;
	destroy(): void;
}
type PreparedShader = {
	fragmentSource: string;
	vertexSource: string;
	staticAttributes: Array<string>;
	staticUniforms: Array<string>;
};
type SerializedFeaturePositionMap = {
	ids: Float64Array;
	positions: Uint32Array;
};
type FeaturePosition = {
	index: number;
	start: number;
	end: number;
};
declare class FeaturePositionMap {
	ids: Array<number>;
	positions: Array<number>;
	indexed: boolean;
	constructor();
	add(id: unknown, index: number, start: number, end: number): void;
	getPositions(id: unknown): Array<FeaturePosition>;
	static serialize(map: FeaturePositionMap, transferables: Array<ArrayBuffer>): SerializedFeaturePositionMap;
	static deserialize(obj: SerializedFeaturePositionMap): FeaturePositionMap;
}
type UniformLocations = {
	[_: string]: WebGLUniformLocation;
};
declare abstract class Uniform<T> {
	gl: WebGLRenderingContext | WebGL2RenderingContext;
	location: WebGLUniformLocation;
	current: T;
	constructor(context: Context, location: WebGLUniformLocation);
	abstract set(v: T): void;
}
declare class VertexArrayObject {
	context: Context;
	boundProgram: Program<any>;
	boundLayoutVertexBuffer: VertexBuffer;
	boundPaintVertexBuffers: Array<VertexBuffer>;
	boundIndexBuffer: IndexBuffer;
	boundVertexOffset: number;
	boundDynamicVertexBuffer: VertexBuffer;
	boundDynamicVertexBuffer2: VertexBuffer;
	boundDynamicVertexBuffer3: VertexBuffer;
	vao: any;
	constructor();
	bind(context: Context, program: Program<any>, layoutVertexBuffer: VertexBuffer, paintVertexBuffers: Array<VertexBuffer>, indexBuffer?: IndexBuffer | null, vertexOffset?: number | null, dynamicVertexBuffer?: VertexBuffer | null, dynamicVertexBuffer2?: VertexBuffer | null, dynamicVertexBuffer3?: VertexBuffer | null): void;
	freshBind(program: Program<any>, layoutVertexBuffer: VertexBuffer, paintVertexBuffers: Array<VertexBuffer>, indexBuffer?: IndexBuffer | null, vertexOffset?: number | null, dynamicVertexBuffer?: VertexBuffer | null, dynamicVertexBuffer2?: VertexBuffer | null, dynamicVertexBuffer3?: VertexBuffer | null): void;
	destroy(): void;
}
type Segment = {
	sortKey?: number;
	vertexOffset: number;
	primitiveOffset: number;
	vertexLength: number;
	primitiveLength: number;
	vaos: {
		[_: string]: VertexArrayObject;
	};
};
declare class SegmentVector {
	static MAX_VERTEX_ARRAY_LENGTH: number;
	segments: Array<Segment>;
	private _forceNewSegmentOnNextPrepare;
	constructor(segments?: Array<Segment>);
	/**
	 * Returns the last segment if `numVertices` fits into it.
	 * If there are no segments yet or `numVertices` doesn't fit into the last one, creates a new empty segment and returns it.
	 */
	prepareSegment(numVertices: number, layoutVertexArray: StructArray, indexArray: StructArray, sortKey?: number): Segment;
	/**
	 * Creates a new empty segment and returns it.
	 */
	createNewSegment(layoutVertexArray: StructArray, indexArray: StructArray, sortKey?: number): Segment;
	/**
	 * Returns the last segment, or creates a new segments if there are no segments yet.
	 */
	getOrCreateLatestSegment(layoutVertexArray: StructArray, indexArray: StructArray, sortKey?: number): Segment;
	/**
	 * Causes the next call to {@link prepareSegment} to always return a new segment,
	 * not reusing the current segment even if the new geometry would fit it.
	 */
	forceNewSegmentOnNextPrepare(): void;
	get(): Segment[];
	destroy(): void;
	static simpleSegment(vertexOffset: number, primitiveOffset: number, vertexLength: number, primitiveLength: number): SegmentVector;
}
declare class HeatmapBucket extends CircleBucket<HeatmapStyleLayer> {
	layers: Array<HeatmapStyleLayer>;
}
type HeatmapPaintProps = {
	"heatmap-radius": DataDrivenProperty<number>;
	"heatmap-weight": DataDrivenProperty<number>;
	"heatmap-intensity": DataConstantProperty<number>;
	"heatmap-color": ColorRampProperty;
	"heatmap-opacity": DataConstantProperty<number>;
};
type HeatmapPaintPropsPossiblyEvaluated = {
	"heatmap-radius": PossiblyEvaluatedPropertyValue<number>;
	"heatmap-weight": PossiblyEvaluatedPropertyValue<number>;
	"heatmap-intensity": number;
	"heatmap-color": ColorRampProperty;
	"heatmap-opacity": number;
};
type BlendFuncConstant = WebGLRenderingContextBase["ZERO"] | WebGLRenderingContextBase["ONE"] | WebGLRenderingContextBase["SRC_COLOR"] | WebGLRenderingContextBase["ONE_MINUS_SRC_COLOR"] | WebGLRenderingContextBase["DST_COLOR"] | WebGLRenderingContextBase["ONE_MINUS_DST_COLOR"] | WebGLRenderingContextBase["SRC_ALPHA"] | WebGLRenderingContextBase["ONE_MINUS_SRC_ALPHA"] | WebGLRenderingContextBase["DST_ALPHA"] | WebGLRenderingContextBase["ONE_MINUS_DST_ALPHA"] | WebGLRenderingContextBase["CONSTANT_COLOR"] | WebGLRenderingContextBase["ONE_MINUS_CONSTANT_COLOR"] | WebGLRenderingContextBase["CONSTANT_ALPHA"] | WebGLRenderingContextBase["ONE_MINUS_CONSTANT_ALPHA"] | WebGLRenderingContextBase["BLEND_COLOR"];
type BlendFuncType = [
	BlendFuncConstant,
	BlendFuncConstant
];
type BlendEquationType = WebGLRenderingContextBase["FUNC_ADD"] | WebGLRenderingContextBase["FUNC_SUBTRACT"] | WebGLRenderingContextBase["FUNC_REVERSE_SUBTRACT"];
type ColorMaskType = [
	boolean,
	boolean,
	boolean,
	boolean
];
type CompareFuncType = WebGLRenderingContextBase["NEVER"] | WebGLRenderingContextBase["LESS"] | WebGLRenderingContextBase["EQUAL"] | WebGLRenderingContextBase["LEQUAL"] | WebGLRenderingContextBase["GREATER"] | WebGLRenderingContextBase["NOTEQUAL"] | WebGLRenderingContextBase["GEQUAL"] | WebGLRenderingContextBase["ALWAYS"];
type DepthMaskType = boolean;
type DepthRangeType = [
	number,
	number
];
type DepthFuncType = CompareFuncType;
type StencilFuncType = {
	func: CompareFuncType;
	ref: number;
	mask: number;
};
type StencilOpConstant = WebGLRenderingContextBase["KEEP"] | WebGLRenderingContextBase["ZERO"] | WebGLRenderingContextBase["REPLACE"] | WebGLRenderingContextBase["INCR"] | WebGLRenderingContextBase["INCR_WRAP"] | WebGLRenderingContextBase["DECR"] | WebGLRenderingContextBase["DECR_WRAP"] | WebGLRenderingContextBase["INVERT"];
type StencilOpType = [
	StencilOpConstant,
	StencilOpConstant,
	StencilOpConstant
];
type TextureUnitType = number;
type ViewportType = [
	number,
	number,
	number,
	number
];
type StencilTestGL = {
	func: WebGLRenderingContextBase["NEVER"];
	mask: 0;
} | {
	func: WebGLRenderingContextBase["LESS"];
	mask: number;
} | {
	func: WebGLRenderingContextBase["EQUAL"];
	mask: number;
} | {
	func: WebGLRenderingContextBase["LEQUAL"];
	mask: number;
} | {
	func: WebGLRenderingContextBase["GREATER"];
	mask: number;
} | {
	func: WebGLRenderingContextBase["NOTEQUAL"];
	mask: number;
} | {
	func: WebGLRenderingContextBase["GEQUAL"];
	mask: number;
} | {
	func: WebGLRenderingContextBase["ALWAYS"];
	mask: 0;
};
type CullFaceModeType = WebGLRenderingContextBase["FRONT"] | WebGLRenderingContextBase["BACK"] | WebGLRenderingContextBase["FRONT_AND_BACK"];
type FrontFaceType = WebGLRenderingContextBase["CW"] | WebGLRenderingContextBase["CCW"];
interface IValue<T> {
	current: T;
	default: T;
	dirty: boolean;
	get(): T;
	setDefault(): void;
	set(value: T): void;
}
declare class BaseValue<T> implements IValue<T> {
	gl: WebGLRenderingContext | WebGL2RenderingContext;
	current: T;
	default: T;
	dirty: boolean;
	constructor(context: Context);
	get(): T;
	set(value: T): void;
	getDefault(): T;
	setDefault(): void;
}
declare class ClearColor extends BaseValue<Color$1> {
	getDefault(): Color$1;
	set(v: Color$1): void;
}
declare class ClearDepth extends BaseValue<number> {
	getDefault(): number;
	set(v: number): void;
}
declare class ClearStencil extends BaseValue<number> {
	getDefault(): number;
	set(v: number): void;
}
declare class ColorMask extends BaseValue<ColorMaskType> {
	getDefault(): ColorMaskType;
	set(v: ColorMaskType): void;
}
declare class DepthMask extends BaseValue<DepthMaskType> {
	getDefault(): DepthMaskType;
	set(v: DepthMaskType): void;
}
declare class StencilMask extends BaseValue<number> {
	getDefault(): number;
	set(v: number): void;
}
declare class StencilFunc extends BaseValue<StencilFuncType> {
	getDefault(): StencilFuncType;
	set(v: StencilFuncType): void;
}
declare class StencilOp extends BaseValue<StencilOpType> {
	getDefault(): StencilOpType;
	set(v: StencilOpType): void;
}
declare class StencilTest extends BaseValue<boolean> {
	getDefault(): boolean;
	set(v: boolean): void;
}
declare class DepthRange extends BaseValue<DepthRangeType> {
	getDefault(): DepthRangeType;
	set(v: DepthRangeType): void;
}
declare class DepthTest extends BaseValue<boolean> {
	getDefault(): boolean;
	set(v: boolean): void;
}
declare class DepthFunc extends BaseValue<DepthFuncType> {
	getDefault(): DepthFuncType;
	set(v: DepthFuncType): void;
}
declare class Blend extends BaseValue<boolean> {
	getDefault(): boolean;
	set(v: boolean): void;
}
declare class BlendFunc extends BaseValue<BlendFuncType> {
	getDefault(): BlendFuncType;
	set(v: BlendFuncType): void;
}
declare class BlendColor extends BaseValue<Color$1> {
	getDefault(): Color$1;
	set(v: Color$1): void;
}
declare class BlendEquation extends BaseValue<BlendEquationType> {
	getDefault(): BlendEquationType;
	set(v: BlendEquationType): void;
}
declare class CullFace extends BaseValue<boolean> {
	getDefault(): boolean;
	set(v: boolean): void;
}
declare class CullFaceSide extends BaseValue<CullFaceModeType> {
	getDefault(): CullFaceModeType;
	set(v: CullFaceModeType): void;
}
declare class FrontFace extends BaseValue<FrontFaceType> {
	getDefault(): FrontFaceType;
	set(v: FrontFaceType): void;
}
declare class ProgramValue extends BaseValue<WebGLProgram> {
	getDefault(): WebGLProgram;
	set(v?: WebGLProgram | null): void;
}
declare class ActiveTextureUnit extends BaseValue<TextureUnitType> {
	getDefault(): TextureUnitType;
	set(v: TextureUnitType): void;
}
declare class Viewport extends BaseValue<ViewportType> {
	getDefault(): ViewportType;
	set(v: ViewportType): void;
}
declare class BindFramebuffer extends BaseValue<WebGLFramebuffer> {
	getDefault(): WebGLFramebuffer;
	set(v?: WebGLFramebuffer | null): void;
}
declare class BindRenderbuffer extends BaseValue<WebGLRenderbuffer> {
	getDefault(): WebGLRenderbuffer;
	set(v?: WebGLRenderbuffer | null): void;
}
declare class BindTexture extends BaseValue<WebGLTexture> {
	getDefault(): WebGLTexture;
	set(v?: WebGLTexture | null): void;
}
declare class BindVertexBuffer extends BaseValue<WebGLBuffer> {
	getDefault(): WebGLBuffer;
	set(v?: WebGLBuffer | null): void;
}
declare class BindElementBuffer extends BaseValue<WebGLBuffer> {
	getDefault(): WebGLBuffer;
	set(v?: WebGLBuffer | null): void;
}
declare class BindVertexArray extends BaseValue<WebGLVertexArrayObject | null> {
	getDefault(): WebGLVertexArrayObject | null;
	set(v: WebGLVertexArrayObject | null): void;
}
declare class PixelStoreUnpack extends BaseValue<number> {
	getDefault(): number;
	set(v: number): void;
}
declare class PixelStoreUnpackPremultiplyAlpha extends BaseValue<boolean> {
	getDefault(): boolean;
	set(v: boolean): void;
}
declare class PixelStoreUnpackFlipY extends BaseValue<boolean> {
	getDefault(): boolean;
	set(v: boolean): void;
}
declare class FramebufferAttachment<T> extends BaseValue<T> {
	parent: WebGLFramebuffer;
	context: Context;
	constructor(context: Context, parent: WebGLFramebuffer);
	getDefault(): any;
}
declare class ColorAttachment extends FramebufferAttachment<WebGLTexture> {
	setDirty(): void;
	set(v?: WebGLTexture | null): void;
}
declare class DepthAttachment extends FramebufferAttachment<WebGLRenderbuffer> {
	set(v?: WebGLRenderbuffer | null): void;
}
declare class Framebuffer {
	context: Context;
	width: number;
	height: number;
	framebuffer: WebGLFramebuffer;
	colorAttachment: ColorAttachment;
	depthAttachment: DepthAttachment;
	constructor(context: Context, width: number, height: number, hasDepth: boolean, hasStencil: boolean);
	destroy(): void;
}
declare class HeatmapStyleLayer extends StyleLayer {
	heatmapFbos: Map<string, Framebuffer>;
	colorRamp: RGBAImage;
	colorRampTexture: Texture$1;
	_transitionablePaint: Transitionable<HeatmapPaintProps>;
	_transitioningPaint: Transitioning<HeatmapPaintProps>;
	paint: PossiblyEvaluated<HeatmapPaintProps, HeatmapPaintPropsPossiblyEvaluated>;
	createBucket(options: any): HeatmapBucket;
	constructor(layer: LayerSpecification);
	_handleSpecialPaintPropertyUpdate(name: string): void;
	_updateColorRamp(): void;
	resize(): void;
	queryRadius(): number;
	queryIntersectsFeature(): boolean;
	hasOffscreenPass(): boolean;
}
type SerializedGrid = {
	buffer: ArrayBuffer;
};
declare class TransferableGridIndex {
	cells: number[][];
	arrayBuffer: ArrayBuffer;
	d: number;
	keys: number[];
	bboxes: number[];
	n: number;
	extent: number;
	padding: number;
	scale: any;
	uid: number;
	min: number;
	max: number;
	constructor(extent: number | ArrayBuffer, n?: number, padding?: number);
	insert(key: number, x1: number, y1: number, x2: number, y2: number): void;
	_insertReadonly(): void;
	_insertCell(x1: number, y1: number, x2: number, y2: number, cellIndex: number, uid: number): void;
	query(x1: number, y1: number, x2: number, y2: number, intersectionTest?: Function): number[];
	_queryCell(x1: number, y1: number, x2: number, y2: number, cellIndex: number, result: any, seenUids: any, intersectionTest: Function): void;
	_forEachCell(x1: number, y1: number, x2: number, y2: number, fn: Function, arg1: any, arg2: any, intersectionTest: any): void;
	_convertFromCellCoord(x: any): number;
	_convertToCellCoord(x: any): number;
	toArrayBuffer(): ArrayBuffer;
	static serialize(grid: TransferableGridIndex, transferables?: Array<Transferable>): SerializedGrid;
	static deserialize(serialized: SerializedGrid): TransferableGridIndex;
}
declare class DictionaryCoder {
	_stringToNumber: {
		[_: string]: number;
	};
	_numberToString: Array<string>;
	constructor(strings: Array<string>);
	encode(string: string): number;
	decode(n: number): string;
}
type DistributiveKeys<T> = T extends T ? keyof T : never;
type DistributiveOmit<T, K extends DistributiveKeys<T>> = T extends unknown ? Omit<T, K> : never;
type MapGeoJSONFeature = GeoJSONFeature & {
	layer: DistributiveOmit<LayerSpecification, "source"> & {
		source: string;
	};
	source: string;
	sourceLayer?: string;
	state: {
		[key: string]: any;
	};
};
declare class GeoJSONFeature {
	type: "Feature";
	_geometry: Geometry$1;
	properties: {
		[name: string]: any;
	};
	id: number | string | undefined;
	_vectorTileFeature: VectorTileFeature;
	constructor(vectorTileFeature: VectorTileFeature, z: number, x: number, y: number, id: string | number | undefined);
	get geometry(): Geometry$1;
	set geometry(g: Geometry$1);
	toJSON(): any;
}
type LngLatBoundsLike = LngLatBounds | [
	LngLatLike,
	LngLatLike
] | [
	number,
	number,
	number,
	number
];
declare class LngLatBounds {
	_ne: LngLat;
	_sw: LngLat;
	/**
	 * @param sw - The southwest corner of the bounding box.
	 * OR array of 4 numbers in the order of  west, south, east, north
	 * OR array of 2 LngLatLike: [sw,ne]
	 * @param ne - The northeast corner of the bounding box.
	 * @example
	 * ```ts
	 * let sw = new LngLat(-73.9876, 40.7661);
	 * let ne = new LngLat(-73.9397, 40.8002);
	 * let llb = new LngLatBounds(sw, ne);
	 * ```
	 * OR
	 * ```ts
	 * let llb = new LngLatBounds([-73.9876, 40.7661, -73.9397, 40.8002]);
	 * ```
	 * OR
	 * ```ts
	 * let llb = new LngLatBounds([sw, ne]);
	 * ```
	 */
	constructor(sw?: LngLatLike | [
		number,
		number,
		number,
		number
	] | [
		LngLatLike,
		LngLatLike
	], ne?: LngLatLike);
	/**
	 * Set the northeast corner of the bounding box
	 *
	 * @param ne - a {@link LngLatLike} object describing the northeast corner of the bounding box.
	 */
	setNorthEast(ne: LngLatLike): this;
	/**
	 * Set the southwest corner of the bounding box
	 *
	 * @param sw - a {@link LngLatLike} object describing the southwest corner of the bounding box.
	 */
	setSouthWest(sw: LngLatLike): this;
	/**
	 * Extend the bounds to include a given LngLatLike or LngLatBoundsLike.
	 *
	 * @param obj - object to extend to
	 */
	extend(obj: LngLatLike | LngLatBoundsLike): this;
	/**
	 * Returns the geographical coordinate equidistant from the bounding box's corners.
	 *
	 * @returns The bounding box's center.
	 * @example
	 * ```ts
	 * let llb = new LngLatBounds([-73.9876, 40.7661], [-73.9397, 40.8002]);
	 * llb.getCenter(); // = LngLat {lng: -73.96365, lat: 40.78315}
	 * ```
	 */
	getCenter(): LngLat;
	/**
	 * Returns the southwest corner of the bounding box.
	 *
	 * @returns The southwest corner of the bounding box.
	 */
	getSouthWest(): LngLat;
	/**
	 * Returns the northeast corner of the bounding box.
	 *
	 * @returns The northeast corner of the bounding box.
	 */
	getNorthEast(): LngLat;
	/**
	 * Returns the northwest corner of the bounding box.
	 *
	 * @returns The northwest corner of the bounding box.
	 */
	getNorthWest(): LngLat;
	/**
	 * Returns the southeast corner of the bounding box.
	 *
	 * @returns The southeast corner of the bounding box.
	 */
	getSouthEast(): LngLat;
	/**
	 * Returns the west edge of the bounding box.
	 *
	 * @returns The west edge of the bounding box.
	 */
	getWest(): number;
	/**
	 * Returns the south edge of the bounding box.
	 *
	 * @returns The south edge of the bounding box.
	 */
	getSouth(): number;
	/**
	 * Returns the east edge of the bounding box.
	 *
	 * @returns The east edge of the bounding box.
	 */
	getEast(): number;
	/**
	 * Returns the north edge of the bounding box.
	 *
	 * @returns The north edge of the bounding box.
	 */
	getNorth(): number;
	/**
	 * Returns the bounding box represented as an array.
	 *
	 * @returns The bounding box represented as an array, consisting of the
	 * southwest and northeast coordinates of the bounding represented as arrays of numbers.
	 * @example
	 * ```ts
	 * let llb = new LngLatBounds([-73.9876, 40.7661], [-73.9397, 40.8002]);
	 * llb.toArray(); // = [[-73.9876, 40.7661], [-73.9397, 40.8002]]
	 * ```
	 */
	toArray(): [
		number,
		number
	][];
	/**
	 * Return the bounding box represented as a string.
	 *
	 * @returns The bounding box represents as a string of the format
	 * `'LngLatBounds(LngLat(lng, lat), LngLat(lng, lat))'`.
	 * @example
	 * ```ts
	 * let llb = new LngLatBounds([-73.9876, 40.7661], [-73.9397, 40.8002]);
	 * llb.toString(); // = "LngLatBounds(LngLat(-73.9876, 40.7661), LngLat(-73.9397, 40.8002))"
	 * ```
	 */
	toString(): string;
	/**
	 * Check if the bounding box is an empty/`null`-type box.
	 *
	 * @returns True if bounds have been defined, otherwise false.
	 */
	isEmpty(): boolean;
	/**
	 * Check if the point is within the bounding box.
	 *
	 * @param lnglat - geographic point to check against.
	 * @returns `true` if the point is within the bounding box.
	 * @example
	 * ```ts
	 * let llb = new LngLatBounds(
	 *   new LngLat(-73.9876, 40.7661),
	 *   new LngLat(-73.9397, 40.8002)
	 * );
	 *
	 * let ll = new LngLat(-73.9567, 40.7789);
	 *
	 * console.log(llb.contains(ll)); // = true
	 * ```
	 */
	contains(lnglat: LngLatLike): boolean;
	/**
	 * Converts an array to a `LngLatBounds` object.
	 *
	 * If a `LngLatBounds` object is passed in, the function returns it unchanged.
	 *
	 * Internally, the function calls `LngLat#convert` to convert arrays to `LngLat` values.
	 *
	 * @param input - An array of two coordinates to convert, or a `LngLatBounds` object to return.
	 * @returns A new `LngLatBounds` object, if a conversion occurred, or the original `LngLatBounds` object.
	 * @example
	 * ```ts
	 * let arr = [[-73.9876, 40.7661], [-73.9397, 40.8002]];
	 * let llb = LngLatBounds.convert(arr); // = LngLatBounds {_sw: LngLat {lng: -73.9876, lat: 40.7661}, _ne: LngLat {lng: -73.9397, lat: 40.8002}}
	 * ```
	 */
	static convert(input: LngLatBoundsLike | null): LngLatBounds;
	/**
	 * Returns a `LngLatBounds` from the coordinates extended by a given `radius`. The returned `LngLatBounds` completely contains the `radius`.
	 *
	 * @param center - center coordinates of the new bounds.
	 * @param radius - Distance in meters from the coordinates to extend the bounds.
	 * @returns A new `LngLatBounds` object representing the coordinates extended by the `radius`.
	 * @example
	 * ```ts
	 * let center = new LngLat(-73.9749, 40.7736);
	 * LngLatBounds.fromLngLat(100).toArray(); // = [[-73.97501862141328, 40.77351016847229], [-73.97478137858673, 40.77368983152771]]
	 * ```
	 */
	static fromLngLat(center: LngLat, radius?: number): LngLatBounds;
	/**
	 * Adjusts the given bounds to handle the case where the bounds cross the 180th meridian (antimeridian).
	 *
	 * @returns The adjusted LngLatBounds
	 * @example
	 * ```ts
	 * let bounds = new LngLatBounds([175.813127, -20.157768], [-178. 340903, -15.449124]);
	 * let adjustedBounds = bounds.adjustAntiMeridian();
	 * // adjustedBounds will be: [[175.813127, -20.157768], [181.659097, -15.449124]]
	 * ```
	 */
	adjustAntiMeridian(): LngLatBounds;
}
type PaddingOptions = RequireAtLeastOne<{
	/**
	 * Padding in pixels from the top of the map canvas.
	 */
	top: number;
	/**
	 * Padding in pixels from the bottom of the map canvas.
	 */
	bottom: number;
	/**
	 * Padding in pixels from the left of the map canvas.
	 */
	right: number;
	/**
	 * Padding in pixels from the right of the map canvas.
	 */
	left: number;
}>;
declare class TileCache {
	max: number;
	data: {
		[key: string]: Array<{
			value: Tile;
			timeout: ReturnType<typeof setTimeout>;
		}>;
	};
	order: Array<string>;
	onRemove: (element: Tile) => void;
	/**
	 * @param max - number of permitted values
	 * @param onRemove - callback called with items when they expire
	 */
	constructor(max: number, onRemove: (element: Tile) => void);
	/**
	 * Clear the cache
	 *
	 * @returns this cache
	 */
	reset(): this;
	/**
	 * Add a key, value combination to the cache, trimming its size if this pushes
	 * it over max length.
	 *
	 * @param tileID - lookup key for the item
	 * @param data - tile data
	 *
	 * @returns this cache
	 */
	add(tileID: OverscaledTileID, data: Tile, expiryTimeout: number | void): this;
	/**
	 * Determine whether the value attached to `key` is present
	 *
	 * @param tileID - the key to be looked-up
	 * @returns whether the cache has this value
	 */
	has(tileID: OverscaledTileID): boolean;
	/**
	 * Get the value attached to a specific key and remove data from cache.
	 * If the key is not found, returns `null`
	 *
	 * @param tileID - the key to look up
	 * @returns the tile data, or null if it isn't found
	 */
	getAndRemove(tileID: OverscaledTileID): Tile;
	_getAndRemoveByKey(key: string): Tile;
	getByKey(key: string): Tile;
	/**
	 * Get the value attached to a specific key without removing data
	 * from the cache. If the key is not found, returns `null`
	 *
	 * @param tileID - the key to look up
	 * @returns the tile data, or null if it isn't found
	 */
	get(tileID: OverscaledTileID): Tile;
	/**
	 * Remove a key/value combination from the cache.
	 *
	 * @param tileID - the key for the pair to delete
	 * @param value - If a value is provided, remove that exact version of the value.
	 * @returns this cache
	 */
	remove(tileID: OverscaledTileID, value?: {
		value: Tile;
		timeout: ReturnType<typeof setTimeout>;
	}): this;
	/**
	 * Change the max size of the cache.
	 *
	 * @param max - the max size of the cache
	 * @returns this cache
	 */
	setMaxSize(max: number): TileCache;
	/**
	 * Remove entries that do not pass a filter function. Used for removing
	 * stale tiles from the cache.
	 *
	 * @param filterFn - Determines whether the tile is filtered. If the supplied function returns false, the tile will be filtered out.
	 */
	filter(filterFn: (tile: Tile) => boolean): void;
}
declare class WorkerPool {
	static workerCount: number;
	active: {
		[_ in number | string]: boolean;
	};
	workers: Array<ActorTarget>;
	constructor();
	acquire(mapId: number | string): Array<ActorTarget>;
	release(mapId: number | string): void;
	isPreloaded(): boolean;
	numActive(): number;
}
declare class Dispatcher {
	workerPool: WorkerPool;
	actors: Array<Actor>;
	currentActor: number;
	id: string | number;
	constructor(workerPool: WorkerPool, mapId: string | number);
	/**
	 * Broadcast a message to all Workers.
	 */
	broadcast<T extends MessageType>(type: T, data: RequestResponseMessageMap[T][0]): Promise<RequestResponseMessageMap[T][1][]>;
	/**
	 * Acquires an actor to dispatch messages to. The actors are distributed in round-robin fashion.
	 * @returns An actor object backed by a web worker for processing messages.
	 */
	getActor(): Actor;
	remove(mapRemoved?: boolean): void;
	registerMessageHandler<T extends MessageType>(type: T, handler: MessageHandler<T>): void;
}
type CanonicalTileRange = {
	minTileX: number;
	minTileY: number;
	maxTileX: number;
	maxTileY: number;
};
type CanvasSourceSpecification = {
	/**
	 * Source type. Must be `"canvas"`.
	 */
	type: "canvas";
	/**
	 * Four geographical coordinates denoting where to place the corners of the canvas, specified in `[longitude, latitude]` pairs.
	 */
	coordinates: [
		[
			number,
			number
		],
		[
			number,
			number
		],
		[
			number,
			number
		],
		[
			number,
			number
		]
	];
	/**
	 * Whether the canvas source is animated. If the canvas is static (i.e. pixels do not need to be re-read on every frame), `animate` should be set to `false` to improve performance.
	 * @defaultValue true
	 */
	animate?: boolean;
	/**
	 * Canvas source from which to read pixels. Can be a string representing the ID of the canvas element, or the `HTMLCanvasElement` itself.
	 */
	canvas?: string | HTMLCanvasElement;
};
declare const enum IntersectionResult {
	None = 0,
	Partial = 1,
	Full = 2
}
interface IBoundingVolume {
	/**
	 * Performs an intersection test with a frustum.
	 */
	intersectsFrustum(frustum: Frustum): IntersectionResult;
	/**
	 * Performs an intersection test with a half-space defined by a plane equation.
	 * The half-space is assumed to lie on the positive side of the plane.
	 */
	intersectsPlane(plane: vec4): IntersectionResult;
}
declare class Aabb implements IBoundingVolume {
	min: vec3;
	max: vec3;
	center: vec3;
	constructor(min_: vec3, max_: vec3);
	quadrant(index: number): Aabb;
	distanceX(point: Array<number>): number;
	distanceY(point: Array<number>): number;
	/**
	 * Performs a frustum-aabb intersection test.
	 */
	intersectsFrustum(frustum: Frustum): IntersectionResult;
	/**
	 * Performs a halfspace-aabb intersection test.
	 */
	intersectsPlane(plane: vec4): IntersectionResult;
}
declare class Frustum {
	points: vec4[];
	planes: vec4[];
	aabb: Aabb;
	constructor(points: vec4[], planes: vec4[], aabb: Aabb);
	static fromInvProjectionMatrix(invProj: mat4, worldSize?: number, zoom?: number, horizonPlane?: vec4, flippedNearFar?: boolean): Frustum;
}
type CoveringZoomOptions = {
	/**
	 * Whether to round or floor the target zoom level. If true, the value will be rounded to the closest integer. Otherwise the value will be floored.
	 */
	roundZoom?: boolean;
	/**
	 * Tile size, expressed in screen pixels.
	 */
	tileSize: number;
};
type CoveringTilesOptions = CoveringZoomOptions & {
	/**
	 * Smallest allowed tile zoom.
	 */
	minzoom?: number;
	/**
	 * Largest allowed tile zoom.
	 */
	maxzoom?: number;
	/**
	 * `true` if tiles should be sent back to the worker for each overzoomed zoom level, `false` if not.
	 * Fill this option when computing covering tiles for a source.
	 * When true, any tile at `maxzoom` level that should be overscaled to a greater zoom will have
	 * its zoom set to the overscaled greater zoom. When false, such tiles will have zoom set to `maxzoom`.
	 */
	reparseOverscaled?: boolean;
	/**
	 * When terrain is present, tile visibility will be computed in regards to the min and max elevations for each tile.
	 */
	terrain?: Terrain;
	/**
	 * Optional function to redefine how tiles are loaded at high pitch angles.
	 */
	calculateTileZoom?: CalculateTileZoomFunction;
};
type CalculateTileZoomFunction = (requestedCenterZoom: number, distanceToTile2D: number, distanceToTileZ: number, distanceToCenter3D: number, cameraVerticalFOV: number) => number;
type TileResult = {
	tile: Tile;
	tileID: OverscaledTileID;
	queryGeometry: Array<Point>;
	cameraQueryGeometry: Array<Point>;
	scale: number;
};
declare class SourceCache extends Evented {
	id: string;
	dispatcher: Dispatcher;
	map: Map$1;
	style: Style$1;
	_source: Source;
	/**
	 * @internal
	 * signifies that the TileJSON is loaded if applicable.
	 * if the source type does not come with a TileJSON, the flag signifies the
	 * source data has loaded (i.e geojson has been tiled on the worker and is ready)
	 */
	_sourceLoaded: boolean;
	_sourceErrored: boolean;
	_tiles: {
		[_: string]: Tile;
	};
	_prevLng: number;
	_cache: TileCache;
	_timers: {
		[_ in any]: ReturnType<typeof setTimeout>;
	};
	_cacheTimers: {
		[_ in any]: ReturnType<typeof setTimeout>;
	};
	_maxTileCacheSize: number;
	_maxTileCacheZoomLevels: number;
	_paused: boolean;
	_shouldReloadOnResume: boolean;
	_coveredTiles: {
		[_: string]: boolean;
	};
	transform: ITransform;
	terrain: Terrain;
	used: boolean;
	usedForTerrain: boolean;
	tileSize: number;
	_state: SourceFeatureState;
	_loadedParentTiles: {
		[_: string]: Tile;
	};
	_loadedSiblingTiles: {
		[_: string]: Tile;
	};
	_didEmitContent: boolean;
	_updated: boolean;
	static maxUnderzooming: number;
	static maxOverzooming: number;
	constructor(id: string, options: SourceSpecification | CanvasSourceSpecification, dispatcher: Dispatcher);
	onAdd(map: Map$1): void;
	onRemove(map: Map$1): void;
	/**
	 * Return true if no tile data is pending, tiles will not change unless
	 * an additional API call is received.
	 */
	loaded(): boolean;
	getSource(): Source;
	pause(): void;
	resume(): void;
	_loadTile(tile: Tile, id: string, state: TileState): Promise<void>;
	_unloadTile(tile: Tile): void;
	_abortTile(tile: Tile): void;
	serialize(): any;
	prepare(context: Context): void;
	/**
	 * Return all tile ids ordered with z-order, and cast to numbers
	 */
	getIds(): Array<string>;
	getRenderableIds(symbolLayer?: boolean): Array<string>;
	hasRenderableParent(tileID: OverscaledTileID): boolean;
	_isIdRenderable(id: string, symbolLayer?: boolean): boolean;
	reload(sourceDataChanged?: boolean): void;
	_reloadTile(id: string, state: TileState): Promise<void>;
	_tileLoaded(tile: Tile, id: string, previousState: TileState): void;
	/**
	 * For raster terrain source, backfill DEM to eliminate visible tile boundaries
	 */
	_backfillDEM(tile: Tile): void;
	/**
	 * Get a specific tile by TileID
	 */
	getTile(tileID: OverscaledTileID): Tile;
	/**
	 * Get a specific tile by id
	 */
	getTileByID(id: string): Tile;
	/**
	 * For a given set of tiles, retain children that are loaded and have a zoom
	 * between `zoom` (exclusive) and `maxCoveringZoom` (inclusive)
	 */
	_retainLoadedChildren(idealTiles: {
		[_ in any]: OverscaledTileID;
	}, zoom: number, maxCoveringZoom: number, retain: {
		[_ in any]: OverscaledTileID;
	}): void;
	/**
	 * Find a loaded parent of the given tile (up to minCoveringZoom)
	 */
	findLoadedParent(tileID: OverscaledTileID, minCoveringZoom: number): Tile;
	/**
	 * Find a loaded sibling of the given tile
	 */
	findLoadedSibling(tileID: OverscaledTileID): Tile;
	_getLoadedTile(tileID: OverscaledTileID): Tile;
	/**
	 * Resizes the tile cache based on the current viewport's size
	 * or the maxTileCacheSize option passed during map creation
	 *
	 * Larger viewports use more tiles and need larger caches. Larger viewports
	 * are more likely to be found on devices with more memory and on pages where
	 * the map is more important.
	 */
	updateCacheSize(transform: IReadonlyTransform): void;
	handleWrapJump(lng: number): void;
	_updateCoveredAndRetainedTiles(retain: {
		[_: string]: OverscaledTileID;
	}, minCoveringZoom: number, maxCoveringZoom: number, zoom: number, idealTileIDs: OverscaledTileID[], terrain?: Terrain): void;
	/**
	 * Removes tiles that are outside the viewport and adds new tiles that
	 * are inside the viewport.
	 */
	update(transform: ITransform, terrain?: Terrain): void;
	releaseSymbolFadeTiles(): void;
	_updateRetainedTiles(idealTileIDs: Array<OverscaledTileID>, zoom: number): {
		[_: string]: OverscaledTileID;
	};
	_updateLoadedParentTileCache(): void;
	/**
	 * Update the cache of loaded sibling tiles
	 *
	 * Sibling tiles are tiles that share the same zoom level and
	 * x/y position but have different wrap values
	 * Maintaining sibling tile cache allows fading from old to new tiles
	 * of the same position and zoom level
	 */
	_updateLoadedSiblingTileCache(): void;
	/**
	 * Add a tile, given its coordinate, to the pyramid.
	 */
	_addTile(tileID: OverscaledTileID): Tile;
	_setTileReloadTimer(id: string, tile: Tile): void;
	/**
	 * Reload any currently renderable tiles that are match one of the incoming `tileId` x/y/z
	 */
	refreshTiles(tileIds: Array<ICanonicalTileID>): void;
	/**
	 * Remove a tile, given its id, from the pyramid
	 */
	_removeTile(id: string): void;
	/** @internal */
	private _dataHandler;
	/**
	 * Remove all tiles from this pyramid
	 */
	clearTiles(): void;
	/**
	 * Search through our current tiles and attempt to find the tiles that
	 * cover the given bounds.
	 * @param pointQueryGeometry - coordinates of the corners of bounding rectangle
	 * @returns result items have `{tile, minX, maxX, minY, maxY}`, where min/max bounding values are the given bounds transformed in into the coordinate space of this tile.
	 */
	tilesIn(pointQueryGeometry: Array<Point>, maxPitchScaleFactor: number, has3DLayer: boolean): TileResult[];
	private transformBbox;
	getVisibleCoordinates(symbolLayer?: boolean): Array<OverscaledTileID>;
	hasTransition(): boolean;
	/**
	 * Set the value of a particular state for a feature
	 */
	setFeatureState(sourceLayer: string, featureId: number | string, state: any): void;
	/**
	 * Resets the value of a particular state key for a feature
	 */
	removeFeatureState(sourceLayer?: string, featureId?: number | string, key?: string): void;
	/**
	 * Get the entire state object for a feature
	 */
	getFeatureState(sourceLayer: string, featureId: number | string): import("@maplibre/maplibre-gl-style-spec").FeatureState;
	/**
	 * Sets the set of keys that the tile depends on. This allows tiles to
	 * be reloaded when their dependencies change.
	 */
	setDependencies(tileKey: string, namespace: string, dependencies: Array<string>): void;
	/**
	 * Reloads all tiles that depend on the given keys.
	 */
	reloadTilesForDependencies(namespaces: Array<string>, keys: Array<string>): void;
}
type GlyphMetrics = {
	width: number;
	height: number;
	left: number;
	top: number;
	advance: number;
	/**
	 * isDoubleResolution = true for 48px textures
	 */
	isDoubleResolution?: boolean;
};
type StyleGlyph = {
	id: number;
	bitmap: AlphaImage;
	metrics: GlyphMetrics;
};
type Rect = {
	x: number;
	y: number;
	w: number;
	h: number;
};
type GlyphPosition = {
	rect: Rect;
	metrics: GlyphMetrics;
};
type GlyphPositions = {
	[_: string]: {
		[_: number]: GlyphPosition;
	};
};
declare enum WritingMode {
	none = 0,
	horizontal = 1,
	vertical = 2,
	horizontalOnly = 3
}
declare class Anchor extends Point {
	angle: any;
	segment?: number;
	constructor(x: number, y: number, angle: number, segment?: number);
	clone(): Anchor;
}
type SymbolLayoutProps = {
	"symbol-placement": DataConstantProperty<"point" | "line" | "line-center">;
	"symbol-spacing": DataConstantProperty<number>;
	"symbol-avoid-edges": DataConstantProperty<boolean>;
	"symbol-sort-key": DataDrivenProperty<number>;
	"symbol-z-order": DataConstantProperty<"auto" | "viewport-y" | "source">;
	"icon-allow-overlap": DataConstantProperty<boolean>;
	"icon-overlap": DataConstantProperty<"never" | "always" | "cooperative">;
	"icon-ignore-placement": DataConstantProperty<boolean>;
	"icon-optional": DataConstantProperty<boolean>;
	"icon-rotation-alignment": DataConstantProperty<"map" | "viewport" | "auto">;
	"icon-size": DataDrivenProperty<number>;
	"icon-text-fit": DataConstantProperty<"none" | "width" | "height" | "both">;
	"icon-text-fit-padding": DataConstantProperty<[
		number,
		number,
		number,
		number
	]>;
	"icon-image": DataDrivenProperty<ResolvedImage>;
	"icon-rotate": DataDrivenProperty<number>;
	"icon-padding": DataDrivenProperty<Padding>;
	"icon-keep-upright": DataConstantProperty<boolean>;
	"icon-offset": DataDrivenProperty<[
		number,
		number
	]>;
	"icon-anchor": DataDrivenProperty<"center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right">;
	"icon-pitch-alignment": DataConstantProperty<"map" | "viewport" | "auto">;
	"text-pitch-alignment": DataConstantProperty<"map" | "viewport" | "auto">;
	"text-rotation-alignment": DataConstantProperty<"map" | "viewport" | "viewport-glyph" | "auto">;
	"text-field": DataDrivenProperty<Formatted>;
	"text-font": DataDrivenProperty<Array<string>>;
	"text-size": DataDrivenProperty<number>;
	"text-max-width": DataDrivenProperty<number>;
	"text-line-height": DataConstantProperty<number>;
	"text-letter-spacing": DataDrivenProperty<number>;
	"text-justify": DataDrivenProperty<"auto" | "left" | "center" | "right">;
	"text-radial-offset": DataDrivenProperty<number>;
	"text-variable-anchor": DataConstantProperty<Array<"center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right">>;
	"text-variable-anchor-offset": DataDrivenProperty<VariableAnchorOffsetCollection>;
	"text-anchor": DataDrivenProperty<"center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right">;
	"text-max-angle": DataConstantProperty<number>;
	"text-writing-mode": DataConstantProperty<Array<"horizontal" | "vertical">>;
	"text-rotate": DataDrivenProperty<number>;
	"text-padding": DataConstantProperty<number>;
	"text-keep-upright": DataConstantProperty<boolean>;
	"text-transform": DataDrivenProperty<"none" | "uppercase" | "lowercase">;
	"text-offset": DataDrivenProperty<[
		number,
		number
	]>;
	"text-allow-overlap": DataConstantProperty<boolean>;
	"text-overlap": DataConstantProperty<"never" | "always" | "cooperative">;
	"text-ignore-placement": DataConstantProperty<boolean>;
	"text-optional": DataConstantProperty<boolean>;
};
type SymbolLayoutPropsPossiblyEvaluated = {
	"symbol-placement": "point" | "line" | "line-center";
	"symbol-spacing": number;
	"symbol-avoid-edges": boolean;
	"symbol-sort-key": PossiblyEvaluatedPropertyValue<number>;
	"symbol-z-order": "auto" | "viewport-y" | "source";
	"icon-allow-overlap": boolean;
	"icon-overlap": "never" | "always" | "cooperative";
	"icon-ignore-placement": boolean;
	"icon-optional": boolean;
	"icon-rotation-alignment": "map" | "viewport" | "auto";
	"icon-size": PossiblyEvaluatedPropertyValue<number>;
	"icon-text-fit": "none" | "width" | "height" | "both";
	"icon-text-fit-padding": [
		number,
		number,
		number,
		number
	];
	"icon-image": PossiblyEvaluatedPropertyValue<ResolvedImage>;
	"icon-rotate": PossiblyEvaluatedPropertyValue<number>;
	"icon-padding": PossiblyEvaluatedPropertyValue<Padding>;
	"icon-keep-upright": boolean;
	"icon-offset": PossiblyEvaluatedPropertyValue<[
		number,
		number
	]>;
	"icon-anchor": PossiblyEvaluatedPropertyValue<"center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right">;
	"icon-pitch-alignment": "map" | "viewport" | "auto";
	"text-pitch-alignment": "map" | "viewport" | "auto";
	"text-rotation-alignment": "map" | "viewport" | "viewport-glyph" | "auto";
	"text-field": PossiblyEvaluatedPropertyValue<Formatted>;
	"text-font": PossiblyEvaluatedPropertyValue<Array<string>>;
	"text-size": PossiblyEvaluatedPropertyValue<number>;
	"text-max-width": PossiblyEvaluatedPropertyValue<number>;
	"text-line-height": number;
	"text-letter-spacing": PossiblyEvaluatedPropertyValue<number>;
	"text-justify": PossiblyEvaluatedPropertyValue<"auto" | "left" | "center" | "right">;
	"text-radial-offset": PossiblyEvaluatedPropertyValue<number>;
	"text-variable-anchor": Array<"center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right">;
	"text-variable-anchor-offset": PossiblyEvaluatedPropertyValue<VariableAnchorOffsetCollection>;
	"text-anchor": PossiblyEvaluatedPropertyValue<"center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right">;
	"text-max-angle": number;
	"text-writing-mode": Array<"horizontal" | "vertical">;
	"text-rotate": PossiblyEvaluatedPropertyValue<number>;
	"text-padding": number;
	"text-keep-upright": boolean;
	"text-transform": PossiblyEvaluatedPropertyValue<"none" | "uppercase" | "lowercase">;
	"text-offset": PossiblyEvaluatedPropertyValue<[
		number,
		number
	]>;
	"text-allow-overlap": boolean;
	"text-overlap": "never" | "always" | "cooperative";
	"text-ignore-placement": boolean;
	"text-optional": boolean;
};
type SymbolPaintProps = {
	"icon-opacity": DataDrivenProperty<number>;
	"icon-color": DataDrivenProperty<Color$1>;
	"icon-halo-color": DataDrivenProperty<Color$1>;
	"icon-halo-width": DataDrivenProperty<number>;
	"icon-halo-blur": DataDrivenProperty<number>;
	"icon-translate": DataConstantProperty<[
		number,
		number
	]>;
	"icon-translate-anchor": DataConstantProperty<"map" | "viewport">;
	"text-opacity": DataDrivenProperty<number>;
	"text-color": DataDrivenProperty<Color$1>;
	"text-halo-color": DataDrivenProperty<Color$1>;
	"text-halo-width": DataDrivenProperty<number>;
	"text-halo-blur": DataDrivenProperty<number>;
	"text-translate": DataConstantProperty<[
		number,
		number
	]>;
	"text-translate-anchor": DataConstantProperty<"map" | "viewport">;
};
type SymbolPaintPropsPossiblyEvaluated = {
	"icon-opacity": PossiblyEvaluatedPropertyValue<number>;
	"icon-color": PossiblyEvaluatedPropertyValue<Color$1>;
	"icon-halo-color": PossiblyEvaluatedPropertyValue<Color$1>;
	"icon-halo-width": PossiblyEvaluatedPropertyValue<number>;
	"icon-halo-blur": PossiblyEvaluatedPropertyValue<number>;
	"icon-translate": [
		number,
		number
	];
	"icon-translate-anchor": "map" | "viewport";
	"text-opacity": PossiblyEvaluatedPropertyValue<number>;
	"text-color": PossiblyEvaluatedPropertyValue<Color$1>;
	"text-halo-color": PossiblyEvaluatedPropertyValue<Color$1>;
	"text-halo-width": PossiblyEvaluatedPropertyValue<number>;
	"text-halo-blur": PossiblyEvaluatedPropertyValue<number>;
	"text-translate": [
		number,
		number
	];
	"text-translate-anchor": "map" | "viewport";
};
declare class SymbolStyleLayer extends StyleLayer {
	_unevaluatedLayout: Layout<SymbolLayoutProps>;
	layout: PossiblyEvaluated<SymbolLayoutProps, SymbolLayoutPropsPossiblyEvaluated>;
	_transitionablePaint: Transitionable<SymbolPaintProps>;
	_transitioningPaint: Transitioning<SymbolPaintProps>;
	paint: PossiblyEvaluated<SymbolPaintProps, SymbolPaintPropsPossiblyEvaluated>;
	constructor(layer: LayerSpecification);
	recalculate(parameters: EvaluationParameters, availableImages: Array<string>): void;
	getValueAndResolveTokens(name: any, feature: Feature$2, canonical: CanonicalTileID, availableImages: Array<string>): any;
	createBucket(parameters: BucketParameters<any>): SymbolBucket;
	queryRadius(): number;
	queryIntersectsFeature(): boolean;
	_setPaintOverrides(): void;
	_handleOverridablePaintPropertyUpdate<T, R>(name: string, oldValue: PropertyValue<T, R>, newValue: PropertyValue<T, R>): boolean;
	static hasPaintOverride(layout: PossiblyEvaluated<SymbolLayoutProps, SymbolLayoutPropsPossiblyEvaluated>, propertyName: string): boolean;
}
type SymbolQuad = {
	tl: Point;
	tr: Point;
	bl: Point;
	br: Point;
	tex: {
		x: number;
		y: number;
		w: number;
		h: number;
	};
	pixelOffsetTL: Point;
	pixelOffsetBR: Point;
	writingMode: any | void;
	glyphOffset: [
		number,
		number
	];
	sectionIndex: number;
	isSDF: boolean;
	minFontScaleX: number;
	minFontScaleY: number;
};
type SizeData = {
	kind: "constant";
	layoutSize: number;
} | {
	kind: "source";
} | {
	kind: "camera";
	minZoom: number;
	maxZoom: number;
	minSize: number;
	maxSize: number;
	interpolationType: InterpolationType;
} | {
	kind: "composite";
	minZoom: number;
	maxZoom: number;
	interpolationType: InterpolationType;
};
type SingleCollisionBox = {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	anchorPointX: number;
	anchorPointY: number;
};
type CollisionArrays = {
	textBox?: SingleCollisionBox;
	verticalTextBox?: SingleCollisionBox;
	iconBox?: SingleCollisionBox;
	verticalIconBox?: SingleCollisionBox;
	textFeatureIndex?: number;
	verticalTextFeatureIndex?: number;
	iconFeatureIndex?: number;
	verticalIconFeatureIndex?: number;
};
type SymbolFeature = {
	sortKey: number | void;
	text: Formatted | void;
	icon: ResolvedImage;
	index: number;
	sourceLayerIndex: number;
	geometry: Array<Array<Point>>;
	properties: any;
	type: "Unknown" | "Point" | "LineString" | "Polygon";
	id?: any;
};
type SortKeyRange = {
	sortKey: number;
	symbolInstanceStart: number;
	symbolInstanceEnd: number;
};
declare function addDynamicAttributes(dynamicLayoutVertexArray: StructArray, p: Point, angle: number): void;
declare class SymbolBuffers {
	layoutVertexArray: SymbolLayoutArray;
	layoutVertexBuffer: VertexBuffer;
	indexArray: TriangleIndexArray;
	indexBuffer: IndexBuffer;
	programConfigurations: ProgramConfigurationSet<SymbolStyleLayer>;
	segments: SegmentVector;
	dynamicLayoutVertexArray: SymbolDynamicLayoutArray;
	dynamicLayoutVertexBuffer: VertexBuffer;
	opacityVertexArray: SymbolOpacityArray;
	opacityVertexBuffer: VertexBuffer;
	hasVisibleVertices: boolean;
	collisionVertexArray: CollisionVertexArray;
	collisionVertexBuffer: VertexBuffer;
	placedSymbolArray: PlacedSymbolArray;
	constructor(programConfigurations: ProgramConfigurationSet<SymbolStyleLayer>);
	isEmpty(): boolean;
	upload(context: Context, dynamicIndexBuffer: boolean, upload?: boolean, update?: boolean): void;
	destroy(): void;
}
declare class SymbolBucket implements Bucket {
	static MAX_GLYPHS: number;
	static addDynamicAttributes: typeof addDynamicAttributes;
	collisionBoxArray: CollisionBoxArray;
	zoom: number;
	globalState: Record<string, any>;
	overscaling: number;
	layers: Array<SymbolStyleLayer>;
	layerIds: Array<string>;
	stateDependentLayers: Array<SymbolStyleLayer>;
	stateDependentLayerIds: Array<string>;
	index: number;
	sdfIcons: boolean;
	iconsInText: boolean;
	iconsNeedLinear: boolean;
	bucketInstanceId: number;
	justReloaded: boolean;
	hasPattern: boolean;
	textSizeData: SizeData;
	iconSizeData: SizeData;
	glyphOffsetArray: GlyphOffsetArray;
	lineVertexArray: SymbolLineVertexArray;
	features: Array<SymbolFeature>;
	symbolInstances: SymbolInstanceArray;
	textAnchorOffsets: TextAnchorOffsetArray;
	collisionArrays: Array<CollisionArrays>;
	sortKeyRanges: Array<SortKeyRange>;
	pixelRatio: number;
	tilePixelRatio: number;
	compareText: {
		[_: string]: Array<Point>;
	};
	fadeStartTime: number;
	sortFeaturesByKey: boolean;
	sortFeaturesByY: boolean;
	canOverlap: boolean;
	sortedAngle: number;
	featureSortOrder: Array<number>;
	collisionCircleArray: Array<number>;
	text: SymbolBuffers;
	icon: SymbolBuffers;
	textCollisionBox: CollisionBuffers;
	iconCollisionBox: CollisionBuffers;
	uploaded: boolean;
	sourceLayerIndex: number;
	sourceID: string;
	symbolInstanceIndexes: Array<number>;
	writingModes: WritingMode[];
	allowVerticalPlacement: boolean;
	hasRTLText: boolean;
	constructor(options: BucketParameters<SymbolStyleLayer>);
	createArrays(): void;
	private calculateGlyphDependencies;
	populate(features: Array<IndexedFeature>, options: PopulateParameters, canonical: CanonicalTileID): void;
	update(states: FeatureStates, vtLayer: VectorTileLayer, imagePositions: {
		[_: string]: ImagePosition;
	}): void;
	isEmpty(): boolean;
	uploadPending(): boolean;
	upload(context: Context): void;
	destroyDebugData(): void;
	destroy(): void;
	addToLineVertexArray(anchor: Anchor, line: Array<Point>): {
		lineStartIndex: number;
		lineLength: number;
	};
	addSymbols(arrays: SymbolBuffers, quads: Array<SymbolQuad>, sizeVertex: any, lineOffset: [
		number,
		number
	], alongLine: boolean, feature: SymbolFeature, writingMode: WritingMode, labelAnchor: Anchor, lineStartIndex: number, lineLength: number, associatedIconIndex: number, canonical: CanonicalTileID): void;
	_addCollisionDebugVertex(layoutVertexArray: StructArray, collisionVertexArray: StructArray, point: Point, anchorX: number, anchorY: number, extrude: Point): any;
	addCollisionDebugVertices(x1: number, y1: number, x2: number, y2: number, arrays: CollisionBuffers, boxAnchorPoint: Point, symbolInstance: SymbolInstance): void;
	addDebugCollisionBoxes(startIndex: number, endIndex: number, symbolInstance: SymbolInstance, isText: boolean): void;
	generateCollisionDebugBuffers(): void;
	_deserializeCollisionBoxesForSymbol(collisionBoxArray: CollisionBoxArray, textStartIndex: number, textEndIndex: number, verticalTextStartIndex: number, verticalTextEndIndex: number, iconStartIndex: number, iconEndIndex: number, verticalIconStartIndex: number, verticalIconEndIndex: number): CollisionArrays;
	deserializeCollisionBoxes(collisionBoxArray: CollisionBoxArray): void;
	hasTextData(): boolean;
	hasIconData(): boolean;
	hasDebugData(): CollisionBuffers;
	hasTextCollisionBoxData(): boolean;
	hasIconCollisionBoxData(): boolean;
	addIndicesForPlacedSymbol(iconOrText: SymbolBuffers, placedSymbolIndex: number): void;
	getSortedSymbolIndexes(angle: number): any[];
	addToSortKeyRanges(symbolInstanceIndex: number, sortKey: number): void;
	sortFeatures(angle: number): void;
}
declare class DepthMode {
	func: DepthFuncType;
	mask: DepthMaskType;
	range: DepthRangeType;
	static ReadOnly: boolean;
	static ReadWrite: boolean;
	constructor(depthFunc: DepthFuncType, depthMask: DepthMaskType, depthRange: DepthRangeType);
	static disabled: Readonly<DepthMode>;
}
declare class StencilMode {
	test: StencilTestGL;
	ref: number;
	mask: number;
	fail: StencilOpConstant;
	depthFail: StencilOpConstant;
	pass: StencilOpConstant;
	constructor(test: StencilTestGL, ref: number, mask: number, fail: StencilOpConstant, depthFail: StencilOpConstant, pass: StencilOpConstant);
	static disabled: Readonly<StencilMode>;
}
declare class ColorMode {
	blendFunction: BlendFuncType;
	blendColor: Color$1;
	mask: ColorMaskType;
	constructor(blendFunction: BlendFuncType, blendColor: Color$1, mask: ColorMaskType);
	static Replace: BlendFuncType;
	static disabled: Readonly<ColorMode>;
	static unblended: Readonly<ColorMode>;
	static alphaBlended: Readonly<ColorMode>;
}
type DashEntry = {
	y: number;
	height: number;
	width: number;
};
declare class LineAtlas {
	width: number;
	height: number;
	nextRow: number;
	bytes: number;
	data: Uint8Array;
	dashEntry: {
		[_: string]: DashEntry;
	};
	dirty: boolean;
	texture: WebGLTexture;
	constructor(width: number, height: number);
	/**
	 * Get or create a dash line pattern.
	 *
	 * @param dasharray - the key (represented by numbers) to get the dash texture
	 * @param round - whether to add circle caps in between dash segments
	 * @returns position of dash texture in {@link DashEntry}
	 */
	getDash(dasharray: Array<number>, round: boolean): DashEntry;
	getDashRanges(dasharray: Array<number>, lineAtlasWidth: number, stretch: number): any[];
	addRoundDash(ranges: any, stretch: number, n: number): void;
	addRegularDash(ranges: any): void;
	addDash(dasharray: Array<number>, round: boolean): DashEntry;
	bind(context: Context): void;
}
declare const enum ResourceType {
	Glyphs = "Glyphs",
	Image = "Image",
	Source = "Source",
	SpriteImage = "SpriteImage",
	SpriteJSON = "SpriteJSON",
	Style = "Style",
	Tile = "Tile",
	Unknown = "Unknown"
}
type RequestTransformFunction = (url: string, resourceType?: ResourceType) => RequestParameters | undefined;
declare class RequestManager {
	_transformRequestFn: RequestTransformFunction;
	constructor(transformRequestFn?: RequestTransformFunction);
	transformRequest(url: string, type: ResourceType): RequestParameters;
	setTransformRequest(transformRequest: RequestTransformFunction): void;
}
declare function loadGlyphRange(fontstack: string, range: number, urlTemplate: string, requestManager: RequestManager): Promise<{
	[_: number]: StyleGlyph | null;
}>;
type Entry = {
	glyphs: {
		[id: number]: StyleGlyph | null;
	};
	requests: {
		[range: number]: Promise<{
			[_: number]: StyleGlyph | null;
		}>;
	};
	ranges: {
		[range: number]: boolean | null;
	};
	tinySDF?: TinySDF;
};
declare class GlyphManager {
	requestManager: RequestManager;
	localIdeographFontFamily: string | false;
	entries: {
		[stack: string]: Entry;
	};
	url: string;
	static loadGlyphRange: typeof loadGlyphRange;
	static TinySDF: typeof TinySDF;
	constructor(requestManager: RequestManager, localIdeographFontFamily?: string | false);
	setURL(url?: string | null): void;
	getGlyphs(glyphs: {
		[stack: string]: Array<number>;
	}): Promise<GetGlyphsResponse>;
	_getAndCacheGlyphsPromise(stack: string, id: number): Promise<{
		stack: string;
		id: number;
		glyph: StyleGlyph;
	}>;
	_doesCharSupportLocalGlyph(id: number): boolean;
	_tinySDF(entry: Entry, stack: string, id: number): StyleGlyph;
}
type RenderPass = "offscreen" | "opaque" | "translucent";
type PainterOptions = {
	showOverdrawInspector: boolean;
	showTileBoundaries: boolean;
	showPadding: boolean;
	rotating: boolean;
	zooming: boolean;
	moving: boolean;
	fadeDuration: number;
};
type RenderOptions = {
	isRenderingToTexture: boolean;
	isRenderingGlobe: boolean;
};
declare class Painter {
	context: Context;
	transform: IReadonlyTransform;
	renderToTexture: RenderToTexture;
	_tileTextures: {
		[_: number]: Array<Texture$1>;
	};
	numSublayers: number;
	depthEpsilon: number;
	emptyProgramConfiguration: ProgramConfiguration;
	width: number;
	height: number;
	pixelRatio: number;
	tileExtentBuffer: VertexBuffer;
	tileExtentSegments: SegmentVector;
	tileExtentMesh: Mesh;
	debugBuffer: VertexBuffer;
	debugSegments: SegmentVector;
	rasterBoundsBuffer: VertexBuffer;
	rasterBoundsSegments: SegmentVector;
	rasterBoundsBufferPosOnly: VertexBuffer;
	rasterBoundsSegmentsPosOnly: SegmentVector;
	viewportBuffer: VertexBuffer;
	viewportSegments: SegmentVector;
	quadTriangleIndexBuffer: IndexBuffer;
	tileBorderIndexBuffer: IndexBuffer;
	_tileClippingMaskIDs: {
		[_: string]: number;
	};
	stencilClearMode: StencilMode;
	style: Style$1;
	options: PainterOptions;
	lineAtlas: LineAtlas;
	imageManager: ImageManager;
	glyphManager: GlyphManager;
	depthRangeFor3D: DepthRangeType;
	opaquePassCutoff: number;
	renderPass: RenderPass;
	currentLayer: number;
	currentStencilSource: string;
	nextStencilID: number;
	id: string;
	_showOverdrawInspector: boolean;
	cache: {
		[_: string]: Program<any>;
	};
	crossTileSymbolIndex: CrossTileSymbolIndex;
	symbolFadeChange: number;
	debugOverlayTexture: Texture$1;
	debugOverlayCanvas: HTMLCanvasElement;
	terrainFacilitator: {
		dirty: boolean;
		matrix: mat4;
		renderTime: number;
	};
	constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, transform: IReadonlyTransform);
	resize(width: number, height: number, pixelRatio: number): void;
	setup(): void;
	clearStencil(): void;
	_renderTileClippingMasks(layer: StyleLayer, tileIDs: Array<OverscaledTileID>, renderToTexture: boolean): void;
	_renderTileMasks(tileStencilRefs: {
		[_: string]: number;
	}, tileIDs: Array<OverscaledTileID>, renderToTexture: boolean, useBorders: boolean): void;
	/**
	 * Fills the depth buffer with the geometry of all supplied tiles.
	 * Does not change the color buffer or the stencil buffer.
	 */
	_renderTilesDepthBuffer(): void;
	stencilModeFor3D(): StencilMode;
	stencilModeForClipping(tileID: OverscaledTileID): StencilMode;
	getStencilConfigForOverlapAndUpdateStencilID(tileIDs: Array<OverscaledTileID>): [
		{
			[_: number]: Readonly<StencilMode>;
		},
		Array<OverscaledTileID>
	];
	stencilConfigForOverlapTwoPass(tileIDs: Array<OverscaledTileID>): [
		{
			[_: number]: Readonly<StencilMode>;
		},
		{
			[_: number]: Readonly<StencilMode>;
		},
		Array<OverscaledTileID>
	];
	colorModeForRenderPass(): Readonly<ColorMode>;
	getDepthModeForSublayer(n: number, mask: DepthMaskType, func?: DepthFuncType | null): Readonly<DepthMode>;
	getDepthModeFor3D(): Readonly<DepthMode>;
	opaquePassEnabledForLayer(): boolean;
	render(style: Style$1, options: PainterOptions): void;
	/**
	 * Update the depth and coords framebuffers, if the contents of those frame buffers is out of date.
	 * If requireExact is false, then the contents of those frame buffers is not updated if it is close
	 * to accurate (that is, the camera has not moved much since it was updated last).
	 */
	maybeDrawDepthAndCoords(requireExact: boolean): void;
	renderLayer(painter: Painter, sourceCache: SourceCache, layer: StyleLayer, coords: Array<OverscaledTileID>, renderOptions: RenderOptions): void;
	saveTileTexture(texture: Texture$1): void;
	getTileTexture(size: number): Texture$1;
	/**
	 * Checks whether a pattern image is needed, and if it is, whether it is not loaded.
	 *
	 * @returns true if a needed image is missing and rendering needs to be skipped.
	 */
	isPatternMissing(image?: CrossFaded<ResolvedImage> | null): boolean;
	/**
	 * Finds the required shader and its variant (base/terrain/globe, etc.) and binds it, compiling a new shader if required.
	 * @param name - Name of the desired shader.
	 * @param programConfiguration - Configuration of shader's inputs.
	 * @param forceSimpleProjection - Whether to force the use of a shader variant with simple mercator projection vertex shader.
	 * @param defines - Additional macros to be injected at the beginning of the shader. Expected format is `['#define XYZ']`, etc.
	 * False by default. Use true when drawing with a simple projection matrix is desired, eg. when drawing a fullscreen quad.
	 * @returns
	 */
	useProgram(name: string, programConfiguration?: ProgramConfiguration | null, forceSimpleProjection?: boolean, defines?: Array<string>): Program<any>;
	setCustomLayerDefaults(): void;
	setBaseState(): void;
	initDebugOverlayCanvas(): void;
	destroy(): void;
	overLimit(): boolean;
}
declare class TerrainSourceCache extends Evented {
	/**
	 * source-cache for the raster-dem source.
	 */
	sourceCache: SourceCache;
	/**
	 * stores all render-to-texture tiles.
	 */
	_tiles: {
		[_: string]: Tile;
	};
	/**
	 * contains a list of tileID-keys for the current scene. (only for performance)
	 */
	_renderableTilesKeys: Array<string>;
	/**
	 * raster-dem-tile for a TileID cache.
	 */
	_sourceTileCache: {
		[_: string]: string;
	};
	/**
	 * minimum zoomlevel to render the terrain.
	 */
	minzoom: number;
	/**
	 * maximum zoomlevel to render the terrain.
	 */
	maxzoom: number;
	/**
	 * render-to-texture tileSize in scene.
	 */
	tileSize: number;
	/**
	 * raster-dem tiles will load for performance the actualZoom - deltaZoom zoom-level.
	 */
	deltaZoom: number;
	/**
	 * used to determine whether depth & coord framebuffers need updating
	 */
	_lastTilesetChange: number;
	constructor(sourceCache: SourceCache);
	destruct(): void;
	/**
	 * Load Terrain Tiles, create internal render-to-texture tiles, free GPU memory.
	 * @param transform - the operation to do
	 * @param terrain - the terrain
	 */
	update(transform: ITransform, terrain: Terrain): void;
	/**
	 * Free render to texture cache
	 * @param tileID - optional, free only corresponding to tileID.
	 */
	freeRtt(tileID?: OverscaledTileID): void;
	/**
	 * get a list of tiles, which are loaded and should be rendered in the current scene
	 * @returns the renderable tiles
	 */
	getRenderableTiles(): Array<Tile>;
	/**
	 * get terrain tile by the TileID key
	 * @param id - the tile id
	 * @returns the tile
	 */
	getTileByID(id: string): Tile;
	/**
	 * Searches for the corresponding current renderable terrain-tiles
	 * @param tileID - the tile to look for
	 * @returns the tiles that were found
	 */
	getTerrainCoords(tileID: OverscaledTileID, terrainTileRanges?: {
		[zoom: string]: CanonicalTileRange;
	}): Record<string, OverscaledTileID>;
	/**
	 * Searches for the corresponding current renderable terrain-tiles.
	 * Includes terrain tiles that are either:
	 * - the same as the tileID
	 * - a parent of the tileID
	 * - a child of the tileID
	 * @param tileID - the tile to look for
	 * @returns the tiles that were found
	 */
	_getTerrainCoordsForRegularTile(tileID: OverscaledTileID): Record<string, OverscaledTileID>;
	/**
	 * Searches for the corresponding current renderable terrain-tiles.
	 * Includes terrain tiles that are within terrain tile ranges.
	 * @param tileID - the tile to look for
	 * @returns the tiles that were found
	 */
	_getTerrainCoordsForTileRanges(tileID: OverscaledTileID, terrainTileRanges: {
		[zoom: string]: CanonicalTileRange;
	}): Record<string, OverscaledTileID>;
	/**
	 * find the covering raster-dem tile
	 * @param tileID - the tile to look for
	 * @param searchForDEM - Optional parameter to search for (parent) source tiles with loaded dem.
	 * @returns the tile
	 */
	getSourceTile(tileID: OverscaledTileID, searchForDEM?: boolean): Tile;
	/**
	 * gets whether any tiles were loaded after a specific time. This is used to update depth & coords framebuffers.
	 * @param time - the time
	 * @returns true if any tiles came into view at or after the specified time
	 */
	anyTilesAfterTime(time?: number): boolean;
	/**
	 * Checks whether a tile is within the canonical tile ranges.
	 * @param tileID - Tile to check
	 * @param canonicalTileRanges - Canonical tile ranges
	 * @returns
	 */
	private _isWithinTileRanges;
}
type TerrainData = {
	"u_depth": number;
	"u_terrain": number;
	"u_terrain_dim": number;
	"u_terrain_matrix": mat4;
	"u_terrain_unpack": number[];
	"u_terrain_exaggeration": number;
	texture: WebGLTexture;
	depthTexture: WebGLTexture;
	tile: Tile;
};
declare class Terrain {
	/**
	 * The style this terrain corresponds to
	 */
	painter: Painter;
	/**
	 * the sourcecache this terrain is based on
	 */
	sourceCache: TerrainSourceCache;
	/**
	 * the TerrainSpecification object passed to this instance
	 */
	options: TerrainSpecification;
	/**
	 * define the meshSize per tile.
	 */
	meshSize: number;
	/**
	 * multiplicator for the elevation. Used to make terrain more "extreme".
	 */
	exaggeration: number;
	/**
	 * to not see pixels in the render-to-texture tiles it is good to render them bigger
	 * this number is the multiplicator (must be a power of 2) for the current tileSize.
	 * So to get good results with not too much memory footprint a value of 2 should be fine.
	 */
	qualityFactor: number;
	/**
	 * holds the framebuffer object in size of the screen to render the coords & depth into a texture.
	 */
	_fbo: Framebuffer;
	_fboCoordsTexture: Texture$1;
	_fboDepthTexture: Texture$1;
	_emptyDepthTexture: Texture$1;
	/**
	 * GL Objects for the terrain-mesh
	 * The mesh is a regular mesh, which has the advantage that it can be reused for all tiles.
	 */
	_meshCache: {
		[key: string]: Mesh;
	};
	/**
	 * coords index contains a list of tileID.keys. This index is used to identify
	 * the tile via the alpha-cannel in the coords-texture.
	 * As the alpha-channel has 1 Byte a max of 255 tiles can rendered without an error.
	 */
	coordsIndex: Array<string>;
	/**
	 * tile-coords encoded in the rgb channel, _coordsIndex is in the alpha-channel.
	 */
	_coordsTexture: Texture$1;
	/**
	 * accuracy of the coords. 2 * tileSize should be enough.
	 */
	_coordsTextureSize: number;
	/**
	 * variables for an empty dem texture, which is used while the raster-dem tile is loading.
	 */
	_emptyDemUnpack: number[];
	_emptyDemTexture: Texture$1;
	_emptyDemMatrix: mat4;
	/**
	 * as of overzooming of raster-dem tiles in high zoomlevels, this cache contains
	 * matrices to transform from vector-tile coords to raster-dem-tile coords.
	 */
	_demMatrixCache: {
		[_: string]: {
			matrix: mat4;
			coord: OverscaledTileID;
		};
	};
	constructor(painter: Painter, sourceCache: SourceCache, options: TerrainSpecification);
	/**
	 * get the elevation-value from original dem-data for a given tile-coordinate
	 * @param tileID - the tile to get elevation for
	 * @param x - between 0 .. EXTENT
	 * @param y - between 0 .. EXTENT
	 * @param extent - optional, default 8192
	 * @returns the elevation
	 */
	getDEMElevation(tileID: OverscaledTileID, x: number, y: number, extent?: number): number;
	/**
	 * Get the elevation for given {@link LngLat} in respect of exaggeration.
	 * @param lnglat - the location
	 * @param zoom - the zoom
	 * @returns the elevation
	 */
	getElevationForLngLatZoom(lnglat: LngLat, zoom: number): number;
	/**
	 * Get the elevation for given coordinate in respect of exaggeration.
	 * @param tileID - the tile id
	 * @param x - between 0 .. EXTENT
	 * @param y - between 0 .. EXTENT
	 * @param extent - optional, default 8192
	 * @returns the elevation
	 */
	getElevation(tileID: OverscaledTileID, x: number, y: number, extent?: number): number;
	/**
	 * returns a Terrain Object for a tile. Unless the tile corresponds to data (e.g. tile is loading), return a flat dem object
	 * @param tileID - the tile to get the terrain for
	 * @returns the terrain data to use in the program
	 */
	getTerrainData(tileID: OverscaledTileID): TerrainData;
	/**
	 * get a framebuffer as big as the map-div, which will be used to render depth & coords into a texture
	 * @param texture - the texture
	 * @returns the frame buffer
	 */
	getFramebuffer(texture: string): Framebuffer;
	/**
	 * create coords texture, needed to grab coordinates from canvas
	 * encode coords coordinate into 4 bytes:
	 *   - 8 lower bits for x
	 *   - 8 lower bits for y
	 *   - 4 higher bits for x
	 *   - 4 higher bits for y
	 *   - 8 bits for coordsIndex (1 .. 255) (= number of terraintile), is later setted in draw_terrain uniform value
	 * @returns the texture
	 */
	getCoordsTexture(): Texture$1;
	/**
	 * Reads a pixel from the coords-framebuffer and translate this to mercator, or null, if the pixel doesn't lie on the terrain's surface (but the sky instead).
	 * @param p - Screen-Coordinate
	 * @returns Mercator coordinate for a screen pixel, or null, if the pixel is not covered by terrain (is in the sky).
	 */
	pointCoordinate(p: Point): MercatorCoordinate;
	/**
	 * Reads the depth value from the depth-framebuffer at a given screen pixel
	 * @param p - Screen coordinate
	 * @returns depth value in clip space (between 0 and 1)
	 */
	depthAtPoint(p: Point): number;
	/**
	 * create a regular mesh which will be used by all terrain-tiles
	 * @returns the created regular mesh
	 */
	getTerrainMesh(tileId: OverscaledTileID): Mesh;
	/**
	 * Calculates a height of the frame around the terrain-mesh to avoid stitching between
	 * tile boundaries in different zoomlevels.
	 * @param zoom - current zoomlevel
	 * @returns the elevation delta in meters
	 */
	getMeshFrameDelta(zoom: number): number;
	getMinTileElevationForLngLatZoom(lnglat: LngLat, zoom: number): number;
	/**
	 * Get the minimum and maximum elevation contained in a tile. This includes any
	 * exaggeration included in the terrain.
	 *
	 * @param tileID - ID of the tile to be used as a source for the min/max elevation
	 * @returns the minimum and maximum elevation found in the tile, including the terrain's
	 * exaggeration
	 */
	getMinMaxElevation(tileID: OverscaledTileID): {
		minElevation: number | null;
		maxElevation: number | null;
	};
	_getOverscaledTileIDFromLngLatZoom(lnglat: LngLat, zoom: number): {
		tileID: OverscaledTileID;
		mercatorX: number;
		mercatorY: number;
	};
}
type PointProjection = {
	/**
	 * The projected point.
	 */
	point: Point;
	/**
	 * The original W component of the projection.
	 */
	signedDistanceFromCamera: number;
	/**
	 * For complex projections (such as globe), true if the point is occluded by the projection, such as by being on the backfacing side of the globe.
	 * If the point is simply beyond the edge of the screen, this should NOT be set to false.
	 */
	isOccluded: boolean;
};
type IndexToPointCache = {
	[lineIndex: number]: Point;
};
type ProjectionCache = {
	/**
	 * tile-unit vertices projected into label-plane units
	 */
	projections: IndexToPointCache;
	/**
	 * label-plane vertices which have been shifted to follow an offset line
	 */
	offsets: IndexToPointCache;
	/**
	 * Cached projected anchor point.
	 */
	cachedAnchorPoint: Point | undefined;
	/**
	 * Was any projected point occluded by the map itself (eg. occluded by the planet when using globe projection).
	 *
	 * Viewport-pitched line-following texts where *any* of the line points is hidden behind the planet curve becomes entirely hidden.
	 * This is perhaps not the most ideal behavior, but it works, it is simple and planetary-scale texts such as this seem to be a rare edge case.
	 */
	anyProjectionOccluded: boolean;
};
type SymbolProjectionContext = {
	/**
	 * Used to cache results, save cost if projecting the same vertex multiple times
	 */
	projectionCache: ProjectionCache;
	/**
	 * The array of tile-unit vertices transferred from worker
	 */
	lineVertexArray: SymbolLineVertexArray;
	/**
	 * Matrix for transforming from pixels (symbol shaping) to potentially rotated tile units (pitched map label plane).
	 */
	pitchedLabelPlaneMatrix: mat4;
	/**
	 * Function to get elevation at a point
	 * @param x - the x coordinate
	 * @param y - the y coordinate
	*/
	getElevation: (x: number, y: number) => number;
	/**
	 * Only for creating synthetic vertices if vertex would otherwise project behind plane of camera,
	 * but still convenient to pass it inside this type.
	 */
	tileAnchorPoint: Point;
	/**
	 * True when line glyphs are projected onto the map, instead of onto the viewport.
	 */
	pitchWithMap: boolean;
	transform: IReadonlyTransform;
	unwrappedTileID: UnwrappedTileID;
	/**
	 * Viewport width.
	 */
	width: number;
	/**
	 * Viewport height.
	 */
	height: number;
	/**
	 * Translation in tile units, computed using text-translate and text-translate-anchor paint style properties.
	 */
	translation: [
		number,
		number
	];
};
type ProjectionData = {
	/**
	 * The main projection matrix. For mercator projection, it usually projects in-tile coordinates 0..EXTENT to screen,
	 * for globe projection, it projects a unit sphere planet to screen.
	 * Uniform name: `u_projection_matrix`.
	 */
	mainMatrix: mat4;
	/**
	 * The extent of current tile in the mercator square.
	 * Used by globe projection.
	 * First two components are X and Y offset, last two are X and Y scale.
	 * Uniform name: `u_projection_tile_mercator_coords`.
	 *
	 * Conversion from in-tile coordinates in range 0..EXTENT is done as follows:
	 * @example
	 * ```
	 * vec2 mercator_coords = u_projection_tile_mercator_coords.xy + in_tile.xy * u_projection_tile_mercator_coords.zw;
	 * ```
	 */
	tileMercatorCoords: [
		number,
		number,
		number,
		number
	];
	/**
	 * The plane equation for a plane that intersects the planet's horizon.
	 * Assumes the planet to be a unit sphere.
	 * Used by globe projection for clipping.
	 * Uniform name: `u_projection_clipping_plane`.
	 */
	clippingPlane: [
		number,
		number,
		number,
		number
	];
	/**
	 * A value in range 0..1 indicating interpolation between mercator (0) and globe (1) projections.
	 * Used by globe projection to hide projection transition at high zooms.
	 * Uniform name: `u_projection_transition`.
	 */
	projectionTransition: number;
	/**
	 * Fallback matrix that projects the current tile according to mercator projection.
	 * Used by globe projection to fall back to mercator projection in an animated way.
	 * Uniform name: `u_projection_fallback_matrix`.
	 */
	fallbackMatrix: mat4;
};
type ProjectionDataParams = {
	/**
	 * The ID of the current tile
	 */
	overscaledTileID: OverscaledTileID | null;
	/**
	 * Set to true if a pixel-aligned matrix should be used, if possible (mostly used for raster tiles under mercator projection)
	 */
	aligned?: boolean;
	/**
	 * Set to true if the terrain matrix should be applied (i.e. when rendering terrain)
	 */
	applyTerrainMatrix?: boolean;
	/**
	 * Set to true if the globe matrix should be applied (i.e. when rendering globe)
	 */
	applyGlobeMatrix?: boolean;
};
interface CoveringTilesDetailsProvider {
	/**
	 * Returns the distance from the point to the tile
	 * @param pointX - point x.
	 * @param pointY - point y.
	 * @param tileID - Tile x, y and z for zoom.
	 * @param boundingVolume - tile bounding volume
	 */
	distanceToTile2d: (pointX: number, pointY: number, tileID: {
		x: number;
		y: number;
		z: number;
	}, boundingVolume: IBoundingVolume) => number;
	/**
	 * Returns the wrap value for a given tile.
	 */
	getWrap: (centerCoord: MercatorCoordinate, tileID: {
		x: number;
		y: number;
		z: number;
	}, parentWrap: number) => number;
	/**
	 * Returns the bounding volume of the specified tile.
	 * @param tileID - Tile x, y and z for zoom.
	 * @param wrap - wrap number of the tile.
	 * @param elevation - camera center point elevation.
	 * @param options - CoveringTilesOptions.
	 */
	getTileBoundingVolume: (tileID: {
		x: number;
		y: number;
		z: number;
	}, wrap: number, elevation: number, options: CoveringTilesOptions) => IBoundingVolume;
	/**
	 * Whether to allow variable zoom, which is used at high pitch angle to avoid loading an excessive amount of tiles.
	 */
	allowVariableZoom: (transform: IReadonlyTransform, options: CoveringTilesOptions) => boolean;
	/**
	 * Whether to allow world copies to be rendered.
	 */
	allowWorldCopies: () => boolean;
	/**
	 * Prepare cache for the next frame.
	 */
	prepareNextFrame(): void;
}
interface ITransformGetters {
	get tileSize(): number;
	get tileZoom(): number;
	/**
	 * How many times "larger" the world is compared to zoom 0. Usually computed as `pow(2, zoom)`.
	 * Relevant mostly for mercator projection.
	 */
	get scale(): number;
	/**
	 * How many units the current world has. Computed by multiplying {@link worldSize} by {@link tileSize}.
	 * Relevant mostly for mercator projection.
	 */
	get worldSize(): number;
	/**
	 * Gets the transform's width in pixels. Use {@link ITransform.resize} to set the transform's size.
	 */
	get width(): number;
	/**
	 * Gets the transform's height in pixels. Use {@link ITransform.resize} to set the transform's size.
	 */
	get height(): number;
	get lngRange(): [
		number,
		number
	];
	get latRange(): [
		number,
		number
	];
	get minZoom(): number;
	get maxZoom(): number;
	get zoom(): number;
	get center(): LngLat;
	get minPitch(): number;
	get maxPitch(): number;
	/**
	 * Roll in degrees.
	 */
	get roll(): number;
	get rollInRadians(): number;
	/**
	 * Pitch in degrees.
	 */
	get pitch(): number;
	get pitchInRadians(): number;
	/**
	 * Bearing in degrees.
	 */
	get bearing(): number;
	get bearingInRadians(): number;
	/**
	 * Vertical field of view in degrees.
	 */
	get fov(): number;
	get fovInRadians(): number;
	get elevation(): number;
	get minElevationForCurrentTile(): number;
	get padding(): PaddingOptions;
	get unmodified(): boolean;
	get renderWorldCopies(): boolean;
	/**
	 * The distance from the camera to the center of the map in pixels space.
	 */
	get cameraToCenterDistance(): number;
	get nearZ(): number;
	get farZ(): number;
	get autoCalculateNearFarZ(): boolean;
}
interface ITransformMutators {
	clone(): ITransform;
	apply(that: IReadonlyTransform): void;
	/**
	 * Sets the transform's minimal allowed zoom level.
	 * Automatically constrains the transform's zoom to the new range and recomputes internal matrices if needed.
	 */
	setMinZoom(zoom: number): void;
	/**
	 * Sets the transform's maximal allowed zoom level.
	 * Automatically constrains the transform's zoom to the new range and recomputes internal matrices if needed.
	 */
	setMaxZoom(zoom: number): void;
	/**
	 * Sets the transform's minimal allowed pitch, in degrees.
	 * Automatically constrains the transform's pitch to the new range and recomputes internal matrices if needed.
	 */
	setMinPitch(pitch: number): void;
	/**
	 * Sets the transform's maximal allowed pitch, in degrees.
	 * Automatically constrains the transform's pitch to the new range and recomputes internal matrices if needed.
	 */
	setMaxPitch(pitch: number): void;
	setRenderWorldCopies(renderWorldCopies: boolean): void;
	/**
	 * Sets the transform's bearing, in degrees.
	 * Recomputes internal matrices if needed.
	 */
	setBearing(bearing: number): void;
	/**
	 * Sets the transform's pitch, in degrees.
	 * Recomputes internal matrices if needed.
	 */
	setPitch(pitch: number): void;
	/**
	 * Sets the transform's roll, in degrees.
	 * Recomputes internal matrices if needed.
	 */
	setRoll(roll: number): void;
	/**
	 * Sets the transform's vertical field of view, in degrees.
	 * Recomputes internal matrices if needed.
	 */
	setFov(fov: number): void;
	/**
	 * Sets the transform's zoom.
	 * Automatically constrains the transform's center and zoom and recomputes internal matrices if needed.
	 */
	setZoom(zoom: number): void;
	/**
	 * Sets the transform's center.
	 * Automatically constrains the transform's center and zoom and recomputes internal matrices if needed.
	 */
	setCenter(center: LngLat): void;
	setElevation(elevation: number): void;
	setMinElevationForCurrentTile(elevation: number): void;
	setPadding(padding: PaddingOptions): void;
	/**
	 * Sets the overriding values to use for near and far Z instead of what the transform would normally compute.
	 * If set to undefined, the transform will compute its ideal values.
	 * Calling this will set `autoCalculateNearFarZ` to false.
	 */
	overrideNearFarZ(nearZ: number, farZ: number): void;
	/**
	 * Resets near and far Z plane override. Sets `autoCalculateNearFarZ` to true.
	 */
	clearNearFarZOverride(): void;
	/**
	 * Sets the transform's width and height and recomputes internal matrices.
	 */
	resize(width: number, height: number, constrainTransform: boolean): void;
	/**
	 * Helper method to update edge-insets in place
	 *
	 * @param start - the starting padding
	 * @param target - the target padding
	 * @param t - the step/weight
	 */
	interpolatePadding(start: PaddingOptions, target: PaddingOptions, t: number): void;
	/**
	 * This method works in combination with freezeElevation activated.
	 * freezeElevation is enabled during map-panning because during this the camera should sit in constant height.
	 * After panning finished, call this method to recalculate the zoom level and center point for the current camera-height in current terrain.
	 * @param terrain - the terrain
	 */
	recalculateZoomAndCenter(terrain?: Terrain): void;
	/**
	 * Set's the transform's center so that the given point on screen is at the given world coordinates.
	 * @param lnglat - Desired world coordinates of the point.
	 * @param point - The screen point that should lie at the given coordinates.
	 */
	setLocationAtPoint(lnglat: LngLat, point: Point): void;
	/**
	 * Sets or clears the map's geographical constraints.
	 * @param bounds - A {@link LngLatBounds} object describing the new geographic boundaries of the map.
	 */
	setMaxBounds(bounds?: LngLatBounds | null): void;
	/**
	 * @internal
	 * Called before rendering to allow the transform implementation
	 * to precompute data needed to render the given tiles.
	 * Used in mercator transform to precompute tile matrices (posMatrix).
	 * @param coords - Array of tile IDs that will be rendered.
	 */
	populateCache(coords: Array<OverscaledTileID>): void;
	/**
	 * @internal
	 * Sets the transform's transition state from one projection to another.
	 * @param value - The transition state value.
	 * @param error - The error value.
	 */
	setTransitionState(value: number, error: number): void;
}
interface IReadonlyTransform extends ITransformGetters {
	/**
	 * Distance from camera origin to view plane, in pixels.
	 * Calculated using vertical fov and viewport height.
	 * Center is considered to be in the middle of the viewport.
	 */
	get cameraToCenterDistance(): number;
	get modelViewProjectionMatrix(): mat4;
	get projectionMatrix(): mat4;
	/**
	 * Inverse of matrix from camera space to clip space.
	 */
	get inverseProjectionMatrix(): mat4;
	get pixelsToClipSpaceMatrix(): mat4;
	get clipSpaceToPixelsMatrix(): mat4;
	get pixelsToGLUnits(): [
		number,
		number
	];
	get centerOffset(): Point;
	/**
	 * Gets the transform's width and height in pixels (viewport size). Use {@link resize} to set the transform's size.
	 */
	get size(): Point;
	get rotationMatrix(): mat2;
	/**
	 * The center of the screen in pixels with the top-left corner being (0,0)
	 * and +y axis pointing downwards. This accounts for padding.
	 */
	get centerPoint(): Point;
	/**
	 * @internal
	 */
	get pixelsPerMeter(): number;
	/**
	 * @internal
	 * Returns the camera's position transformed to be in the same space as 3D features under this transform's projection. Mostly used for globe + fill-extrusion.
	 */
	get cameraPosition(): vec3;
	/**
	 * Returns if the padding params match
	 *
	 * @param padding - the padding to check against
	 * @returns true if they are equal, false otherwise
	 */
	isPaddingEqual(padding: PaddingOptions): boolean;
	/**
	 * @internal
	 * Return any "wrapped" copies of a given tile coordinate that are visible
	 * in the current view.
	 */
	getVisibleUnwrappedCoordinates(tileID: CanonicalTileID): Array<UnwrappedTileID>;
	/**
	 * @internal
	 * Return the camera frustum for the current view.
	 */
	getCameraFrustum(): Frustum;
	/**
	 * @internal
	 * Return the clipping plane, behind which nothing should be rendered. If the camera frustum is sufficient
	 * to describe the render geometry (additional clipping is not required), this may be null.
	 */
	getClippingPlane(): vec4 | null;
	/**
	 * @internal
	 * Returns this transform's CoveringTilesDetailsProvider.
	 */
	getCoveringTilesDetailsProvider(): CoveringTilesDetailsProvider;
	/**
	 * @internal
	 * Given a LngLat location, return the screen point that corresponds to it.
	 * @param lnglat - location
	 * @param terrain - optional terrain
	 * @returns screen point
	 */
	locationToScreenPoint(lnglat: LngLat, terrain?: Terrain): Point;
	/**
	 * @internal
	 * Given a point on screen, return its LngLat location.
	 * @param p - screen point
	 * @param terrain - optional terrain
	 * @returns lnglat location
	 */
	screenPointToLocation(p: Point, terrain?: Terrain): LngLat;
	/**
	 * @internal
	 * Given a point on screen, return its mercator coordinate.
	 * @param p - the point
	 * @param terrain - optional terrain
	 * @returns lnglat
	 */
	screenPointToMercatorCoordinate(p: Point, terrain?: Terrain): MercatorCoordinate;
	/**
	 * @internal
	 * Returns the map's geographical bounds. When the bearing or pitch is non-zero, the visible region is not
	 * an axis-aligned rectangle, and the result is the smallest bounds that encompasses the visible region.
	 * @returns Returns a {@link LngLatBounds} object describing the map's geographical bounds.
	 */
	getBounds(): LngLatBounds;
	/**
	 * Returns the maximum geographical bounds the map is constrained to, or `null` if none set.
	 * @returns max bounds
	 */
	getMaxBounds(): LngLatBounds | null;
	/**
	 * @internal
	 * Returns whether the specified screen point lies on the map.
	 * May return false if, for example, the point is above the map's horizon, or if doesn't lie on the planet's surface if globe is enabled.
	 * @param p - The point's coordinates.
	 * @param terrain - Optional terrain.
	 */
	isPointOnMapSurface(p: Point, terrain?: Terrain): boolean;
	/**
	 * Get center lngLat and zoom to ensure that longitude and latitude bounds are respected and regions beyond the map bounds are not displayed.
	 */
	getConstrained(lngLat: LngLat, zoom: number): {
		center: LngLat;
		zoom: number;
	};
	maxPitchScaleFactor(): number;
	/**
	 * The camera looks at the map from a 3D (lng, lat, altitude) location. Let's use `cameraLocation`
	 * as the name for the location under the camera and on the surface of the earth (lng, lat, 0).
	 * `cameraPoint` is the projected position of the `cameraLocation`.
	 *
	 * This point is useful to us because only fill-extrusions that are between `cameraPoint` and
	 * the query point on the surface of the earth can extend and intersect the query.
	 *
	 * When the map is not pitched the `cameraPoint` is equivalent to the center of the map because
	 * the camera is right above the center of the map.
	 */
	getCameraPoint(): Point;
	/**
	 * The altitude of the camera above the sea level in meters.
	 */
	getCameraAltitude(): number;
	/**
	 * The longitude and latitude of the camera.
	 */
	getCameraLngLat(): LngLat;
	/**
	 * Given the camera position (lng, lat, alt), calculate the center point and zoom level
	 * @param lngLat - lng, lat of the camera
	 * @param alt - altitude of the camera above sea level, in meters
	 * @param bearing - bearing of the camera, in degrees
	 * @param pitch - pitch angle of the camera, in degrees
	 */
	calculateCenterFromCameraLngLatAlt(lngLat: LngLatLike, alt: number, bearing?: number, pitch?: number): {
		center: LngLat;
		elevation: number;
		zoom: number;
	};
	getRayDirectionFromPixel(p: Point): vec3;
	/**
	 * When the map is pitched, some of the 3D features that intersect a query will not intersect
	 * the query at the surface of the earth. Instead the feature may be closer and only intersect
	 * the query because it extrudes into the air.
	 * @param queryGeometry - For point queries, the line from the query point to the "camera point",
	 * for other geometries, the envelope of the query geometry and the "camera point"
	 * @returns a geometry that includes all of the original query as well as all possible ares of the
	 * screen where the *base* of a visible extrusion could be.
	 *
	 */
	getCameraQueryGeometry(queryGeometry: Array<Point>): Array<Point>;
	/**
	 * Return the distance to the camera in clip space from a LngLat.
	 * This can be compared to the value from the depth buffer (terrain.depthAtPoint)
	 * to determine whether a point is occluded.
	 * @param lngLat - the point
	 * @param elevation - the point's elevation
	 * @returns depth value in clip space (between 0 and 1)
	 */
	lngLatToCameraDepth(lngLat: LngLat, elevation: number): number;
	/**
	 * @internal
	 * Calculate the fogMatrix that, given a tile coordinate, would be used to calculate fog on the map.
	 * Currently only supported in mercator projection.
	 * @param unwrappedTileID - the tile ID
	 */
	calculateFogMatrix(unwrappedTileID: UnwrappedTileID): mat4;
	/**
	 * @internal
	 * Generates a `ProjectionData` instance to be used while rendering the supplied tile.
	 * @param params - Parameters for the projection data generation.
	 */
	getProjectionData(params: ProjectionDataParams): ProjectionData;
	/**
	 * @internal
	 * Returns whether the supplied location is occluded in this projection.
	 * For example during globe rendering a location on the backfacing side of the globe is occluded.
	 */
	isLocationOccluded(lngLat: LngLat): boolean;
	/**
	 * @internal
	 */
	getPixelScale(): number;
	/**
	 * @internal
	 * Allows the projection to adjust the radius of `circle-pitch-alignment: 'map'` circles and heatmap kernels based on the map's latitude.
	 * Circle radius and heatmap kernel radius is multiplied by this value.
	 */
	getCircleRadiusCorrection(): number;
	/**
	 * @internal
	 * Allows the projection to adjust the scale of `text-pitch-alignment: 'map'` symbols's collision boxes based on the map's center and the text anchor.
	 * Only affects the collision boxes (and click areas), scaling of the rendered text is mostly handled in shaders.
	 * @param transform - The map's transform, with only the `center` property, describing the map's longitude and latitude.
	 * @param textAnchorX - Text anchor position inside the tile, X axis.
	 * @param textAnchorY - Text anchor position inside the tile, Y axis.
	 * @param tileID - The tile coordinates.
	 */
	getPitchedTextCorrection(textAnchorX: number, textAnchorY: number, tileID: UnwrappedTileID): number;
	/**
	 * @internal
	 * Returns light direction transformed to be in the same space as 3D features under this projection. Mostly used for globe + fill-extrusion.
	 * @param transform - Current map transform.
	 * @param dir - The light direction.
	 * @returns A new vector with the transformed light direction.
	 */
	transformLightDirection(dir: vec3): vec3;
	/**
	 * @internal
	 * Projects a point in tile coordinates to clip space. Used in symbol rendering.
	 */
	projectTileCoordinates(x: number, y: number, unwrappedTileID: UnwrappedTileID, getElevation: (x: number, y: number) => number): PointProjection;
	/**
	 * Returns a matrix that will place, rotate and scale a model to display at the given location and altitude
	 * while also being projected by the custom layer matrix.
	 * This function is intended to be called from custom layers.
	 * @param location - Location of the model.
	 * @param altitude - Altitude of the model. May be undefined.
	 */
	getMatrixForModel(location: LngLatLike, altitude?: number): mat4;
	/**
	 * Return projection data such that coordinates in mercator projection in range 0..1 will get projected to the map correctly.
	 */
	getProjectionDataForCustomLayer(applyGlobeMatrix: boolean): ProjectionData;
	/**
	 * Returns a tile-specific projection matrix. Used for symbol placement fast-path for mercator transform.
	 */
	getFastPathSimpleProjectionMatrix(tileID: OverscaledTileID): mat4 | undefined;
}
interface ITransform extends IReadonlyTransform, ITransformMutators {
}
type QueryParameters = {
	scale: number;
	pixelPosMatrix: mat4;
	transform: IReadonlyTransform;
	tileSize: number;
	queryGeometry: Array<Point>;
	cameraQueryGeometry: Array<Point>;
	queryPadding: number;
	getElevation: undefined | ((x: number, y: number) => number);
	params: {
		filter?: FilterSpecification;
		layers?: Set<string> | null;
		availableImages?: Array<string>;
	};
};
type QueryResults = {
	[_: string]: QueryResultsItem[];
};
type QueryResultsItem = {
	featureIndex: number;
	feature: GeoJSONFeature;
	intersectionZ?: boolean | number;
};
declare class FeatureIndex {
	tileID: OverscaledTileID;
	x: number;
	y: number;
	z: number;
	grid: TransferableGridIndex;
	grid3D: TransferableGridIndex;
	featureIndexArray: FeatureIndexArray;
	promoteId?: PromoteIdSpecification;
	rawTileData: ArrayBuffer;
	bucketLayerIDs: Array<Array<string>>;
	vtLayers: {
		[_: string]: VectorTileLayer;
	};
	sourceLayerCoder: DictionaryCoder;
	constructor(tileID: OverscaledTileID, promoteId?: PromoteIdSpecification | null);
	insert(feature: VectorTileFeature, geometry: Array<Array<Point>>, featureIndex: number, sourceLayerIndex: number, bucketIndex: number, is3D?: boolean): void;
	loadVTLayers(): {
		[_: string]: VectorTileLayer;
	};
	query(args: QueryParameters, styleLayers: {
		[_: string]: StyleLayer;
	}, serializedLayers: {
		[_: string]: any;
	}, sourceFeatureState: SourceFeatureState): QueryResults;
	loadMatchingFeature(result: QueryResults, bucketIndex: number, sourceLayerIndex: number, featureIndex: number, filter: FeatureFilter, filterLayerIDs: Set<string> | undefined, availableImages: Array<string>, styleLayers: {
		[_: string]: StyleLayer;
	}, serializedLayers: {
		[_: string]: any;
	}, sourceFeatureState?: SourceFeatureState, intersectionTest?: (feature: VectorTileFeature, styleLayer: StyleLayer, featureState: any, id: string | number | void) => boolean | number): void;
	lookupSymbolFeatures(symbolFeatureIndexes: Array<number>, serializedLayers: {
		[_: string]: StyleLayer;
	}, bucketIndex: number, sourceLayerIndex: number, filterSpec: FilterSpecification, filterLayerIDs: Set<string> | null, availableImages: Array<string>, styleLayers: {
		[_: string]: StyleLayer;
	}): QueryResults;
	hasLayer(id: string): boolean;
	getId(feature: VectorTileFeature, sourceLayerId: string): string | number;
}
type DEMEncoding = "mapbox" | "terrarium" | "custom";
declare class DEMData {
	uid: string | number;
	data: Uint32Array;
	stride: number;
	dim: number;
	min: number;
	max: number;
	redFactor: number;
	greenFactor: number;
	blueFactor: number;
	baseShift: number;
	/**
	 * Constructs a `DEMData` object
	 * @param uid - the tile's unique id
	 * @param data - RGBAImage data has uniform 1px padding on all sides: square tile edge size defines stride
	// and dim is calculated as stride - 2.
	 * @param encoding - the encoding type of the data
	 * @param redFactor - the red channel factor used to unpack the data, used for `custom` encoding only
	 * @param greenFactor - the green channel factor used to unpack the data, used for `custom` encoding only
	 * @param blueFactor - the blue channel factor used to unpack the data, used for `custom` encoding only
	 * @param baseShift - the base shift used to unpack the data, used for `custom` encoding only
	 */
	constructor(uid: string | number, data: RGBAImage | ImageData, encoding: DEMEncoding, redFactor?: number, greenFactor?: number, blueFactor?: number, baseShift?: number);
	get(x: number, y: number): number;
	getUnpackVector(): number[];
	_idx(x: number, y: number): number;
	unpack(r: number, g: number, b: number): number;
	pack(v: number): {
		r: number;
		g: number;
		b: number;
	};
	getPixels(): RGBAImage;
	backfillBorder(borderTile: DEMData, dx: number, dy: number): void;
}
type CircleGranularity = 1 | 3 | 5 | 7;
declare class SubdivisionGranularityExpression {
	/**
	 * A tile of zoom level 0 will be subdivided to this granularity level.
	 * Each subsequent zoom level will have its granularity halved.
	 */
	private readonly _baseZoomGranularity;
	/**
	 * No tile will have granularity level smaller than this.
	 */
	private readonly _minGranularity;
	constructor(baseZoomGranularity: number, minGranularity: number);
	getGranularityForZoomLevel(zoomLevel: number): number;
}
declare class SubdivisionGranularitySetting {
	/**
	 * Granularity settings used for fill and fill-extrusion layers (for fill, both polygons and their anti-aliasing outlines).
	 */
	readonly fill: SubdivisionGranularityExpression;
	/**
	 * Granularity used for the line layer.
	 */
	readonly line: SubdivisionGranularityExpression;
	/**
	 * Granularity used for geometry covering the entire tile: raster tiles, etc.
	 */
	readonly tile: SubdivisionGranularityExpression;
	/**
	 * Granularity used for stencil masks for tiles.
	 */
	readonly stencil: SubdivisionGranularityExpression;
	/**
	 * Controls the granularity of `pitch-alignment: map` circles and heatmap kernels.
	 * More granular circles will more closely follow the map's surface.
	 */
	readonly circle: CircleGranularity;
	constructor(options: {
		/**
		 * Granularity settings used for fill and fill-extrusion layers (for fill, both polygons and their anti-aliasing outlines).
		 */
		fill: SubdivisionGranularityExpression;
		/**
		 * Granularity used for the line layer.
		 */
		line: SubdivisionGranularityExpression;
		/**
		 * Granularity used for geometry covering the entire tile: stencil masks, raster tiles, etc.
		 */
		tile: SubdivisionGranularityExpression;
		/**
		 * Granularity used for stencil masks for tiles.
		 */
		stencil: SubdivisionGranularityExpression;
		/**
		 * Controls the granularity of `pitch-alignment: map` circles and heatmap kernels.
		 * More granular circles will more closely follow the map's surface.
		 */
		circle: CircleGranularity;
	});
	/**
	 * Granularity settings that disable subdivision altogether.
	 */
	static readonly noSubdivision: SubdivisionGranularitySetting;
}
type TileParameters = {
	type: string;
	source: string;
	uid: string | number;
};
type WorkerTileParameters = TileParameters & {
	tileID: OverscaledTileID;
	request?: RequestParameters;
	zoom: number;
	maxZoom?: number;
	tileSize: number;
	promoteId: PromoteIdSpecification;
	pixelRatio: number;
	showCollisionBoxes: boolean;
	collectResourceTiming?: boolean;
	returnDependencies?: boolean;
	subdivisionGranularity: SubdivisionGranularitySetting;
	globalState: Record<string, any>;
};
type WorkerDEMTileParameters = TileParameters & {
	rawImageData: RGBAImage | ImageBitmap | ImageData;
	encoding: DEMEncoding;
	redFactor: number;
	greenFactor: number;
	blueFactor: number;
	baseShift: number;
};
type WorkerTileResult = ExpiryData & {
	buckets: Array<Bucket>;
	imageAtlas: ImageAtlas;
	glyphAtlasImage: AlphaImage;
	featureIndex: FeatureIndex;
	collisionBoxArray: CollisionBoxArray;
	rawTileData?: ArrayBuffer;
	resourceTiming?: Array<PerformanceResourceTiming>;
	glyphMap?: {
		[_: string]: {
			[_: number]: StyleGlyph;
		};
	} | null;
	iconMap?: {
		[_: string]: StyleImage;
	} | null;
	glyphPositions?: GlyphPositions | null;
};
type OverlapMode = "never" | "always" | "cooperative";
type QueryResult<T> = {
	key: T;
	x1: number;
	y1: number;
	x2: number;
	y2: number;
};
type GridKey = {
	overlapMode?: OverlapMode;
};
declare class GridIndex<T extends GridKey> {
	circleKeys: Array<T>;
	boxKeys: Array<T>;
	boxCells: Array<Array<number>>;
	circleCells: Array<Array<number>>;
	bboxes: Array<number>;
	circles: Array<number>;
	xCellCount: number;
	yCellCount: number;
	width: number;
	height: number;
	xScale: number;
	yScale: number;
	boxUid: number;
	circleUid: number;
	constructor(width: number, height: number, cellSize: number);
	keysLength(): number;
	insert(key: T, x1: number, y1: number, x2: number, y2: number): void;
	insertCircle(key: T, x: number, y: number, radius: number): void;
	private _insertBoxCell;
	private _insertCircleCell;
	private _query;
	query(x1: number, y1: number, x2: number, y2: number): Array<QueryResult<T>>;
	hitTest(x1: number, y1: number, x2: number, y2: number, overlapMode: OverlapMode, predicate?: (key: T) => boolean): boolean;
	hitTestCircle(x: number, y: number, radius: number, overlapMode: OverlapMode, predicate?: (key: T) => boolean): boolean;
	private _queryCell;
	private _queryCellCircle;
	private _forEachCell;
	private _convertToXCellCoord;
	private _convertToYCellCoord;
	private _circlesCollide;
	private _circleAndRectCollide;
}
type PlacedCircles = {
	circles: Array<number>;
	offscreen: boolean;
	collisionDetected: boolean;
};
type PlacedBox = {
	box: Array<number>;
	placeable: boolean;
	offscreen: boolean;
	occluded: boolean;
};
type FeatureKey = {
	bucketInstanceId: number;
	featureIndex: number;
	collisionGroupID: number;
	overlapMode: OverlapMode;
};
declare class CollisionIndex {
	grid: GridIndex<FeatureKey>;
	ignoredGrid: GridIndex<FeatureKey>;
	transform: IReadonlyTransform;
	pitchFactor: number;
	screenRightBoundary: number;
	screenBottomBoundary: number;
	gridRightBoundary: number;
	gridBottomBoundary: number;
	perspectiveRatioCutoff: number;
	constructor(transform: IReadonlyTransform, grid?: GridIndex<FeatureKey>, ignoredGrid?: GridIndex<FeatureKey>);
	placeCollisionBox(collisionBox: SingleCollisionBox, overlapMode: OverlapMode, textPixelRatio: number, tileID: OverscaledTileID, unwrappedTileID: UnwrappedTileID, pitchWithMap: boolean, rotateWithMap: boolean, translation: [
		number,
		number
	], collisionGroupPredicate?: (key: FeatureKey) => boolean, getElevation?: (x: number, y: number) => number, shift?: Point, simpleProjectionMatrix?: mat4): PlacedBox;
	placeCollisionCircles(overlapMode: OverlapMode, symbol: any, lineVertexArray: SymbolLineVertexArray, glyphOffsetArray: GlyphOffsetArray, fontSize: number, unwrappedTileID: UnwrappedTileID, pitchedLabelPlaneMatrix: mat4, showCollisionCircles: boolean, pitchWithMap: boolean, collisionGroupPredicate: (key: FeatureKey) => boolean, circlePixelDiameter: number, textPixelPadding: number, translation: [
		number,
		number
	], getElevation: (x: number, y: number) => number): PlacedCircles;
	projectPathToScreenSpace(projectedPath: Array<Point>, projectionContext: SymbolProjectionContext): Array<PointProjection>;
	/**
	 * Because the geometries in the CollisionIndex are an approximation of the shape of
	 * symbols on the map, we use the CollisionIndex to look up the symbol part of
	 * `queryRenderedFeatures`.
	 */
	queryRenderedSymbols(viewportQueryGeometry: Array<Point>): {};
	insertCollisionBox(collisionBox: Array<number>, overlapMode: OverlapMode, ignorePlacement: boolean, bucketInstanceId: number, featureIndex: number, collisionGroupID: number): void;
	insertCollisionCircles(collisionCircles: Array<number>, overlapMode: OverlapMode, ignorePlacement: boolean, bucketInstanceId: number, featureIndex: number, collisionGroupID: number): void;
	projectAndGetPerspectiveRatio(x: number, y: number, unwrappedTileID: UnwrappedTileID, getElevation?: (x: number, y: number) => number, simpleProjectionMatrix?: mat4): {
		x: number;
		y: number;
		perspectiveRatio: number;
		isOccluded: boolean;
		signedDistanceFromCamera: any;
	};
	getPerspectiveRatio(x: number, y: number, unwrappedTileID: UnwrappedTileID, getElevation?: (x: number, y: number) => number): number;
	isOffscreen(x1: number, y1: number, x2: number, y2: number): boolean;
	isInsideGrid(x1: number, y1: number, x2: number, y2: number): boolean;
	getViewportMatrix(): mat4;
	/**
	 * Applies all layout+paint properties of the given box in order to find as good approximation of its screen-space bounding box as possible.
	 */
	private _projectCollisionBox;
}
declare enum TextAnchorEnum {
	"center" = 1,
	"left" = 2,
	"right" = 3,
	"top" = 4,
	"bottom" = 5,
	"top-left" = 6,
	"top-right" = 7,
	"bottom-left" = 8,
	"bottom-right" = 9
}
type TextAnchor = keyof typeof TextAnchorEnum;
declare class OpacityState {
	opacity: number;
	placed: boolean;
	constructor(prevState: OpacityState, increment: number, placed: boolean, skipFade?: boolean | null);
	isHidden(): boolean;
}
declare class JointOpacityState {
	text: OpacityState;
	icon: OpacityState;
	constructor(prevState: JointOpacityState, increment: number, placedText: boolean, placedIcon: boolean, skipFade?: boolean | null);
	isHidden(): boolean;
}
declare class JointPlacement {
	text: boolean;
	icon: boolean;
	skipFade: boolean;
	constructor(text: boolean, icon: boolean, skipFade: boolean);
}
declare class RetainedQueryData {
	bucketInstanceId: number;
	featureIndex: FeatureIndex;
	sourceLayerIndex: number;
	bucketIndex: number;
	tileID: OverscaledTileID;
	featureSortOrder: Array<number>;
	constructor(bucketInstanceId: number, featureIndex: FeatureIndex, sourceLayerIndex: number, bucketIndex: number, tileID: OverscaledTileID);
}
type CollisionGroup = {
	ID: number;
	predicate?: (key: FeatureKey) => boolean;
};
declare class CollisionGroups {
	collisionGroups: {
		[groupName: string]: CollisionGroup;
	};
	maxGroupID: number;
	crossSourceCollisions: boolean;
	constructor(crossSourceCollisions: boolean);
	get(sourceID: string): CollisionGroup;
}
type VariableOffset = {
	textOffset: [
		number,
		number
	];
	width: number;
	height: number;
	anchor: TextAnchor;
	textBoxScale: number;
	prevAnchor?: TextAnchor;
};
type CrossTileID = string | number;
declare class Placement {
	transform: IReadonlyTransform;
	terrain: Terrain;
	collisionIndex: CollisionIndex;
	placements: {
		[_ in CrossTileID]: JointPlacement;
	};
	opacities: {
		[_ in CrossTileID]: JointOpacityState;
	};
	variableOffsets: {
		[_ in CrossTileID]: VariableOffset;
	};
	placedOrientations: {
		[_ in CrossTileID]: number;
	};
	commitTime: number;
	prevZoomAdjustment: number;
	lastPlacementChangeTime: number;
	stale: boolean;
	fadeDuration: number;
	retainedQueryData: {
		[_: number]: RetainedQueryData;
	};
	collisionGroups: CollisionGroups;
	prevPlacement: Placement;
	zoomAtLastRecencyCheck: number;
	collisionCircleArrays: {
		[k in any]: Array<number>;
	};
	collisionBoxArrays: Map<number, Map<number, {
		text: number[];
		icon: number[];
	}>>;
	constructor(transform: ITransform, terrain: Terrain, fadeDuration: number, crossSourceCollisions: boolean, prevPlacement?: Placement);
	private _getTerrainElevationFunc;
	getBucketParts(results: Array<BucketPart>, styleLayer: StyleLayer, tile: Tile, sortAcrossTiles: boolean): void;
	attemptAnchorPlacement(textAnchorOffset: TextAnchorOffset, textBox: SingleCollisionBox, width: number, height: number, textBoxScale: number, rotateWithMap: boolean, pitchWithMap: boolean, textPixelRatio: number, tileID: OverscaledTileID, unwrappedTileID: any, collisionGroup: CollisionGroup, textOverlapMode: OverlapMode, symbolInstance: SymbolInstance, bucket: SymbolBucket, orientation: number, translationText: [
		number,
		number
	], translationIcon: [
		number,
		number
	], iconBox?: SingleCollisionBox | null, getElevation?: (x: number, y: number) => number, simpleProjectionMatrix?: mat4): {
		shift: Point;
		placedGlyphBoxes: PlacedBox;
	};
	placeLayerBucketPart(bucketPart: BucketPart, seenCrossTileIDs: {
		[k in string | number]: boolean;
	}, showCollisionBoxes: boolean): void;
	storeCollisionData(bucketInstanceId: number, symbolIndex: number, collisionArrays: CollisionArrays, placedGlyphBoxes: PlacedBox, placedIconBoxes: PlacedBox, placedGlyphCircles: PlacedCircles): void;
	markUsedJustification(bucket: SymbolBucket, placedAnchor: TextAnchor, symbolInstance: SymbolInstance, orientation: number): void;
	markUsedOrientation(bucket: SymbolBucket, orientation: number, symbolInstance: SymbolInstance): void;
	commit(now: number): void;
	updateLayerOpacities(styleLayer: StyleLayer, tiles: Array<Tile>): void;
	updateBucketOpacities(bucket: SymbolBucket, tileID: OverscaledTileID, seenCrossTileIDs: {
		[k in string | number]: boolean;
	}, collisionBoxArray?: CollisionBoxArray | null): void;
	symbolFadeChange(now: number): number;
	zoomAdjustment(zoom: number): number;
	hasTransitions(now: number): boolean;
	stillRecent(now: number, zoom: number): boolean;
	setStale(): void;
}
type QueryRenderedFeaturesOptions = {
	/**
	 * An array or set of [style layer IDs](https://maplibre.org/maplibre-style-spec/#layer-id) for the query to inspect.
	 * Only features within these layers will be returned. If this parameter is undefined, all layers will be checked.
	 */
	layers?: Array<string> | Set<string>;
	/**
	 * A [filter](https://maplibre.org/maplibre-style-spec/layers/#filter) to limit query results.
	 */
	filter?: FilterSpecification;
	/**
	 * An array of string representing the available images
	 */
	availableImages?: Array<string>;
	/**
	 * Whether to check if the [options.filter] conforms to the MapLibre Style Specification. Disabling validation is a performance optimization that should only be used if you have previously validated the values you will be passing to this function.
	 */
	validate?: boolean;
};
type QueryRenderedFeaturesOptionsStrict = Omit<QueryRenderedFeaturesOptions, "layers"> & {
	layers: Set<string> | null;
};
type QuerySourceFeatureOptions = {
	/**
	 * The name of the source layer to query. *For vector tile sources, this parameter is required.* For GeoJSON sources, it is ignored.
	 */
	sourceLayer?: string;
	/**
	 * A [filter](https://maplibre.org/maplibre-style-spec/layers/#filter)
	 * to limit query results.
	 */
	filter?: FilterSpecification;
	/**
	 * Whether to check if the [parameters.filter] conforms to the MapLibre Style Specification. Disabling validation is a performance optimization that should only be used if you have previously validated the values you will be passing to this function.
	 * @defaultValue true
	 */
	validate?: boolean;
};
type QueryRenderedFeaturesResults = {
	[key: string]: QueryRenderedFeaturesResultsItem[];
};
type QueryRenderedFeaturesResultsItem = QueryResultsItem & {
	feature: MapGeoJSONFeature;
};
type TileState = "loading" | "loaded" | "reloading" | "unloaded" | "errored" | "expired";
declare class Tile {
	tileID: OverscaledTileID;
	uid: number;
	uses: number;
	tileSize: number;
	buckets: {
		[_: string]: Bucket;
	};
	latestFeatureIndex: FeatureIndex;
	latestRawTileData: ArrayBuffer;
	imageAtlas: ImageAtlas;
	imageAtlasTexture: Texture$1;
	glyphAtlasImage: AlphaImage;
	glyphAtlasTexture: Texture$1;
	expirationTime: any;
	expiredRequestCount: number;
	state: TileState;
	timeAdded: number;
	fadeEndTime: number;
	collisionBoxArray: CollisionBoxArray;
	redoWhenDone: boolean;
	showCollisionBoxes: boolean;
	placementSource: any;
	actor: Actor;
	vtLayers: {
		[_: string]: VectorTileLayer;
	};
	neighboringTiles: any;
	dem: DEMData;
	demMatrix: mat4;
	aborted: boolean;
	needsHillshadePrepare: boolean;
	needsTerrainPrepare: boolean;
	abortController: AbortController;
	texture: any;
	fbo: Framebuffer;
	demTexture: Texture$1;
	refreshedUponExpiration: boolean;
	reloadPromise: {
		resolve: () => void;
		reject: () => void;
	};
	resourceTiming: Array<PerformanceResourceTiming>;
	queryPadding: number;
	symbolFadeHoldUntil: number;
	hasSymbolBuckets: boolean;
	hasRTLText: boolean;
	dependencies: any;
	rtt: Array<{
		id: number;
		stamp: number;
	}>;
	rttCoords: {
		[_: string]: string;
	};
	/**
	 * @param tileID - the tile ID
	 * @param size - The tile size
	 */
	constructor(tileID: OverscaledTileID, size: number);
	registerFadeDuration(duration: number): void;
	wasRequested(): boolean;
	clearTextures(painter: any): void;
	/**
	 * Given a data object with a 'buffers' property, load it into
	 * this tile's elementGroups and buffers properties and set loaded
	 * to true. If the data is null, like in the case of an empty
	 * GeoJSON tile, no-op but still set loaded to true.
	 * @param data - The data from the worker
	 * @param painter - the painter
	 * @param justReloaded - `true` to just reload
	 */
	loadVectorData(data: WorkerTileResult, painter: any, justReloaded?: boolean | null): void;
	/**
	 * Release any data or WebGL resources referenced by this tile.
	 */
	unloadVectorData(): void;
	getBucket(layer: StyleLayer): Bucket;
	upload(context: Context): void;
	prepare(imageManager: ImageManager): void;
	queryRenderedFeatures(layers: {
		[_: string]: StyleLayer;
	}, serializedLayers: {
		[_: string]: any;
	}, sourceFeatureState: SourceFeatureState, queryGeometry: Array<Point>, cameraQueryGeometry: Array<Point>, scale: number, params: Pick<QueryRenderedFeaturesOptionsStrict, "filter" | "layers" | "availableImages"> | undefined, transform: IReadonlyTransform, maxPitchScaleFactor: number, pixelPosMatrix: mat4, getElevation: undefined | ((x: number, y: number) => number)): QueryResults;
	querySourceFeatures(result: Array<GeoJSONFeature>, params?: {
		sourceLayer?: string;
		filter?: FilterSpecification;
		validate?: boolean;
	}): void;
	hasData(): boolean;
	patternsLoaded(): boolean;
	setExpiryData(data: ExpiryData): void;
	getExpiryTimeout(): number;
	setFeatureState(states: LayerFeatureStates, painter: any): void;
	holdingForFade(): boolean;
	symbolFadeFinished(): boolean;
	clearFadeHold(): void;
	setHoldDuration(duration: number): void;
	setDependencies(namespace: string, dependencies: Array<string>): void;
	hasDependency(namespaces: Array<string>, keys: Array<string>): boolean;
}
type FeatureStates = {
	[featureId: string]: FeatureState;
};
type LayerFeatureStates = {
	[layer: string]: FeatureStates;
};
declare class SourceFeatureState {
	state: LayerFeatureStates;
	stateChanges: LayerFeatureStates;
	deletedStates: {};
	constructor();
	updateState(sourceLayer: string, featureId: number | string, newState: any): void;
	removeFeatureState(sourceLayer: string, featureId?: number | string, key?: string): void;
	getState(sourceLayer: string, featureId: number | string): FeatureState;
	initializeTileState(tile: Tile, painter: any): void;
	coalesceChanges(tiles: {
		[_ in any]: Tile;
	}, painter: any): void;
}
declare class CircleBucket<Layer extends CircleStyleLayer | HeatmapStyleLayer> implements Bucket {
	index: number;
	zoom: number;
	globalState: Record<string, any>;
	overscaling: number;
	layerIds: Array<string>;
	layers: Array<Layer>;
	stateDependentLayers: Array<Layer>;
	stateDependentLayerIds: Array<string>;
	layoutVertexArray: CircleLayoutArray;
	layoutVertexBuffer: VertexBuffer;
	indexArray: TriangleIndexArray;
	indexBuffer: IndexBuffer;
	hasPattern: boolean;
	programConfigurations: ProgramConfigurationSet<Layer>;
	segments: SegmentVector;
	uploaded: boolean;
	constructor(options: BucketParameters<Layer>);
	populate(features: Array<IndexedFeature>, options: PopulateParameters, canonical: CanonicalTileID): void;
	update(states: FeatureStates, vtLayer: VectorTileLayer, imagePositions: {
		[_: string]: ImagePosition;
	}): void;
	isEmpty(): boolean;
	uploadPending(): boolean;
	upload(context: Context): void;
	destroy(): void;
	addFeature(feature: BucketFeature, geometry: Array<Array<Point>>, index: number, canonical: CanonicalTileID, granularity?: CircleGranularity): void;
}
type CircleLayoutProps = {
	"circle-sort-key": DataDrivenProperty<number>;
};
type CircleLayoutPropsPossiblyEvaluated = {
	"circle-sort-key": PossiblyEvaluatedPropertyValue<number>;
};
type CirclePaintProps = {
	"circle-radius": DataDrivenProperty<number>;
	"circle-color": DataDrivenProperty<Color$1>;
	"circle-blur": DataDrivenProperty<number>;
	"circle-opacity": DataDrivenProperty<number>;
	"circle-translate": DataConstantProperty<[
		number,
		number
	]>;
	"circle-translate-anchor": DataConstantProperty<"map" | "viewport">;
	"circle-pitch-scale": DataConstantProperty<"map" | "viewport">;
	"circle-pitch-alignment": DataConstantProperty<"map" | "viewport">;
	"circle-stroke-width": DataDrivenProperty<number>;
	"circle-stroke-color": DataDrivenProperty<Color$1>;
	"circle-stroke-opacity": DataDrivenProperty<number>;
};
type CirclePaintPropsPossiblyEvaluated = {
	"circle-radius": PossiblyEvaluatedPropertyValue<number>;
	"circle-color": PossiblyEvaluatedPropertyValue<Color$1>;
	"circle-blur": PossiblyEvaluatedPropertyValue<number>;
	"circle-opacity": PossiblyEvaluatedPropertyValue<number>;
	"circle-translate": [
		number,
		number
	];
	"circle-translate-anchor": "map" | "viewport";
	"circle-pitch-scale": "map" | "viewport";
	"circle-pitch-alignment": "map" | "viewport";
	"circle-stroke-width": PossiblyEvaluatedPropertyValue<number>;
	"circle-stroke-color": PossiblyEvaluatedPropertyValue<Color$1>;
	"circle-stroke-opacity": PossiblyEvaluatedPropertyValue<number>;
};
declare class CircleStyleLayer extends StyleLayer {
	_unevaluatedLayout: Layout<CircleLayoutProps>;
	layout: PossiblyEvaluated<CircleLayoutProps, CircleLayoutPropsPossiblyEvaluated>;
	_transitionablePaint: Transitionable<CirclePaintProps>;
	_transitioningPaint: Transitioning<CirclePaintProps>;
	paint: PossiblyEvaluated<CirclePaintProps, CirclePaintPropsPossiblyEvaluated>;
	constructor(layer: LayerSpecification);
	createBucket(parameters: BucketParameters<any>): CircleBucket<any>;
	queryRadius(bucket: Bucket): number;
	queryIntersectsFeature({ queryGeometry, feature, featureState, geometry, transform, pixelsToTileUnits, unwrappedTileID, getElevation }: QueryIntersectsFeatureParams): boolean;
}
declare class FillBucket implements Bucket {
	index: number;
	zoom: number;
	overscaling: number;
	layers: Array<FillStyleLayer>;
	layerIds: Array<string>;
	stateDependentLayers: Array<FillStyleLayer>;
	stateDependentLayerIds: Array<string>;
	patternFeatures: Array<BucketFeature>;
	globalState: Record<string, any>;
	layoutVertexArray: FillLayoutArray;
	layoutVertexBuffer: VertexBuffer;
	indexArray: TriangleIndexArray;
	indexBuffer: IndexBuffer;
	indexArray2: LineIndexArray;
	indexBuffer2: IndexBuffer;
	hasPattern: boolean;
	programConfigurations: ProgramConfigurationSet<FillStyleLayer>;
	segments: SegmentVector;
	segments2: SegmentVector;
	uploaded: boolean;
	constructor(options: BucketParameters<FillStyleLayer>);
	populate(features: Array<IndexedFeature>, options: PopulateParameters, canonical: CanonicalTileID): void;
	update(states: FeatureStates, vtLayer: VectorTileLayer, imagePositions: {
		[_: string]: ImagePosition;
	}): void;
	addFeatures(options: PopulateParameters, canonical: CanonicalTileID, imagePositions: {
		[_: string]: ImagePosition;
	}): void;
	isEmpty(): boolean;
	uploadPending(): boolean;
	upload(context: Context): void;
	destroy(): void;
	addFeature(feature: BucketFeature, geometry: Array<Array<Point>>, index: number, canonical: CanonicalTileID, imagePositions: {
		[_: string]: ImagePosition;
	}, subdivisionGranularity: SubdivisionGranularitySetting): void;
}
type FillLayoutProps = {
	"fill-sort-key": DataDrivenProperty<number>;
};
type FillLayoutPropsPossiblyEvaluated = {
	"fill-sort-key": PossiblyEvaluatedPropertyValue<number>;
};
type FillPaintProps = {
	"fill-antialias": DataConstantProperty<boolean>;
	"fill-opacity": DataDrivenProperty<number>;
	"fill-color": DataDrivenProperty<Color$1>;
	"fill-outline-color": DataDrivenProperty<Color$1>;
	"fill-translate": DataConstantProperty<[
		number,
		number
	]>;
	"fill-translate-anchor": DataConstantProperty<"map" | "viewport">;
	"fill-pattern": CrossFadedDataDrivenProperty<ResolvedImage>;
};
type FillPaintPropsPossiblyEvaluated = {
	"fill-antialias": boolean;
	"fill-opacity": PossiblyEvaluatedPropertyValue<number>;
	"fill-color": PossiblyEvaluatedPropertyValue<Color$1>;
	"fill-outline-color": PossiblyEvaluatedPropertyValue<Color$1>;
	"fill-translate": [
		number,
		number
	];
	"fill-translate-anchor": "map" | "viewport";
	"fill-pattern": PossiblyEvaluatedPropertyValue<CrossFaded<ResolvedImage>>;
};
declare class FillStyleLayer extends StyleLayer {
	_unevaluatedLayout: Layout<FillLayoutProps>;
	layout: PossiblyEvaluated<FillLayoutProps, FillLayoutPropsPossiblyEvaluated>;
	_transitionablePaint: Transitionable<FillPaintProps>;
	_transitioningPaint: Transitioning<FillPaintProps>;
	paint: PossiblyEvaluated<FillPaintProps, FillPaintPropsPossiblyEvaluated>;
	constructor(layer: LayerSpecification);
	recalculate(parameters: EvaluationParameters, availableImages: Array<string>): void;
	createBucket(parameters: BucketParameters<any>): FillBucket;
	queryRadius(): number;
	queryIntersectsFeature({ queryGeometry, geometry, transform, pixelsToTileUnits }: QueryIntersectsFeatureParams): boolean;
	isTileClipped(): boolean;
}
declare class FillExtrusionBucket implements Bucket {
	index: number;
	zoom: number;
	globalState: Record<string, any>;
	overscaling: number;
	layers: Array<FillExtrusionStyleLayer>;
	layerIds: Array<string>;
	stateDependentLayers: Array<FillExtrusionStyleLayer>;
	stateDependentLayerIds: Array<string>;
	layoutVertexArray: FillExtrusionLayoutArray;
	layoutVertexBuffer: VertexBuffer;
	centroidVertexArray: PosArray;
	centroidVertexBuffer: VertexBuffer;
	indexArray: TriangleIndexArray;
	indexBuffer: IndexBuffer;
	hasPattern: boolean;
	programConfigurations: ProgramConfigurationSet<FillExtrusionStyleLayer>;
	segments: SegmentVector;
	uploaded: boolean;
	features: Array<BucketFeature>;
	constructor(options: BucketParameters<FillExtrusionStyleLayer>);
	populate(features: Array<IndexedFeature>, options: PopulateParameters, canonical: CanonicalTileID): void;
	addFeatures(options: PopulateParameters, canonical: CanonicalTileID, imagePositions: {
		[_: string]: ImagePosition;
	}): void;
	update(states: FeatureStates, vtLayer: VectorTileLayer, imagePositions: {
		[_: string]: ImagePosition;
	}): void;
	isEmpty(): boolean;
	uploadPending(): boolean;
	upload(context: Context): void;
	destroy(): void;
	addFeature(feature: BucketFeature, geometry: Array<Array<Point>>, index: number, canonical: CanonicalTileID, imagePositions: {
		[_: string]: ImagePosition;
	}, subdivisionGranularity: SubdivisionGranularitySetting): void;
	private processPolygon;
	/**
	 * Generates side faces for the supplied geometry. Assumes `geometry` to be a line string, like the output of {@link subdivideVertexLine}.
	 * For rings, it is assumed that the first and last vertex of `geometry` are equal.
	 */
	private _generateSideFaces;
}
type FillExtrusionPaintProps = {
	"fill-extrusion-opacity": DataConstantProperty<number>;
	"fill-extrusion-color": DataDrivenProperty<Color$1>;
	"fill-extrusion-translate": DataConstantProperty<[
		number,
		number
	]>;
	"fill-extrusion-translate-anchor": DataConstantProperty<"map" | "viewport">;
	"fill-extrusion-pattern": CrossFadedDataDrivenProperty<ResolvedImage>;
	"fill-extrusion-height": DataDrivenProperty<number>;
	"fill-extrusion-base": DataDrivenProperty<number>;
	"fill-extrusion-vertical-gradient": DataConstantProperty<boolean>;
};
type FillExtrusionPaintPropsPossiblyEvaluated = {
	"fill-extrusion-opacity": number;
	"fill-extrusion-color": PossiblyEvaluatedPropertyValue<Color$1>;
	"fill-extrusion-translate": [
		number,
		number
	];
	"fill-extrusion-translate-anchor": "map" | "viewport";
	"fill-extrusion-pattern": PossiblyEvaluatedPropertyValue<CrossFaded<ResolvedImage>>;
	"fill-extrusion-height": PossiblyEvaluatedPropertyValue<number>;
	"fill-extrusion-base": PossiblyEvaluatedPropertyValue<number>;
	"fill-extrusion-vertical-gradient": boolean;
};
declare class FillExtrusionStyleLayer extends StyleLayer {
	_transitionablePaint: Transitionable<FillExtrusionPaintProps>;
	_transitioningPaint: Transitioning<FillExtrusionPaintProps>;
	paint: PossiblyEvaluated<FillExtrusionPaintProps, FillExtrusionPaintPropsPossiblyEvaluated>;
	constructor(layer: LayerSpecification);
	createBucket(parameters: BucketParameters<FillExtrusionStyleLayer>): FillExtrusionBucket;
	queryRadius(): number;
	is3D(): boolean;
	queryIntersectsFeature({ queryGeometry, feature, featureState, geometry, transform, pixelsToTileUnits, pixelPosMatrix }: QueryIntersectsFeatureParams): boolean | number;
}
type HillshadePaintProps = {
	"hillshade-illumination-direction": DataConstantProperty<NumberArray>;
	"hillshade-illumination-altitude": DataConstantProperty<NumberArray>;
	"hillshade-illumination-anchor": DataConstantProperty<"map" | "viewport">;
	"hillshade-exaggeration": DataConstantProperty<number>;
	"hillshade-shadow-color": DataConstantProperty<ColorArray>;
	"hillshade-highlight-color": DataConstantProperty<ColorArray>;
	"hillshade-accent-color": DataConstantProperty<Color$1>;
	"hillshade-method": DataConstantProperty<"standard" | "basic" | "combined" | "igor" | "multidirectional">;
};
type HillshadePaintPropsPossiblyEvaluated = {
	"hillshade-illumination-direction": NumberArray;
	"hillshade-illumination-altitude": NumberArray;
	"hillshade-illumination-anchor": "map" | "viewport";
	"hillshade-exaggeration": number;
	"hillshade-shadow-color": ColorArray;
	"hillshade-highlight-color": ColorArray;
	"hillshade-accent-color": Color$1;
	"hillshade-method": "standard" | "basic" | "combined" | "igor" | "multidirectional";
};
declare class HillshadeStyleLayer extends StyleLayer {
	_transitionablePaint: Transitionable<HillshadePaintProps>;
	_transitioningPaint: Transitioning<HillshadePaintProps>;
	paint: PossiblyEvaluated<HillshadePaintProps, HillshadePaintPropsPossiblyEvaluated>;
	constructor(layer: LayerSpecification);
	getIlluminationProperties(): {
		directionRadians: number[];
		altitudeRadians: number[];
		shadowColor: Color$1[];
		highlightColor: Color$1[];
	};
	hasOffscreenPass(): boolean;
}
type ColorReliefPaintProps = {
	"color-relief-opacity": DataConstantProperty<number>;
	"color-relief-color": ColorRampProperty;
};
type ColorReliefPaintPropsPossiblyEvaluated = {
	"color-relief-opacity": number;
	"color-relief-color": ColorRampProperty;
};
type ColorRamp = {
	elevationStops: Array<number>;
	colorStops: Array<Color$1>;
};
declare class ColorReliefStyleLayer extends StyleLayer {
	colorRampExpression: StylePropertyExpression;
	colorRampTextures: ColorRampTextures;
	_transitionablePaint: Transitionable<ColorReliefPaintProps>;
	_transitioningPaint: Transitioning<ColorReliefPaintProps>;
	paint: PossiblyEvaluated<ColorReliefPaintProps, ColorReliefPaintPropsPossiblyEvaluated>;
	constructor(layer: LayerSpecification);
	/**
	 * Create the color ramp, enforcing a maximum length for the vectors. This modifies the internal color ramp,
	 * so that the remapping is only performed once.
	 *
	 * @param maxLength - the maximum number of stops in the color ramp
	 *
	 * @return a `ColorRamp` object with no more than `maxLength` stops.
	 *
	 */
	_createColorRamp(maxLength: number): ColorRamp;
	_colorRampChanged(): boolean;
	getColorRampTextures(context: Context, maxLength: number, unpackVector: number[]): ColorRampTextures;
	hasOffscreenPass(): boolean;
}
type LineClips = {
	start: number;
	end: number;
};
declare class LineBucket implements Bucket {
	distance: number;
	totalDistance: number;
	maxLineLength: number;
	scaledDistance: number;
	lineClips?: LineClips;
	e1: number;
	e2: number;
	index: number;
	zoom: number;
	globalState: Record<string, any>;
	overscaling: number;
	layers: Array<LineStyleLayer>;
	layerIds: Array<string>;
	gradients: {
		[x: string]: GradientTexture;
	};
	stateDependentLayers: Array<any>;
	stateDependentLayerIds: Array<string>;
	patternFeatures: Array<BucketFeature>;
	lineClipsArray: Array<LineClips>;
	layoutVertexArray: LineLayoutArray;
	layoutVertexBuffer: VertexBuffer;
	layoutVertexArray2: LineExtLayoutArray;
	layoutVertexBuffer2: VertexBuffer;
	indexArray: TriangleIndexArray;
	indexBuffer: IndexBuffer;
	hasPattern: boolean;
	programConfigurations: ProgramConfigurationSet<LineStyleLayer>;
	segments: SegmentVector;
	uploaded: boolean;
	constructor(options: BucketParameters<LineStyleLayer>);
	populate(features: Array<IndexedFeature>, options: PopulateParameters, canonical: CanonicalTileID): void;
	update(states: FeatureStates, vtLayer: VectorTileLayer, imagePositions: {
		[_: string]: ImagePosition;
	}): void;
	addFeatures(options: PopulateParameters, canonical: CanonicalTileID, imagePositions: {
		[_: string]: ImagePosition;
	}): void;
	isEmpty(): boolean;
	uploadPending(): boolean;
	upload(context: Context): void;
	destroy(): void;
	lineFeatureClips(feature: BucketFeature): LineClips | undefined;
	addFeature(feature: BucketFeature, geometry: Array<Array<Point>>, index: number, canonical: CanonicalTileID, imagePositions: {
		[_: string]: ImagePosition;
	}, subdivisionGranularity: SubdivisionGranularitySetting): void;
	addLine(vertices: Array<Point>, feature: BucketFeature, join: string, cap: string, miterLimit: number, roundLimit: number, canonical: CanonicalTileID | undefined, subdivisionGranularity: SubdivisionGranularitySetting): void;
	/**
	 * Add two vertices to the buffers.
	 *
	 * @param p - the line vertex to add buffer vertices for
	 * @param normal - vertex normal
	 * @param endLeft - extrude to shift the left vertex along the line
	 * @param endRight - extrude to shift the left vertex along the line
	 * @param segment - the segment object to add the vertex to
	 * @param round - whether this is a round cap
	 */
	addCurrentVertex(p: Point, normal: Point, endLeft: number, endRight: number, segment: Segment, round?: boolean): void;
	addHalfVertex({ x, y }: Point, extrudeX: number, extrudeY: number, round: boolean, up: boolean, dir: number, segment: Segment): void;
	updateScaledDistance(): void;
	updateDistance(prev: Point, next: Point): void;
}
type LineLayoutProps = {
	"line-cap": DataConstantProperty<"butt" | "round" | "square">;
	"line-join": DataDrivenProperty<"bevel" | "round" | "miter">;
	"line-miter-limit": DataConstantProperty<number>;
	"line-round-limit": DataConstantProperty<number>;
	"line-sort-key": DataDrivenProperty<number>;
};
type LineLayoutPropsPossiblyEvaluated = {
	"line-cap": "butt" | "round" | "square";
	"line-join": PossiblyEvaluatedPropertyValue<"bevel" | "round" | "miter">;
	"line-miter-limit": number;
	"line-round-limit": number;
	"line-sort-key": PossiblyEvaluatedPropertyValue<number>;
};
type LinePaintProps = {
	"line-opacity": DataDrivenProperty<number>;
	"line-color": DataDrivenProperty<Color$1>;
	"line-translate": DataConstantProperty<[
		number,
		number
	]>;
	"line-translate-anchor": DataConstantProperty<"map" | "viewport">;
	"line-width": DataDrivenProperty<number>;
	"line-gap-width": DataDrivenProperty<number>;
	"line-offset": DataDrivenProperty<number>;
	"line-blur": DataDrivenProperty<number>;
	"line-dasharray": CrossFadedProperty<Array<number>>;
	"line-pattern": CrossFadedDataDrivenProperty<ResolvedImage>;
	"line-gradient": ColorRampProperty;
};
type LinePaintPropsPossiblyEvaluated = {
	"line-opacity": PossiblyEvaluatedPropertyValue<number>;
	"line-color": PossiblyEvaluatedPropertyValue<Color$1>;
	"line-translate": [
		number,
		number
	];
	"line-translate-anchor": "map" | "viewport";
	"line-width": PossiblyEvaluatedPropertyValue<number>;
	"line-gap-width": PossiblyEvaluatedPropertyValue<number>;
	"line-offset": PossiblyEvaluatedPropertyValue<number>;
	"line-blur": PossiblyEvaluatedPropertyValue<number>;
	"line-dasharray": CrossFaded<Array<number>>;
	"line-pattern": PossiblyEvaluatedPropertyValue<CrossFaded<ResolvedImage>>;
	"line-gradient": ColorRampProperty;
};
declare class LineStyleLayer extends StyleLayer {
	_unevaluatedLayout: Layout<LineLayoutProps>;
	layout: PossiblyEvaluated<LineLayoutProps, LineLayoutPropsPossiblyEvaluated>;
	gradientVersion: number;
	stepInterpolant: boolean;
	_transitionablePaint: Transitionable<LinePaintProps>;
	_transitioningPaint: Transitioning<LinePaintProps>;
	paint: PossiblyEvaluated<LinePaintProps, LinePaintPropsPossiblyEvaluated>;
	constructor(layer: LayerSpecification);
	_handleSpecialPaintPropertyUpdate(name: string): void;
	gradientExpression(): import("@maplibre/maplibre-gl-style-spec").StylePropertyExpression;
	recalculate(parameters: EvaluationParameters, availableImages: Array<string>): void;
	createBucket(parameters: BucketParameters<any>): LineBucket;
	queryRadius(bucket: Bucket): number;
	queryIntersectsFeature({ queryGeometry, feature, featureState, geometry, transform, pixelsToTileUnits }: QueryIntersectsFeatureParams): boolean;
	isTileClipped(): boolean;
}
type TypedStyleLayer = CircleStyleLayer | FillStyleLayer | FillExtrusionStyleLayer | HeatmapStyleLayer | HillshadeStyleLayer | ColorReliefStyleLayer | LineStyleLayer | SymbolStyleLayer;
type BinderUniform = {
	name: string;
	property: string;
	binding: Uniform<any>;
};
interface AttributeBinder {
	populatePaintArray(length: number, feature: Feature$2, imagePositions: {
		[_: string]: ImagePosition;
	}, canonical?: CanonicalTileID, formattedSection?: FormattedSection): void;
	updatePaintArray(start: number, length: number, feature: Feature$2, featureState: FeatureState, imagePositions: {
		[_: string]: ImagePosition;
	}): void;
	upload(a: Context): void;
	destroy(): void;
}
interface UniformBinder {
	uniformNames: Array<string>;
	setUniform(uniform: Uniform<any>, globals: GlobalProperties, currentValue: PossiblyEvaluatedPropertyValue<any>, uniformName: string): void;
	getBinding(context: Context, location: WebGLUniformLocation, name: string): Partial<Uniform<any>>;
}
declare class ProgramConfiguration {
	binders: {
		[_: string]: AttributeBinder | UniformBinder;
	};
	cacheKey: string;
	_buffers: Array<VertexBuffer>;
	constructor(layer: TypedStyleLayer, zoom: number, filterProperties: (_: string) => boolean);
	getMaxValue(property: string): number;
	populatePaintArrays(newLength: number, feature: Feature$2, imagePositions: {
		[_: string]: ImagePosition;
	}, canonical?: CanonicalTileID, formattedSection?: FormattedSection): void;
	setConstantPatternPositions(posTo: ImagePosition, posFrom: ImagePosition): void;
	updatePaintArrays(featureStates: FeatureStates, featureMap: FeaturePositionMap, vtLayer: VectorTileLayer, layer: TypedStyleLayer, imagePositions: {
		[_: string]: ImagePosition;
	}): boolean;
	defines(): Array<string>;
	getBinderAttributes(): Array<string>;
	getBinderUniforms(): Array<string>;
	getPaintVertexBuffers(): Array<VertexBuffer>;
	getUniforms(context: Context, locations: UniformLocations): Array<BinderUniform>;
	setUniforms(context: Context, binderUniforms: Array<BinderUniform>, properties: any, globals: GlobalProperties): void;
	updatePaintBuffers(crossfade?: CrossfadeParameters): void;
	upload(context: Context): void;
	destroy(): void;
}
declare class ProgramConfigurationSet<Layer extends TypedStyleLayer> {
	programConfigurations: {
		[_: string]: ProgramConfiguration;
	};
	needsUpload: boolean;
	_featureMap: FeaturePositionMap;
	_bufferOffset: number;
	constructor(layers: ReadonlyArray<Layer>, zoom: number, filterProperties?: (_: string) => boolean);
	populatePaintArrays(length: number, feature: Feature$2, index: number, imagePositions: {
		[_: string]: ImagePosition;
	}, canonical: CanonicalTileID, formattedSection?: FormattedSection): void;
	updatePaintArrays(featureStates: FeatureStates, vtLayer: VectorTileLayer, layers: ReadonlyArray<TypedStyleLayer>, imagePositions: {
		[_: string]: ImagePosition;
	}): void;
	get(layerId: string): ProgramConfiguration;
	upload(context: Context): void;
	destroy(): void;
}
declare class CullFaceMode {
	enable: boolean;
	mode: CullFaceModeType;
	frontFace: FrontFaceType;
	constructor(enable: boolean, mode: CullFaceModeType, frontFace: FrontFaceType);
	static disabled: Readonly<CullFaceMode>;
	/**
	 * The standard GL cull mode. Culls backfacing triangles when counterclockwise vertex order is used.
	 * Use for 3D geometry such as terrain.
	 */
	static backCCW: Readonly<CullFaceMode>;
	/**
	 * Opposite of {@link backCCW}. Culls front-facing triangles when counterclockwise vertex order is used.
	 */
	static frontCCW: Readonly<CullFaceMode>;
}
type SkyProps = {
	"sky-color": DataConstantProperty<Color$1>;
	"horizon-color": DataConstantProperty<Color$1>;
	"fog-color": DataConstantProperty<Color$1>;
	"fog-ground-blend": DataConstantProperty<number>;
	"horizon-fog-blend": DataConstantProperty<number>;
	"sky-horizon-blend": DataConstantProperty<number>;
	"atmosphere-blend": DataConstantProperty<number>;
};
type SkyPropsPossiblyEvaluated = {
	"sky-color": Color$1;
	"horizon-color": Color$1;
	"fog-color": Color$1;
	"fog-ground-blend": number;
	"horizon-fog-blend": number;
	"sky-horizon-blend": number;
	"atmosphere-blend": number;
};
declare class Sky extends Evented {
	properties: PossiblyEvaluated<SkyProps, SkyPropsPossiblyEvaluated>;
	/**
	 * This is used to cache the gl mesh for the sky, it should be initialized only once.
	 */
	mesh: Mesh | undefined;
	atmosphereMesh: Mesh | undefined;
	_transitionable: Transitionable<SkyProps>;
	_transitioning: Transitioning<SkyProps>;
	constructor(sky?: SkySpecification);
	setSky(sky?: SkySpecification, options?: StyleSetterOptions): void;
	getSky(): SkySpecification;
	updateTransitions(parameters: TransitionParameters): void;
	hasTransition(): boolean;
	recalculate(parameters: EvaluationParameters): void;
	_validate(validate: Function, value: unknown, options?: StyleSetterOptions): boolean;
	/**
	 * Currently fog is a very simple implementation, and should only used
	 * to create an atmosphere near the horizon.
	 * But because the fog is drawn from the far-clipping-plane to
	 * map-center, and because the fog does nothing know about the horizon,
	 * this method does a fadeout in respect of pitch. So, when the horizon
	 * gets out of view, which is at about pitch 70, this methods calculates
	 * the corresponding opacity values. Below pitch 60 the fog is completely
	 * invisible.
	 */
	calculateFogBlendOpacity(pitch: number): number;
}
type ClearArgs = {
	color?: Color$1;
	depth?: number;
	stencil?: number;
};
declare class Context {
	gl: WebGLRenderingContext | WebGL2RenderingContext;
	currentNumAttributes: number;
	maxTextureSize: number;
	clearColor: ClearColor;
	clearDepth: ClearDepth;
	clearStencil: ClearStencil;
	colorMask: ColorMask;
	depthMask: DepthMask;
	stencilMask: StencilMask;
	stencilFunc: StencilFunc;
	stencilOp: StencilOp;
	stencilTest: StencilTest;
	depthRange: DepthRange;
	depthTest: DepthTest;
	depthFunc: DepthFunc;
	blend: Blend;
	blendFunc: BlendFunc;
	blendColor: BlendColor;
	blendEquation: BlendEquation;
	cullFace: CullFace;
	cullFaceSide: CullFaceSide;
	frontFace: FrontFace;
	program: ProgramValue;
	activeTexture: ActiveTextureUnit;
	viewport: Viewport;
	bindFramebuffer: BindFramebuffer;
	bindRenderbuffer: BindRenderbuffer;
	bindTexture: BindTexture;
	bindVertexBuffer: BindVertexBuffer;
	bindElementBuffer: BindElementBuffer;
	bindVertexArray: BindVertexArray;
	pixelStoreUnpack: PixelStoreUnpack;
	pixelStoreUnpackPremultiplyAlpha: PixelStoreUnpackPremultiplyAlpha;
	pixelStoreUnpackFlipY: PixelStoreUnpackFlipY;
	extTextureFilterAnisotropic: EXT_texture_filter_anisotropic | null;
	extTextureFilterAnisotropicMax?: GLfloat;
	HALF_FLOAT?: GLenum;
	RGBA16F?: GLenum;
	RGB16F?: GLenum;
	constructor(gl: WebGLRenderingContext | WebGL2RenderingContext);
	setDefault(): void;
	setDirty(): void;
	createIndexBuffer(array: TriangleIndexArray | LineIndexArray | LineStripIndexArray, dynamicDraw?: boolean): IndexBuffer;
	createVertexBuffer(array: StructArray, attributes: ReadonlyArray<StructArrayMember>, dynamicDraw?: boolean): VertexBuffer;
	createRenderbuffer(storageFormat: number, width: number, height: number): WebGLRenderbuffer;
	createFramebuffer(width: number, height: number, hasDepth: boolean, hasStencil: boolean): Framebuffer;
	clear({ color, depth, stencil }: ClearArgs): void;
	setCullFace(cullFaceMode: Readonly<CullFaceMode>): void;
	setDepthMode(depthMode: Readonly<DepthMode>): void;
	setStencilMode(stencilMode: Readonly<StencilMode>): void;
	setColorMode(colorMode: Readonly<ColorMode>): void;
	createVertexArray(): WebGLVertexArrayObject | undefined;
	deleteVertexArray(x: WebGLVertexArrayObject | undefined): void;
	unbindVAO(): void;
}
type TextureFormat = WebGLRenderingContextBase["RGBA"] | WebGLRenderingContextBase["ALPHA"];
type TextureFilter = WebGLRenderingContextBase["LINEAR"] | WebGLRenderingContextBase["LINEAR_MIPMAP_NEAREST"] | WebGLRenderingContextBase["NEAREST"];
type TextureWrap = WebGLRenderingContextBase["REPEAT"] | WebGLRenderingContextBase["CLAMP_TO_EDGE"] | WebGLRenderingContextBase["MIRRORED_REPEAT"];
type EmptyImage = {
	width: number;
	height: number;
	data: null;
};
type DataTextureImage = RGBAImage | AlphaImage | EmptyImage;
type TextureImage = TexImageSource | DataTextureImage;
declare class Texture$1 {
	context: Context;
	size: [
		number,
		number
	];
	texture: WebGLTexture;
	format: TextureFormat;
	filter: TextureFilter;
	wrap: TextureWrap;
	useMipmap: boolean;
	constructor(context: Context, image: TextureImage, format: TextureFormat, options?: {
		premultiply?: boolean;
		useMipmap?: boolean;
	} | null);
	update(image: TextureImage, options?: {
		premultiply?: boolean;
		useMipmap?: boolean;
	} | null, position?: {
		x: number;
		y: number;
	}): void;
	bind(filter: TextureFilter, wrap: TextureWrap, minFilter?: TextureFilter | null): void;
	isSizePowerOfTwo(): boolean;
	destroy(): void;
}
type LightPosition = {
	x: number;
	y: number;
	z: number;
};
declare class LightPositionProperty implements Property<[
	number,
	number,
	number
], LightPosition> {
	specification: StylePropertySpecification;
	constructor();
	possiblyEvaluate(value: PropertyValue<[
		number,
		number,
		number
	], LightPosition>, parameters: EvaluationParameters): LightPosition;
	interpolate(a: LightPosition, b: LightPosition, t: number): LightPosition;
}
type LightProps = {
	"anchor": DataConstantProperty<"map" | "viewport">;
	"position": LightPositionProperty;
	"color": DataConstantProperty<Color$1>;
	"intensity": DataConstantProperty<number>;
};
type LightPropsPossiblyEvaluated = {
	"anchor": "map" | "viewport";
	"position": LightPosition;
	"color": Color$1;
	"intensity": number;
};
declare class Light extends Evented {
	_transitionable: Transitionable<LightProps>;
	_transitioning: Transitioning<LightProps>;
	properties: PossiblyEvaluated<LightProps, LightPropsPossiblyEvaluated>;
	constructor(lightOptions?: LightSpecification);
	getLight(): LightSpecification;
	setLight(light?: LightSpecification, options?: StyleSetterOptions): void;
	updateTransitions(parameters: TransitionParameters): void;
	hasTransition(): boolean;
	recalculate(parameters: EvaluationParameters): void;
	_validate(validate: Function, value: unknown, options?: {
		validate?: boolean;
	}): boolean;
}
declare class LayerPlacement {
	_sortAcrossTiles: boolean;
	_currentTileIndex: number;
	_currentPartIndex: number;
	_seenCrossTileIDs: {
		[k in string | number]: boolean;
	};
	_bucketParts: Array<BucketPart>;
	constructor(styleLayer: SymbolStyleLayer);
	continuePlacement(tiles: Array<Tile>, placement: Placement, showCollisionBoxes: boolean, styleLayer: StyleLayer, shouldPausePlacement: () => boolean): boolean;
}
declare class PauseablePlacement {
	placement: Placement;
	_done: boolean;
	_currentPlacementIndex: number;
	_forceFullPlacement: boolean;
	_showCollisionBoxes: boolean;
	_inProgressLayer: LayerPlacement;
	constructor(transform: ITransform, terrain: Terrain, order: Array<string>, forceFullPlacement: boolean, showCollisionBoxes: boolean, fadeDuration: number, crossSourceCollisions: boolean, prevPlacement?: Placement);
	isDone(): boolean;
	continuePlacement(order: Array<string>, layers: {
		[_: string]: StyleLayer;
	}, layerTiles: {
		[_: string]: Array<Tile>;
	}): void;
	commit(now: number): Placement;
}
type ValidationError = {
	message: string;
	line: number;
	identifier?: string;
};
type Validator = (a: any) => ReadonlyArray<ValidationError>;
type TileMeshUsage = "stencil" | "raster";
interface Projection {
	/**
	 * @internal
	 * A short, descriptive name of this projection, such as 'mercator' or 'globe'.
	 */
	get name(): ProjectionSpecification["type"];
	/**
	 * @internal
	 * True if this projection needs to render subdivided geometry.
	 * Optimized rendering paths for non-subdivided geometry might be used throughout MapLibre.
	 * The value of this property may change during runtime, for example in globe projection depending on zoom.
	 */
	get useSubdivision(): boolean;
	/**
	 * Name of the shader projection variant that should be used for this projection.
	 * Note that this value may change dynamically, for example when globe projection internally transitions to mercator.
	 * Then globe projection might start reporting the mercator shader variant name to make MapLibre use faster mercator shaders.
	 */
	get shaderVariantName(): string;
	/**
	 * A `#define` macro that is injected into every MapLibre shader that uses this projection.
	 * @example
	 * `const define = projection.shaderDefine; // '#define GLOBE'`
	 */
	get shaderDefine(): string;
	/**
	 * @internal
	 * A preprocessed prelude code for both vertex and fragment shaders.
	 */
	get shaderPreludeCode(): PreparedShader;
	/**
	 * Vertex shader code that is injected into every MapLibre vertex shader that uses this projection.
	 */
	get vertexShaderPreludeCode(): string;
	/**
	 * @internal
	 * An object describing how much subdivision should be applied to rendered geometry.
	 * The subdivision settings should be a constant for a given projection.
	 * Projections that do not require subdivision should return {@link SubdivisionGranularitySetting.noSubdivision}.
	 */
	get subdivisionGranularity(): SubdivisionGranularitySetting;
	/**
	 * @internal
	 * A number representing the current transition state of the projection.
	 * The return value should be a number between 0 and 1,
	 * where 0 means the projection is fully in the initial state,
	 * and 1 means the projection is fully in the final state.
	 */
	get transitionState(): number;
	/**
	 * @internal
	 * Gets the error correction latitude in radians.
	 */
	get latitudeErrorCorrectionRadians(): number;
	/**
	 * @internal
	 * Cleans up any resources the projection created, especially GPU buffers.
	 */
	destroy(): void;
	/**
	 * @internal
	 * Runs any GPU-side tasks this projection required. Called at the beginning of every frame.
	 */
	updateGPUdependent(renderContext: ProjectionGPUContext): void;
	/**
	 * @internal
	 * Returns a subdivided mesh for a given tile ID, covering 0..EXTENT range.
	 * @param context - WebGL context.
	 * @param tileID - The tile coordinates for which to return a mesh. Meshes for tiles that border the top/bottom mercator edge might include extra geometry for the north/south pole.
	 * @param hasBorder - When true, the mesh will also include a small border beyond the 0..EXTENT range.
	 * @param allowPoles - When true, the mesh will also include geometry to cover the north (south) pole, if the given tileID borders the mercator range's top (bottom) edge.
	 * @param usage - Specify the usage of the tile mesh, as different usages might use different levels of subdivision.
	 */
	getMeshFromTileID(context: Context, tileID: CanonicalTileID, hasBorder: boolean, allowPoles: boolean, usage: TileMeshUsage): Mesh;
	/**
	 * @internal
	 * Recalculates the projection state based on the current evaluation parameters.
	 * @param params - Evaluation parameters.
	 */
	recalculate(params: EvaluationParameters): void;
	/**
	 * @internal
	 * Returns true if the projection is currently transitioning between two states.
	 */
	hasTransition(): boolean;
	/**
	 * @internal
	 * Sets the error query latidude in degrees
	 */
	setErrorQueryLatitudeDegrees(value: number): any;
}
type FeatureIdentifier = {
	/**
	 * Unique id of the feature.
	 */
	id?: string | number | undefined;
	/**
	 * The id of the vector or GeoJSON source for the feature.
	 */
	source: string;
	/**
	 * *For vector tile sources, `sourceLayer` is required.*
	 */
	sourceLayer?: string | undefined;
};
type StyleOptions = {
	/**
	 * If false, style validation will be skipped. Useful in production environment.
	 */
	validate?: boolean;
	/**
	 * Defines a CSS
	 * font-family for locally overriding generation of Chinese, Japanese, and Korean characters.
	 * For these characters, font settings from the map's style will be ignored, except for font-weight keywords (light/regular/medium/bold).
	 * Set to `false`, to enable font settings from the map's style for these glyph ranges.
	 * Forces a full update.
	 */
	localIdeographFontFamily?: string | false;
};
type StyleSetterOptions = {
	/**
	 * Whether to check if the filter conforms to the MapLibre Style Specification. Disabling validation is a performance optimization that should only be used if you have previously validated the values you will be passing to this function.
	 */
	validate?: boolean;
};
type TransformStyleFunction = (previous: StyleSpecification | undefined, next: StyleSpecification) => StyleSpecification;
type StyleSwapOptions = {
	/**
	 * If false, force a 'full' update, removing the current style
	 * and building the given one instead of attempting a diff-based update.
	 */
	diff?: boolean;
	/**
	 * TransformStyleFunction is a convenience function
	 * that allows to modify a style after it is fetched but before it is committed to the map state. Refer to {@link TransformStyleFunction}.
	 */
	transformStyle?: TransformStyleFunction;
};
type AddLayerObject = LayerSpecification | (Omit<LayerSpecification, "source"> & {
	source: SourceSpecification;
}) | CustomLayerInterface;
declare class Style$1 extends Evented {
	map: Map$1;
	stylesheet: StyleSpecification;
	dispatcher: Dispatcher;
	imageManager: ImageManager;
	glyphManager: GlyphManager;
	lineAtlas: LineAtlas;
	light: Light;
	projection: Projection | undefined;
	sky: Sky;
	_frameRequest: AbortController;
	_loadStyleRequest: AbortController;
	_spriteRequest: AbortController;
	_layers: {
		[_: string]: StyleLayer;
	};
	_serializedLayers: {
		[_: string]: LayerSpecification;
	};
	_order: Array<string>;
	sourceCaches: {
		[_: string]: SourceCache;
	};
	zoomHistory: ZoomHistory;
	_loaded: boolean;
	_changed: boolean;
	_updatedSources: {
		[_: string]: "clear" | "reload";
	};
	_updatedLayers: {
		[_: string]: true;
	};
	_removedLayers: {
		[_: string]: StyleLayer;
	};
	_changedImages: {
		[_: string]: true;
	};
	_glyphsDidChange: boolean;
	_updatedPaintProps: {
		[layer: string]: true;
	};
	_layerOrderChanged: boolean;
	_spritesImagesIds: {
		[spriteId: string]: string[];
	};
	_availableImages: Array<string>;
	_globalState: Record<string, any>;
	crossTileSymbolIndex: CrossTileSymbolIndex;
	pauseablePlacement: PauseablePlacement;
	placement: Placement;
	z: number;
	constructor(map: Map$1, options?: StyleOptions);
	_rtlPluginLoaded: () => void;
	setGlobalStateProperty(name: string, value: any): this;
	getGlobalState(): Record<string, any>;
	setGlobalState(newStylesheetState: StateSpecification): void;
	/**
	 * Find all sources that are affected by the global state changes.
	 * For example, if a layer filter uses global-state expression, this function will return the source id of that layer.
	 */
	_findGlobalStateAffectedSources(globalStateRefs: string[]): Set<string>;
	loadURL(url: string, options?: StyleSwapOptions & StyleSetterOptions, previousStyle?: StyleSpecification): void;
	loadJSON(json: StyleSpecification, options?: StyleSetterOptions & StyleSwapOptions, previousStyle?: StyleSpecification): void;
	loadEmpty(): void;
	_load(json: StyleSpecification, options: StyleSwapOptions & StyleSetterOptions, previousStyle?: StyleSpecification): void;
	private _createLayers;
	_loadSprite(sprite: SpriteSpecification, isUpdate?: boolean, completion?: (err: Error) => void): void;
	_unloadSprite(): void;
	_validateLayer(layer: StyleLayer): void;
	loaded(): boolean;
	/**
	 * @hidden
	 * take an array of string IDs, and based on this._layers, generate an array of LayerSpecification
	 * @param ids - an array of string IDs, for which serialized layers will be generated. If omitted, all serialized layers will be returned
	 * @param returnClose - if true, return a clone of the layer object
	 * @returns generated result
	 */
	private _serializeByIds;
	/**
	 * @hidden
	 * Lazy initialization of this._serializedLayers dictionary and return it
	 * @returns this._serializedLayers dictionary
	 */
	private _serializedAllLayers;
	hasTransitions(): boolean;
	_checkLoaded(): void;
	/**
	 * @internal
	 * Apply queued style updates in a batch and recalculate zoom-dependent paint properties.
	 */
	update(parameters: EvaluationParameters): void;
	_updateTilesForChangedImages(): void;
	_updateTilesForChangedGlyphs(): void;
	_updateWorkerLayers(updatedIds: Array<string>, removedIds: Array<string>): void;
	_resetUpdates(): void;
	/**
	 * Update this style's state to match the given style JSON, performing only
	 * the necessary mutations.
	 *
	 * May throw an Error ('Unimplemented: METHOD') if the mapbox-gl-style-spec
	 * diff algorithm produces an operation that is not supported.
	 *
	 * @returns true if any changes were made; false otherwise
	 */
	setState(nextState: StyleSpecification, options?: StyleSwapOptions & StyleSetterOptions): boolean;
	_getOperationsToPerform(diff: DiffCommand<DiffOperations>[]): {
		operations: Function[];
		unimplemented: string[];
	};
	addImage(id: string, image: StyleImage): this;
	updateImage(id: string, image: StyleImage): void;
	getImage(id: string): StyleImage;
	removeImage(id: string): this;
	_afterImageUpdated(id: string): void;
	listImages(): string[];
	addSource(id: string, source: SourceSpecification | CanvasSourceSpecification, options?: StyleSetterOptions): void;
	/**
	 * Remove a source from this stylesheet, given its id.
	 * @param id - id of the source to remove
	 * @throws if no source is found with the given ID
	 */
	removeSource(id: string): this;
	/**
	 * Set the data of a GeoJSON source, given its id.
	 * @param id - id of the source
	 * @param data - GeoJSON source
	 */
	setGeoJSONSourceData(id: string, data: GeoJSON$1 | string): void;
	/**
	 * Get a source by ID.
	 * @param id - ID of the desired source
	 * @returns source
	 */
	getSource(id: string): Source | undefined;
	/**
	 * Add a layer to the map style. The layer will be inserted before the layer with
	 * ID `before`, or appended if `before` is omitted.
	 * @param layerObject - The style layer to add.
	 * @param before - ID of an existing layer to insert before
	 * @param options - Style setter options.
	 */
	addLayer(layerObject: AddLayerObject, before?: string, options?: StyleSetterOptions): this;
	/**
	 * Moves a layer to a different z-position. The layer will be inserted before the layer with
	 * ID `before`, or appended if `before` is omitted.
	 * @param id - ID of the layer to move
	 * @param before - ID of an existing layer to insert before
	 */
	moveLayer(id: string, before?: string): void;
	/**
	 * Remove the layer with the given id from the style.
	 * A {@link ErrorEvent} event will be fired if no such layer exists.
	 *
	 * @param id - id of the layer to remove
	 */
	removeLayer(id: string): void;
	/**
	 * Return the style layer object with the given `id`.
	 *
	 * @param id - id of the desired layer
	 * @returns a layer, if one with the given `id` exists
	 */
	getLayer(id: string): StyleLayer | undefined;
	/**
	 * Return the ids of all layers currently in the style, including custom layers, in order.
	 *
	 * @returns ids of layers, in order
	 */
	getLayersOrder(): string[];
	/**
	 * Checks if a specific layer is present within the style.
	 *
	 * @param id - the id of the desired layer
	 * @returns a boolean specifying if the given layer is present
	 */
	hasLayer(id: string): boolean;
	setLayerZoomRange(layerId: string, minzoom?: number | null, maxzoom?: number | null): void;
	setFilter(layerId: string, filter?: FilterSpecification | null, options?: StyleSetterOptions): void;
	/**
	 * Get a layer's filter object
	 * @param layer - the layer to inspect
	 * @returns the layer's filter, if any
	 */
	getFilter(layer: string): FilterSpecification | void;
	setLayoutProperty(layerId: string, name: string, value: any, options?: StyleSetterOptions): void;
	/**
	 * Get a layout property's value from a given layer
	 * @param layerId - the layer to inspect
	 * @param name - the name of the layout property
	 * @returns the property value
	 */
	getLayoutProperty(layerId: string, name: string): any;
	setPaintProperty(layerId: string, name: string, value: any, options?: StyleSetterOptions): void;
	getPaintProperty(layer: string, name: string): unknown;
	setFeatureState(target: FeatureIdentifier, state: any): void;
	removeFeatureState(target: FeatureIdentifier, key?: string): void;
	getFeatureState(target: FeatureIdentifier): import("@maplibre/maplibre-gl-style-spec").FeatureState;
	getTransition(): {
		duration: number;
		delay: number;
	} & import("@maplibre/maplibre-gl-style-spec").TransitionSpecification;
	serialize(): StyleSpecification | undefined;
	_updateLayer(layer: StyleLayer): void;
	_flattenAndSortRenderedFeatures(sourceResults: QueryRenderedFeaturesResults[]): MapGeoJSONFeature[];
	queryRenderedFeatures(queryGeometry: Point[], params: QueryRenderedFeaturesOptions, transform: IReadonlyTransform): MapGeoJSONFeature[];
	querySourceFeatures(sourceID: string, params?: QuerySourceFeatureOptions): GeoJSONFeature[];
	getLight(): LightSpecification;
	setLight(lightOptions: LightSpecification, options?: StyleSetterOptions): void;
	getProjection(): ProjectionSpecification;
	setProjection(projection: ProjectionSpecification): void;
	getSky(): SkySpecification;
	setSky(skyOptions?: SkySpecification, options?: StyleSetterOptions): void;
	_setProjectionInternal(name: ProjectionSpecification["type"]): void;
	_validate(validate: Validator, key: string, value: any, props: any, options?: {
		validate?: boolean;
	}): boolean;
	_remove(mapRemoved?: boolean): void;
	_clearSource(id: string): void;
	_reloadSource(id: string): void;
	_updateSources(transform: ITransform): void;
	_generateCollisionBoxes(): void;
	_updatePlacement(transform: ITransform, showCollisionBoxes: boolean, fadeDuration: number, crossSourceCollisions: boolean, forceFullPlacement?: boolean): boolean;
	_releaseSymbolFadeTiles(): void;
	getImages(mapId: string | number, params: GetImagesParameters): Promise<GetImagesResponse>;
	getGlyphs(mapId: string | number, params: GetGlyphsParameters): Promise<GetGlyphsResponse>;
	getGlyphsUrl(): string;
	setGlyphs(glyphsUrl: string | null, options?: StyleSetterOptions): void;
	/**
	 * Add a sprite.
	 *
	 * @param id - The id of the desired sprite
	 * @param url - The url to load the desired sprite from
	 * @param options - The style setter options
	 * @param completion - The completion handler
	 */
	addSprite(id: string, url: string, options?: StyleSetterOptions, completion?: (err: Error) => void): void;
	/**
	 * Remove a sprite by its id. When the last sprite is removed, the whole `this.stylesheet.sprite` object becomes
	 * `undefined`. This falsy `undefined` value later prevents attempts to load the sprite when it's absent.
	 *
	 * @param id - the id of the sprite to remove
	 */
	removeSprite(id: string): void;
	/**
	 * Get the current sprite value.
	 *
	 * @returns empty array when no sprite is set; id-url pairs otherwise
	 */
	getSprite(): {
		id: string;
		url: string;
	}[];
	/**
	 * Set a new value for the style's sprite.
	 *
	 * @param sprite - new sprite value
	 * @param options - style setter options
	 * @param completion - the completion handler
	 */
	setSprite(sprite: SpriteSpecification, options?: StyleSetterOptions, completion?: (err: Error) => void): void;
}
type BucketParameters<Layer extends TypedStyleLayer> = {
	index: number;
	layers: Array<Layer>;
	zoom: number;
	pixelRatio: number;
	overscaling: number;
	collisionBoxArray: CollisionBoxArray;
	sourceLayerIndex: number;
	sourceID: string;
	globalState: Record<string, any>;
};
type IndexedFeature = {
	feature: VectorTileFeature;
	id: number | string;
	index: number;
	sourceLayerIndex: number;
};
type BucketFeature = {
	index: number;
	sourceLayerIndex: number;
	geometry: Array<Array<Point>>;
	properties: any;
	type: 0 | 1 | 2 | 3;
	id?: any;
	readonly patterns: {
		[_: string]: {
			"min": string;
			"mid": string;
			"max": string;
		};
	};
	sortKey?: number;
};
type QueryIntersectsFeatureParams = {
	/**
	 * The geometry to check intersection with.
	 * This geometry is in tile coordinates.
	 */
	queryGeometry: Array<Point>;
	/**
	 * The feature to allow expression evaluation.
	 */
	feature: VectorTileFeature;
	/**
	 * The feature state to allow expression evaluation.
	 */
	featureState: FeatureState;
	/**
	 * The geometry of the feature.
	 * This geometry is in tile coordinates.
	 */
	geometry: Array<Array<Point>>;
	/**
	 * The current zoom level.
	 */
	zoom: number;
	/**
	 * The transform to convert from tile coordinates to pixels.
	 */
	transform: IReadonlyTransform;
	/**
	 * The number of pixels per tile unit.
	 */
	pixelsToTileUnits: number;
	/**
	 * The matrix to convert from tile coordinates to pixel coordinates.
	 * The pixel coordinates are relative to the center of the screen.
	 */
	pixelPosMatrix: mat4;
	/**
	 * The unwrapped tile ID for the tile being queried.
	 */
	unwrappedTileID: UnwrappedTileID;
	/**
	 * A function to get the elevation of a point in tile coordinates.
	 */
	getElevation: undefined | ((x: number, y: number) => number);
};
declare abstract class StyleLayer extends Evented {
	id: string;
	metadata: unknown;
	type: LayerSpecification["type"] | CustomLayerInterface["type"];
	source: string;
	sourceLayer: string;
	minzoom: number;
	maxzoom: number;
	filter: FilterSpecification | void;
	visibility: "visible" | "none" | void;
	_crossfadeParameters: CrossfadeParameters;
	_unevaluatedLayout: Layout<any>;
	readonly layout: unknown;
	_transitionablePaint: Transitionable<any>;
	_transitioningPaint: Transitioning<any>;
	readonly paint: unknown;
	_featureFilter: FeatureFilter;
	readonly onAdd: ((map: Map$1) => void);
	readonly onRemove: ((map: Map$1) => void);
	queryRadius?(bucket: Bucket): number;
	queryIntersectsFeature?(params: QueryIntersectsFeatureParams): boolean | number;
	constructor(layer: LayerSpecification | CustomLayerInterface, properties: Readonly<{
		layout?: Properties<any>;
		paint?: Properties<any>;
	}>);
	setFilter(filter: FilterSpecification | void): void;
	getCrossfadeParameters(): CrossfadeParameters;
	getLayoutProperty(name: string): any;
	/**
	 * Get list of global state references that are used within layout or filter properties.
	 * This is used to determine if layer source need to be reloaded when global state property changes.
	 *
	 */
	getLayoutAffectingGlobalStateRefs(): Set<string>;
	setLayoutProperty(name: string, value: any, options?: StyleSetterOptions): void;
	getPaintProperty(name: string): unknown;
	setPaintProperty(name: string, value: unknown, options?: StyleSetterOptions): boolean;
	_handleSpecialPaintPropertyUpdate(_: string): void;
	_handleOverridablePaintPropertyUpdate<T, R>(name: string, oldValue: PropertyValue<T, R>, newValue: PropertyValue<T, R>): boolean;
	isHidden(zoom: number): boolean;
	updateTransitions(parameters: TransitionParameters): void;
	hasTransition(): boolean;
	recalculate(parameters: EvaluationParameters, availableImages: Array<string>): void;
	serialize(): LayerSpecification;
	_validate(validate: Function, key: string, name: string, value: unknown, options?: StyleSetterOptions): boolean;
	is3D(): boolean;
	isTileClipped(): boolean;
	hasOffscreenPass(): boolean;
	resize(): void;
	isStateDependent(): boolean;
}
type GeoJSONFeatureId = number | string;
type GeoJSONSourceDiff = {
	/**
	 * When set to `true` it will remove all features
	 */
	removeAll?: boolean;
	/**
	 * An array of features IDs to remove
	 */
	remove?: Array<GeoJSONFeatureId>;
	/**
	 * An array of features to add
	 */
	add?: Array<Feature$1>;
	/**
	 * An array of update objects
	 */
	update?: Array<GeoJSONFeatureDiff>;
};
type GeoJSONFeatureDiff = {
	/**
	 * The feature ID
	 */
	id: GeoJSONFeatureId;
	/**
	 * If it's a new geometry, place it here
	 */
	newGeometry?: Geometry$1;
	/**
	 * Setting to `true` will remove all preperties
	 */
	removeAllProperties?: boolean;
	/**
	 * The properties keys to remove
	 */
	removeProperties?: Array<string>;
	/**
	 * The properties to add or update along side their values
	 */
	addOrUpdateProperties?: Array<{
		key: string;
		value: any;
	}>;
};
type GeoJSONWorkerOptions = {
	source?: string;
	cluster?: boolean;
	geojsonVtOptions?: GeoJSONVTOptions;
	superclusterOptions?: SuperclusterOptions<any, any>;
	clusterProperties?: ClusterProperties;
	filter?: Array<unknown>;
	promoteId?: string;
	collectResourceTiming?: boolean;
};
type LoadGeoJSONParameters = GeoJSONWorkerOptions & {
	type: "geojson";
	request?: RequestParameters;
	/**
	 * Literal GeoJSON data. Must be provided if `request.url` is not.
	 */
	data?: string;
	dataDiff?: GeoJSONSourceDiff;
};
type RTLPluginStatus = "unavailable" | "deferred" | "requested" | "loading" | "loaded" | "error";
type PluginState = {
	pluginStatus: RTLPluginStatus;
	pluginURL: string;
};
type ClusterIDAndSource = {
	type: "geojson";
	clusterId: number;
	source: string;
};
type GetClusterLeavesParams = ClusterIDAndSource & {
	limit: number;
	offset: number;
};
type GeoJSONWorkerSourceLoadDataResult = {
	resourceTiming?: {
		[_: string]: Array<PerformanceResourceTiming>;
	};
	abandoned?: boolean;
};
type RemoveSourceParams = {
	source: string;
	type: string;
};
type UpdateLayersParameters = {
	layers: Array<LayerSpecification>;
	removedIds: Array<string>;
};
type GetImagesParameters = {
	icons: Array<string>;
	source: string;
	tileID: OverscaledTileID;
	type: string;
};
type GetGlyphsParameters = {
	type: string;
	stacks: {
		[_: string]: Array<number>;
	};
	source: string;
	tileID: OverscaledTileID;
};
type GetGlyphsResponse = {
	[stack: string]: {
		[id: number]: StyleGlyph;
	};
};
type GetImagesResponse = {
	[_: string]: StyleImage;
};
declare const enum MessageType {
	loadDEMTile = "LDT",
	getClusterExpansionZoom = "GCEZ",
	getClusterChildren = "GCC",
	getClusterLeaves = "GCL",
	loadData = "LD",
	getData = "GD",
	loadTile = "LT",
	reloadTile = "RT",
	getGlyphs = "GG",
	getImages = "GI",
	setImages = "SI",
	setLayers = "SL",
	updateLayers = "UL",
	syncRTLPluginState = "SRPS",
	setReferrer = "SR",
	removeSource = "RS",
	removeMap = "RM",
	importScript = "IS",
	removeTile = "RMT",
	abortTile = "AT",
	removeDEMTile = "RDT",
	getResource = "GR"
}
type RequestResponseMessageMap = {
	[MessageType.loadDEMTile]: [
		WorkerDEMTileParameters,
		DEMData
	];
	[MessageType.getClusterExpansionZoom]: [
		ClusterIDAndSource,
		number
	];
	[MessageType.getClusterChildren]: [
		ClusterIDAndSource,
		Array<Feature$1>
	];
	[MessageType.getClusterLeaves]: [
		GetClusterLeavesParams,
		Array<Feature$1>
	];
	[MessageType.loadData]: [
		LoadGeoJSONParameters,
		GeoJSONWorkerSourceLoadDataResult
	];
	[MessageType.getData]: [
		LoadGeoJSONParameters,
		GeoJSON$1
	];
	[MessageType.loadTile]: [
		WorkerTileParameters,
		WorkerTileResult
	];
	[MessageType.reloadTile]: [
		WorkerTileParameters,
		WorkerTileResult
	];
	[MessageType.getGlyphs]: [
		GetGlyphsParameters,
		GetGlyphsResponse
	];
	[MessageType.getImages]: [
		GetImagesParameters,
		GetImagesResponse
	];
	[MessageType.setImages]: [
		string[],
		void
	];
	[MessageType.setLayers]: [
		Array<LayerSpecification>,
		void
	];
	[MessageType.updateLayers]: [
		UpdateLayersParameters,
		void
	];
	[MessageType.syncRTLPluginState]: [
		PluginState,
		PluginState
	];
	[MessageType.setReferrer]: [
		string,
		void
	];
	[MessageType.removeSource]: [
		RemoveSourceParams,
		void
	];
	[MessageType.removeMap]: [
		undefined,
		void
	];
	[MessageType.importScript]: [
		string,
		void
	];
	[MessageType.removeTile]: [
		TileParameters,
		void
	];
	[MessageType.abortTile]: [
		TileParameters,
		void
	];
	[MessageType.removeDEMTile]: [
		TileParameters,
		void
	];
	[MessageType.getResource]: [
		RequestParameters,
		GetResourceResponse<any>
	];
};
type ActorMessage<T extends MessageType> = {
	type: T;
	data: RequestResponseMessageMap[T][0];
	targetMapId?: string | number | null;
	mustQueue?: boolean;
	sourceMapId?: string | number | null;
};
interface ActorTarget {
	addEventListener: typeof window.addEventListener;
	removeEventListener: typeof window.removeEventListener;
	postMessage: typeof window.postMessage;
	terminate?: () => void;
}
type MessageData = {
	id: string;
	type: MessageType | "<cancel>" | "<response>";
	origin: string;
	data?: Serialized;
	targetMapId?: string | number | null;
	mustQueue?: boolean;
	error?: Serialized | null;
	sourceMapId: string | number | null;
};
type ResolveReject = {
	resolve: (value?: RequestResponseMessageMap[MessageType][1]) => void;
	reject: (reason?: Error) => void;
};
interface IActor {
	sendAsync<T extends MessageType>(message: ActorMessage<T>, abortController?: AbortController): Promise<RequestResponseMessageMap[T][1]>;
}
type MessageHandler<T extends MessageType> = (mapId: string | number, params: RequestResponseMessageMap[T][0], abortController?: AbortController) => Promise<RequestResponseMessageMap[T][1]>;
declare class Actor implements IActor {
	target: ActorTarget;
	mapId: string | number | null;
	resolveRejects: {
		[x: string]: ResolveReject;
	};
	name: string;
	tasks: {
		[x: string]: MessageData;
	};
	taskQueue: Array<string>;
	abortControllers: {
		[x: number | string]: AbortController;
	};
	invoker: ThrottledInvoker;
	globalScope: ActorTarget;
	messageHandlers: {
		[x in MessageType]?: MessageHandler<MessageType>;
	};
	subscription: Subscription;
	/**
	 * @param target - The target
	 * @param mapId - A unique identifier for the Map instance using this Actor.
	 */
	constructor(target: ActorTarget, mapId?: string | number);
	registerMessageHandler<T extends MessageType>(type: T, handler: MessageHandler<T>): void;
	/**
	 * Sends a message from a main-thread map to a Worker or from a Worker back to
	 * a main-thread map instance.
	 * @param message - the message to send
	 * @param abortController - an optional AbortController to abort the request
	 * @returns a promise that will be resolved with the response data
	 */
	sendAsync<T extends MessageType>(message: ActorMessage<T>, abortController?: AbortController): Promise<RequestResponseMessageMap[T][1]>;
	receive(message: {
		data: MessageData;
	}): void;
	process(): void;
	processTask(id: string, task: MessageData): Promise<void>;
	completeTask(id: string, err: Error, data?: RequestResponseMessageMap[MessageType][1]): void;
	remove(): void;
}
interface Subscription {
	/**
	 * Unsubscribes from the event.
	 */
	unsubscribe(): void;
}
type RequireAtLeastOne<T> = {
	[K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];
type DragPanOptions = {
	/**
	 * factor used to scale the drag velocity
	 * @defaultValue 0
	 */
	linearity?: number;
	/**
	 * easing function applied to `map.panTo` when applying the drag.
	 * @param t - the easing function
	 * @defaultValue bezier(0, 0, 0.3, 1)
	 */
	easing?: (t: number) => number;
	/**
	 * the maximum value of the drag velocity.
	 * @defaultValue 1400
	 */
	deceleration?: number;
	/**
	 * the rate at which the speed reduces after the pan ends.
	 * @defaultValue 2500
	 */
	maxSpeed?: number;
};
type TaskID = number;
type Task = {
	callback: (timeStamp: number) => void;
	id: TaskID;
	cancelled: boolean;
};
declare class TaskQueue {
	_queue: Array<Task>;
	_id: TaskID;
	_cleared: boolean;
	_currentlyRunning: Array<Task> | false;
	constructor();
	add(callback: (timeStamp: number) => void): TaskID;
	remove(id: TaskID): void;
	run(timeStamp?: number): void;
	clear(): void;
}
type MapControlsDeltas = {
	panDelta: Point;
	zoomDelta: number;
	bearingDelta: number;
	pitchDelta: number;
	rollDelta: number;
	around: Point;
};
type CameraForBoxAndBearingHandlerResult = {
	center: LngLat;
	zoom: number;
	bearing: number;
};
type EaseToHandlerOptions = {
	bearing: number;
	pitch: number;
	roll: number;
	padding: PaddingOptions;
	offsetAsPoint: Point;
	around?: LngLat;
	aroundPoint?: Point;
	center?: LngLatLike;
	zoom?: number;
	offset?: PointLike;
};
type EaseToHandlerResult = {
	easeFunc: (k: number) => void;
	elevationCenter: LngLat;
	isZooming: boolean;
};
type FlyToHandlerOptions = {
	bearing: number;
	pitch: number;
	roll: number;
	padding: PaddingOptions;
	offsetAsPoint: Point;
	center?: LngLatLike;
	locationAtOffset: LngLat;
	zoom?: number;
	minZoom?: number;
};
type FlyToHandlerResult = {
	easeFunc: (k: number, scale: number, centerFactor: number, pointAtOffset: Point) => void;
	scaleOfZoom: number;
	scaleOfMinZoom?: number;
	targetCenter: LngLat;
	pixelPathLength: number;
};
interface ICameraHelper {
	get useGlobeControls(): boolean;
	handlePanInertia(pan: Point, transform: IReadonlyTransform): {
		easingCenter: LngLat;
		easingOffset: Point;
	};
	handleMapControlsRollPitchBearingZoom(deltas: MapControlsDeltas, tr: ITransform): void;
	handleMapControlsPan(deltas: MapControlsDeltas, tr: ITransform, preZoomAroundLoc: LngLat): void;
	cameraForBoxAndBearing(options: CameraForBoundsOptions, padding: PaddingOptions, bounds: LngLatBounds, bearing: number, tr: IReadonlyTransform): CameraForBoxAndBearingHandlerResult;
	handleJumpToCenterZoom(tr: ITransform, options: {
		zoom?: number;
		center?: LngLatLike;
	}): void;
	handleEaseTo(tr: ITransform, options: EaseToHandlerOptions): EaseToHandlerResult;
	handleFlyTo(tr: ITransform, options: FlyToHandlerOptions): FlyToHandlerResult;
}
type PointLike = Point | [
	number,
	number
];
type CameraOptions = CenterZoomBearing & {
	/**
	 * The desired pitch in degrees. The pitch is the angle towards the horizon
	 * measured in degrees with a range between 0 and 60 degrees. For example, pitch: 0 provides the appearance
	 * of looking straight down at the map, while pitch: 60 tilts the user's perspective towards the horizon.
	 * Increasing the pitch value is often used to display 3D objects.
	 */
	pitch?: number;
	/**
	 * The desired roll in degrees. The roll is the angle about the camera boresight.
	 */
	roll?: number;
	/**
	 * The elevation of the center point in meters above sea level.
	 */
	elevation?: number;
};
type CenterZoomBearing = {
	/**
	 * The desired center.
	 */
	center?: LngLatLike;
	/**
	 * The desired mercator zoom level.
	 */
	zoom?: number;
	/**
	 * The desired bearing in degrees. The bearing is the compass direction that
	 * is "up". For example, `bearing: 90` orients the map so that east is up.
	 */
	bearing?: number;
};
type JumpToOptions = CameraOptions & {
	/**
	 * Dimensions in pixels applied on each side of the viewport for shifting the vanishing point.
	 */
	padding?: PaddingOptions;
};
type CameraForBoundsOptions = CameraOptions & {
	/**
	 * The amount of padding in pixels to add to the given bounds.
	 */
	padding?: number | PaddingOptions;
	/**
	 * The center of the given bounds relative to the map's center, measured in pixels.
	 * @defaultValue [0, 0]
	 */
	offset?: PointLike;
	/**
	 * The maximum zoom level to allow when the camera would transition to the specified bounds.
	 */
	maxZoom?: number;
};
type FlyToOptions = AnimationOptions & CameraOptions & {
	/**
	 * The zooming "curve" that will occur along the
	 * flight path. A high value maximizes zooming for an exaggerated animation, while a low
	 * value minimizes zooming for an effect closer to {@link Map#easeTo}. 1.42 is the average
	 * value selected by participants in the user study discussed in
	 * [van Wijk (2003)](https://www.win.tue.nl/~vanwijk/zoompan.pdf). A value of
	 * `Math.pow(6, 0.25)` would be equivalent to the root mean squared average velocity. A
	 * value of 1 would produce a circular motion.
	 * @defaultValue 1.42
	 */
	curve?: number;
	/**
	 * The zero-based zoom level at the peak of the flight path. If
	 * `options.curve` is specified, this option is ignored.
	 */
	minZoom?: number;
	/**
	 * The average speed of the animation defined in relation to
	 * `options.curve`. A speed of 1.2 means that the map appears to move along the flight path
	 * by 1.2 times `options.curve` screenfulls every second. A _screenfull_ is the map's visible span.
	 * It does not correspond to a fixed physical distance, but varies by zoom level.
	 * @defaultValue 1.2
	 */
	speed?: number;
	/**
	 * The average speed of the animation measured in screenfulls
	 * per second, assuming a linear timing curve. If `options.speed` is specified, this option is ignored.
	 */
	screenSpeed?: number;
	/**
	 * The animation's maximum duration, measured in milliseconds.
	 * If duration exceeds maximum duration, it resets to 0.
	 */
	maxDuration?: number;
	/**
	 * The amount of padding in pixels to add to the given bounds.
	 */
	padding?: number | PaddingOptions;
};
type EaseToOptions = AnimationOptions & CameraOptions & {
	delayEndEvents?: number;
	padding?: number | PaddingOptions;
	/**
	 * If `zoom` is specified, `around` determines the point around which the zoom is centered.
	 */
	around?: LngLatLike;
	easeId?: string;
	noMoveStart?: boolean;
};
type FitBoundsOptions = FlyToOptions & {
	/**
	 * If `true`, the map transitions using {@link Map#easeTo}. If `false`, the map transitions using {@link Map#flyTo}.
	 * See those functions and {@link AnimationOptions} for information about options available.
	 * @defaultValue false
	 */
	linear?: boolean;
	/**
	 * The center of the given bounds relative to the map's center, measured in pixels.
	 * @defaultValue [0, 0]
	 */
	offset?: PointLike;
	/**
	 * The maximum zoom level to allow when the map view transitions to the specified bounds.
	 */
	maxZoom?: number;
};
type AnimationOptions = {
	/**
	 * The animation's duration, measured in milliseconds.
	 */
	duration?: number;
	/**
	 * A function taking a time in the range 0..1 and returning a number where 0 is
	 * the initial state and 1 is the final state.
	 */
	easing?: (_: number) => number;
	/**
	 * of the target center relative to real map container center at the end of animation.
	 */
	offset?: PointLike;
	/**
	 * If `false`, no animation will occur.
	 */
	animate?: boolean;
	/**
	 * If `true`, then the animation is considered essential and will not be affected by
	 * [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/\@media/prefers-reduced-motion).
	 */
	essential?: boolean;
	/**
	 * Default false. Needed in 3D maps to let the camera stay in a constant
	 * height based on sea-level. After the animation finished the zoom-level will be recalculated in respect of
	 * the distance from the camera to the center-coordinate-altitude.
	 */
	freezeElevation?: boolean;
};
type CameraUpdateTransformFunction = (next: {
	center: LngLat;
	zoom: number;
	roll: number;
	pitch: number;
	bearing: number;
	elevation: number;
}) => {
	center?: LngLat;
	zoom?: number;
	roll?: number;
	pitch?: number;
	bearing?: number;
	elevation?: number;
};
declare abstract class Camera$1 extends Evented {
	transform: ITransform;
	cameraHelper: ICameraHelper;
	terrain: Terrain;
	handlers: HandlerManager;
	_moving: boolean;
	_zooming: boolean;
	_rotating: boolean;
	_pitching: boolean;
	_rolling: boolean;
	_padding: boolean;
	_bearingSnap: number;
	_easeStart: number;
	_easeOptions: {
		duration?: number;
		easing?: (_: number) => number;
	};
	_easeId: string | void;
	_onEaseFrame: (_: number) => void;
	_onEaseEnd: (easeId?: string) => void;
	_easeFrameId: TaskID;
	/**
	 * @internal
	 * holds the geographical coordinate of the target
	 */
	_elevationCenter: LngLat;
	/**
	 * @internal
	 * holds the targ altitude value, = center elevation of the target.
	 * This value may changes during flight, because new terrain-tiles loads during flight.
	 */
	_elevationTarget: number;
	/**
	 * @internal
	 * holds the start altitude value, = center elevation before animation begins
	 * this value will recalculated during flight in respect of changing _elevationTarget values,
	 * so the linear interpolation between start and target keeps smooth and without jumps.
	 */
	_elevationStart: number;
	/**
	 * @internal
	 * Saves the current state of the elevation freeze - this is used during map movement to prevent "rocky" camera movement.
	 */
	_elevationFreeze: boolean;
	/**
	 * @internal
	 * Used to track accumulated changes during continuous interaction
	 */
	_requestedCameraState?: ITransform;
	/**
	 * A callback used to defer camera updates or apply arbitrary constraints.
	 * If specified, this Camera instance can be used as a stateless component in React etc.
	 */
	transformCameraUpdate: CameraUpdateTransformFunction | null;
	/**
	 * @internal
	 * If true, the elevation of the center point will automatically be set to the terrain elevation
	 * (or zero if terrain is not enabled). If false, the elevation of the center point will default
	 * to sea level and will not automatically update. Defaults to true. Needs to be set to false to
	 * keep the camera above ground when pitch \> 90 degrees.
	 */
	_centerClampedToGround: boolean;
	abstract _requestRenderFrame(a: () => void): TaskID;
	abstract _cancelRenderFrame(_: TaskID): void;
	constructor(transform: ITransform, cameraHelper: ICameraHelper, options: {
		bearingSnap: number;
	});
	/**
	 * @internal
	 * Creates a new specialized transform instance from a projection instance and migrates
	 * to this new transform, carrying over all the properties of the old transform (center, pitch, etc.).
	 * When the style's projection is changed (or first set), this function should be called.
	 */
	migrateProjection(newTransform: ITransform, newCameraHelper: ICameraHelper): void;
	/**
	 * Returns the map's geographical centerpoint.
	 *
	 * @returns The map's geographical centerpoint.
	 * @example
	 * Return a LngLat object such as `{lng: 0, lat: 0}`
	 * ```ts
	 * let center = map.getCenter();
	 * // access longitude and latitude values directly
	 * let {lng, lat} = map.getCenter();
	 * ```
	 */
	getCenter(): LngLat;
	/**
	 * Sets the map's geographical centerpoint. Equivalent to `jumpTo({center: center})`.
	 *
	 * Triggers the following events: `movestart` and `moveend`.
	 *
	 * @param center - The centerpoint to set.
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 * @example
	 * ```ts
	 * map.setCenter([-74, 38]);
	 * ```
	 */
	setCenter(center: LngLatLike, eventData?: any): this;
	/**
	 * Returns the elevation of the map's center point.
	 *
	 * @returns The elevation of the map's center point, in meters above sea level.
	 */
	getCenterElevation(): number;
	/**
	 * Sets the elevation of the map's center point, in meters above sea level. Equivalent to `jumpTo({elevation: elevation})`.
	 *
	 * Triggers the following events: `movestart` and `moveend`.
	 *
	 * @param elevation - The elevation to set, in meters above sea level.
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 */
	setCenterElevation(elevation: number, eventData?: any): this;
	/**
	 * Returns the value of `centerClampedToGround`.
	 *
	 * If true, the elevation of the center point will automatically be set to the terrain elevation
	 * (or zero if terrain is not enabled). If false, the elevation of the center point will default
	 * to sea level and will not automatically update. Defaults to true. Needs to be set to false to
	 * keep the camera above ground when pitch \> 90 degrees.
	 */
	getCenterClampedToGround(): boolean;
	/**
	 * Sets the value of `centerClampedToGround`.
	 *
	 * If true, the elevation of the center point will automatically be set to the terrain elevation
	 * (or zero if terrain is not enabled). If false, the elevation of the center point will default
	 * to sea level and will not automatically update. Defaults to true. Needs to be set to false to
	 * keep the camera above ground when pitch \> 90 degrees.
	 */
	setCenterClampedToGround(centerClampedToGround: boolean): void;
	/**
	 * Pans the map by the specified offset.
	 *
	 * Triggers the following events: `movestart` and `moveend`.
	 *
	 * @param offset - `x` and `y` coordinates by which to pan the map.
	 * @param options - Options object
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 * @see [Navigate the map with game-like controls](https://maplibre.org/maplibre-gl-js/docs/examples/game-controls/)
	 */
	panBy(offset: PointLike, options?: EaseToOptions, eventData?: any): this;
	/**
	 * Pans the map to the specified location with an animated transition.
	 *
	 * Triggers the following events: `movestart` and `moveend`.
	 *
	 * @param lnglat - The location to pan the map to.
	 * @param options - Options describing the destination and animation of the transition.
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 * @example
	 * ```ts
	 * map.panTo([-74, 38]);
	 * // Specify that the panTo animation should last 5000 milliseconds.
	 * map.panTo([-74, 38], {duration: 5000});
	 * ```
	 * @see [Update a feature in realtime](https://maplibre.org/maplibre-gl-js/docs/examples/live-update-feature/)
	 */
	panTo(lnglat: LngLatLike, options?: EaseToOptions, eventData?: any): this;
	/**
	 * Returns the map's current zoom level.
	 *
	 * @returns The map's current zoom level.
	 * @example
	 * ```ts
	 * map.getZoom();
	 * ```
	 */
	getZoom(): number;
	/**
	 * Sets the map's zoom level. Equivalent to `jumpTo({zoom: zoom})`.
	 *
	 * Triggers the following events: `movestart`, `move`, `moveend`, `zoomstart`, `zoom`, and `zoomend`.
	 *
	 * @param zoom - The zoom level to set (0-20).
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 * @example
	 * Zoom to the zoom level 5 without an animated transition
	 * ```ts
	 * map.setZoom(5);
	 * ```
	 */
	setZoom(zoom: number, eventData?: any): this;
	/**
	 * Zooms the map to the specified zoom level, with an animated transition.
	 *
	 * Triggers the following events: `movestart`, `move`, `moveend`, `zoomstart`, `zoom`, and `zoomend`.
	 *
	 * @param zoom - The zoom level to transition to.
	 * @param options - Options object
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 * @example
	 * ```ts
	 * // Zoom to the zoom level 5 without an animated transition
	 * map.zoomTo(5);
	 * // Zoom to the zoom level 8 with an animated transition
	 * map.zoomTo(8, {
	 *   duration: 2000,
	 *   offset: [100, 50]
	 * });
	 * ```
	 */
	zoomTo(zoom: number, options?: EaseToOptions | null, eventData?: any): this;
	/**
	 * Increases the map's zoom level by 1.
	 *
	 * Triggers the following events: `movestart`, `move`, `moveend`, `zoomstart`, `zoom`, and `zoomend`.
	 *
	 * @param options - Options object
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 * @example
	 * Zoom the map in one level with a custom animation duration
	 * ```ts
	 * map.zoomIn({duration: 1000});
	 * ```
	 */
	zoomIn(options?: AnimationOptions, eventData?: any): this;
	/**
	 * Decreases the map's zoom level by 1.
	 *
	 * Triggers the following events: `movestart`, `move`, `moveend`, `zoomstart`, `zoom`, and `zoomend`.
	 *
	 * @param options - Options object
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 * @example
	 * Zoom the map out one level with a custom animation offset
	 * ```ts
	 * map.zoomOut({offset: [80, 60]});
	 * ```
	 */
	zoomOut(options?: AnimationOptions, eventData?: any): this;
	/**
	 * Returns the map's current vertical field of view, in degrees.
	 *
	 * @returns The map's current vertical field of view.
	 * @defaultValue 36.87
	 * @example
	 * ```ts
	 * const verticalFieldOfView = map.getVerticalFieldOfView();
	 * ```
	 */
	getVerticalFieldOfView(): number;
	/**
	 * Sets the map's vertical field of view, in degrees.
	 *
	 * Triggers the following events: `movestart`, `move`, and `moveend`.
	 *
	 * @param fov - The vertical field of view to set, in degrees (0-180).
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 * @defaultValue 36.87
	 * @example
	 * Change vertical field of view to 30 degrees
	 * ```ts
	 * map.setVerticalFieldOfView(30);
	 * ```
	 */
	setVerticalFieldOfView(fov: number, eventData?: any): this;
	/**
	 * Returns the map's current bearing. The bearing is the compass direction that is "up"; for example, a bearing
	 * of 90° orients the map so that east is up.
	 *
	 * @returns The map's current bearing.
	 * @see [Navigate the map with game-like controls](https://maplibre.org/maplibre-gl-js/docs/examples/game-controls/)
	 */
	getBearing(): number;
	/**
	 * Sets the map's bearing (rotation). The bearing is the compass direction that is "up"; for example, a bearing
	 * of 90° orients the map so that east is up.
	 *
	 * Equivalent to `jumpTo({bearing: bearing})`.
	 *
	 * Triggers the following events: `movestart`, `moveend`, and `rotate`.
	 *
	 * @param bearing - The desired bearing.
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 * @example
	 * Rotate the map to 90 degrees
	 * ```ts
	 * map.setBearing(90);
	 * ```
	 */
	setBearing(bearing: number, eventData?: any): this;
	/**
	 * Returns the current padding applied around the map viewport.
	 *
	 * @returns The current padding around the map viewport.
	 */
	getPadding(): PaddingOptions;
	/**
	 * Sets the padding in pixels around the viewport.
	 *
	 * Equivalent to `jumpTo({padding: padding})`.
	 *
	 * Triggers the following events: `movestart` and `moveend`.
	 *
	 * @param padding - The desired padding.
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 * @example
	 * Sets a left padding of 300px, and a top padding of 50px
	 * ```ts
	 * map.setPadding({ left: 300, top: 50 });
	 * ```
	 */
	setPadding(padding: PaddingOptions, eventData?: any): this;
	/**
	 * Rotates the map to the specified bearing, with an animated transition. The bearing is the compass direction
	 * that is "up"; for example, a bearing of 90° orients the map so that east is up.
	 *
	 * Triggers the following events: `movestart`, `moveend`, and `rotate`.
	 *
	 * @param bearing - The desired bearing.
	 * @param options - Options object
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 */
	rotateTo(bearing: number, options?: EaseToOptions, eventData?: any): this;
	/**
	 * Rotates the map so that north is up (0° bearing), with an animated transition.
	 *
	 * Triggers the following events: `movestart`, `moveend`, and `rotate`.
	 *
	 * @param options - Options object
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 */
	resetNorth(options?: AnimationOptions, eventData?: any): this;
	/**
	 * Rotates and pitches the map so that north is up (0° bearing) and pitch and roll are 0°, with an animated transition.
	 *
	 * Triggers the following events: `movestart`, `move`, `moveend`, `pitchstart`, `pitch`, `pitchend`, `rollstart`, `roll`, `rollend`, and `rotate`.
	 *
	 * @param options - Options object
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 */
	resetNorthPitch(options?: AnimationOptions, eventData?: any): this;
	/**
	 * Snaps the map so that north is up (0° bearing), if the current bearing is close enough to it (i.e. within the
	 * `bearingSnap` threshold).
	 *
	 * Triggers the following events: `movestart`, `moveend`, and `rotate`.
	 *
	 * @param options - Options object
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 */
	snapToNorth(options?: AnimationOptions, eventData?: any): this;
	/**
	 * Returns the map's current pitch (tilt).
	 *
	 * @returns The map's current pitch, measured in degrees away from the plane of the screen.
	 */
	getPitch(): number;
	/**
	 * Sets the map's pitch (tilt). Equivalent to `jumpTo({pitch: pitch})`.
	 *
	 * Triggers the following events: `movestart`, `moveend`, `pitchstart`, and `pitchend`.
	 *
	 * @param pitch - The pitch to set, measured in degrees away from the plane of the screen (0-60).
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 */
	setPitch(pitch: number, eventData?: any): this;
	/**
	 * Returns the map's current roll angle.
	 *
	 * @returns The map's current roll, measured in degrees about the camera boresight.
	 */
	getRoll(): number;
	/**
	 * Sets the map's roll angle. Equivalent to `jumpTo({roll: roll})`.
	 *
	 * Triggers the following events: `movestart`, `moveend`, `rollstart`, and `rollend`.
	 *
	 * @param roll - The roll to set, measured in degrees about the camera boresight
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 */
	setRoll(roll: number, eventData?: any): this;
	/**
	 * @param bounds - Calculate the center for these bounds in the viewport and use
	 * the highest zoom level up to and including `Map#getMaxZoom()` that fits
	 * in the viewport. LngLatBounds represent a box that is always axis-aligned with bearing 0.
	 * Bounds will be taken in [sw, ne] order. Southwest point will always be to the left of the northeast point.
	 * @param options - Options object
	 * @returns If map is able to fit to provided bounds, returns `center`, `zoom`, and `bearing`.
	 * If map is unable to fit, method will warn and return undefined.
	 * @example
	 * ```ts
	 * let bbox = [[-79, 43], [-73, 45]];
	 * let newCameraTransform = map.cameraForBounds(bbox, {
	 *   padding: {top: 10, bottom:25, left: 15, right: 5}
	 * });
	 * ```
	 */
	cameraForBounds(bounds: LngLatBoundsLike, options?: CameraForBoundsOptions): CenterZoomBearing | undefined;
	/**
	 * @internal
	 * Calculate the center of these two points in the viewport and use
	 * the highest zoom level up to and including `Map#getMaxZoom()` that fits
	 * the AABB defined by these points in the viewport at the specified bearing.
	 * @param p0 - First point
	 * @param p1 - Second point
	 * @param bearing - Desired map bearing at end of animation, in degrees
	 * @param options - the camera options
	 * @returns If map is able to fit to provided bounds, returns `center`, `zoom`, and `bearing`.
	 *      If map is unable to fit, method will warn and return undefined.
	 * @example
	 * ```ts
	 * let p0 = [-79, 43];
	 * let p1 = [-73, 45];
	 * let bearing = 90;
	 * let newCameraTransform = map._cameraForBoxAndBearing(p0, p1, bearing, {
	 *   padding: {top: 10, bottom:25, left: 15, right: 5}
	 * });
	 * ```
	 */
	_cameraForBoxAndBearing(p0: LngLatLike, p1: LngLatLike, bearing: number, options?: CameraForBoundsOptions): CenterZoomBearing | undefined;
	/**
	 * Pans and zooms the map to contain its visible area within the specified geographical bounds.
	 * This function will also reset the map's bearing to 0 if bearing is nonzero.
	 *
	 * Triggers the following events: `movestart` and `moveend`.
	 *
	 * @param bounds - Center these bounds in the viewport and use the highest
	 * zoom level up to and including `Map#getMaxZoom()` that fits them in the viewport.
	 * Bounds will be taken in [sw, ne] order. Southwest point will always be to the left of the northeast point.
	 * @param options - Options supports all properties from {@link AnimationOptions} and {@link CameraOptions} in addition to the fields below.
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 * @example
	 * ```ts
	 * let bbox = [[-79, 43], [-73, 45]];
	 * map.fitBounds(bbox, {
	 *   padding: {top: 10, bottom:25, left: 15, right: 5}
	 * });
	 * ```
	 * @see [Fit a map to a bounding box](https://maplibre.org/maplibre-gl-js/docs/examples/fitbounds/)
	 */
	fitBounds(bounds: LngLatBoundsLike, options?: FitBoundsOptions, eventData?: any): this;
	/**
	 * Pans, rotates and zooms the map to to fit the box made by points p0 and p1
	 * once the map is rotated to the specified bearing. To zoom without rotating,
	 * pass in the current map bearing.
	 *
	 * Triggers the following events: `movestart`, `move`, `moveend`, `zoomstart`, `zoom`, `zoomend` and `rotate`.
	 *
	 * @param p0 - First point on screen, in pixel coordinates
	 * @param p1 - Second point on screen, in pixel coordinates
	 * @param bearing - Desired map bearing at end of animation, in degrees
	 * @param options - Options object
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 * @example
	 * ```ts
	 * let p0 = [220, 400];
	 * let p1 = [500, 900];
	 * map.fitScreenCoordinates(p0, p1, map.getBearing(), {
	 *   padding: {top: 10, bottom:25, left: 15, right: 5}
	 * });
	 * ```
	 * @see Used by {@link BoxZoomHandler}
	 */
	fitScreenCoordinates(p0: PointLike, p1: PointLike, bearing: number, options?: FitBoundsOptions, eventData?: any): this;
	_fitInternal(calculatedOptions?: CenterZoomBearing, options?: FitBoundsOptions, eventData?: any): this;
	/**
	 * Changes any combination of center, zoom, bearing, pitch, and roll, without
	 * an animated transition. The map will retain its current values for any
	 * details not specified in `options`.
	 *
	 * Triggers the following events: `movestart`, `move`, `moveend`, `zoomstart`, `zoom`, `zoomend`, `pitchstart`,
	 * `pitch`, `pitchend`, `rollstart`, `roll`, `rollend` and `rotate`.
	 *
	 * @param options - Options object
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 * @example
	 * ```ts
	 * // jump to coordinates at current zoom
	 * map.jumpTo({center: [0, 0]});
	 * // jump with zoom, pitch, and bearing options
	 * map.jumpTo({
	 *   center: [0, 0],
	 *   zoom: 8,
	 *   pitch: 45,
	 *   bearing: 90
	 * });
	 * ```
	 * @see [Jump to a series of locations](https://maplibre.org/maplibre-gl-js/docs/examples/jump-to/)
	 * @see [Update a feature in realtime](https://maplibre.org/maplibre-gl-js/docs/examples/live-update-feature/)
	 */
	jumpTo(options: JumpToOptions, eventData?: any): this;
	/**
	 * Given a camera 'from' position and a position to look at (`to`), calculates zoom and camera rotation and returns them as {@link CameraOptions}.
	 * @param from - The camera to look from
	 * @param altitudeFrom - The altitude of the camera to look from
	 * @param to - The center to look at
	 * @param altitudeTo - Optional altitude of the center to look at. If none given the ground height will be used.
	 * @returns the calculated camera options
	 * @example
	 * ```ts
	 * // Calculate options to look from (1°, 0°, 1000m) to (1°, 1°, 0m)
	 * const cameraLngLat = new LngLat(1, 0);
	 * const cameraAltitude = 1000;
	 * const targetLngLat = new LngLat(1, 1);
	 * const targetAltitude = 0;
	 * const cameraOptions = map.calculateCameraOptionsFromTo(cameraLngLat, cameraAltitude, targetLngLat, targetAltitude);
	 * // Apply calculated options
	 * map.jumpTo(cameraOptions);
	 * ```
	 */
	calculateCameraOptionsFromTo(from: LngLatLike, altitudeFrom: number, to: LngLatLike, altitudeTo?: number): CameraOptions;
	/**
	 * Given a camera position and rotation, calculates zoom and center point and returns them as {@link CameraOptions}.
	 * @param cameraLngLat - The lng, lat of the camera to look from
	 * @param cameraAlt - The altitude of the camera to look from, in meters above sea level
	 * @param bearing - Bearing of the camera, in degrees
	 * @param pitch - Pitch of the camera, in degrees
	 * @param roll - Roll of the camera, in degrees
	 * @returns the calculated camera options
	 * @example
	 * ```ts
	 * // Calculate options to look from camera position(1°, 0°, 1000m) with bearing = 90°, pitch = 30°, and roll = 45°
	 * const cameraLngLat = new LngLat(1, 0);
	 * const cameraAltitude = 1000;
	 * const bearing = 90;
	 * const pitch = 30;
	 * const roll = 45;
	 * const cameraOptions = map.calculateCameraOptionsFromCameraLngLatAltRotation(cameraLngLat, cameraAltitude, bearing, pitch, roll);
	 * // Apply calculated options
	 * map.jumpTo(cameraOptions);
	 * ```
	 */
	calculateCameraOptionsFromCameraLngLatAltRotation(cameraLngLat: LngLatLike, cameraAlt: number, bearing: number, pitch: number, roll?: number): CameraOptions;
	/**
	 * Changes any combination of `center`, `zoom`, `bearing`, `pitch`, `roll`, and `padding` with an animated transition
	 * between old and new values. The map will retain its current values for any
	 * details not specified in `options`.
	 *
	 * Note: The transition will happen instantly if the user has enabled
	 * the `reduced motion` accessibility feature enabled in their operating system,
	 * unless `options` includes `essential: true`.
	 *
	 * Triggers the following events: `movestart`, `move`, `moveend`, `zoomstart`, `zoom`, `zoomend`, `pitchstart`,
	 * `pitch`, `pitchend`, `rollstart`, `roll`, `rollend`, and `rotate`.
	 *
	 * @param options - Options describing the destination and animation of the transition.
	 * Accepts {@link CameraOptions} and {@link AnimationOptions}.
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 * @see [Navigate the map with game-like controls](https://maplibre.org/maplibre-gl-js/docs/examples/game-controls/)
	 */
	easeTo(options: EaseToOptions, eventData?: any): this;
	_prepareEase(eventData: any, noMoveStart: boolean, currently?: {
		moving?: boolean;
		zooming?: boolean;
		rotating?: boolean;
		pitching?: boolean;
		rolling?: boolean;
	}): void;
	_prepareElevation(center: LngLat): void;
	_updateElevation(k: number): void;
	_finalizeElevation(): void;
	/**
	 * @internal
	 * Called when the camera is about to be manipulated.
	 * If `transformCameraUpdate` is specified or terrain is enabled, a copy of
	 * the current transform is created to track the accumulated changes.
	 * This underlying transform represents the "desired state" proposed by input handlers / animations / UI controls.
	 * It may differ from the state used for rendering (`this.transform`).
	 * @returns Transform to apply changes to
	 */
	_getTransformForUpdate(): ITransform;
	/**
	 * @internal
	 * Checks the given transform for the camera being below terrain surface and
	 * returns new pitch and zoom to fix that.
	 *
	 * With the new pitch and zoom, the camera will be at the same ground
	 * position but at higher altitude. It will still point to the same spot on
	 * the map.
	 *
	 * @param tr - The transform to check.
	 */
	_elevateCameraIfInsideTerrain(tr: ITransform): {
		pitch?: number;
		zoom?: number;
	};
	/**
	 * @internal
	 * Called after the camera is done being manipulated.
	 * @param tr - the requested camera end state
	 * If the camera is inside terrain, it gets elevated.
	 * Call `transformCameraUpdate` if present, and then apply the "approved" changes.
	 */
	_applyUpdatedTransform(tr: ITransform): void;
	_fireMoveEvents(eventData?: any): void;
	_afterEase(eventData?: any, easeId?: string): void;
	/**
	 * Changes any combination of center, zoom, bearing, pitch, and roll, animating the transition along a curve that
	 * evokes flight. The animation seamlessly incorporates zooming and panning to help
	 * the user maintain her bearings even after traversing a great distance.
	 *
	 * Note: The animation will be skipped, and this will behave equivalently to `jumpTo`
	 * if the user has the `reduced motion` accessibility feature enabled in their operating system,
	 * unless 'options' includes `essential: true`.
	 *
	 * Triggers the following events: `movestart`, `move`, `moveend`, `zoomstart`, `zoom`, `zoomend`, `pitchstart`,
	 * `pitch`, `pitchend`, `rollstart`, `roll`, `rollend`, and `rotate`.
	 *
	 * @param options - Options describing the destination and animation of the transition.
	 * Accepts {@link CameraOptions}, {@link AnimationOptions},
	 * and the following additional options.
	 * @param eventData - Additional properties to be added to event objects of events triggered by this method.
	 * @example
	 * ```ts
	 * // fly with default options to null island
	 * map.flyTo({center: [0, 0], zoom: 9});
	 * // using flyTo options
	 * map.flyTo({
	 *   center: [0, 0],
	 *   zoom: 9,
	 *   speed: 0.2,
	 *   curve: 1,
	 *   easing(t) {
	 *     return t;
	 *   }
	 * });
	 * ```
	 * @see [Fly to a location](https://maplibre.org/maplibre-gl-js/docs/examples/flyto/)
	 * @see [Slowly fly to a location](https://maplibre.org/maplibre-gl-js/docs/examples/flyto-options/)
	 * @see [Fly to a location based on scroll position](https://maplibre.org/maplibre-gl-js/docs/examples/scroll-fly-to/)
	 */
	flyTo(options: FlyToOptions, eventData?: any): this;
	isEasing(): boolean;
	/**
	 * Stops any animated transition underway.
	 */
	stop(): this;
	_stop(allowGestures?: boolean, easeId?: string): this;
	_ease(frame: (_: number) => void, finish: () => void, options: {
		animate?: boolean;
		duration?: number;
		easing?: (_: number) => number;
	}): void;
	_renderFrameCallback: () => void;
	_normalizeBearing(bearing: number, currentBearing: number): number;
	/**
	 * Gets the elevation at a given location, in meters above sea level.
	 * Returns null if terrain is not enabled.
	 * If terrain is enabled with some exaggeration value, the value returned here will be reflective of (multiplied by) that exaggeration value.
	 * This method should be used for proper positioning of custom 3d objects, as explained [here](https://maplibre.org/maplibre-gl-js/docs/examples/add-3d-model-with-terrain/)
	 * @param lngLatLike - [x,y] or LngLat coordinates of the location
	 * @returns elevation in meters
	 */
	queryTerrainElevation(lngLatLike: LngLatLike): number | null;
}
type ControlPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type MapLayerMouseEvent = MapMouseEvent & {
	features?: MapGeoJSONFeature[];
};
type MapLayerTouchEvent = MapTouchEvent & {
	features?: MapGeoJSONFeature[];
};
type MapSourceDataType = "content" | "metadata" | "visibility" | "idle";
type MapLayerEventType = {
	/**
	 * Fired when a pointing device (usually a mouse) is pressed and released contains a visible portion of the specified layer.
	 *
	 * @see [Measure distances](https://maplibre.org/maplibre-gl-js/docs/examples/measure/)
	 * @see [Center the map on a clicked symbol](https://maplibre.org/maplibre-gl-js/docs/examples/center-on-symbol/)
	 */
	click: MapLayerMouseEvent;
	/**
	 * Fired when a pointing device (usually a mouse) is pressed and released twice contains a visible portion of the specified layer.
	 *
	 * **Note:** Under normal conditions, this event will be preceded by two `click` events.
	 */
	dblclick: MapLayerMouseEvent;
	/**
	 * Fired when a pointing device (usually a mouse) is pressed while inside a visible portion of the specified layer.
	 * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
	 */
	mousedown: MapLayerMouseEvent;
	/**
	 * Fired when a pointing device (usually a mouse) is released while inside a visible portion of the specified layer.
	 * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
	 */
	mouseup: MapLayerMouseEvent;
	/**
	 * Fired when a pointing device (usually a mouse) is moved while the cursor is inside a visible portion of the specified layer.
	 * As you move the cursor across the layer, the event will fire every time the cursor changes position within that layer.
	 *
	 * @see [Get coordinates of the mouse pointer](https://maplibre.org/maplibre-gl-js/docs/examples/mouse-position/)
	 * @see [Highlight features under the mouse pointer](https://maplibre.org/maplibre-gl-js/docs/examples/hover-styles/)
	 * @see [Display a popup on over](https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-hover/)
	 * @see [Animate symbol to follow the mouse](https://maplibre.org/maplibre-gl-js/docs/examples/animate-symbol-to-follow-mouse/)
	 */
	mousemove: MapLayerMouseEvent;
	/**
	 * Fired when a pointing device (usually a mouse) enters a visible portion of a specified layer from
	 * outside that layer or outside the map canvas.
	 *
	 * @see [Center the map on a clicked symbol](https://maplibre.org/maplibre-gl-js/docs/examples/center-on-symbol/)
	 * @see [Display a popup on click](https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-click/)
	 */
	mouseenter: MapLayerMouseEvent;
	/**
	 * Fired when a pointing device (usually a mouse) leaves a visible portion of a specified layer, or leaves
	 * the map canvas.
	 *
	 * @see [Highlight features under the mouse pointer](https://maplibre.org/maplibre-gl-js/docs/examples/hover-styles/)
	 * @see [Display a popup on click](https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-click/)
	 */
	mouseleave: MapLayerMouseEvent;
	/**
	 * Fired when a pointing device (usually a mouse) is moved inside a visible portion of the specified layer.
	 *
	 * @see [Get coordinates of the mouse pointer](https://maplibre.org/maplibre-gl-js/docs/examples/mouse-position/)
	 * @see [Highlight features under the mouse pointer](https://maplibre.org/maplibre-gl-js/docs/examples/hover-styles/)
	 * @see [Display a popup on hover](https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-hover/)
	 */
	mouseover: MapLayerMouseEvent;
	/**
	 * Fired when a point device (usually a mouse) leaves the visible portion of the specified layer.
	 */
	mouseout: MapLayerMouseEvent;
	/**
	 * Fired when the right button of the mouse is clicked or the context menu key is pressed within visible portion of the specified layer.
	 */
	contextmenu: MapLayerMouseEvent;
	/**
	 * Fired when a [`touchstart`](https://developer.mozilla.org/en-US/docs/Web/Events/touchstart) event occurs within the visible portion of the specified layer.
	 * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
	 */
	touchstart: MapLayerTouchEvent;
	/**
	 * Fired when a [`touchend`](https://developer.mozilla.org/en-US/docs/Web/Events/touchend) event occurs within the visible portion of the specified layer.
	 * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
	 */
	touchend: MapLayerTouchEvent;
	/**
	 * Fired when a [`touchstart`](https://developer.mozilla.org/en-US/docs/Web/Events/touchstart) event occurs within the visible portion of the specified layer.
	 * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
	 */
	touchcancel: MapLayerTouchEvent;
};
type MapEventType = {
	/**
	 * Fired when an error occurs. This is GL JS's primary error reporting
	 * mechanism. We use an event instead of `throw` to better accommodate
	 * asynchronous operations. If no listeners are bound to the `error` event, the
	 * error will be printed to the console.
	 */
	error: ErrorEvent;
	/**
	 * Fired immediately after all necessary resources have been downloaded
	 * and the first visually complete rendering of the map has occurred.
	 *
	 * @see [Draw GeoJSON points](https://maplibre.org/maplibre-gl-js/docs/examples/geojson-markers/)
	 * @see [Add live realtime data](https://maplibre.org/maplibre-gl-js/docs/examples/live-geojson/)
	 * @see [Animate a point](https://maplibre.org/maplibre-gl-js/docs/examples/animate-point-along-line/)
	 */
	load: MapLibreEvent;
	/**
	 * Fired after the last frame rendered before the map enters an
	 * "idle" state:
	 *
	 * - No camera transitions are in progress
	 * - All currently requested tiles have loaded
	 * - All fade/transition animations have completed
	 */
	idle: MapLibreEvent;
	/**
	 * Fired immediately after the map has been removed with {@link Map#remove}.
	 */
	remove: MapLibreEvent;
	/**
	 * Fired whenever the map is drawn to the screen, as the result of
	 *
	 * - a change to the map's position, zoom, pitch, or bearing
	 * - a change to the map's style
	 * - a change to a GeoJSON source
	 * - the loading of a vector tile, GeoJSON file, glyph, or sprite
	 */
	render: MapLibreEvent;
	/**
	 * Fired immediately after the map has been resized.
	 */
	resize: MapLibreEvent;
	/**
	 * Fired when the WebGL context is lost.
	 */
	webglcontextlost: MapContextEvent;
	/**
	 * Fired when the WebGL context is restored.
	 */
	webglcontextrestored: MapContextEvent;
	/**
	 * Fired when any map data (style, source, tile, etc) begins loading or
	 * changing asynchronously. All `dataloading` events are followed by a `data`,
	 * `dataabort` or `error` event.
	 */
	dataloading: MapDataEvent;
	/**
	 * Fired when any map data loads or changes. See {@link MapDataEvent} for more information.
	 * @see [Display HTML clusters with custom properties](https://maplibre.org/maplibre-gl-js/docs/examples/cluster-html/)
	 */
	data: MapDataEvent;
	tiledataloading: MapDataEvent;
	/**
	 * Fired when one of the map's sources begins loading or changing asynchronously.
	 * All `sourcedataloading` events are followed by a `sourcedata`, `sourcedataabort` or `error` event.
	 */
	sourcedataloading: MapSourceDataEvent;
	/**
	 * Fired when the map's style begins loading or changing asynchronously.
	 * All `styledataloading` events are followed by a `styledata`
	 * or `error` event.
	 */
	styledataloading: MapStyleDataEvent;
	/**
	 * Fired when one of the map's sources loads or changes, including if a tile belonging
	 * to a source loads or changes.
	 */
	sourcedata: MapSourceDataEvent;
	/**
	 * Fired when the map's style loads or changes.
	 */
	styledata: MapStyleDataEvent;
	/**
	 * Fired when an icon or pattern needed by the style is missing. The missing image can
	 * be added with {@link Map#addImage} within this event listener callback to prevent the image from
	 * being skipped. This event can be used to dynamically generate icons and patterns.
	 * @see [Generate and add a missing icon to the map](https://maplibre.org/maplibre-gl-js/docs/examples/add-image-missing-generated/)
	 */
	styleimagemissing: MapStyleImageMissingEvent;
	/**
	 * Fired when a request for one of the map's sources' tiles or data is aborted.
	 */
	dataabort: MapDataEvent;
	/**
	 * Fired when a request for one of the map's sources' data is aborted.
	 */
	sourcedataabort: MapSourceDataEvent;
	/**
	 * Fired when the user cancels a "box zoom" interaction, or when the bounding box does not meet the minimum size threshold.
	 * See {@link BoxZoomHandler}.
	 */
	boxzoomcancel: MapLibreZoomEvent;
	/**
	 * Fired when a "box zoom" interaction starts. See {@link BoxZoomHandler}.
	 */
	boxzoomstart: MapLibreZoomEvent;
	/**
	 * Fired when a "box zoom" interaction ends.  See {@link BoxZoomHandler}.
	 */
	boxzoomend: MapLibreZoomEvent;
	/**
	 * Fired when a [`touchcancel`](https://developer.mozilla.org/en-US/docs/Web/Events/touchcancel) event occurs within the map.
	 */
	touchcancel: MapTouchEvent;
	/**
	 * Fired when a [`touchmove`](https://developer.mozilla.org/en-US/docs/Web/Events/touchmove) event occurs within the map.
	 * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
	 */
	touchmove: MapTouchEvent;
	/**
	 * Fired when a [`touchend`](https://developer.mozilla.org/en-US/docs/Web/Events/touchend) event occurs within the map.
	 * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
	 */
	touchend: MapTouchEvent;
	/**
	 * Fired when a [`touchstart`](https://developer.mozilla.org/en-US/docs/Web/Events/touchstart) event occurs within the map.
	 * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
	 */
	touchstart: MapTouchEvent;
	/**
	 * Fired when a pointing device (usually a mouse) is pressed and released at the same point on the map.
	 *
	 * @see [Measure distances](https://maplibre.org/maplibre-gl-js/docs/examples/measure/)
	 * @see [Center the map on a clicked symbol](https://maplibre.org/maplibre-gl-js/docs/examples/center-on-symbol/)
	 */
	click: MapMouseEvent;
	/**
	 * Fired when the right button of the mouse is clicked or the context menu key is pressed within the map.
	 */
	contextmenu: MapMouseEvent;
	/**
	 * Fired when a pointing device (usually a mouse) is pressed and released twice at the same point on the map in rapid succession.
	 *
	 * **Note:** Under normal conditions, this event will be preceded by two `click` events.
	 */
	dblclick: MapMouseEvent;
	/**
	 * Fired when a pointing device (usually a mouse) is moved while the cursor is inside the map.
	 * As you move the cursor across the map, the event will fire every time the cursor changes position within the map.
	 *
	 * @see [Get coordinates of the mouse pointer](https://maplibre.org/maplibre-gl-js/docs/examples/mouse-position/)
	 * @see [Highlight features under the mouse pointer](https://maplibre.org/maplibre-gl-js/docs/examples/hover-styles/)
	 * @see [Display a popup on over](https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-hover/)
	 */
	mousemove: MapMouseEvent;
	/**
	 * Fired when a pointing device (usually a mouse) is released within the map.
	 *
	 * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
	 */
	mouseup: MapMouseEvent;
	/**
	 * Fired when a pointing device (usually a mouse) is pressed within the map.
	 *
	 * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
	 */
	mousedown: MapMouseEvent;
	/**
	 * Fired when a point device (usually a mouse) leaves the map's canvas.
	 */
	mouseout: MapMouseEvent;
	/**
	 * Fired when a pointing device (usually a mouse) is moved within the map.
	 * As you move the cursor across a web page containing a map,
	 * the event will fire each time it enters the map or any child elements.
	 *
	 * @see [Get coordinates of the mouse pointer](https://maplibre.org/maplibre-gl-js/docs/examples/mouse-position/)
	 * @see [Highlight features under the mouse pointer](https://maplibre.org/maplibre-gl-js/docs/examples/hover-styles/)
	 * @see [Display a popup on hover](https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-hover/)
	 */
	mouseover: MapMouseEvent;
	/**
	 * Fired just before the map begins a transition from one
	 * view to another, as the result of either user interaction or methods such as {@link Map#jumpTo}.
	 *
	 */
	movestart: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined>;
	/**
	 * Fired repeatedly during an animated transition from one view to
	 * another, as the result of either user interaction or methods such as {@link Map#flyTo}.
	 *
	 * @see [Display HTML clusters with custom properties](https://maplibre.org/maplibre-gl-js/docs/examples/cluster-html/)
	 */
	move: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined>;
	/**
	 * Fired just after the map completes a transition from one
	 * view to another, as the result of either user interaction or methods such as {@link Map#jumpTo}.
	 *
	 * @see [Display HTML clusters with custom properties](https://maplibre.org/maplibre-gl-js/docs/examples/cluster-html/)
	 */
	moveend: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined>;
	/**
	 * Fired just before the map begins a transition from one zoom level to another,
	 * as the result of either user interaction or methods such as {@link Map#flyTo}.
	 */
	zoomstart: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined>;
	/**
	 * Fired repeatedly during an animated transition from one zoom level to another,
	 * as the result of either user interaction or methods such as {@link Map#flyTo}.
	 */
	zoom: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined>;
	/**
	 * Fired just after the map completes a transition from one zoom level to another,
	 * as the result of either user interaction or methods such as {@link Map#flyTo}.
	 */
	zoomend: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined>;
	/**
	 * Fired when a "drag to rotate" interaction starts. See {@link DragRotateHandler}.
	 */
	rotatestart: MapLibreEvent<MouseEvent | TouchEvent | undefined>;
	/**
	 * Fired repeatedly during a "drag to rotate" interaction. See {@link DragRotateHandler}.
	 */
	rotate: MapLibreEvent<MouseEvent | TouchEvent | undefined>;
	/**
	 * Fired when a "drag to rotate" interaction ends. See {@link DragRotateHandler}.
	 */
	rotateend: MapLibreEvent<MouseEvent | TouchEvent | undefined>;
	/**
	 * Fired when a "drag to pan" interaction starts. See {@link DragPanHandler}.
	 */
	dragstart: MapLibreEvent<MouseEvent | TouchEvent | undefined>;
	/**
	 * Fired repeatedly during a "drag to pan" interaction. See {@link DragPanHandler}.
	 */
	drag: MapLibreEvent<MouseEvent | TouchEvent | undefined>;
	/**
	 * Fired when a "drag to pan" interaction ends. See {@link DragPanHandler}.
	 * @see [Create a draggable marker](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-marker/)
	 */
	dragend: MapLibreEvent<MouseEvent | TouchEvent | undefined>;
	/**
	 * Fired whenever the map's pitch (tilt) begins a change as
	 * the result of either user interaction or methods such as {@link Map#flyTo} .
	 */
	pitchstart: MapLibreEvent<MouseEvent | TouchEvent | undefined>;
	/**
	 * Fired repeatedly during the map's pitch (tilt) animation between
	 * one state and another as the result of either user interaction
	 * or methods such as {@link Map#flyTo}.
	 */
	pitch: MapLibreEvent<MouseEvent | TouchEvent | undefined>;
	/**
	 * Fired immediately after the map's pitch (tilt) finishes changing as
	 * the result of either user interaction or methods such as {@link Map#flyTo}.
	 */
	pitchend: MapLibreEvent<MouseEvent | TouchEvent | undefined>;
	/**
	 * Fired when a [`wheel`](https://developer.mozilla.org/en-US/docs/Web/Events/wheel) event occurs within the map.
	 */
	wheel: MapWheelEvent;
	/**
	 * Fired when terrain is changed
	 */
	terrain: MapTerrainEvent;
	/**
	 * Fired whenever the cooperativeGestures option prevents a gesture from being handled by the map.
	 * This is useful for showing your own UI when this happens.
	 */
	cooperativegestureprevented: MapLibreEvent<WheelEvent | TouchEvent> & {
		gestureType: "wheel_zoom" | "touch_pan";
	};
	/**
	 * Fired when map's projection is modified in other ways than by map being moved.
	 */
	projectiontransition: MapProjectionEvent;
};
type MapLibreEvent<TOrig = unknown> = {
	type: keyof MapEventType | keyof MapLayerEventType;
	target: Map$1;
	originalEvent: TOrig;
};
type MapStyleDataEvent = MapLibreEvent & {
	dataType: "style";
};
type MapSourceDataEvent = MapLibreEvent & {
	dataType: "source";
	/**
	 * True if the event has a `dataType` of `source` and the source has no outstanding network requests.
	 */
	isSourceLoaded: boolean;
	/**
	 * The [style spec representation of the source](https://maplibre.org/maplibre-style-spec/#sources) if the event has a `dataType` of `source`.
	 */
	source: SourceSpecification;
	sourceId: string;
	sourceDataType: MapSourceDataType;
	sourceDataChanged?: boolean;
	/**
	 * The tile being loaded or changed, if the event has a `dataType` of `source` and
	 * the event is related to loading of a tile.
	 */
	tile: any;
};
declare class MapMouseEvent extends Event$1 implements MapLibreEvent<MouseEvent> {
	/**
	 * The event type
	 */
	type: "mousedown" | "mouseup" | "click" | "dblclick" | "mousemove" | "mouseover" | "mouseenter" | "mouseleave" | "mouseout" | "contextmenu";
	/**
	 * The `Map` object that fired the event.
	 */
	target: Map$1;
	/**
	 * The DOM event which caused the map event.
	 */
	originalEvent: MouseEvent;
	/**
	 * The pixel coordinates of the mouse cursor, relative to the map and measured from the top left corner.
	 */
	point: Point;
	/**
	 * The geographic location on the map of the mouse cursor.
	 */
	lngLat: LngLat;
	/**
	 * Prevents subsequent default processing of the event by the map.
	 *
	 * Calling this method will prevent the following default map behaviors:
	 *
	 *   * On `mousedown` events, the behavior of {@link DragPanHandler}
	 *   * On `mousedown` events, the behavior of {@link DragRotateHandler}
	 *   * On `mousedown` events, the behavior of {@link BoxZoomHandler}
	 *   * On `dblclick` events, the behavior of {@link DoubleClickZoomHandler}
	 *
	 */
	preventDefault(): void;
	/**
	 * `true` if `preventDefault` has been called.
	 */
	get defaultPrevented(): boolean;
	_defaultPrevented: boolean;
	constructor(type: string, map: Map$1, originalEvent: MouseEvent, data?: any);
}
declare class MapTouchEvent extends Event$1 implements MapLibreEvent<TouchEvent> {
	/**
	 * The event type.
	 */
	type: "touchstart" | "touchmove" | "touchend" | "touchcancel";
	/**
	 * The `Map` object that fired the event.
	 */
	target: Map$1;
	/**
	 * The DOM event which caused the map event.
	 */
	originalEvent: TouchEvent;
	/**
	 * The geographic location on the map of the center of the touch event points.
	 */
	lngLat: LngLat;
	/**
	 * The pixel coordinates of the center of the touch event points, relative to the map and measured from the top left
	 * corner.
	 */
	point: Point;
	/**
	 * The array of pixel coordinates corresponding to a
	 * [touch event's `touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches) property.
	 */
	points: Array<Point>;
	/**
	 * The geographical locations on the map corresponding to a
	 * [touch event's `touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches) property.
	 */
	lngLats: Array<LngLat>;
	/**
	 * Prevents subsequent default processing of the event by the map.
	 *
	 * Calling this method will prevent the following default map behaviors:
	 *
	 *   * On `touchstart` events, the behavior of {@link DragPanHandler}
	 *   * On `touchstart` events, the behavior of {@link TwoFingersTouchZoomRotateHandler}
	 *
	 */
	preventDefault(): void;
	/**
	 * `true` if `preventDefault` has been called.
	 */
	get defaultPrevented(): boolean;
	_defaultPrevented: boolean;
	constructor(type: string, map: Map$1, originalEvent: TouchEvent);
}
declare class MapWheelEvent extends Event$1 {
	/**
	 * The event type.
	 */
	type: "wheel";
	/**
	 * The `Map` object that fired the event.
	 */
	target: Map$1;
	/**
	 * The DOM event which caused the map event.
	 */
	originalEvent: WheelEvent;
	/**
	 * Prevents subsequent default processing of the event by the map.
	 *
	 * Calling this method will prevent the behavior of {@link ScrollZoomHandler}.
	 */
	preventDefault(): void;
	/**
	 * `true` if `preventDefault` has been called.
	 */
	get defaultPrevented(): boolean;
	_defaultPrevented: boolean;
	/** */
	constructor(type: string, map: Map$1, originalEvent: WheelEvent);
}
type MapLibreZoomEvent = {
	/**
	 * The type of boxzoom event. One of `boxzoomstart`, `boxzoomend` or `boxzoomcancel`
	 */
	type: "boxzoomstart" | "boxzoomend" | "boxzoomcancel";
	/**
	 * The `Map` instance that triggered the event
	 */
	target: Map$1;
	/**
	 * The DOM event that triggered the boxzoom event. Can be a `MouseEvent` or `KeyboardEvent`
	 */
	originalEvent: MouseEvent;
};
type MapDataEvent = {
	/**
	 * The event type.
	 */
	type: string;
	/**
	 * The type of data that has changed. One of `'source'`, `'style'`.
	 */
	dataType: string;
	/**
	 *  Included if the event has a `dataType` of `source` and the event signals that internal data has been received or changed. Possible values are `metadata`, `content`, `visibility` and `idle`.
	 */
	sourceDataType: MapSourceDataType;
};
type MapTerrainEvent = {
	type: "terrain";
};
type MapProjectionEvent = {
	type: "projectiontransition";
	/**
	 * Specifies the name of the new projection.
	 * For example:
	 *
	 *  - `globe` to describe globe that has internally switched to mercator
	 *  - `vertical-perspective` to describe a globe that doesn't change to mercator
	 *  - `mercator` to describe mercator projection
	 */
	newProjection: ProjectionSpecification["type"];
};
type MapContextEvent = {
	type: "webglcontextlost" | "webglcontextrestored";
	originalEvent: WebGLContextEvent;
};
type MapStyleImageMissingEvent = MapLibreEvent & {
	type: "styleimagemissing";
	id: string;
};
type AttributionControlOptions = {
	/**
	 * If `true`, the attribution control will always collapse when moving the map. If `false`,
	 * force the expanded attribution control. The default is a responsive attribution that collapses when the user moves the map on maps less than 640 pixels wide.
	 * **Attribution should not be collapsed if it can comfortably fit on the map. `compact` should only be used to modify default attribution when map size makes it impossible to fit default attribution and when the automatic compact resizing for default settings are not sufficient.**
	 */
	compact?: boolean;
	/**
	 * Attributions to show in addition to any other attributions.
	 */
	customAttribution?: string | Array<string>;
};
declare const defaultLocale: {
	"AttributionControl.ToggleAttribution": string;
	"AttributionControl.MapFeedback": string;
	"FullscreenControl.Enter": string;
	"FullscreenControl.Exit": string;
	"GeolocateControl.FindMyLocation": string;
	"GeolocateControl.LocationNotAvailable": string;
	"LogoControl.Title": string;
	"Map.Title": string;
	"Marker.Title": string;
	"NavigationControl.ResetBearing": string;
	"NavigationControl.ZoomIn": string;
	"NavigationControl.ZoomOut": string;
	"Popup.Close": string;
	"ScaleControl.Feet": string;
	"ScaleControl.Meters": string;
	"ScaleControl.Kilometers": string;
	"ScaleControl.Miles": string;
	"ScaleControl.NauticalMiles": string;
	"GlobeControl.Enable": string;
	"GlobeControl.Disable": string;
	"TerrainControl.Enable": string;
	"TerrainControl.Disable": string;
	"CooperativeGesturesHandler.WindowsHelpText": string;
	"CooperativeGesturesHandler.MacHelpText": string;
	"CooperativeGesturesHandler.MobileHelpText": string;
};
type AroundCenterOptions = {
	/**
	 * If "center" is passed, map will zoom around the center of map
	 */
	around: "center";
};
type GestureOptions = boolean;
type WebGLSupportedVersions = "webgl2" | "webgl" | undefined;
type WebGLContextAttributesWithType = WebGLContextAttributes & {
	contextType?: WebGLSupportedVersions;
};
type MapOptions = {
	/**
	 * If `true`, the map's position (zoom, center latitude, center longitude, bearing, and pitch) will be synced with the hash fragment of the page's URL.
	 * For example, `http://path/to/my/page.html#2.59/39.26/53.07/-24.1/60`.
	 * An additional string may optionally be provided to indicate a parameter-styled hash,
	 * e.g. http://path/to/my/page.html#map=2.59/39.26/53.07/-24.1/60&foo=bar, where foo
	 * is a custom parameter and bar is an arbitrary hash distinct from the map hash.
	 * @defaultValue false
	 */
	hash?: boolean | string;
	/**
	 * If `false`, no mouse, touch, or keyboard listeners will be attached to the map, so it will not respond to interaction.
	 * @defaultValue true
	 */
	interactive?: boolean;
	/**
	 * The HTML element in which MapLibre GL JS will render the map, or the element's string `id`. The specified element must have no children.
	 */
	container: HTMLElement | string;
	/**
	 * The threshold, measured in degrees, that determines when the map's
	 * bearing will snap to north. For example, with a `bearingSnap` of 7, if the user rotates
	 * the map within 7 degrees of north, the map will automatically snap to exact north.
	 * @defaultValue 7
	 */
	bearingSnap?: number;
	/**
	 * If set, an {@link AttributionControl} will be added to the map with the provided options.
	 * To disable the attribution control, pass `false`.
	 * Note: showing the logo of MapLibre is not required for using MapLibre.
	 * @defaultValue compact: true, customAttribution: "MapLibre ...".
	 */
	attributionControl?: false | AttributionControlOptions;
	/**
	 * If `true`, the MapLibre logo will be shown.
	 */
	maplibreLogo?: boolean;
	/**
	 * A string representing the position of the MapLibre wordmark on the map. Valid options are `top-left`,`top-right`, `bottom-left`, or `bottom-right`.
	 * @defaultValue 'bottom-left'
	 */
	logoPosition?: ControlPosition;
	/**
	 * Set of WebGLContextAttributes that are applied to the WebGL context of the map.
	 * See https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext for more details.
	 * `contextType` can be set to `webgl2` or `webgl` to force a WebGL version. Not setting it, Maplibre will do it's best to get a suitable context.
	 * @defaultValue antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: false, failIfMajorPerformanceCaveat: false, desynchronized: false, contextType: 'webgl2withfallback'
	 */
	canvasContextAttributes?: WebGLContextAttributesWithType;
	/**
	 * If `false`, the map won't attempt to re-request tiles once they expire per their HTTP `cacheControl`/`expires` headers.
	 * @defaultValue true
	 */
	refreshExpiredTiles?: boolean;
	/**
	 * If set, the map will be constrained to the given bounds.
	 */
	maxBounds?: LngLatBoundsLike;
	/**
	 * If `true`, the "scroll to zoom" interaction is enabled. {@link AroundCenterOptions} are passed as options to {@link ScrollZoomHandler#enable}.
	 * @defaultValue true
	 */
	scrollZoom?: boolean | AroundCenterOptions;
	/**
	 * The minimum zoom level of the map (0-24).
	 * @defaultValue 0
	 */
	minZoom?: number | null;
	/**
	 * The maximum zoom level of the map (0-24).
	 * @defaultValue 22
	 */
	maxZoom?: number | null;
	/**
	 * The minimum pitch of the map (0-180).
	 * @defaultValue 0
	 */
	minPitch?: number | null;
	/**
	 * The maximum pitch of the map (0-180).
	 * @defaultValue 60
	 */
	maxPitch?: number | null;
	/**
	 * If `true`, the "box zoom" interaction is enabled (see {@link BoxZoomHandler}).
	 * @defaultValue true
	 */
	boxZoom?: boolean;
	/**
	 * If `true`, the "drag to rotate" interaction is enabled (see {@link DragRotateHandler}).
	 * @defaultValue true
	 */
	dragRotate?: boolean;
	/**
	 * If `true`, the "drag to pan" interaction is enabled. An `Object` value is passed as options to {@link DragPanHandler#enable}.
	 * @defaultValue true
	 */
	dragPan?: boolean | DragPanOptions;
	/**
	 * If `true`, keyboard shortcuts are enabled (see {@link KeyboardHandler}).
	 * @defaultValue true
	 */
	keyboard?: boolean;
	/**
	 * If `true`, the "double click to zoom" interaction is enabled (see {@link DoubleClickZoomHandler}).
	 * @defaultValue true
	 */
	doubleClickZoom?: boolean;
	/**
	 * If `true`, the "pinch to rotate and zoom" interaction is enabled. An `Object` value is passed as options to {@link TwoFingersTouchZoomRotateHandler#enable}.
	 * @defaultValue true
	 */
	touchZoomRotate?: boolean | AroundCenterOptions;
	/**
	 * If `true`, the "drag to pitch" interaction is enabled. An `Object` value is passed as options to {@link TwoFingersTouchPitchHandler#enable}.
	 * @defaultValue true
	 */
	touchPitch?: boolean | AroundCenterOptions;
	/**
	 * If `true` or set to an options object, the map is only accessible on desktop while holding Command/Ctrl and only accessible on mobile with two fingers. Interacting with the map using normal gestures will trigger an informational screen. With this option enabled, "drag to pitch" requires a three-finger gesture. Cooperative gestures are disabled when a map enters fullscreen using {@link FullscreenControl}.
	 * @defaultValue false
	 */
	cooperativeGestures?: GestureOptions;
	/**
	 * If `true`, the map will automatically resize when the browser window resizes.
	 * @defaultValue true
	 */
	trackResize?: boolean;
	/**
	 * The initial geographical centerpoint of the map. If `center` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `[0, 0]` Note: MapLibre GL JS uses longitude, latitude coordinate order (as opposed to latitude, longitude) to match GeoJSON.
	 * @defaultValue [0, 0]
	 */
	center?: LngLatLike;
	/**
	 * The elevation of the initial geographical centerpoint of the map, in meters above sea level. If `elevation` is not specified in the constructor options, it will default to `0`.
	 * @defaultValue 0
	 */
	elevation?: number;
	/**
	 * The initial zoom level of the map. If `zoom` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`.
	 * @defaultValue 0
	 */
	zoom?: number;
	/**
	 * The initial bearing (rotation) of the map, measured in degrees counter-clockwise from north. If `bearing` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`.
	 * @defaultValue 0
	 */
	bearing?: number;
	/**
	 * The initial pitch (tilt) of the map, measured in degrees away from the plane of the screen (0-85). If `pitch` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`. Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.
	 * @defaultValue 0
	 */
	pitch?: number;
	/**
	 * The initial roll angle of the map, measured in degrees counter-clockwise about the camera boresight. If `roll` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`.
	 * @defaultValue 0
	 */
	roll?: number;
	/**
	 * If `true`, multiple copies of the world will be rendered side by side beyond -180 and 180 degrees longitude. If set to `false`:
	 *
	 * - When the map is zoomed out far enough that a single representation of the world does not fill the map's entire
	 * container, there will be blank space beyond 180 and -180 degrees longitude.
	 * - Features that cross 180 and -180 degrees longitude will be cut in two (with one portion on the right edge of the
	 * map and the other on the left edge of the map) at every zoom level.
	 * @defaultValue true
	 */
	renderWorldCopies?: boolean;
	/**
	 * The maximum number of tiles stored in the tile cache for a given source. If omitted, the cache will be dynamically sized based on the current viewport which can be set using `maxTileCacheZoomLevels` constructor options.
	 * @defaultValue null
	 */
	maxTileCacheSize?: number | null;
	/**
	 * The maximum number of zoom levels for which to store tiles for a given source. Tile cache dynamic size is calculated by multiplying `maxTileCacheZoomLevels` with the approximate number of tiles in the viewport for a given source.
	 * @defaultValue 5
	 */
	maxTileCacheZoomLevels?: number;
	/**
	 * A callback run before the Map makes a request for an external URL. The callback can be used to modify the url, set headers, or set the credentials property for cross-origin requests.
	 * Expected to return an object with a `url` property and optionally `headers` and `credentials` properties.
	 * @defaultValue null
	 */
	transformRequest?: RequestTransformFunction | null;
	/**
	 * A callback run before the map's camera is moved due to user input or animation. The callback can be used to modify the new center, zoom, pitch and bearing.
	 * Expected to return an object containing center, zoom, pitch or bearing values to overwrite.
	 * @defaultValue null
	 */
	transformCameraUpdate?: CameraUpdateTransformFunction | null;
	/**
	 * A patch to apply to the default localization table for UI strings, e.g. control tooltips. The `locale` object maps namespaced UI string IDs to translated strings in the target language; see `src/ui/default_locale.js` for an example with all supported string IDs. The object may specify all UI strings (thereby adding support for a new translation) or only a subset of strings (thereby patching the default translation table).
	 * @defaultValue null
	 */
	locale?: any;
	/**
	 * Controls the duration of the fade-in/fade-out animation for label collisions after initial map load, in milliseconds. This setting affects all symbol layers. This setting does not affect the duration of runtime styling transitions or raster tile cross-fading.
	 * @defaultValue 300
	 */
	fadeDuration?: number;
	/**
	 * If `true`, symbols from multiple sources can collide with each other during collision detection. If `false`, collision detection is run separately for the symbols in each source.
	 * @defaultValue true
	 */
	crossSourceCollisions?: boolean;
	/**
	 * If `true`, Resource Timing API information will be collected for requests made by GeoJSON and Vector Tile web workers (this information is normally inaccessible from the main Javascript thread). Information will be returned in a `resourceTiming` property of relevant `data` events.
	 * @defaultValue false
	 */
	collectResourceTiming?: boolean;
	/**
	 * The max number of pixels a user can shift the mouse pointer during a click for it to be considered a valid click (as opposed to a mouse drag).
	 * @defaultValue 3
	 */
	clickTolerance?: number;
	/**
	 * The initial bounds of the map. If `bounds` is specified, it overrides `center` and `zoom` constructor options.
	 */
	bounds?: LngLatBoundsLike;
	/**
	 * A {@link FitBoundsOptions} options object to use _only_ when fitting the initial `bounds` provided above.
	 */
	fitBoundsOptions?: FitBoundsOptions;
	/**
	 * Defines a CSS
	 * font-family for locally overriding generation of Chinese, Japanese, and Korean characters.
	 * For these characters, font settings from the map's style will be ignored, except for font-weight keywords (light/regular/medium/bold).
	 * Set to `false`, to enable font settings from the map's style for these glyph ranges.
	 * The purpose of this option is to avoid bandwidth-intensive glyph server requests. (See [Use locally generated ideographs](https://maplibre.org/maplibre-gl-js/docs/examples/local-ideographs).)
	 * @defaultValue 'sans-serif'
	 */
	localIdeographFontFamily?: string | false;
	/**
	 * The map's MapLibre style. This must be a JSON object conforming to
	 * the schema described in the [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/),
	 * or a URL to such JSON.
	 * When the style is not specified, calling {@link Map#setStyle} is required to render the map.
	 */
	style?: StyleSpecification | string;
	/**
	 * If `false`, the map's pitch (tilt) control with "drag to rotate" interaction will be disabled.
	 * @defaultValue true
	 */
	pitchWithRotate?: boolean;
	/**
	 * If `false`, the map's roll control with "drag to rotate" interaction will be disabled.
	 * @defaultValue false
	 */
	rollEnabled?: boolean;
	/**
	 * The pixel ratio.
	 * The canvas' `width` attribute will be `container.clientWidth * pixelRatio` and its `height` attribute will be `container.clientHeight * pixelRatio`. Defaults to `devicePixelRatio` if not specified.
	 */
	pixelRatio?: number;
	/**
	 * If false, style validation will be skipped. Useful in production environment.
	 * @defaultValue true
	 */
	validateStyle?: boolean;
	/**
	 * The canvas' `width` and `height` max size. The values are passed as an array where the first element is max width and the second element is max height.
	 * You shouldn't set this above WebGl `MAX_TEXTURE_SIZE`.
	 * @defaultValue [4096, 4096].
	 */
	maxCanvasSize?: [
		number,
		number
	];
	/**
	 * Determines whether to cancel, or retain, tiles from the current viewport which are still loading but which belong to a farther (smaller) zoom level than the current one.
	 * * If `true`, when zooming in, tiles which didn't manage to load for previous zoom levels will become canceled. This might save some computing resources for slower devices, but the map details might appear more abruptly at the end of the zoom.
	 * * If `false`, when zooming in, the previous zoom level(s) tiles will progressively appear, giving a smoother map details experience. However, more tiles will be rendered in a short period of time.
	 * @defaultValue true
	 */
	cancelPendingTileRequestsWhileZooming?: boolean;
	/**
	 * If true, the elevation of the center point will automatically be set to the terrain elevation
	 * (or zero if terrain is not enabled). If false, the elevation of the center point will default
	 * to sea level and will not automatically update. Defaults to true. Needs to be set to false to
	 * keep the camera above ground when pitch \> 90 degrees.
	 */
	centerClampedToGround?: boolean;
};
declare class Map$1 extends Camera$1 {
	style: Style$1;
	painter: Painter;
	handlers: HandlerManager;
	_container: HTMLElement;
	_canvasContainer: HTMLElement;
	_controlContainer: HTMLElement;
	_controlPositions: Record<string, HTMLElement>;
	_interactive: boolean;
	_showTileBoundaries: boolean;
	_showCollisionBoxes: boolean;
	_showPadding: boolean;
	_showOverdrawInspector: boolean;
	_repaint: boolean;
	_vertices: boolean;
	_canvas: HTMLCanvasElement;
	_maxTileCacheSize: number | null;
	_maxTileCacheZoomLevels: number;
	_frameRequest: AbortController;
	_styleDirty: boolean;
	_sourcesDirty: boolean;
	_placementDirty: boolean;
	_loaded: boolean;
	_idleTriggered: boolean;
	_fullyLoaded: boolean;
	_trackResize: boolean;
	_resizeObserver: ResizeObserver;
	_canvasContextAttributes: WebGLContextAttributesWithType;
	_refreshExpiredTiles: boolean;
	_hash: Hash;
	_delegatedListeners: Record<string, DelegatedListener[]>;
	_fadeDuration: number;
	_crossSourceCollisions: boolean;
	_crossFadingFactor: number;
	_collectResourceTiming: boolean;
	_renderTaskQueue: TaskQueue;
	_controls: Array<IControl>;
	_mapId: number;
	_localIdeographFontFamily: string | false;
	_validateStyle: boolean;
	_requestManager: RequestManager;
	_locale: typeof defaultLocale;
	_removed: boolean;
	_clickTolerance: number;
	_overridePixelRatio: number | null | undefined;
	_maxCanvasSize: [
		number,
		number
	];
	_terrainDataCallback: (e: MapStyleDataEvent | MapSourceDataEvent) => void;
	/**
	 * @internal
	 * image queue throttling handle. To be used later when clean up
	 */
	_imageQueueHandle: number;
	/**
	 * The map's {@link ScrollZoomHandler}, which implements zooming in and out with a scroll wheel or trackpad.
	 * Find more details and examples using `scrollZoom` in the {@link ScrollZoomHandler} section.
	 */
	scrollZoom: ScrollZoomHandler;
	/**
	 * The map's {@link BoxZoomHandler}, which implements zooming using a drag gesture with the Shift key pressed.
	 * Find more details and examples using `boxZoom` in the {@link BoxZoomHandler} section.
	 */
	boxZoom: BoxZoomHandler;
	/**
	 * The map's {@link DragRotateHandler}, which implements rotating the map while dragging with the right
	 * mouse button or with the Control key pressed. Find more details and examples using `dragRotate`
	 * in the {@link DragRotateHandler} section.
	 */
	dragRotate: DragRotateHandler;
	/**
	 * The map's {@link DragPanHandler}, which implements dragging the map with a mouse or touch gesture.
	 * Find more details and examples using `dragPan` in the {@link DragPanHandler} section.
	 */
	dragPan: DragPanHandler;
	/**
	 * The map's {@link KeyboardHandler}, which allows the user to zoom, rotate, and pan the map using keyboard
	 * shortcuts. Find more details and examples using `keyboard` in the {@link KeyboardHandler} section.
	 */
	keyboard: KeyboardHandler;
	/**
	 * The map's {@link DoubleClickZoomHandler}, which allows the user to zoom by double clicking.
	 * Find more details and examples using `doubleClickZoom` in the {@link DoubleClickZoomHandler} section.
	 */
	doubleClickZoom: DoubleClickZoomHandler;
	/**
	 * The map's {@link TwoFingersTouchZoomRotateHandler}, which allows the user to zoom or rotate the map with touch gestures.
	 * Find more details and examples using `touchZoomRotate` in the {@link TwoFingersTouchZoomRotateHandler} section.
	 */
	touchZoomRotate: TwoFingersTouchZoomRotateHandler;
	/**
	 * The map's {@link TwoFingersTouchPitchHandler}, which allows the user to pitch the map with touch gestures.
	 * Find more details and examples using `touchPitch` in the {@link TwoFingersTouchPitchHandler} section.
	 */
	touchPitch: TwoFingersTouchPitchHandler;
	/**
	 * The map's {@link CooperativeGesturesHandler}, which allows the user to see cooperative gesture info when user tries to zoom in/out.
	 * Find more details and examples using `cooperativeGestures` in the {@link CooperativeGesturesHandler} section.
	 */
	cooperativeGestures: CooperativeGesturesHandler;
	/**
	 * The map's property which determines whether to cancel, or retain, tiles from the current viewport which are still loading but which belong to a farther (smaller) zoom level than the current one.
	 * * If `true`, when zooming in, tiles which didn't manage to load for previous zoom levels will become canceled. This might save some computing resources for slower devices, but the map details might appear more abruptly at the end of the zoom.
	 * * If `false`, when zooming in, the previous zoom level(s) tiles will progressively appear, giving a smoother map details experience. However, more tiles will be rendered in a short period of time.
	 * @defaultValue true
	 */
	cancelPendingTileRequestsWhileZooming: boolean;
	constructor(options: MapOptions);
	/**
	 * @internal
	 * Returns a unique number for this map instance which is used for the MapLoadEvent
	 * to make sure we only fire one event per instantiated map object.
	 * @returns the uniq map ID
	 */
	_getMapId(): number;
	/**
	 * Sets a global state property that can be retrieved with the [`global-state` expression](https://maplibre.org/maplibre-style-spec/expressions/#global-state).
	 * If the value is null, it resets the property to its default value defined in the [`state` style property](https://maplibre.org/maplibre-style-spec/root/#state).
	 *
	 * Note that changing `global-state` values defined in layout properties is not supported, and will be ignored.
	 *
	 * @param propertyName - The name of the state property to set.
	 * @param value - The value of the state property to set.
	 */
	setGlobalStateProperty(propertyName: string, value: any): this;
	/**
	 * Returns the global map state
	 *
	 * @returns The map state object.
	*/
	getGlobalState(): Record<string, any>;
	/**
	 * Adds an {@link IControl} to the map, calling `control.onAdd(this)`.
	 *
	 * An {@link ErrorEvent} will be fired if the image parameter is invalid.
	 *
	 * @param control - The {@link IControl} to add.
	 * @param position - position on the map to which the control will be added.
	 * Valid values are `'top-left'`, `'top-right'`, `'bottom-left'`, and `'bottom-right'`. Defaults to `'top-right'`.
	 * @example
	 * Add zoom and rotation controls to the map.
	 * ```ts
	 * map.addControl(new NavigationControl());
	 * ```
	 * @see [Display map navigation controls](https://maplibre.org/maplibre-gl-js/docs/examples/navigation/)
	 */
	addControl(control: IControl, position?: ControlPosition): Map$1;
	/**
	 * Removes the control from the map.
	 *
	 * An {@link ErrorEvent} will be fired if the image parameter is invalid.
	 *
	 * @param control - The {@link IControl} to remove.
	 * @example
	 * ```ts
	 * // Define a new navigation control.
	 * let navigation = new NavigationControl();
	 * // Add zoom and rotation controls to the map.
	 * map.addControl(navigation);
	 * // Remove zoom and rotation controls from the map.
	 * map.removeControl(navigation);
	 * ```
	 */
	removeControl(control: IControl): Map$1;
	/**
	 * Checks if a control exists on the map.
	 *
	 * @param control - The {@link IControl} to check.
	 * @returns true if map contains control.
	 * @example
	 * ```ts
	 * // Define a new navigation control.
	 * let navigation = new NavigationControl();
	 * // Add zoom and rotation controls to the map.
	 * map.addControl(navigation);
	 * // Check that the navigation control exists on the map.
	 * map.hasControl(navigation);
	 * ```
	 */
	hasControl(control: IControl): boolean;
	calculateCameraOptionsFromTo(from: LngLat, altitudeFrom: number, to: LngLat, altitudeTo?: number): CameraOptions;
	/**
	 * Resizes the map according to the dimensions of its
	 * `container` element.
	 *
	 * Checks if the map container size changed and updates the map if it has changed.
	 * This method must be called after the map's `container` is resized programmatically
	 * or when the map is shown after being initially hidden with CSS.
	 *
	 * Triggers the following events: `movestart`, `move`, `moveend`, and `resize`.
	 *
	 * @param eventData - Additional properties to be passed to `movestart`, `move`, `resize`, and `moveend`
	 * events that get triggered as a result of resize. This can be useful for differentiating the
	 * source of an event (for example, user-initiated or programmatically-triggered events).
	 * @example
	 * Resize the map when the map container is shown after being initially hidden with CSS.
	 * ```ts
	 * let mapDiv = document.getElementById('map');
	 * if (mapDiv.style.visibility === true) map.resize();
	 * ```
	 */
	resize(eventData?: any, constrainTransform?: boolean): Map$1;
	_resizeTransform(constrainTransform?: boolean): void;
	/**
	 * @internal
	 * Return the map's pixel ratio eventually scaled down to respect maxCanvasSize.
	 * Internally you should use this and not getPixelRatio().
	 */
	_getClampedPixelRatio(width: number, height: number): number;
	/**
	 * Returns the map's pixel ratio.
	 * Note that the pixel ratio actually applied may be lower to respect maxCanvasSize.
	 * @returns The pixel ratio.
	 */
	getPixelRatio(): number;
	/**
	 * Sets the map's pixel ratio. This allows to override `devicePixelRatio`.
	 * After this call, the canvas' `width` attribute will be `container.clientWidth * pixelRatio`
	 * and its height attribute will be `container.clientHeight * pixelRatio`.
	 * Set this to null to disable `devicePixelRatio` override.
	 * Note that the pixel ratio actually applied may be lower to respect maxCanvasSize.
	 * @param pixelRatio - The pixel ratio.
	 */
	setPixelRatio(pixelRatio: number): void;
	/**
	 * Returns the map's geographical bounds. When the bearing or pitch is non-zero, the visible region is not
	 * an axis-aligned rectangle, and the result is the smallest bounds that encompasses the visible region.
	 * @returns The geographical bounds of the map as {@link LngLatBounds}.
	 * @example
	 * ```ts
	 * let bounds = map.getBounds();
	 * ```
	 */
	getBounds(): LngLatBounds;
	/**
	 * Returns the maximum geographical bounds the map is constrained to, or `null` if none set.
	 * @returns The map object.
	 * @example
	 * ```ts
	 * let maxBounds = map.getMaxBounds();
	 * ```
	 */
	getMaxBounds(): LngLatBounds | null;
	/**
	 * Sets or clears the map's geographical bounds.
	 *
	 * Pan and zoom operations are constrained within these bounds.
	 * If a pan or zoom is performed that would
	 * display regions outside these bounds, the map will
	 * instead display a position and zoom level
	 * as close as possible to the operation's request while still
	 * remaining within the bounds.
	 *
	 * @param bounds - The maximum bounds to set. If `null` or `undefined` is provided, the function removes the map's maximum bounds.
	 * @example
	 * Define bounds that conform to the `LngLatBoundsLike` object as set the max bounds.
	 * ```ts
	 * let bounds = [
	 *   [-74.04728, 40.68392], // [west, south]
	 *   [-73.91058, 40.87764]  // [east, north]
	 * ];
	 * map.setMaxBounds(bounds);
	 * ```
	 */
	setMaxBounds(bounds?: LngLatBoundsLike | null): Map$1;
	/**
	 * Sets or clears the map's minimum zoom level.
	 * If the map's current zoom level is lower than the new minimum,
	 * the map will zoom to the new minimum.
	 *
	 * It is not always possible to zoom out and reach the set `minZoom`.
	 * Other factors such as map height may restrict zooming. For example,
	 * if the map is 512px tall it will not be possible to zoom below zoom 0
	 * no matter what the `minZoom` is set to.
	 *
	 * A {@link ErrorEvent} event will be fired if minZoom is out of bounds.
	 *
	 * @param minZoom - The minimum zoom level to set (-2 - 24).
	 * If `null` or `undefined` is provided, the function removes the current minimum zoom (i.e. sets it to -2).
	 * @example
	 * ```ts
	 * map.setMinZoom(12.25);
	 * ```
	 */
	setMinZoom(minZoom?: number | null): Map$1;
	/**
	 * Returns the map's minimum allowable zoom level.
	 *
	 * @returns minZoom
	 * @example
	 * ```ts
	 * let minZoom = map.getMinZoom();
	 * ```
	 */
	getMinZoom(): number;
	/**
	 * Sets or clears the map's maximum zoom level.
	 * If the map's current zoom level is higher than the new maximum,
	 * the map will zoom to the new maximum.
	 *
	 * A {@link ErrorEvent} event will be fired if minZoom is out of bounds.
	 *
	 * @param maxZoom - The maximum zoom level to set.
	 * If `null` or `undefined` is provided, the function removes the current maximum zoom (sets it to 22).
	 * @example
	 * ```ts
	 * map.setMaxZoom(18.75);
	 * ```
	 */
	setMaxZoom(maxZoom?: number | null): Map$1;
	/**
	 * Returns the map's maximum allowable zoom level.
	 *
	 * @returns The maxZoom
	 * @example
	 * ```ts
	 * let maxZoom = map.getMaxZoom();
	 * ```
	 */
	getMaxZoom(): number;
	/**
	 * Sets or clears the map's minimum pitch.
	 * If the map's current pitch is lower than the new minimum,
	 * the map will pitch to the new minimum.
	 *
	 * A {@link ErrorEvent} event will be fired if minPitch is out of bounds.
	 *
	 * @param minPitch - The minimum pitch to set (0-180). Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.
	 * If `null` or `undefined` is provided, the function removes the current minimum pitch (i.e. sets it to 0).
	 */
	setMinPitch(minPitch?: number | null): Map$1;
	/**
	 * Returns the map's minimum allowable pitch.
	 *
	 * @returns The minPitch
	 */
	getMinPitch(): number;
	/**
	 * Sets or clears the map's maximum pitch.
	 * If the map's current pitch is higher than the new maximum,
	 * the map will pitch to the new maximum.
	 *
	 * A {@link ErrorEvent} event will be fired if maxPitch is out of bounds.
	 *
	 * @param maxPitch - The maximum pitch to set (0-180). Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.
	 * If `null` or `undefined` is provided, the function removes the current maximum pitch (sets it to 60).
	 */
	setMaxPitch(maxPitch?: number | null): Map$1;
	/**
	 * Returns the map's maximum allowable pitch.
	 *
	 * @returns The maxPitch
	 */
	getMaxPitch(): number;
	/**
	 * Returns the state of `renderWorldCopies`. If `true`, multiple copies of the world will be rendered side by side beyond -180 and 180 degrees longitude. If set to `false`:
	 *
	 * - When the map is zoomed out far enough that a single representation of the world does not fill the map's entire
	 * container, there will be blank space beyond 180 and -180 degrees longitude.
	 * - Features that cross 180 and -180 degrees longitude will be cut in two (with one portion on the right edge of the
	 * map and the other on the left edge of the map) at every zoom level.
	 * @returns The renderWorldCopies
	 * @example
	 * ```ts
	 * let worldCopiesRendered = map.getRenderWorldCopies();
	 * ```
	 * @see [Render world copies](https://maplibre.org/maplibre-gl-js/docs/examples/render-world-copies/)
	 */
	getRenderWorldCopies(): boolean;
	/**
	 * Sets the state of `renderWorldCopies`.
	 *
	 * @param renderWorldCopies - If `true`, multiple copies of the world will be rendered side by side beyond -180 and 180 degrees longitude. If set to `false`:
	 *
	 * - When the map is zoomed out far enough that a single representation of the world does not fill the map's entire
	 * container, there will be blank space beyond 180 and -180 degrees longitude.
	 * - Features that cross 180 and -180 degrees longitude will be cut in two (with one portion on the right edge of the
	 * map and the other on the left edge of the map) at every zoom level.
	 *
	 * `undefined` is treated as `true`, `null` is treated as `false`.
	 * @example
	 * ```ts
	 * map.setRenderWorldCopies(true);
	 * ```
	 * @see [Render world copies](https://maplibre.org/maplibre-gl-js/docs/examples/render-world-copies/)
	 */
	setRenderWorldCopies(renderWorldCopies?: boolean | null): Map$1;
	/**
	 * Returns a [Point](https://github.com/mapbox/point-geometry) representing pixel coordinates, relative to the map's `container`,
	 * that correspond to the specified geographical location.
	 *
	 * @param lnglat - The geographical location to project.
	 * @returns The [Point](https://github.com/mapbox/point-geometry) corresponding to `lnglat`, relative to the map's `container`.
	 * @example
	 * ```ts
	 * let coordinate = [-122.420679, 37.772537];
	 * let point = map.project(coordinate);
	 * ```
	 */
	project(lnglat: LngLatLike): Point;
	/**
	 * Returns a {@link LngLat} representing geographical coordinates that correspond
	 * to the specified pixel coordinates.
	 *
	 * @param point - The pixel coordinates to unproject.
	 * @returns The {@link LngLat} corresponding to `point`.
	 * @example
	 * ```ts
	 * map.on('click', (e) => {
	 *   // When the map is clicked, get the geographic coordinate.
	 *   let coordinate = map.unproject(e.point);
	 * });
	 * ```
	 */
	unproject(point: PointLike): LngLat;
	/**
	 * Returns true if the map is panning, zooming, rotating, or pitching due to a camera animation or user gesture.
	 * @returns true if the map is moving.
	 * @example
	 * ```ts
	 * let isMoving = map.isMoving();
	 * ```
	 */
	isMoving(): boolean;
	/**
	 * Returns true if the map is zooming due to a camera animation or user gesture.
	 * @returns true if the map is zooming.
	 * @example
	 * ```ts
	 * let isZooming = map.isZooming();
	 * ```
	 */
	isZooming(): boolean;
	/**
	 * Returns true if the map is rotating due to a camera animation or user gesture.
	 * @returns true if the map is rotating.
	 * @example
	 * ```ts
	 * map.isRotating();
	 * ```
	 */
	isRotating(): boolean;
	_createDelegatedListener(type: keyof MapEventType | string, layerIds: string[], listener: Listener): DelegatedListener;
	_saveDelegatedListener(type: keyof MapEventType | string, delegatedListener: DelegatedListener): void;
	_removeDelegatedListener(type: string, layerIds: string[], listener: Listener): void;
	/**
	 * @event
	 * Adds a listener for events of a specified type, optionally limited to features in a specified style layer(s).
	 * See {@link MapEventType} and {@link MapLayerEventType} for a full list of events and their description.
	 *
	 * | Event                  | Compatible with `layerId` |
	 * |------------------------|---------------------------|
	 * | `mousedown`            | yes                       |
	 * | `mouseup`              | yes                       |
	 * | `mouseover`            | yes                       |
	 * | `mouseout`             | yes                       |
	 * | `mousemove`            | yes                       |
	 * | `mouseenter`           | yes (required)            |
	 * | `mouseleave`           | yes (required)            |
	 * | `click`                | yes                       |
	 * | `dblclick`             | yes                       |
	 * | `contextmenu`          | yes                       |
	 * | `touchstart`           | yes                       |
	 * | `touchend`             | yes                       |
	 * | `touchcancel`          | yes                       |
	 * | `wheel`                |                           |
	 * | `resize`               |                           |
	 * | `remove`               |                           |
	 * | `touchmove`            |                           |
	 * | `movestart`            |                           |
	 * | `move`                 |                           |
	 * | `moveend`              |                           |
	 * | `dragstart`            |                           |
	 * | `drag`                 |                           |
	 * | `dragend`              |                           |
	 * | `zoomstart`            |                           |
	 * | `zoom`                 |                           |
	 * | `zoomend`              |                           |
	 * | `rotatestart`          |                           |
	 * | `rotate`               |                           |
	 * | `rotateend`            |                           |
	 * | `pitchstart`           |                           |
	 * | `pitch`                |                           |
	 * | `pitchend`             |                           |
	 * | `boxzoomstart`         |                           |
	 * | `boxzoomend`           |                           |
	 * | `boxzoomcancel`        |                           |
	 * | `webglcontextlost`     |                           |
	 * | `webglcontextrestored` |                           |
	 * | `load`                 |                           |
	 * | `render`               |                           |
	 * | `idle`                 |                           |
	 * | `error`                |                           |
	 * | `data`                 |                           |
	 * | `styledata`            |                           |
	 * | `sourcedata`           |                           |
	 * | `dataloading`          |                           |
	 * | `styledataloading`     |                           |
	 * | `sourcedataloading`    |                           |
	 * | `styleimagemissing`    |                           |
	 * | `dataabort`            |                           |
	 * | `sourcedataabort`      |                           |
	 *
	 * @param type - The event type to listen for. Events compatible with the optional `layerId` parameter are triggered
	 * when the cursor enters a visible portion of the specified layer from outside that layer or outside the map canvas.
	 * @param layer - The ID of a style layer or a listener if no ID is provided. Event will only be triggered if its location
	 * is within a visible feature in this layer. The event will have a `features` property containing
	 * an array of the matching features. If `layer` is not supplied, the event will not have a `features` property.
	 * Please note that many event types are not compatible with the optional `layer` parameter.
	 * @param listener - The function to be called when the event is fired.
	 * @example
	 * ```ts
	 * // Set an event listener that will fire
	 * // when the map has finished loading
	 * map.on('load', () => {
	 *   // Once the map has finished loading,
	 *   // add a new layer
	 *   map.addLayer({
	 *     id: 'points-of-interest',
	 *     source: {
	 *       type: 'vector',
	 *       url: 'https://maplibre.org/maplibre-style-spec/'
	 *     },
	 *     'source-layer': 'poi_label',
	 *     type: 'circle',
	 *     paint: {
	 *       // MapLibre Style Specification paint properties
	 *     },
	 *     layout: {
	 *       // MapLibre Style Specification layout properties
	 *     }
	 *   });
	 * });
	 * ```
	 * @example
	 * ```ts
	 * // Set an event listener that will fire
	 * // when a feature on the countries layer of the map is clicked
	 * map.on('click', 'countries', (e) => {
	 *   new Popup()
	 *     .setLngLat(e.lngLat)
	 *     .setHTML(`Country name: ${e.features[0].properties.name}`)
	 *     .addTo(map);
	 * });
	 * ```
	 * @see [Display popup on click](https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-click/)
	 * @see [Center the map on a clicked symbol](https://maplibre.org/maplibre-gl-js/docs/examples/center-on-symbol/)
	 * @see [Create a hover effect](https://maplibre.org/maplibre-gl-js/docs/examples/hover-styles/)
	 * @see [Create a draggable marker](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
	 */
	on<T extends keyof MapLayerEventType>(type: T, layer: string, listener: (ev: MapLayerEventType[T] & Object) => void): Subscription;
	/**
	 * Overload of the `on` method that allows to listen to events specifying multiple layers.
	 * @event
	 * @param type - The type of the event.
	 * @param layerIds - The array of style layer IDs.
	 * @param listener - The listener callback.
	 */
	on<T extends keyof MapLayerEventType>(type: T, layerIds: string[], listener: (ev: MapLayerEventType[T] & Object) => void): Subscription;
	/**
	 * Overload of the `on` method that allows to listen to events without specifying a layer.
	 * @event
	 * @param type - The type of the event.
	 * @param listener - The listener callback.
	 */
	on<T extends keyof MapEventType>(type: T, listener: (ev: MapEventType[T] & Object) => void): Subscription;
	/**
	 * Overload of the `on` method that allows to listen to events without specifying a layer.
	 * @event
	 * @param type - The type of the event.
	 * @param listener - The listener callback.
	 */
	on(type: keyof MapEventType | string, listener: Listener): Subscription;
	/**
	 * Adds a listener that will be called only once to a specified event type, optionally limited to features in a specified style layer.
	 *
	 * @event
	 * @param type - The event type to listen for; one of `'mousedown'`, `'mouseup'`, `'click'`, `'dblclick'`,
	 * `'mousemove'`, `'mouseenter'`, `'mouseleave'`, `'mouseover'`, `'mouseout'`, `'contextmenu'`, `'touchstart'`,
	 * `'touchend'`, or `'touchcancel'`. `mouseenter` and `mouseover` events are triggered when the cursor enters
	 * a visible portion of the specified layer from outside that layer or outside the map canvas. `mouseleave`
	 * and `mouseout` events are triggered when the cursor leaves a visible portion of the specified layer, or leaves
	 * the map canvas.
	 * @param layer - The ID of a style layer or a listener if no ID is provided. Only events whose location is within a visible
	 * feature in this layer will trigger the listener. The event will have a `features` property containing
	 * an array of the matching features.
	 * @param listener - The function to be called when the event is fired.
	 * @returns `this` if listener is provided, promise otherwise to allow easier usage of async/await
	 */
	once<T extends keyof MapLayerEventType>(type: T, layer: string, listener?: (ev: MapLayerEventType[T] & Object) => void): this | Promise<MapLayerEventType[T] & Object>;
	/**
	 * Overload of the `once` method that allows to listen to events specifying multiple layers.
	 * @event
	 * @param type - The type of the event.
	 * @param layerIds - The array of style layer IDs.
	 * @param listener - The listener callback.
	 */
	once<T extends keyof MapLayerEventType>(type: T, layerIds: string[], listener?: (ev: MapLayerEventType[T] & Object) => void): this | Promise<any>;
	/**
	 * Overload of the `once` method that allows to listen to events without specifying a layer.
	 * @event
	 * @param type - The type of the event.
	 * @param listener - The listener callback.
	 */
	once<T extends keyof MapEventType>(type: T, listener?: (ev: MapEventType[T] & Object) => void): this | Promise<any>;
	/**
	 * Overload of the `once` method that allows to listen to events without specifying a layer.
	 * @event
	 * @param type - The type of the event.
	 * @param listener - The listener callback.
	 */
	once(type: keyof MapEventType | string, listener?: Listener): this | Promise<any>;
	/**
	 * Removes an event listener for events previously added with `Map#on`.
	 *
	 * @event
	 * @param type - The event type previously used to install the listener.
	 * @param layer - The layer ID or listener previously used to install the listener.
	 * @param listener - The function previously installed as a listener.
	 */
	off<T extends keyof MapLayerEventType>(type: T, layer: string, listener: (ev: MapLayerEventType[T] & Object) => void): this;
	/**
	 * Overload of the `off` method that allows to remove an event created with multiple layers.
	 * Provide the same layer IDs as to `on` or `once`, when the listener was registered.
	 * @event
	 * @param type - The type of the event.
	 * @param layers - The layer IDs previously used to install the listener.
	 * @param listener - The function previously installed as a listener.
	 */
	off<T extends keyof MapLayerEventType>(type: T, layers: string[], listener: (ev: MapLayerEventType[T] & Object) => void): this;
	/**
	 * Overload of the `off` method that allows to remove an event created without specifying a layer.
	 * @event
	 * @param type - The type of the event.
	 * @param listener - The function previously installed as a listener.
	 */
	off<T extends keyof MapEventType>(type: T, listener: (ev: MapEventType[T] & Object) => void): this;
	/**
	 * Overload of the `off` method that allows to remove an event created without specifying a layer.
	 * @event
	 * @param type - The type of the event.
	 * @param listener - The function previously installed as a listener.
	 */
	off(type: keyof MapEventType | string, listener: Listener): this;
	/**
	 * Returns an array of MapGeoJSONFeature objects
	 * representing visible features that satisfy the query parameters.
	 *
	 * @param geometryOrOptions - (optional) The geometry of the query region:
	 * either a single point or southwest and northeast points describing a bounding box.
	 * Omitting this parameter (i.e. calling {@link Map#queryRenderedFeatures} with zero arguments,
	 * or with only a `options` argument) is equivalent to passing a bounding box encompassing the entire
	 * map viewport.
	 * The geometryOrOptions can receive a {@link QueryRenderedFeaturesOptions} only to support a situation where the function receives only one parameter which is the options parameter.
	 * @param options - (optional) Options object.
	 *
	 * @returns An array of MapGeoJSONFeature objects.
	 *
	 * The `properties` value of each returned feature object contains the properties of its source feature. For GeoJSON sources, only
	 * string and numeric property values are supported (i.e. `null`, `Array`, and `Object` values are not supported).
	 *
	 * Each feature includes top-level `layer`, `source`, and `sourceLayer` properties. The `layer` property is an object
	 * representing the style layer to  which the feature belongs. Layout and paint properties in this object contain values
	 * which are fully evaluated for the given zoom level and feature.
	 *
	 * Only features that are currently rendered are included. Some features will **not** be included, like:
	 *
	 * - Features from layers whose `visibility` property is `"none"`.
	 * - Features from layers whose zoom range excludes the current zoom level.
	 * - Symbol features that have been hidden due to text or icon collision.
	 *
	 * Features from all other layers are included, including features that may have no visible
	 * contribution to the rendered result; for example, because the layer's opacity or color alpha component is set to
	 * 0.
	 *
	 * The topmost rendered feature appears first in the returned array, and subsequent features are sorted by
	 * descending z-order. Features that are rendered multiple times (due to wrapping across the antemeridian at low
	 * zoom levels) are returned only once (though subject to the following caveat).
	 *
	 * Because features come from tiled vector data or GeoJSON data that is converted to tiles internally, feature
	 * geometries may be split or duplicated across tile boundaries and, as a result, features may appear multiple
	 * times in query results. For example, suppose there is a highway running through the bounding rectangle of a query.
	 * The results of the query will be those parts of the highway that lie within the map tiles covering the bounding
	 * rectangle, even if the highway extends into other tiles, and the portion of the highway within each map tile
	 * will be returned as a separate feature. Similarly, a point feature near a tile boundary may appear in multiple
	 * tiles due to tile buffering.
	 *
	 * @example
	 * Find all features at a point
	 * ```ts
	 * let features = map.queryRenderedFeatures(
	 *   [20, 35],
	 *   { layers: ['my-layer-name'] }
	 * );
	 * ```
	 *
	 * @example
	 * Find all features within a static bounding box
	 * ```ts
	 * let features = map.queryRenderedFeatures(
	 *   [[10, 20], [30, 50]],
	 *   { layers: ['my-layer-name'] }
	 * );
	 * ```
	 *
	 * @example
	 * Find all features within a bounding box around a point
	 * ```ts
	 * let width = 10;
	 * let height = 20;
	 * let features = map.queryRenderedFeatures([
	 *   [point.x - width / 2, point.y - height / 2],
	 *   [point.x + width / 2, point.y + height / 2]
	 * ], { layers: ['my-layer-name'] });
	 * ```
	 *
	 * @example
	 * Query all rendered features from a single layer
	 * ```ts
	 * let features = map.queryRenderedFeatures({ layers: ['my-layer-name'] });
	 * ```
	 * @see [Get features under the mouse pointer](https://maplibre.org/maplibre-gl-js/docs/examples/queryrenderedfeatures/)
	 */
	queryRenderedFeatures(geometryOrOptions?: PointLike | [
		PointLike,
		PointLike
	] | QueryRenderedFeaturesOptions, options?: QueryRenderedFeaturesOptions): MapGeoJSONFeature[];
	/**
	 * Returns an array of MapGeoJSONFeature objects
	 * representing features within the specified vector tile or GeoJSON source that satisfy the query parameters.
	 *
	 * @param sourceId - The ID of the vector tile or GeoJSON source to query.
	 * @param parameters - The options object.
	 * @returns An array of MapGeoJSONFeature objects.
	 *
	 * In contrast to {@link Map#queryRenderedFeatures}, this function returns all features matching the query parameters,
	 * whether or not they are rendered by the current style (i.e. visible). The domain of the query includes all currently-loaded
	 * vector tiles and GeoJSON source tiles: this function does not check tiles outside the currently
	 * visible viewport.
	 *
	 * Because features come from tiled vector data or GeoJSON data that is converted to tiles internally, feature
	 * geometries may be split or duplicated across tile boundaries and, as a result, features may appear multiple
	 * times in query results. For example, suppose there is a highway running through the bounding rectangle of a query.
	 * The results of the query will be those parts of the highway that lie within the map tiles covering the bounding
	 * rectangle, even if the highway extends into other tiles, and the portion of the highway within each map tile
	 * will be returned as a separate feature. Similarly, a point feature near a tile boundary may appear in multiple
	 * tiles due to tile buffering.
	 *
	 * @example
	 * Find all features in one source layer in a vector source
	 * ```ts
	 * let features = map.querySourceFeatures('your-source-id', {
	 *   sourceLayer: 'your-source-layer'
	 * });
	 * ```
	 *
	 */
	querySourceFeatures(sourceId: string, parameters?: QuerySourceFeatureOptions | null): GeoJSONFeature[];
	/**
	 * Updates the map's MapLibre style object with a new value.
	 *
	 * If a style is already set when this is used and options.diff is set to true, the map renderer will attempt to compare the given style
	 * against the map's current state and perform only the changes necessary to make the map style match the desired state. Changes in sprites
	 * (images used for icons and patterns) and glyphs (fonts for label text) **cannot** be diffed. If the sprites or fonts used in the current
	 * style and the given style are different in any way, the map renderer will force a full update, removing the current style and building
	 * the given one from scratch.
	 *
	 *
	 * @param style - A JSON object conforming to the schema described in the
	 * [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/), or a URL to such JSON.
	 * @param options - The options object.
	 *
	 * @example
	 * ```ts
	 * map.setStyle("https://demotiles.maplibre.org/style.json");
	 *
	 * map.setStyle('https://demotiles.maplibre.org/style.json', {
	 *   transformStyle: (previousStyle, nextStyle) => ({
	 *       ...nextStyle,
	 *       sources: {
	 *           ...nextStyle.sources,
	 *           // copy a source from previous style
	 *           'osm': previousStyle.sources.osm
	 *       },
	 *       layers: [
	 *           // background layer
	 *           nextStyle.layers[0],
	 *           // copy a layer from previous style
	 *           previousStyle.layers[0],
	 *           // other layers from the next style
	 *           ...nextStyle.layers.slice(1).map(layer => {
	 *               // hide the layers we don't need from demotiles style
	 *               if (layer.id.startsWith('geolines')) {
	 *                   layer.layout = {...layer.layout || {}, visibility: 'none'};
	 *               // filter out US polygons
	 *               } else if (layer.id.startsWith('coastline') || layer.id.startsWith('countries')) {
	 *                   layer.filter = ['!=', ['get', 'ADM0_A3'], 'USA'];
	 *               }
	 *               return layer;
	 *           })
	 *       ]
	 *   })
	 * });
	 * ```
	 */
	setStyle(style: StyleSpecification | string | null, options?: StyleSwapOptions & StyleOptions): this;
	/**
	 *  Updates the requestManager's transform request with a new function
	 *
	 * @param transformRequest - A callback run before the Map makes a request for an external URL. The callback can be used to modify the url, set headers, or set the credentials property for cross-origin requests.
	 * Expected to return an object with a `url` property and optionally `headers` and `credentials` properties
	 *
	 * @example
	 * ```ts
	 * map.setTransformRequest((url: string, resourceType: string) => {});
	 * ```
	 */
	setTransformRequest(transformRequest: RequestTransformFunction): this;
	_getUIString(key: keyof typeof defaultLocale): string;
	_updateStyle(style: StyleSpecification | string | null, options?: StyleSwapOptions & StyleOptions): this;
	_lazyInitEmptyStyle(): void;
	_diffStyle(style: StyleSpecification | string, options?: StyleSwapOptions & StyleOptions): void;
	_updateDiff(style: StyleSpecification, options?: StyleSwapOptions & StyleOptions): void;
	/**
	 * Returns the map's MapLibre style object, a JSON object which can be used to recreate the map's style.
	 *
	 * @returns The map's style JSON object.
	 *
	 * @example
	 * ```ts
	 * let styleJson = map.getStyle();
	 * ```
	 *
	 */
	getStyle(): StyleSpecification;
	/**
	 * Returns a Boolean indicating whether the map's style is fully loaded.
	 *
	 * @returns A Boolean indicating whether the style is fully loaded.
	 *
	 * @example
	 * ```ts
	 * let styleLoadStatus = map.isStyleLoaded();
	 * ```
	 */
	isStyleLoaded(): boolean | void;
	/**
	 * Adds a source to the map's style.
	 *
	 * Events triggered:
	 *
	 * Triggers the `source.add` event.
	 *
	 * @param id - The ID of the source to add. Must not conflict with existing sources.
	 * @param source - The source object, conforming to the
	 * MapLibre Style Specification's [source definition](https://maplibre.org/maplibre-style-spec/sources) or
	 * {@link CanvasSourceSpecification}.
	 * @example
	 * ```ts
	 * map.addSource('my-data', {
	 *   type: 'vector',
	 *   url: 'https://demotiles.maplibre.org/tiles/tiles.json'
	 * });
	 * ```
	 * @example
	 * ```ts
	 * map.addSource('my-data', {
	 *   "type": "geojson",
	 *   "data": {
	 *     "type": "Feature",
	 *     "geometry": {
	 *       "type": "Point",
	 *       "coordinates": [-77.0323, 38.9131]
	 *     },
	 *     "properties": {
	 *       "title": "Mapbox DC",
	 *       "marker-symbol": "monument"
	 *     }
	 *   }
	 * });
	 * ```
	 * @see GeoJSON source: [Add live realtime data](https://maplibre.org/maplibre-gl-js/docs/examples/live-geojson/)
	 */
	addSource(id: string, source: SourceSpecification | CanvasSourceSpecification): this;
	/**
	 * Returns a Boolean indicating whether the source is loaded. Returns `true` if the source with
	 * the given ID in the map's style has no outstanding network requests, otherwise `false`.
	 *
	 * A {@link ErrorEvent} event will be fired if there is no source wit the specified ID.
	 *
	 * @param id - The ID of the source to be checked.
	 * @returns A Boolean indicating whether the source is loaded.
	 * @example
	 * ```ts
	 * let sourceLoaded = map.isSourceLoaded('bathymetry-data');
	 * ```
	 */
	isSourceLoaded(id: string): boolean;
	/**
	 * Loads a 3D terrain mesh, based on a "raster-dem" source.
	 *
	 * Triggers the `terrain` event.
	 *
	 * @param options - Options object.
	 * @example
	 * ```ts
	 * map.setTerrain({ source: 'terrain' });
	 * ```
	 */
	setTerrain(options: TerrainSpecification | null): this;
	/**
	 * Get the terrain-options if terrain is loaded
	 * @returns the TerrainSpecification passed to setTerrain
	 * @example
	 * ```ts
	 * map.getTerrain(); // { source: 'terrain' };
	 * ```
	 */
	getTerrain(): TerrainSpecification | null;
	/**
	 * Returns a Boolean indicating whether all tiles in the viewport from all sources on
	 * the style are loaded.
	 *
	 * @returns A Boolean indicating whether all tiles are loaded.
	 * @example
	 * ```ts
	 * let tilesLoaded = map.areTilesLoaded();
	 * ```
	 */
	areTilesLoaded(): boolean;
	/**
	 * Removes a source from the map's style.
	 *
	 * @param id - The ID of the source to remove.
	 * @example
	 * ```ts
	 * map.removeSource('bathymetry-data');
	 * ```
	 */
	removeSource(id: string): Map$1;
	/**
	 * Returns the source with the specified ID in the map's style.
	 *
	 * This method is often used to update a source using the instance members for the relevant
	 * source type as defined in classes that derive from {@link Source}.
	 * For example, setting the `data` for a GeoJSON source or updating the `url` and `coordinates`
	 * of an image source.
	 *
	 * @param id - The ID of the source to get.
	 * @returns The style source with the specified ID or `undefined` if the ID
	 * corresponds to no existing sources.
	 * The shape of the object varies by source type.
	 * A list of options for each source type is available on the MapLibre Style Specification's
	 * [Sources](https://maplibre.org/maplibre-style-spec/sources/) page.
	 * @example
	 * ```ts
	 * let sourceObject = map.getSource('points');
	 * ```
	 * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
	 * @see [Animate a point](https://maplibre.org/maplibre-gl-js/docs/examples/animate-point-along-line/)
	 * @see [Add live realtime data](https://maplibre.org/maplibre-gl-js/docs/examples/live-geojson/)
	 */
	getSource<TSource extends Source>(id: string): TSource | undefined;
	/**
	 * Change the tile Level of Detail behavior of the specified source. These parameters have no effect when
	 * pitch == 0, and the largest effect when the horizon is visible on screen.
	 *
	 * @param maxZoomLevelsOnScreen - The maximum number of distinct zoom levels allowed on screen at a time.
	 * There will generally be fewer zoom levels on the screen, the maximum can only be reached when the horizon
	 * is at the top of the screen. Increasing the maximum number of zoom levels causes the zoom level to decay
	 * faster toward the horizon.
	 * @param tileCountMaxMinRatio - The ratio of the maximum number of tiles loaded (at high pitch) to the minimum
	 * number of tiles loaded. Increasing this ratio allows more tiles to be loaded at high pitch angles. If the ratio
	 * would otherwise be exceeded, the zoom level is reduced uniformly to keep the number of tiles within the limit.
	 * @param sourceId - The ID of the source to set tile LOD parameters for. All sources will be updated if unspecified.
	 * If `sourceId` is specified but a corresponding source does not exist, an error is thrown.
	 * @example
	 * ```ts
	 * map.setSourceTileLodParams(4.0, 3.0, 'terrain');
	 * ```
	 * @see [Modify Level of Detail behavior](https://maplibre.org/maplibre-gl-js/docs/examples/lod-control/)

	 */
	setSourceTileLodParams(maxZoomLevelsOnScreen: number, tileCountMaxMinRatio: number, sourceId?: string): this;
	/**
	 * Triggers a reload of the selected tiles
	 *
	 * @param sourceId - The ID of the source
	 * @param tileIds - An array of tile IDs to be reloaded. If not defined, all tiles will be reloaded.
	 * @example
	 * ```ts
	 * map.refreshTiles('satellite', [{x:1024, y: 1023, z: 11}, {x:1023, y: 1023, z: 11}]);
	 * ```
	 */
	refreshTiles(sourceId: string, tileIds?: Array<{
		x: number;
		y: number;
		z: number;
	}>): void;
	/**
	 * Add an image to the style. This image can be displayed on the map like any other icon in the style's
	 * sprite using the image's ID with
	 * [`icon-image`](https://maplibre.org/maplibre-style-spec/layers/#layout-symbol-icon-image),
	 * [`background-pattern`](https://maplibre.org/maplibre-style-spec/layers/#paint-background-background-pattern),
	 * [`fill-pattern`](https://maplibre.org/maplibre-style-spec/layers/#paint-fill-fill-pattern),
	 * or [`line-pattern`](https://maplibre.org/maplibre-style-spec/layers/#paint-line-line-pattern).
	 *
	 * A {@link ErrorEvent} event will be fired if the image parameter is invalid or there is not enough space in the sprite to add this image.
	 *
	 * @param id - The ID of the image.
	 * @param image - The image as an `HTMLImageElement`, `ImageData`, `ImageBitmap` or object with `width`, `height`, and `data`
	 * properties with the same format as `ImageData`.
	 * @param options - Options object.
	 * @example
	 * ```ts
	 * // If the style's sprite does not already contain an image with ID 'cat',
	 * // add the image 'cat-icon.png' to the style's sprite with the ID 'cat'.
	 * const image = await map.loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/400px-Cat_silhouette.svg.png');
	 * if (!map.hasImage('cat')) map.addImage('cat', image.data);
	 *
	 * // Add a stretchable image that can be used with `icon-text-fit`
	 * // In this example, the image is 600px wide by 400px high.
	 * const image = await map.loadImage('https://upload.wikimedia.org/wikipedia/commons/8/89/Black_and_White_Boxed_%28bordered%29.png');
	 * if (map.hasImage('border-image')) return;
	 * map.addImage('border-image', image.data, {
	 *     content: [16, 16, 300, 384], // place text over left half of image, avoiding the 16px border
	 *     stretchX: [[16, 584]], // stretch everything horizontally except the 16px border
	 *     stretchY: [[16, 384]], // stretch everything vertically except the 16px border
	 * });
	 * ```
	 * @see Use `HTMLImageElement`: [Add an icon to the map](https://maplibre.org/maplibre-gl-js/docs/examples/add-image/)
	 * @see Use `ImageData`: [Add a generated icon to the map](https://maplibre.org/maplibre-gl-js/docs/examples/add-image-generated/)
	 */
	addImage(id: string, image: HTMLImageElement | ImageBitmap | ImageData | {
		width: number;
		height: number;
		data: Uint8Array | Uint8ClampedArray;
	} | StyleImageInterface, options?: Partial<StyleImageMetadata>): this;
	/**
	 * Update an existing image in a style. This image can be displayed on the map like any other icon in the style's
	 * sprite using the image's ID with
	 * [`icon-image`](https://maplibre.org/maplibre-style-spec/layers/#layout-symbol-icon-image),
	 * [`background-pattern`](https://maplibre.org/maplibre-style-spec/layers/#paint-background-background-pattern),
	 * [`fill-pattern`](https://maplibre.org/maplibre-style-spec/layers/#paint-fill-fill-pattern),
	 * or [`line-pattern`](https://maplibre.org/maplibre-style-spec/layers/#paint-line-line-pattern).
	 *
	 * An {@link ErrorEvent} will be fired if the image parameter is invalid.
	 *
	 * @param id - The ID of the image.
	 * @param image - The image as an `HTMLImageElement`, `ImageData`, `ImageBitmap` or object with `width`, `height`, and `data`
	 * properties with the same format as `ImageData`.
	 * @example
	 * ```ts
	 * // If an image with the ID 'cat' already exists in the style's sprite,
	 * // replace that image with a new image, 'other-cat-icon.png'.
	 * if (map.hasImage('cat')) map.updateImage('cat', './other-cat-icon.png');
	 * ```
	 */
	updateImage(id: string, image: HTMLImageElement | ImageBitmap | ImageData | {
		width: number;
		height: number;
		data: Uint8Array | Uint8ClampedArray;
	} | StyleImageInterface): this;
	/**
	 * Returns an image, specified by ID, currently available in the map.
	 * This includes both images from the style's original sprite
	 * and any images that have been added at runtime using {@link Map#addImage}.
	 *
	 * @param id - The ID of the image.
	 * @returns An image in the map with the specified ID.
	 *
	 * @example
	 * ```ts
	 * let coffeeShopIcon = map.getImage("coffee_cup");
	 * ```
	 */
	getImage(id: string): StyleImage;
	/**
	 * Check whether or not an image with a specific ID exists in the style. This checks both images
	 * in the style's original sprite and any images
	 * that have been added at runtime using {@link Map#addImage}.
	 *
	 * An {@link ErrorEvent} will be fired if the image parameter is invalid.
	 *
	 * @param id - The ID of the image.
	 *
	 * @returns A Boolean indicating whether the image exists.
	 * @example
	 * Check if an image with the ID 'cat' exists in the style's sprite.
	 * ```ts
	 * let catIconExists = map.hasImage('cat');
	 * ```
	 */
	hasImage(id: string): boolean;
	/**
	 * Remove an image from a style. This can be an image from the style's original
	 * sprite or any images
	 * that have been added at runtime using {@link Map#addImage}.
	 *
	 * @param id - The ID of the image.
	 *
	 * @example
	 * ```ts
	 * // If an image with the ID 'cat' exists in
	 * // the style's sprite, remove it.
	 * if (map.hasImage('cat')) map.removeImage('cat');
	 * ```
	 */
	removeImage(id: string): void;
	/**
	 * Load an image from an external URL to be used with {@link Map#addImage}. External
	 * domains must support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).
	 *
	 * @param url - The URL of the image file. Image file must be in png, webp, or jpg format.
	 * @returns a promise that is resolved when the image is loaded
	 *
	 * @example
	 * Load an image from an external URL.
	 * ```ts
	 * const response = await map.loadImage('https://picsum.photos/50/50');
	 * // Add the loaded image to the style's sprite with the ID 'photo'.
	 * map.addImage('photo', response.data);
	 * ```
	 * @see [Add an icon to the map](https://maplibre.org/maplibre-gl-js/docs/examples/add-image/)
	 */
	loadImage(url: string): Promise<GetResourceResponse<HTMLImageElement | ImageBitmap>>;
	/**
	 * Returns an Array of strings containing the IDs of all images currently available in the map.
	 * This includes both images from the style's original sprite
	 * and any images that have been added at runtime using {@link Map#addImage}.
	 *
	 * @returns An Array of strings containing the names of all sprites/images currently available in the map.
	 *
	 * @example
	 * ```ts
	 * let allImages = map.listImages();
	 * ```
	 */
	listImages(): Array<string>;
	/**
	 * Adds a [MapLibre style layer](https://maplibre.org/maplibre-style-spec/layers)
	 * to the map's style.
	 *
	 * A layer defines how data from a specified source will be styled. Read more about layer types
	 * and available paint and layout properties in the [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/layers).
	 *
	 * @param layer - The layer to add,
	 * conforming to either the MapLibre Style Specification's [layer definition](https://maplibre.org/maplibre-style-spec/layers) or,
	 * less commonly, the {@link CustomLayerInterface} specification. Can also be a layer definition with an embedded source definition.
	 * The MapLibre Style Specification's layer definition is appropriate for most layers.
	 *
	 * @param beforeId - The ID of an existing layer to insert the new layer before,
	 * resulting in the new layer appearing visually beneath the existing layer.
	 * If this argument is not specified, the layer will be appended to the end of the layers array
	 * and appear visually above all other layers.
	 *
	 * @example
	 * Add a circle layer with a vector source
	 * ```ts
	 * map.addLayer({
	 *   id: 'points-of-interest',
	 *   source: {
	 *     type: 'vector',
	 *     url: 'https://demotiles.maplibre.org/tiles/tiles.json'
	 *   },
	 *   'source-layer': 'poi_label',
	 *   type: 'circle',
	 *   paint: {
	 *     // MapLibre Style Specification paint properties
	 *   },
	 *   layout: {
	 *     // MapLibre Style Specification layout properties
	 *   }
	 * });
	 * ```
	 *
	 * @example
	 * Define a source before using it to create a new layer
	 * ```ts
	 * map.addSource('state-data', {
	 *   type: 'geojson',
	 *   data: 'path/to/data.geojson'
	 * });
	 *
	 * map.addLayer({
	 *   id: 'states',
	 *   // References the GeoJSON source defined above
	 *   // and does not require a `source-layer`
	 *   source: 'state-data',
	 *   type: 'symbol',
	 *   layout: {
	 *     // Set the label content to the
	 *     // feature's `name` property
	 *     text-field: ['get', 'name']
	 *   }
	 * });
	 * ```
	 *
	 * @example
	 * Add a new symbol layer before an existing layer
	 * ```ts
	 * map.addLayer({
	 *   id: 'states',
	 *   // References a source that's already been defined
	 *   source: 'state-data',
	 *   type: 'symbol',
	 *   layout: {
	 *     // Set the label content to the
	 *     // feature's `name` property
	 *     text-field: ['get', 'name']
	 *   }
	 * // Add the layer before the existing `cities` layer
	 * }, 'cities');
	 * ```
	 * @see [Create and style clusters](https://maplibre.org/maplibre-gl-js/docs/examples/cluster/)
	 * @see [Add a vector tile source](https://maplibre.org/maplibre-gl-js/docs/examples/vector-source/)
	 * @see [Add a WMS source](https://maplibre.org/maplibre-gl-js/docs/examples/wms/)
	 */
	addLayer(layer: AddLayerObject, beforeId?: string): this;
	/**
	 * Moves a layer to a different z-position.
	 *
	 * @param id - The ID of the layer to move.
	 * @param beforeId - The ID of an existing layer to insert the new layer before. When viewing the map, the `id` layer will appear beneath the `beforeId` layer. If `beforeId` is omitted, the layer will be appended to the end of the layers array and appear above all other layers on the map.
	 *
	 * @example
	 * Move a layer with ID 'polygon' before the layer with ID 'country-label'. The `polygon` layer will appear beneath the `country-label` layer on the map.
	 * ```ts
	 * map.moveLayer('polygon', 'country-label');
	 * ```
	 */
	moveLayer(id: string, beforeId?: string): this;
	/**
	 * Removes the layer with the given ID from the map's style.
	 *
	 * An {@link ErrorEvent} will be fired if the image parameter is invalid.
	 *
	 * @param id - The ID of the layer to remove
	 *
	 * @example
	 * If a layer with ID 'state-data' exists, remove it.
	 * ```ts
	 * if (map.getLayer('state-data')) map.removeLayer('state-data');
	 * ```
	 */
	removeLayer(id: string): this;
	/**
	 * Returns the layer with the specified ID in the map's style.
	 *
	 * @param id - The ID of the layer to get.
	 * @returns The layer with the specified ID, or `undefined`
	 * if the ID corresponds to no existing layers.
	 *
	 * @example
	 * ```ts
	 * let stateDataLayer = map.getLayer('state-data');
	 * ```
	 * @see [Filter symbols by toggling a list](https://maplibre.org/maplibre-gl-js/docs/examples/filter-markers/)
	 * @see [Filter symbols by text input](https://maplibre.org/maplibre-gl-js/docs/examples/filter-markers-by-input/)
	 */
	getLayer(id: string): StyleLayer | undefined;
	/**
	 * Return the ids of all layers currently in the style, including custom layers, in order.
	 *
	 * @returns ids of layers, in order
	 *
	 * @example
	 * ```ts
	 * const orderedLayerIds = map.getLayersOrder();
	 * ```
	 */
	getLayersOrder(): string[];
	/**
	 * Sets the zoom extent for the specified style layer. The zoom extent includes the
	 * [minimum zoom level](https://maplibre.org/maplibre-style-spec/layers/#minzoom)
	 * and [maximum zoom level](https://maplibre.org/maplibre-style-spec/layers/#maxzoom))
	 * at which the layer will be rendered.
	 *
	 * Note: For style layers using vector sources, style layers cannot be rendered at zoom levels lower than the
	 * minimum zoom level of the _source layer_ because the data does not exist at those zoom levels. If the minimum
	 * zoom level of the source layer is higher than the minimum zoom level defined in the style layer, the style
	 * layer will not be rendered at all zoom levels in the zoom range.
	 *
	 * @param layerId - The ID of the layer to which the zoom extent will be applied.
	 * @param minzoom - The minimum zoom to set (0-24).
	 * @param maxzoom - The maximum zoom to set (0-24).
	 *
	 * @example
	 * ```ts
	 * map.setLayerZoomRange('my-layer', 2, 5);
	 * ```
	 */
	setLayerZoomRange(layerId: string, minzoom: number, maxzoom: number): this;
	/**
	 * Sets the filter for the specified style layer.
	 *
	 * Filters control which features a style layer renders from its source.
	 * Any feature for which the filter expression evaluates to `true` will be
	 * rendered on the map. Those that are false will be hidden.
	 *
	 * Use `setFilter` to show a subset of your source data.
	 *
	 * To clear the filter, pass `null` or `undefined` as the second parameter.
	 *
	 * @param layerId - The ID of the layer to which the filter will be applied.
	 * @param filter - The filter, conforming to the MapLibre Style Specification's
	 * [filter definition](https://maplibre.org/maplibre-style-spec/layers/#filter).  If `null` or `undefined` is provided, the function removes any existing filter from the layer.
	 * @param options - Options object.
	 *
	 * @example
	 * Display only features with the 'name' property 'USA'
	 * ```ts
	 * map.setFilter('my-layer', ['==', ['get', 'name'], 'USA']);
	 * ```
	 * @example
	 * Display only features with five or more 'available-spots'
	 * ```ts
	 * map.setFilter('bike-docks', ['>=', ['get', 'available-spots'], 5]);
	 * ```
	 * @example
	 * Remove the filter for the 'bike-docks' style layer
	 * ```ts
	 * map.setFilter('bike-docks', null);
	 * ```
	 * @see [Create a timeline animation](https://maplibre.org/maplibre-gl-js/docs/examples/timeline-animation/)
	 */
	setFilter(layerId: string, filter?: FilterSpecification | null, options?: StyleSetterOptions): this;
	/**
	 * Returns the filter applied to the specified style layer.
	 *
	 * @param layerId - The ID of the style layer whose filter to get.
	 * @returns The layer's filter.
	 */
	getFilter(layerId: string): FilterSpecification | void;
	/**
	 * Sets the value of a paint property in the specified style layer.
	 *
	 * @param layerId - The ID of the layer to set the paint property in.
	 * @param name - The name of the paint property to set.
	 * @param value - The value of the paint property to set.
	 * Must be of a type appropriate for the property, as defined in the [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/).
	 * Pass `null` to unset the existing value.
	 * @param options - Options object.
	 * @example
	 * ```ts
	 * map.setPaintProperty('my-layer', 'fill-color', '#faafee');
	 * ```
	 * @see [Change a layer's color with buttons](https://maplibre.org/maplibre-gl-js/docs/examples/color-switcher/)
	 * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
	 */
	setPaintProperty(layerId: string, name: string, value: any, options?: StyleSetterOptions): this;
	/**
	 * Returns the value of a paint property in the specified style layer.
	 *
	 * @param layerId - The ID of the layer to get the paint property from.
	 * @param name - The name of a paint property to get.
	 * @returns The value of the specified paint property.
	 */
	getPaintProperty(layerId: string, name: string): unknown;
	/**
	 * Sets the value of a layout property in the specified style layer.
	 *
	 * @param layerId - The ID of the layer to set the layout property in.
	 * @param name - The name of the layout property to set.
	 * @param value - The value of the layout property. Must be of a type appropriate for the property, as defined in the [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/).
	 * @param options - The options object.
	 * @example
	 * ```ts
	 * map.setLayoutProperty('my-layer', 'visibility', 'none');
	 * ```
	 */
	setLayoutProperty(layerId: string, name: string, value: any, options?: StyleSetterOptions): this;
	/**
	 * Returns the value of a layout property in the specified style layer.
	 *
	 * @param layerId - The ID of the layer to get the layout property from.
	 * @param name - The name of the layout property to get.
	 * @returns The value of the specified layout property.
	 */
	getLayoutProperty(layerId: string, name: string): any;
	/**
	 * Sets the value of the style's glyphs property.
	 *
	 * @param glyphsUrl - Glyph URL to set. Must conform to the [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/glyphs/).
	 * @param options - Options object.
	 * @example
	 * ```ts
	 * map.setGlyphs('https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf');
	 * ```
	 */
	setGlyphs(glyphsUrl: string | null, options?: StyleSetterOptions): this;
	/**
	 * Returns the value of the style's glyphs URL
	 *
	 * @returns glyphs Style's glyphs url
	 */
	getGlyphs(): string | null;
	/**
	 * Adds a sprite to the map's style. Fires the `style` event.
	 *
	 * @param id - The ID of the sprite to add. Must not conflict with existing sprites.
	 * @param url - The URL to load the sprite from
	 * @param options - Options object.
	 * @example
	 * ```ts
	 * map.addSprite('sprite-two', 'http://example.com/sprite-two');
	 * ```
	 */
	addSprite(id: string, url: string, options?: StyleSetterOptions): this;
	/**
	 * Removes the sprite from the map's style. Fires the `style` event.
	 *
	 * @param id - The ID of the sprite to remove. If the sprite is declared as a single URL, the ID must be "default".
	 * @example
	 * ```ts
	 * map.removeSprite('sprite-two');
	 * map.removeSprite('default');
	 * ```
	 */
	removeSprite(id: string): this;
	/**
	 * Returns the as-is value of the style's sprite.
	 *
	 * @returns style's sprite list of id-url pairs
	 */
	getSprite(): {
		id: string;
		url: string;
	}[];
	/**
	 * Sets the value of the style's sprite property.
	 *
	 * @param spriteUrl - Sprite URL to set.
	 * @param options - Options object.
	 * @example
	 * ```ts
	 * map.setSprite('YOUR_SPRITE_URL');
	 * ```
	 */
	setSprite(spriteUrl: string | null, options?: StyleSetterOptions): this;
	/**
	 * Sets the any combination of light values.
	 *
	 * @param light - Light properties to set. Must conform to the [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/light).
	 * @param options - Options object.
	 *
	 * @example
	 * ```ts
	 * let layerVisibility = map.getLayoutProperty('my-layer', 'visibility');
	 * ```
	 */
	setLight(light: LightSpecification, options?: StyleSetterOptions): this;
	/**
	 * Returns the value of the light object.
	 *
	 * @returns light Light properties of the style.
	 */
	getLight(): LightSpecification;
	/**
	 * Sets the value of style's sky properties.
	 *
	 * @param sky - Sky properties to set. Must conform to the [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/sky/).
	 * @param options - Options object.
	 *
	 * @example
	 * ```ts
	 * map.setSky({'atmosphere-blend': 1.0});
	 * ```
	 */
	setSky(sky: SkySpecification, options?: StyleSetterOptions): this;
	/**
	 * Returns the value of the style's sky.
	 *
	 * @returns the sky properties of the style.
	 * @example
	 * ```ts
	 * map.getSky();
	 * ```
	 */
	getSky(): SkySpecification;
	/**
	 * Sets the `state` of a feature.
	 * A feature's `state` is a set of user-defined key-value pairs that are assigned to a feature at runtime.
	 * When using this method, the `state` object is merged with any existing key-value pairs in the feature's state.
	 * Features are identified by their `feature.id` attribute, which can be any number or string.
	 *
	 * This method can only be used with sources that have a `feature.id` attribute. The `feature.id` attribute can be defined in three ways:
	 *
	 * - For vector or GeoJSON sources, including an `id` attribute in the original data file.
	 * - For vector or GeoJSON sources, using the [`promoteId`](https://maplibre.org/maplibre-style-spec/sources/#promoteid) option at the time the source is defined.
	 * - For GeoJSON sources, using the [`generateId`](https://maplibre.org/maplibre-style-spec/sources/#generateid) option to auto-assign an `id` based on the feature's index in the source data. If you change feature data using `map.getSource('some id').setData(..)`, you may need to re-apply state taking into account updated `id` values.
	 *
	 * _Note: You can use the [`feature-state` expression](https://maplibre.org/maplibre-style-spec/expressions/#feature-state) to access the values in a feature's state object for the purposes of styling._
	 *
	 * @param feature - Feature identifier. Feature objects returned from
	 * {@link Map#queryRenderedFeatures} or event handlers can be used as feature identifiers.
	 * @param state - A set of key-value pairs. The values should be valid JSON types.
	 *
	 * @example
	 * ```ts
	 * // When the mouse moves over the `my-layer` layer, update
	 * // the feature state for the feature under the mouse
	 * map.on('mousemove', 'my-layer', (e) => {
	 *   if (e.features.length > 0) {
	 *     map.setFeatureState({
	 *       source: 'my-source',
	 *       sourceLayer: 'my-source-layer',
	 *       id: e.features[0].id,
	 *     }, {
	 *       hover: true
	 *     });
	 *   }
	 * });
	 * ```
	 * @see [Create a hover effect](https://maplibre.org/maplibre-gl-js/docs/examples/hover-styles/)
	 */
	setFeatureState(feature: FeatureIdentifier, state: any): this;
	/**
	 * Removes the `state` of a feature, setting it back to the default behavior.
	 * If only a `target.source` is specified, it will remove the state for all features from that source.
	 * If `target.id` is also specified, it will remove all keys for that feature's state.
	 * If `key` is also specified, it removes only that key from that feature's state.
	 * Features are identified by their `feature.id` attribute, which can be any number or string.
	 *
	 * @param target - Identifier of where to remove state. It can be a source, a feature, or a specific key of feature.
	 * Feature objects returned from {@link Map#queryRenderedFeatures} or event handlers can be used as feature identifiers.
	 * @param key - (optional) The key in the feature state to reset.
	 * @example
	 * Reset the entire state object for all features in the `my-source` source
	 * ```ts
	 * map.removeFeatureState({
	 *   source: 'my-source'
	 * });
	 * ```
	 *
	 * @example
	 * When the mouse leaves the `my-layer` layer,
	 * reset the entire state object for the
	 * feature under the mouse
	 * ```ts
	 * map.on('mouseleave', 'my-layer', (e) => {
	 *   map.removeFeatureState({
	 *     source: 'my-source',
	 *     sourceLayer: 'my-source-layer',
	 *     id: e.features[0].id
	 *   });
	 * });
	 * ```
	 *
	 * @example
	 * When the mouse leaves the `my-layer` layer,
	 * reset only the `hover` key-value pair in the
	 * state for the feature under the mouse
	 * ```ts
	 * map.on('mouseleave', 'my-layer', (e) => {
	 *   map.removeFeatureState({
	 *     source: 'my-source',
	 *     sourceLayer: 'my-source-layer',
	 *     id: e.features[0].id
	 *   }, 'hover');
	 * });
	 * ```
	 */
	removeFeatureState(target: FeatureIdentifier, key?: string): this;
	/**
	 * Gets the `state` of a feature.
	 * A feature's `state` is a set of user-defined key-value pairs that are assigned to a feature at runtime.
	 * Features are identified by their `feature.id` attribute, which can be any number or string.
	 *
	 * _Note: To access the values in a feature's state object for the purposes of styling the feature, use the [`feature-state` expression](https://maplibre.org/maplibre-style-spec/expressions/#feature-state)._
	 *
	 * @param feature - Feature identifier. Feature objects returned from
	 * {@link Map#queryRenderedFeatures} or event handlers can be used as feature identifiers.
	 * @returns The state of the feature: a set of key-value pairs that was assigned to the feature at runtime.
	 *
	 * @example
	 * When the mouse moves over the `my-layer` layer,
	 * get the feature state for the feature under the mouse
	 * ```ts
	 * map.on('mousemove', 'my-layer', (e) => {
	 *   if (e.features.length > 0) {
	 *     map.getFeatureState({
	 *       source: 'my-source',
	 *       sourceLayer: 'my-source-layer',
	 *       id: e.features[0].id
	 *     });
	 *   }
	 * });
	 * ```
	 */
	getFeatureState(feature: FeatureIdentifier): any;
	/**
	 * Returns the map's containing HTML element.
	 *
	 * @returns The map's container.
	 */
	getContainer(): HTMLElement;
	/**
	 * Returns the HTML element containing the map's `<canvas>` element.
	 *
	 * If you want to add non-GL overlays to the map, you should append them to this element.
	 *
	 * This is the element to which event bindings for map interactivity (such as panning and zooming) are
	 * attached. It will receive bubbled events from child elements such as the `<canvas>`, but not from
	 * map controls.
	 *
	 * @returns The container of the map's `<canvas>`.
	 * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
	 */
	getCanvasContainer(): HTMLElement;
	/**
	 * Returns the map's `<canvas>` element.
	 *
	 * @returns The map's `<canvas>` element.
	 * @see [Measure distances](https://maplibre.org/maplibre-gl-js/docs/examples/measure/)
	 * @see [Display a popup on hover](https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-hover/)
	 * @see [Center the map on a clicked symbol](https://maplibre.org/maplibre-gl-js/docs/examples/center-on-symbol/)
	 */
	getCanvas(): HTMLCanvasElement;
	_containerDimensions(): number[];
	_setupContainer(): void;
	_resizeCanvas(width: number, height: number, pixelRatio: number): void;
	_setupPainter(): void;
	migrateProjection(newTransform: ITransform, newCameraHelper: ICameraHelper): void;
	_contextLost: (event: any) => void;
	_contextRestored: (event: any) => void;
	_onMapScroll: (event: any) => boolean;
	/**
	 * Returns a Boolean indicating whether the map is fully loaded.
	 *
	 * Returns `false` if the style is not yet fully loaded,
	 * or if there has been a change to the sources or style that
	 * has not yet fully loaded.
	 *
	 * @returns A Boolean indicating whether the map is fully loaded.
	 */
	loaded(): boolean;
	/**
	 * @internal
	 * Update this map's style and sources, and re-render the map.
	 *
	 * @param updateStyle - mark the map's style for reprocessing as
	 * well as its sources
	 */
	_update(updateStyle?: boolean): this;
	/**
	 * @internal
	 * Request that the given callback be executed during the next render
	 * frame.  Schedule a render frame if one is not already scheduled.
	 *
	 * @returns An id that can be used to cancel the callback
	 */
	_requestRenderFrame(callback: () => void): TaskID;
	_cancelRenderFrame(id: TaskID): void;
	/**
	 * @internal
	 * Call when a (re-)render of the map is required:
	 *
	 * - The style has changed (`setPaintProperty()`, etc.)
	 * - Source data has changed (e.g. tiles have finished loading)
	 * - The map has is moving (or just finished moving)
	 * - A transition is in progress
	 *
	 * @param paintStartTimeStamp - The time when the animation frame began executing.
	 */
	_render(paintStartTimeStamp: number): this;
	/**
	 * Force a synchronous redraw of the map.
	 * @example
	 * ```ts
	 * map.redraw();
	 * ```
	 */
	redraw(): this;
	/**
	 * Clean up and release all internal resources associated with this map.
	 *
	 * This includes DOM elements, event bindings, web workers, and WebGL resources.
	 *
	 * Use this method when you are done using the map and wish to ensure that it no
	 * longer consumes browser resources. Afterwards, you must not call any other
	 * methods on the map.
	 */
	remove(): void;
	/**
	 * Trigger the rendering of a single frame. Use this method with custom layers to
	 * repaint the map when the layer changes. Calling this multiple times before the
	 * next frame is rendered will still result in only a single frame being rendered.
	 * @example
	 * ```ts
	 * map.triggerRepaint();
	 * ```
	 * @see [Add a 3D model](https://maplibre.org/maplibre-gl-js/docs/examples/add-3d-model/)
	 * @see [Add an animated icon to the map](https://maplibre.org/maplibre-gl-js/docs/examples/add-image-animated/)
	 */
	triggerRepaint(): void;
	_onWindowOnline: () => void;
	/**
	 * Gets and sets a Boolean indicating whether the map will render an outline
	 * around each tile and the tile ID. These tile boundaries are useful for
	 * debugging.
	 *
	 * The uncompressed file size of the first vector source is drawn in the top left
	 * corner of each tile, next to the tile ID.
	 *
	 * @example
	 * ```ts
	 * map.showTileBoundaries = true;
	 * ```
	 */
	get showTileBoundaries(): boolean;
	set showTileBoundaries(value: boolean);
	/**
	 * Gets and sets a Boolean indicating whether the map will visualize
	 * the padding offsets.
	 */
	get showPadding(): boolean;
	set showPadding(value: boolean);
	/**
	 * Gets and sets a Boolean indicating whether the map will render boxes
	 * around all symbols in the data source, revealing which symbols
	 * were rendered or which were hidden due to collisions.
	 * This information is useful for debugging.
	 */
	get showCollisionBoxes(): boolean;
	set showCollisionBoxes(value: boolean);
	/**
	 * Gets and sets a Boolean indicating whether the map should color-code
	 * each fragment to show how many times it has been shaded.
	 * White fragments have been shaded 8 or more times.
	 * Black fragments have been shaded 0 times.
	 * This information is useful for debugging.
	 */
	get showOverdrawInspector(): boolean;
	set showOverdrawInspector(value: boolean);
	/**
	 * Gets and sets a Boolean indicating whether the map will
	 * continuously repaint. This information is useful for analyzing performance.
	 */
	get repaint(): boolean;
	set repaint(value: boolean);
	get vertices(): boolean;
	set vertices(value: boolean);
	/**
	 * Returns the package version of the library
	 * @returns Package version of the library
	 */
	get version(): string;
	/**
	 * Returns the elevation for the point where the camera is looking.
	 * This value corresponds to:
	 * "meters above sea level" * "exaggeration"
	 * @returns The elevation.
	 */
	getCameraTargetElevation(): number;
	/**
	 * Gets the {@link ProjectionSpecification}.
	 * @returns the projection specification.
	 * @example
	 * ```ts
	 * let projection = map.getProjection();
	 * ```
	 */
	getProjection(): ProjectionSpecification;
	/**
	 * Sets the {@link ProjectionSpecification}.
	 * @param projection - the projection specification to set
	 * @returns
	 */
	setProjection(projection: ProjectionSpecification): this;
}
type Primitive$1 = null | undefined | string | number | boolean | symbol | bigint;
type OptionalKeysOf<BaseType extends object> = BaseType extends unknown // For distributing `BaseType`
 ? (keyof {
	[Key in keyof BaseType as BaseType extends Record<Key, BaseType[Key]> ? never : Key]: never;
}) & (keyof BaseType) // Intersect with `keyof BaseType` to ensure result of `OptionalKeysOf<BaseType>` is always assignable to `keyof BaseType`
 : never;
type RequiredKeysOf<BaseType extends object> = BaseType extends unknown // For distributing `BaseType`
 ? Exclude<keyof BaseType, OptionalKeysOf<BaseType>> : never;
type IsNever<T> = [
	T
] extends [
	never
] ? true : false;
type IfNever<T, TypeIfNever = true, TypeIfNotNever = false> = (IsNever<T> extends true ? TypeIfNever : TypeIfNotNever);
type NoInfer$1<T> = T extends infer U ? U : never;
type IsAny$1<T> = 0 extends 1 & NoInfer$1<T> ? true : false;
type Simplify<T> = {
	[KeyType in keyof T]: T[KeyType];
} & {};
type OmitIndexSignature$1<ObjectType> = {
	[KeyType in keyof ObjectType as {} extends Record<KeyType, unknown> ? never : KeyType]: ObjectType[KeyType];
};
type PickIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType as {} extends Record<KeyType, unknown> ? KeyType : never]: ObjectType[KeyType];
};
type SimpleMerge<Destination, Source> = {
	[Key in keyof Destination as Key extends keyof Source ? never : Key]: Destination[Key];
} & Source;
type Merge<Destination, Source> = Simplify<SimpleMerge<PickIndexSignature<Destination>, PickIndexSignature<Source>> & SimpleMerge<OmitIndexSignature$1<Destination>, OmitIndexSignature$1<Source>>>;
type IfAny<T, TypeIfAny = true, TypeIfNotAny = false> = (IsAny$1<T> extends true ? TypeIfAny : TypeIfNotAny);
type BuiltIns = Primitive$1 | void | Date | RegExp;
type HasMultipleCallSignatures<T extends (...arguments_: any[]) => unknown> = T extends {
	(...arguments_: infer A): unknown;
	(...arguments_: infer B): unknown;
} ? B extends A ? A extends B ? false : true : true : false;
type ApplyDefaultOptions<Options extends object, Defaults extends Simplify<Omit<Required<Options>, RequiredKeysOf<Options>> & Partial<Record<RequiredKeysOf<Options>, never>>>, SpecifiedOptions extends Options> = IfAny<SpecifiedOptions, Defaults, IfNever<SpecifiedOptions, Defaults, Simplify<Merge<Defaults, {
	[Key in keyof SpecifiedOptions as Key extends OptionalKeysOf<Options> ? Extract<SpecifiedOptions[Key], undefined> extends never ? Key : never : Key]: SpecifiedOptions[Key];
}> & Required<Options>> // `& Required<Options>` ensures that `ApplyDefaultOptions<SomeOption, ...>` is always assignable to `Required<SomeOption>`
>>;
type PartialDeepOptions = {
	/**
	Whether to affect the individual elements of arrays and tuples.

	@default false
	*/
	readonly recurseIntoArrays?: boolean;
	/**
	Allows `undefined` values in non-tuple arrays.

	- When set to `true`, elements of non-tuple arrays can be `undefined`.
	- When set to `false`, only explicitly defined elements are allowed in non-tuple arrays, ensuring stricter type checking.

	@default true

	@example
	You can prevent `undefined` values in non-tuple arrays by passing `{recurseIntoArrays: true; allowUndefinedInNonTupleArrays: false}` as the second type argument:

	```
	import type {PartialDeep} from 'type-fest';

	type Settings = {
		languages: string[];
	};

	declare const partialSettings: PartialDeep<Settings, {recurseIntoArrays: true; allowUndefinedInNonTupleArrays: false}>;

	partialSettings.languages = [undefined]; // Error
	partialSettings.languages = []; // Ok
	```
	*/
	readonly allowUndefinedInNonTupleArrays?: boolean;
};
type DefaultPartialDeepOptions = {
	recurseIntoArrays: false;
	allowUndefinedInNonTupleArrays: true;
};
type PartialDeep<T, Options extends PartialDeepOptions = {}> = _PartialDeep<T, ApplyDefaultOptions<PartialDeepOptions, DefaultPartialDeepOptions, Options>>;
type _PartialDeep<T, Options extends Required<PartialDeepOptions>> = T extends BuiltIns | ((new (...arguments_: any[]) => unknown)) ? T : IsNever<keyof T> extends true // For functions with no properties
 ? T : T extends Map<infer KeyType, infer ValueType> ? PartialMapDeep<KeyType, ValueType, Options> : T extends Set<infer ItemType> ? PartialSetDeep<ItemType, Options> : T extends ReadonlyMap<infer KeyType, infer ValueType> ? PartialReadonlyMapDeep<KeyType, ValueType, Options> : T extends ReadonlySet<infer ItemType> ? PartialReadonlySetDeep<ItemType, Options> : T extends object ? T extends ReadonlyArray<infer ItemType> // Test for arrays/tuples, per https://github.com/microsoft/TypeScript/issues/35156
 ? Options["recurseIntoArrays"] extends true ? ItemType[] extends T // Test for arrays (non-tuples) specifically
 ? readonly ItemType[] extends T // Differentiate readonly and mutable arrays
 ? ReadonlyArray<_PartialDeep<Options["allowUndefinedInNonTupleArrays"] extends false ? ItemType : ItemType | undefined, Options>> : Array<_PartialDeep<Options["allowUndefinedInNonTupleArrays"] extends false ? ItemType : ItemType | undefined, Options>> : PartialObjectDeep<T, Options> // Tuples behave properly
 : T // If they don't opt into array testing, just use the original type
 : PartialObjectDeep<T, Options> : unknown;
type PartialMapDeep<KeyType, ValueType, Options extends Required<PartialDeepOptions>> = {} & Map<_PartialDeep<KeyType, Options>, _PartialDeep<ValueType, Options>>;
type PartialSetDeep<T, Options extends Required<PartialDeepOptions>> = {} & Set<_PartialDeep<T, Options>>;
type PartialReadonlyMapDeep<KeyType, ValueType, Options extends Required<PartialDeepOptions>> = {} & ReadonlyMap<_PartialDeep<KeyType, Options>, _PartialDeep<ValueType, Options>>;
type PartialReadonlySetDeep<T, Options extends Required<PartialDeepOptions>> = {} & ReadonlySet<_PartialDeep<T, Options>>;
type PartialObjectDeep<ObjectType extends object, Options extends Required<PartialDeepOptions>> = (ObjectType extends (...arguments_: any) => unknown ? (...arguments_: Parameters<ObjectType>) => ReturnType<ObjectType> : {}) & ({
	[KeyType in keyof ObjectType]?: _PartialDeep<ObjectType[KeyType], Options>;
});
type LiteralUnion<LiteralType, BaseType extends Primitive$1> = LiteralType | (BaseType & Record<never, never>);
type ReadonlyDeep<T> = T extends BuiltIns ? T : T extends new (...arguments_: any[]) => unknown ? T // Skip class constructors
 : T extends (...arguments_: any[]) => unknown ? {} extends ReadonlyObjectDeep<T> ? T : HasMultipleCallSignatures<T> extends true ? T : ((...arguments_: Parameters<T>) => ReturnType<T>) & ReadonlyObjectDeep<T> : T extends Readonly<ReadonlyMap<infer KeyType, infer ValueType>> ? ReadonlyMapDeep<KeyType, ValueType> : T extends Readonly<ReadonlySet<infer ItemType>> ? ReadonlySetDeep<ItemType> : T extends readonly [
] | readonly [
	...never[]
] ? readonly [
] : T extends readonly [
	infer U,
	...infer V
] ? readonly [
	ReadonlyDeep<U>,
	...ReadonlyDeep<V>
] : T extends readonly [
	...infer U,
	infer V
] ? readonly [
	...ReadonlyDeep<U>,
	ReadonlyDeep<V>
] : T extends ReadonlyArray<infer ItemType> ? ReadonlyArray<ReadonlyDeep<ItemType>> : T extends object ? ReadonlyObjectDeep<T> : unknown;
type ReadonlyMapDeep<KeyType, ValueType> = {} & Readonly<ReadonlyMap<ReadonlyDeep<KeyType>, ReadonlyDeep<ValueType>>>;
type ReadonlySetDeep<ItemType> = {} & Readonly<ReadonlySet<ReadonlyDeep<ItemType>>>;
type ReadonlyObjectDeep<ObjectType extends object> = {
	readonly [KeyType in keyof ObjectType]: ReadonlyDeep<ObjectType[KeyType]>;
};
type ValueOf<ObjectType, ValueType extends keyof ObjectType = keyof ObjectType> = ObjectType[ValueType];
type PartialExcept<T, K extends string> = {
	[P in keyof T as P extends K ? P : never]: T[P];
} & {
	[P in keyof T as P extends K ? never : P]?: T[P] extends Primitive$1 ? T[P] : T[P] extends (infer U)[] ? PartialExcept<U, K>[] : PartialExcept<T[P], K>;
};
type ExtractDeep<T, U, Depth extends readonly number[] = [
]> = Depth["length"] extends 3 ? any : {
	[K in keyof T as T[K] extends U ? K : T[K] extends object | undefined ? ExtractDeep<NonNullable<T[K]>, U, [
		...Depth,
		0
	]> extends never ? never : K : never]: T[K] extends object | undefined ? undefined extends T[K] ? ExtractDeep<NonNullable<T[K]>, U, [
		...Depth,
		0
	]> | undefined : ExtractDeep<NonNullable<T[K]>, U, [
		...Depth,
		0
	]> : T[K] extends U ? T[K] : never;
};
declare const MARKER_PLACEMENT: {
	/** Marker is aligned to the top of the anchor */
	readonly TOP: "top";
	/** Marker is aligned to the bottom of the anchor */
	readonly BOTTOM: "bottom";
	/** Marker is aligned to the left of the anchor */
	readonly LEFT: "left";
	/** Marker is aligned to the right of the anchor */
	readonly RIGHT: "right";
	/** Marker is aligned to the center of the anchor */
	readonly CENTER: "center";
	/** Marker is aligned to the top-left of the anchor */
	readonly TOP_LEFT: "top-left";
	/** Marker is aligned to the top-right of the anchor */
	readonly TOP_RIGHT: "top-right";
	/** Marker is aligned to the bottom-left of the anchor */
	readonly BOTTOM_LEFT: "bottom-left";
	/** Marker is aligned to the bottom-right of the anchor */
	readonly BOTTOM_RIGHT: "bottom-right";
	/** Marker is hidden and replaced with a pin */
	readonly HIDDEN: "hidden";
};
type MarkerPlacement = ValueOf<typeof MARKER_PLACEMENT>;
type WatermarkPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | "top" | "bottom" | "left" | "right";
type WatermarkOptions = {
	/**
	 * Padding in pixels. Can be a number or an object with top, right, bottom, and left properties.
	 * @default 16
	 */
	padding?: number | {
		top?: number;
		right?: number;
		bottom?: number;
		left?: number;
	};
	/**
	 * Position of the watermark on the screen.
	 * @default 'bottom-left'
	 */
	position?: WatermarkPosition;
	/**
	 * Show only the Mappedin icon without text.
	 * @default false
	 */
	iconOnly?: boolean;
	/**
	 * Color of the watermark.
	 * @default 'dark'
	 */
	color?: "light" | "dark";
	/**
	 * Scale of the watermark between 0.5 and 1.5.
	 * @default 1
	 */
	scale?: number;
	/**
	 * Callback when the watermark is clicked.
	 * @hidden
	 */
	onClick?: () => void;
	/**
	 * Whether the watermark is interactive.
	 * @default true
	 */
	interactive?: boolean;
	/**
	 * Whether the watermark should be visible.
	 * @hidden
	 * @default true
	 */
	visible?: boolean;
};
type WatermarkUpdateOptions = Omit<WatermarkOptions, "onClick" | "visible"> & {
	/** Show the Mappedin watermark. */
	visible?: boolean;
	/** Set the interactivity of the watermark. */
	interactive?: boolean;
};
declare class WatermarkSystem extends PubSub<{
	"texture-loaded": void;
}> {
	#private;
	dirty: boolean;
	private get color();
	private get iconName();
	private get minWidth();
	private get defaultWidth();
	private get aspectRatio();
	get options(): Required<WatermarkOptions>;
	set options(options: WatermarkUpdateOptions);
	get icon(): string;
	constructor(cameraObject: PerspectiveCamera, rendererState: RendererState, options?: Partial<WatermarkOptions>);
	private setSize;
	private setXY;
	get width(): number;
	get height(): number;
	getPositionAlignedOffset(width: number, height: number): {
		x: number;
		y: number;
	};
	getPositionAlignedCanvasCoordinates: (canvasWidth: number, canvasHeight: number) => {
		x: number;
		y: number;
	};
	getPositionAlignedPadding: () => {
		x: number;
		y: number;
	};
	insertIntoQuadTree(quadTree: QuadTree<{
		entityId: Geometry2D["id"];
	}>): void;
	resize(canvasWidth: number, canvasHeight: number): void;
	update(): void;
	destroy(): void;
}
type TSerializedColliderResponse = [
	number,
	1 | 0,
	Rectangle?
];
type TCollisionSystemEvent = {
	"visibility-changed": undefined;
};
type PackedBBox = [
	x: number,
	y: number,
	w: number,
	h: number,
	index: number
];
type PackedBBoxes = PackedBBox[];
type PackedCollider = [
	bboxes: PackedBBoxes,
	enabled: 0 | 1,
	alwaysVisible: 0 | 1,
	x: number,
	y: number,
	shouldCollideWithScreenEdges?: 0 | 1,
	onlyExposeStrategyIndex?: number
];
type PackedMessage = [
	colliders: PackedCollider[],
	devicePixelRatio: number,
	totalHeight: number,
	totalWidth: number,
	watermarkWidth: number,
	watermarkHeight: number,
	watermarkPosition: WatermarkPosition
];
type PackedJsonMessage = {
	x: number;
	y: number;
	enabled: boolean;
	rank: number;
	bboxes: PackedBBoxes;
	shouldCollideWithScreenEdges: boolean;
	lockedToStrategyIndex: number;
};
declare class CollisionSystem extends PubSub<TCollisionSystemEvent, keyof TCollisionSystemEvent> {
	private worker;
	private debugContext;
	private debugCanvas;
	collidersDirty: boolean;
	packedMessage: PackedMessage;
	visibleCollidersQTree: QuadTree<{
		entityId: string | number;
	}>;
	interactiveCollidersQTree: QuadTree<{
		entityId: string | number;
	}>;
	coreState: RendererState;
	constructor(debugCanvas: HTMLCanvasElement, coreState: RendererState, useWorker?: boolean);
	postMessage: () => void;
	showCollisionBoxes: () => void;
	hideCollisionBoxes: () => void;
	currentMsgId: string;
	working: boolean;
	private _postMessage;
	componentArray: (MarkerComponent | LabelComponent)[];
	update: (watermarkWidth: number, watermarkHeight: number, watermarkPosition?: WatermarkPosition, isPanning?: boolean, staticColliders?: Rectangle[]) => void;
	resize(watermarkWidth: number, watermarkHeight: number, watermarkPosition: WatermarkPosition): void;
	/**
	 * Resolve collisions
	 */
	resolve: (e: MessageEvent<{
		msgId: string;
		colliders: TSerializedColliderResponse[];
		staticColliders: Rectangle[];
	}>) => void;
	drawDebug: () => void;
	destroy: () => void;
}
declare enum TapType {
	onefinger = 0,
	twofinger = 1
}
declare class Tap {
	type: TapType;
	event: PointerEvent;
	constructor(event: PointerEvent);
	get timestamp(): number;
}
declare class TapsController {
	private taps;
	add(tap: Tap): void;
	get lastPointerDown(): Tap | undefined;
	get isSingleTapWithTwoFingers(): boolean;
	get isSingleTapWithOneFinger(): boolean;
	get isDoubleTapWithOneFinger(): boolean;
	get isSingleTap(): boolean;
	get isDoubleTap(): boolean;
	discardOutsideOfWaitWindow(timestamp: number): void;
	flush(): void;
	get _taps(): Tap[];
	destroy(): void;
}
type InteractionPayload = {
	entity2D?: Geometry2D;
	entity3D?: Geometry3D;
	position?: Vector3;
	groupContainers?: GroupContainerObject3D[];
	pointerEvent: Pick<PointerEvent, "button">;
};
type InteractionEvents = {
	click: InteractionPayload;
	hover: Omit<InteractionPayload, "pointerEvent">;
	"singletap-with-twofinger": PointerEvent;
	"doubletap-with-onefinger": PointerEvent;
};
type CursorTypes = "grabbing" | "grab" | "pointer";
type InteractionState = {
	distanceFromMouseDown: number | undefined;
	isPanning: boolean;
	mouseDownStart: {
		time: number;
		timestamp: number;
		offsetX: number;
		offsetY: number;
	} | undefined;
};
declare class InteractionSystem extends PubSub<InteractionEvents> {
	#private;
	raycaster: Raycaster;
	private state;
	private coreState;
	private camera;
	private worldPlane;
	_quadtree: QuadTree<{
		entityId: Geometry2D["id"];
	}>;
	_container: HTMLCanvasElement;
	private lastPointerEvent?;
	private cursor;
	private touchesCount;
	private isUserInteracting;
	constructor(container: HTMLCanvasElement, coreState: RendererState, camera: PerspectiveCamera, worldPlane: Mesh, isUserInteracting: () => boolean);
	updateQuadtree(takeIT: QuadTree<{
		entityId: Geometry2D["id"];
	}>): void;
	setHovered3DEntityInteractionComponentDirty(): void;
	hasTouched: boolean;
	onPointerMoveRaf: (event: PointerEvent) => void;
	private onPointerMove;
	tapsControl: TapsController;
	getThreeDIntersectsFromXY(point: Vector2): Intersection<Object3D<Object3DEventMap>>[];
	getGroupContainerIntersectsFromXY(point: Vector2): any;
	private onPointerDown;
	private clickTimeout;
	private onPointerUp;
	private flush;
	handleHover(e?: PointerEvent): void;
	private handleCursor;
	private detect2DEntityHover;
	private handleClick;
	dirty3D: boolean;
	private cachedHitBoxes;
	get _hitBoxes(): {
		entities: (Object3D | EntityMesh$1<Geometry3D> | EntityBatchedMesh)[];
	};
	private ndcPoint;
	private intersect;
	private detect3DEntityHover;
	private detect3DContainerHover;
	private updateInteractionStateIfPanning;
	getMouseRayIntersects(): Intersection<Object3D<Object3DEventMap>>[];
	destroy(): void;
	debugPanel: HTMLDivElement | undefined;
	enableDebug(): void;
	get _state(): {
		hovered3DEntity: Geometry3D | undefined;
		hovered2DEntity: Geometry2D | undefined;
		hovered3DContainers: GroupContainerObject3D[] | undefined;
		lastHover: Geometry3D | undefined;
		interaction: InteractionState;
	};
	private queueDebugMessage;
	/**
	 * Get the current cursor type determined by the interaction.
	 */
	getCursor(): CursorTypes;
}
type GLTFExportOptions = {
	onlyVisible?: boolean;
	binary?: boolean;
	scale?: number;
	light?: boolean;
};
declare class ExporterSystem {
	#private;
	/**
	 * @hidden
	 */
	constructor(state: RendererState);
	/**
	 * Exports the current scene as a GLTF file.
	 * @param {GLTFExportOptions} userOptions - User-defined options for exporting.
	 * @returns {Promise<Blob>} - A promise that resolves to a Blob containing the GLTF data.
	 */
	getCurrentSceneGLTF: (userOptions: GLTFExportOptions) => Promise<Blob>;
	/**
	 * Cleans up resources used by the ExporterSystem.
	 */
	destroy(): void;
}
/**
 * Different properties that can be interpolated on, and what input values are expected.
 */
export type InterpolateOn = {
	"zoom-level": number[];
};
/**
 * Define interpolation behavior for a value.
 * @example
 * ```ts
 * // Interpolate a value from 1 to 2 between zoom levels 17 and 18 with easing
 * const value: Interpolation<'zoom-level', [number, number]> = {
 *  on: 'zoom-level',
 * 	input: [17, 18],
 * 	output: [1, 2],
 * 	easing: 'ease-in',
 * };
 */
export type Interpolation<T extends keyof InterpolateOn, U extends unknown[]> = {
	/**
	 * The property to observe when interpolating.
	 *
	 * @defaultValue 'zoom-level'
	 */
	on: T;
	/**
	 * Breakpoints in the observed property.
	 */
	input: [
		InterpolateOn[T][number],
		...InterpolateOn[T]
	];
	/**
	 * Output values corresponding to the input breakpoints.
	 */
	output: [
		U[number],
		...U
	];
	/**
	 * The easing function to use for the interpolation.
	 *
	 * @defaultValue 'linear'
	 */
	easing?: EasingCurve;
};
type OptionalRemap<T extends object, U extends keyof T, V> = Omit<T, U> & {
	[key in U]?: V;
};
declare const LABEL_TEXT_PLACEMENT: {
	/**
	 * Text appears to the right of the pin.
	 */
	readonly RIGHT: "right";
	/**
	 * Text appears to the left of the pin.
	 */
	readonly LEFT: "left";
	/**
	 * Text appears above the pin.
	 */
	readonly TOP: "top";
	/**
	 * Text is hidden, only the pin is visible.
	 */
	readonly HIDDEN: "hidden";
	/**
	 * Text is centered at the pin location, pin is hidden.
	 */
	readonly CENTER: "center";
};
declare const LABEL_LOW_PRIORITY = "low-priority";
export type LabelTextPlacement = ValueOf<typeof LABEL_TEXT_PLACEMENT>;
type LabelTextPlacementInternal = LabelTextPlacement | typeof LABEL_LOW_PRIORITY;
declare const labelAppearanceSchema: z.ZodPipe<z.ZodObject<{
	margin: z.ZodDefault<z.ZodNumber>;
	maxLines: z.ZodDefault<z.ZodNumber>;
	textSize: z.ZodDefault<z.ZodNumber>;
	maxWidth: z.ZodDefault<z.ZodNumber>;
	lineHeight: z.ZodDefault<z.ZodNumber>;
	color: z.ZodDefault<z.ZodString>;
	outlineColor: z.ZodDefault<z.ZodString>;
	textColor: z.ZodOptional<z.ZodString>;
	textOutlineColor: z.ZodOptional<z.ZodString>;
	pinColor: z.ZodOptional<z.ZodString>;
	pinOutlineColor: z.ZodOptional<z.ZodString>;
	pinColorInactive: z.ZodOptional<z.ZodString>;
	pinOutlineColorInactive: z.ZodOptional<z.ZodString>;
	icon: z.ZodOptional<z.ZodString>;
	iconSize: z.ZodDefault<z.ZodNumber>;
	iconScale: z.ZodDefault<z.ZodUnion<readonly [
		z.ZodNumber,
		z.ZodObject<{
			on: z.ZodLiteral<"zoom-level">;
			input: z.ZodTuple<[
				z.ZodNumber
			], z.ZodNumber>;
			output: z.ZodTuple<[
				z.ZodNumber
			], z.ZodNumber>;
			easing: z.ZodDefault<z.ZodEnum<{
				"ease-in": "ease-in";
				"ease-out": "ease-out";
				"ease-in-out": "ease-in-out";
				linear: "linear";
			}>>;
		}, z.core.$strip>
	]>>;
	iconPadding: z.ZodDefault<z.ZodNumber>;
	iconFit: z.ZodDefault<z.ZodEnum<{
		fill: "fill";
		contain: "contain";
		cover: "cover";
	}>>;
	iconOverflow: z.ZodDefault<z.ZodEnum<{
		visible: "visible";
		hidden: "hidden";
	}>>;
	iconVisible: z.ZodDefault<z.ZodUnion<readonly [
		z.ZodBoolean,
		z.ZodNumber
	]>>;
	opacity: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>, z.ZodTransform<{
	textColor: string;
	textOutlineColor: string;
	pinColor: string;
	pinOutlineColor: string;
	pinColorInactive: string;
	pinOutlineColorInactive: string;
	margin: number;
	maxLines: number;
	textSize: number;
	maxWidth: number;
	lineHeight: number;
	color: string;
	outlineColor: string;
	iconSize: number;
	iconScale: number | {
		on: "zoom-level";
		input: [
			number,
			...number[]
		];
		output: [
			number,
			...number[]
		];
		easing: "ease-in" | "ease-out" | "ease-in-out" | "linear";
	};
	iconPadding: number;
	iconFit: "fill" | "contain" | "cover";
	iconOverflow: "visible" | "hidden";
	iconVisible: number | boolean;
	opacity: number;
	icon?: string | undefined;
}, {
	margin: number;
	maxLines: number;
	textSize: number;
	maxWidth: number;
	lineHeight: number;
	color: string;
	outlineColor: string;
	iconSize: number;
	iconScale: number | {
		on: "zoom-level";
		input: [
			number,
			...number[]
		];
		output: [
			number,
			...number[]
		];
		easing: "ease-in" | "ease-out" | "ease-in-out" | "linear";
	};
	iconPadding: number;
	iconFit: "fill" | "contain" | "cover";
	iconOverflow: "visible" | "hidden";
	iconVisible: number | boolean;
	opacity: number;
	textColor?: string | undefined;
	textOutlineColor?: string | undefined;
	pinColor?: string | undefined;
	pinOutlineColor?: string | undefined;
	pinColorInactive?: string | undefined;
	pinOutlineColorInactive?: string | undefined;
	icon?: string | undefined;
}>>;
declare const labelAppearanceSchemaStrict: z.ZodObject<{
	margin: z.ZodDefault<z.ZodNumber>;
	maxLines: z.ZodDefault<z.ZodNumber>;
	textSize: z.ZodDefault<z.ZodNumber>;
	maxWidth: z.ZodDefault<z.ZodNumber>;
	lineHeight: z.ZodDefault<z.ZodNumber>;
	color: z.ZodDefault<z.ZodString>;
	outlineColor: z.ZodDefault<z.ZodString>;
	textColor: z.ZodOptional<z.ZodString>;
	textOutlineColor: z.ZodOptional<z.ZodString>;
	pinColor: z.ZodOptional<z.ZodString>;
	pinOutlineColor: z.ZodOptional<z.ZodString>;
	pinColorInactive: z.ZodOptional<z.ZodString>;
	pinOutlineColorInactive: z.ZodOptional<z.ZodString>;
	icon: z.ZodOptional<z.ZodString>;
	iconSize: z.ZodDefault<z.ZodNumber>;
	iconScale: z.ZodDefault<z.ZodUnion<readonly [
		z.ZodNumber,
		z.ZodObject<{
			on: z.ZodLiteral<"zoom-level">;
			input: z.ZodTuple<[
				z.ZodNumber
			], z.ZodNumber>;
			output: z.ZodTuple<[
				z.ZodNumber
			], z.ZodNumber>;
			easing: z.ZodDefault<z.ZodEnum<{
				"ease-in": "ease-in";
				"ease-out": "ease-out";
				"ease-in-out": "ease-in-out";
				linear: "linear";
			}>>;
		}, z.core.$strip>
	]>>;
	iconPadding: z.ZodDefault<z.ZodNumber>;
	iconFit: z.ZodDefault<z.ZodEnum<{
		fill: "fill";
		contain: "contain";
		cover: "cover";
	}>>;
	iconOverflow: z.ZodDefault<z.ZodEnum<{
		visible: "visible";
		hidden: "hidden";
	}>>;
	iconVisible: z.ZodDefault<z.ZodUnion<readonly [
		z.ZodBoolean,
		z.ZodNumber
	]>>;
	opacity: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
/**
 * Options to control how a label is rendered.
 *
 * | Option | Type | Description | Default |
 * |--------|------|-------------|---------|
 * | `margin` | `number` | Margin around the label text and pin in pixels. This will affect label density. Minimum is 6px. | 6 |
 * | `maxLines` | `number` | Number of lines to display when text spans multiple lines. | 2 |
 * | `textSize` | `number` | Text size in pixels | 11.5 |
 * | `textPlacement` | `'top'` \| `'left'` \| `'right'` \| `'hidden'` \| `['top', 'left', 'right', 'hidden']` | The placement of the text relative to the pin. | - |
 * | `maxWidth` | `number` | Maximum width of text in pixels. | 150 |
 * | `lineHeight` | `number` | Line height sets the height of a line box. It's commonly used to set the distance between lines of text. | 1.2 |
 * | `color` | {@link ColorString} | A {@link ColorString} for the label text and pin. | `#333` |
 * | `outlineColor` | {@link ColorString} | A {@link ColorString} for the outline around the label text and pin. | `white` |
 * | `textColor` | {@link ColorString} | A {@link ColorString} representing just the text color. Defaults to the same as `color`. | - |
 * | `textOutlineColor` | {@link ColorString} | A {@link ColorString} representing just the text outline. Defaults to the same as `outlineColor`. | - |
 * | `pinColor` | {@link ColorString} | A {@link ColorString} representing just the pin color. Defaults to the same as `color`. | - |
 * | `pinOutlineColor` | {@link ColorString} | A {@link ColorString} representing just the pin outline. Defaults to the same as `outlineColor`. | - |
 * | `pinColorInactive` | {@link ColorString} | A {@link ColorString} representing just the pin color when the label is inactive. Defaults to the same as `pinColor`. | - |
 * | `pinOutlineColorInactive` | {@link ColorString} | A {@link ColorString} representing just the pin outline when the label is inactive. Defaults to the same as `pinOutlineColor`. | - |
 * | `icon` | `string` | An icon to be placed inside the label pin. Can be an SVG string or a path to a PNG or JPEG. | - |
 * | `iconSize` | `number` | Size of the icon in pixels. Requires `icon` to be set. | 20 |
 * | `iconScale` | `number` \| {@link Interpolation} | Scale the icon uniformly. Specify a number or an {@link Interpolation} object. | 1 |
 * | `iconPadding` | `number` | Padding between the icon and the pin's border in pixels. | 2 |
 * | `iconFit` | `'fill'` \| `'contain'` \| `'cover'` | How the icon should fit inside the pin. Options: `fill` (stretch to fill), `cover` (maintain aspect ratio and fill), `contain` (maintain aspect ratio and fit inside). | `cover` |
 * | `iconOverflow` | `'visible'` \| `'hidden'` | Whether the icon should overflow the circle of the pin. Options: `visible`, `hidden`. | `hidden` |
 * | `iconVisible` | `boolean` \| `number` | Controls icon visibility. If boolean, directly shows/hides the icon. If number, defines the zoom level at which the icon becomes visible. | `true` |
 * | `pinOpacity` | `number` | The opacity of the pin when the Label is visible. | `1` |
 *
 * @example Render a label with an SVG icon
 * ```ts
 * mapView.FloatingLabels.add(space, "Label", {
 * 	appearance: {
 * 		icon: `<svg>...</svg>`,
 * 	},
 * });
 * ```
 *
 * @example Render a label with an image icon
 * ```ts
 * mapView.FloatingLabels.add(space, "Label", {
 * 	appearance: {
 * 		icon: 'https://example.com/icon.png',
 * 	},
 * });
 * ```
 *
 * @example Scale a label's icon with zoom level
 * ```ts
 * mapView.FloatingLabels.add(space, "Label", {
 * 	appearance: {
 * 		// Make the icon 3x larger from zoom level 19 to 22
 * 		iconScale: {
 * 			on: 'zoom-level',
 * 			input: [19, 22],
 * 			output: [1, 3],
 * 		},
 * 	},
 * });
 * ```
 *
 * @useDeclaredType
 */
export type LabelAppearance = OptionalRemap<OptionalRemap<z.input<typeof labelAppearanceSchemaStrict>, "iconScale", number | Interpolation<"zoom-level", number[]>>, "color" | "outlineColor" | "pinColor" | "pinOutlineColor" | "pinColorInactive" | "pinOutlineColorInactive", ColorString>;
type LabelAppearanceWithDefaults = z.infer<typeof labelAppearanceSchema>;
declare const addLabelOptionsSchema: z.ZodObject<{
	rank: z.ZodOptional<z.ZodUnion<readonly [
		z.ZodEnum<{
			low: "low";
			medium: "medium";
			high: "high";
			"always-visible": "always-visible";
		}>,
		z.ZodNumber
	]>>;
	appearance: z.ZodOptional<z.ZodPipe<z.ZodObject<{
		margin: z.ZodDefault<z.ZodNumber>;
		maxLines: z.ZodDefault<z.ZodNumber>;
		textSize: z.ZodDefault<z.ZodNumber>;
		maxWidth: z.ZodDefault<z.ZodNumber>;
		lineHeight: z.ZodDefault<z.ZodNumber>;
		color: z.ZodDefault<z.ZodString>;
		outlineColor: z.ZodDefault<z.ZodString>;
		textColor: z.ZodOptional<z.ZodString>;
		textOutlineColor: z.ZodOptional<z.ZodString>;
		pinColor: z.ZodOptional<z.ZodString>;
		pinOutlineColor: z.ZodOptional<z.ZodString>;
		pinColorInactive: z.ZodOptional<z.ZodString>;
		pinOutlineColorInactive: z.ZodOptional<z.ZodString>;
		icon: z.ZodOptional<z.ZodString>;
		iconSize: z.ZodDefault<z.ZodNumber>;
		iconScale: z.ZodDefault<z.ZodUnion<readonly [
			z.ZodNumber,
			z.ZodObject<{
				on: z.ZodLiteral<"zoom-level">;
				input: z.ZodTuple<[
					z.ZodNumber
				], z.ZodNumber>;
				output: z.ZodTuple<[
					z.ZodNumber
				], z.ZodNumber>;
				easing: z.ZodDefault<z.ZodEnum<{
					"ease-in": "ease-in";
					"ease-out": "ease-out";
					"ease-in-out": "ease-in-out";
					linear: "linear";
				}>>;
			}, z.core.$strip>
		]>>;
		iconPadding: z.ZodDefault<z.ZodNumber>;
		iconFit: z.ZodDefault<z.ZodEnum<{
			fill: "fill";
			contain: "contain";
			cover: "cover";
		}>>;
		iconOverflow: z.ZodDefault<z.ZodEnum<{
			visible: "visible";
			hidden: "hidden";
		}>>;
		iconVisible: z.ZodDefault<z.ZodUnion<readonly [
			z.ZodBoolean,
			z.ZodNumber
		]>>;
		opacity: z.ZodDefault<z.ZodNumber>;
	}, z.core.$strip>, z.ZodTransform<{
		textColor: string;
		textOutlineColor: string;
		pinColor: string;
		pinOutlineColor: string;
		pinColorInactive: string;
		pinOutlineColorInactive: string;
		margin: number;
		maxLines: number;
		textSize: number;
		maxWidth: number;
		lineHeight: number;
		color: string;
		outlineColor: string;
		iconSize: number;
		iconScale: number | {
			on: "zoom-level";
			input: [
				number,
				...number[]
			];
			output: [
				number,
				...number[]
			];
			easing: "ease-in" | "ease-out" | "ease-in-out" | "linear";
		};
		iconPadding: number;
		iconFit: "fill" | "contain" | "cover";
		iconOverflow: "visible" | "hidden";
		iconVisible: number | boolean;
		opacity: number;
		icon?: string | undefined;
	}, {
		margin: number;
		maxLines: number;
		textSize: number;
		maxWidth: number;
		lineHeight: number;
		color: string;
		outlineColor: string;
		iconSize: number;
		iconScale: number | {
			on: "zoom-level";
			input: [
				number,
				...number[]
			];
			output: [
				number,
				...number[]
			];
			easing: "ease-in" | "ease-out" | "ease-in-out" | "linear";
		};
		iconPadding: number;
		iconFit: "fill" | "contain" | "cover";
		iconOverflow: "visible" | "hidden";
		iconVisible: number | boolean;
		opacity: number;
		textColor?: string | undefined;
		textOutlineColor?: string | undefined;
		pinColor?: string | undefined;
		pinOutlineColor?: string | undefined;
		pinColorInactive?: string | undefined;
		pinOutlineColorInactive?: string | undefined;
		icon?: string | undefined;
	}>>>;
	interactive: z.ZodDefault<z.ZodBoolean>;
	textPlacement: z.ZodDefault<z.ZodUnion<readonly [
		z.ZodEnum<{
			center: "center";
			top: "top";
			left: "left";
			right: "right";
			hidden: "hidden";
		}>,
		z.ZodArray<z.ZodEnum<{
			center: "center";
			top: "top";
			left: "left";
			right: "right";
			hidden: "hidden";
		}>>
	]>>;
}, z.core.$strip>;
type AddLabelOptionsInternal = z.input<typeof addLabelOptionsSchema> & {
	appearance?: LabelAppearance;
	/**
	 * @internal
	 */
	id?: string;
	/**
	 * @internal
	 */
	occluderId?: number;
	/**
	 * The vertical position of the label relative to the floor.
	 */
	verticalOffset?: number;
	/**
	 * Whether the label is enabled.
	 * @default true
	 */
	enabled?: boolean;
	/**
	 * The entity to attach the label to.
	 */
	attachTo?: EntityId<GeometryState> | string | null;
	/**
	 * The placement of the text relative to the pin.
	 */
	textPlacement?: LabelTextPlacement | LabelTextPlacement[];
};
declare class MeshCreationAndOptimizationSystem extends PubSub<{
	"model-loaded": void;
	"geometry-2d-added": void;
	"geometry-group-added": void;
}> {
	state: RendererState;
	convertTo3DMapPosition: any;
	loader?: GLTFLoader;
	constructor(state: RendererState, convertTo3DMapPosition: any);
	getGLTFLoader(): Promise<GLTFLoader>;
	createEntityFromFeature(id: string | number, feature: Feature$1<Polygon$1 | LineString | MultiPolygon$1, MeshComponentProperties>, style?: (LineStyle | PaintStyle) & {
		focusable?: boolean;
	}): Geometry3D<MeshComponent, StyleComponent, InteractionComponent, "geometry", OutlineComponent | undefined, FocusableComponent | undefined, TextureComponent | undefined, BorderComponent | undefined, ClippingPlaneComponent | undefined>;
	createModelFromFeature(id: string | number, feature: Feature$1<Point$1, ModelProperties>, style?: Partial<ModelStyle>): ModelGeometry3D;
	populateEntityMesh(entity: Geometry3D, geometry: BufferGeometry): void;
	populateModelGroup(entities: Set<string | number>, url: string, tree: GeometryGroupObject3D): Promise<Geometry3DObject3D>;
	populateEntityGroup(entities: Set<string | number>): Set<string | number>;
	private optimizePromise;
	update(): Promise<void>;
}
declare class DOMVisibilitySystem {
	state: RendererState;
	dirty: boolean;
	domTree: Entity2DHTMLDivElementContainer;
	constructor(state: RendererState, domTree: Entity2DHTMLDivElementContainer);
	update(): void;
}
declare class TwoDProjectionSystem {
	state: RendererState;
	project: (projection: Vector2, position: Vector3) => void;
	constructor(state: RendererState, project: (projection: Vector2, position: Vector3) => void);
	update(): void;
}
declare enum PINVISIBILITY {
	/** The pin is visible. */
	ACTIVE = 1,
	/** The pin is visible, but the icon is not visible. */
	INACTIVE = 0.5,
	/** The pin is not visible. */
	HIDDEN = 0
}
declare enum TEXTALIGN {
	LEFT = "left",
	CENTER = "center",
	RIGHT = "right"
}
declare class TwoDDrawSystem extends PubSub<{
	"img:loaded": undefined;
}> {
	dirty: boolean;
	state: RendererState;
	colliderContext: CanvasRenderingContext2D;
	colliderCanvas: HTMLCanvasElement;
	transformRequestFunc?: TransformImageRequest;
	constructor(state: RendererState, colliderCanvas: HTMLCanvasElement, transformImageRequest?: TransformImageRequest);
	transformRequest: (url: string) => Promise<{
		url: string;
	}>;
	pinCache: {
		[key in number]: [
			HTMLCanvasElement | OffscreenCanvas,
			HTMLCanvasElement | OffscreenCanvas
		];
	};
	/** Stores the loaded images ready to be drawn. */
	imageCache: {
		[key in number]: HTMLImageElement | ImageBitmap;
	};
	/** Stores the promises for each image fetch. */
	imagePromiseCache: {
		[key in number]: Promise<HTMLImageElement | ImageBitmap>;
	};
	imageDimensionsCache: {
		[key in number]: {
			width: number;
			height: number;
		};
	};
	textCache: {
		[key in string]: {
			left?: OffscreenCanvas | HTMLCanvasElement;
			center?: OffscreenCanvas | HTMLCanvasElement;
			right?: OffscreenCanvas | HTMLCanvasElement;
		};
	};
	update: (zoomLevel: number) => void;
	processText: (text: string, size: number, maxWidth: number, maxLines: number, lineHeight: number) => {
		textDrawFn: TDrawFn;
		width: number;
		height: number;
	};
	textToCanvas: (textDrawFn: (ctx: CanvasRenderingContext2D, x: number, y: number) => void, size: number, textAlign: TEXTALIGN, width: number, height: number, foregroundColor: string, backgroundColor: string) => any;
	cacheImage: (label: LabelComponent) => void;
	createPinCanvas: (label: LabelComponent, pinSize: number, backgroundColor: string, foregroundColor: string, maxIconScale?: number) => HTMLCanvasElement | OffscreenCanvas;
	prepare: (label: LabelComponent, labelCacheId: string, context: CanvasRenderingContext2D) => void;
	draw(label: LabelComponent, labelCacheId: string, context: CanvasRenderingContext2D): void;
}
declare class DrawSystem {
	state: RendererState;
	convertTo3DMapPosition: (position: Position$1) => Vector3;
	constructor(state: RendererState, convertTo3DMapPosition: (position: Position$1) => Vector3);
	determineTextureVisiblity(meshComponent: MeshComponent, textureComponent: TextureComponent, interactionComponent?: InteractionComponent): void;
	update(): void;
}
declare class TwoDVisibilitySystem extends PubSub<{
	"draw:2d": undefined;
	"animate:2d": undefined;
}> {
	state: RendererState;
	constructor(state: RendererState);
	animating: Map<LabelComponent, [
		number,
		number
	]>;
	isAnimating: boolean;
	startTime: number;
	showDuration: number;
	hideDuration: number;
	update: () => void;
	playAnimations: () => void;
	_playAnimations(): void;
}
declare class RenderSystem extends PubSub<{
	"measure-canvas": undefined;
	"pre-render": undefined;
	"post-render": undefined;
	"camera-state-change": undefined;
}> {
	private state;
	private renderer;
	private mode;
	private scene;
	private cameraObject;
	private viewCamera;
	private systems;
	constructor(renderer: Renderer, state: RendererState, mode: Core["mode"], scene: Scene, cameraObject: PerspectiveCamera, viewCamera: Camera, systems: Systems);
	needs2DRecompute: boolean;
	twoDdirty: boolean;
	threeDdirty: boolean;
	private frameId;
	private twoDFrameId;
	private animationFrameId;
	private nextFrame;
	update: (sync?: boolean) => Promise<any>;
	/**
	 * Paint to screen
	 */
	private paint;
	/**
	 * Play 2D animations in a frame
	 */
	private animate2D;
	/**
	 * Draw 2D entities in a frame
	 */
	private drawEntities2D;
	/**
	 * Update 2D entities to determine which ones are visible, and these are to be processed in the next frame
	 */
	private updateEntities2D;
	private commitRenderState;
	destroy(): void;
}
declare const EVENTS: readonly [
	"change",
	"pan-start",
	"pan-end",
	"rotate-start",
	"rotate-end",
	"zoom-start",
	"zoom-end",
	"multi-start",
	"multi-end",
	"multi-cancel",
	"pedestal-start",
	"pedestal-change",
	"pedestal-end",
	"user-pan-start",
	"user-pedestal-start",
	"user-rotate-start",
	"user-dolly-start",
	"user-zoom-start",
	"user-tilt-start",
	"user-pan-end",
	"user-pedestal-end",
	"user-rotate-end",
	"user-dolly-end",
	"user-zoom-end",
	"user-tilt-end",
	"position-updated",
	"zoom-updated",
	"tilt-updated",
	"rotation-updated"
];
type AnimateCameraTarget = {
	position?: {
		x?: number;
		y?: number;
		z?: number;
	};
	zoom?: number;
	tilt?: number;
	rotation?: number;
	doNotAutoStart?: boolean;
};
type CameraFocusOnOptions = {
	/**
	 * The duration (in ms) the focus animation should last for.
	 * @defaultValue `100`
	 */
	duration?: number;
	/**
	 * The animation curve to use for zooming in. Uses the animateCamera one by default.
	 */
	curve?: (n: number) => number;
	/**
	 * Camera tilt between 0 (top-down) to 1 (from the side)
	 */
	tilt?: number;
	/**
	 * Rotation in degrees
	 */
	rotation?: number;
	/**
	 * You can overide the {{#crossLink "MapView/focusZoomFactor:property"}}{{/crossLink}} for a specific {{#crossLink "MapView/focusOn:method"}}{{/crossLink}} call, rather than globally, if you like.
	 */
	focusZoomFactor?: number;
	/**
	 * Sets a floor for how close you can zoom in on the scene. If it's lower than mapView.controls.minZoom, it's ignored.
	 * @defaultValue: 0
	 */
	minZoom?: number;
	maxZoom?: number;
	padding?: InsetPadding;
	points?: any[];
	boundingBox?: any;
	callback?: () => void;
	cancelledCallback?: () => void;
	interruptible?: boolean;
	verticalPadding?: number;
};
type PanBounds = {
	min: Vector3;
	max: Vector3;
	center: Vector3;
	radius: number;
};
declare enum CameraControlsState {
	NONE = -1,
	ROTATE = 0,
	DOLLY = 1,
	PAN = 2,
	WHEEL_ZOOM = 3,
	TOUCH_TILT = 4,
	TOUCH_DOLLY = 5,
	TOUCH_PAN = 6,
	MULTI = 7,
	PEDESTAL = 8,
	TOUCH_PEDESTAL = 9
}
type CameraEventName = (typeof EVENTS)[number];
type SpecificCameraEvents = {
	"multi-start": {
		zooming: boolean;
		rotating: boolean;
		tilting: boolean;
	};
	"multi-end": {
		zooming: boolean;
		rotating: boolean;
		tilting: boolean;
	};
	"multi-cancel": {
		zooming: boolean;
		rotating: boolean;
		tilting: boolean;
	};
	"pedestal-change": {
		pedestal: number;
		scrolledToTop?: boolean;
		scrolledToBottom?: boolean;
		scrollPercent?: number;
	};
};
type CameraSystemState = {
	center: [
		number,
		number
	];
	zoomLevel: number;
	minZoomLevel: number;
	maxZoomLevel: number;
	pitch: number;
	minPitch: number;
	maxPitch: number;
	bearing: number;
	elevation: number;
};
type CameraEvents = {
	[Event in CameraEventName]: Event extends keyof SpecificCameraEvents ? SpecificCameraEvents[Event] : undefined;
};
declare class CameraSystem extends PubSub<CameraEvents> {
	#private;
	dirty: boolean;
	zoomDirty: boolean;
	rotationDirty: boolean;
	panDirty: boolean;
	stateDirty: boolean;
	/**
	 * Factor that controls how fast zooming in and out happens in response to mouse wheel events
	 *
	 * @property zoomSpeed {Float}
	 * @default 5.0
	 */
	zoomSpeed: number;
	/**
	 * Factor to multiple mouse movement by to get tilt/rotation.
	 *
	 * @property rotateSpeed {Float}
	 * @default 100
	 */
	rotateSpeed: number;
	/**
	 * Disable or re-enable user input.
	 *
	 * @property enabled {Boolean}
	 * @default true
	 */
	enabled: boolean;
	/**
	 * Disable or re-enable user zoom.
	 *
	 * @property enableZoom {Boolean}
	 * @default true
	 */
	enableZoom: boolean;
	/**
	 * Disable or re-enable user pan.
	 *
	 * @property enablePan {Boolean}
	 * @default true
	 */
	enablePan: boolean;
	/**
	 * Disable or re-enable user pedestal.
	 *
	 * @property enablePedestal {Boolean}
	 * @default false
	 */
	enablePedestal: boolean;
	/**
	 * Max amount to allow scrolling maps down
	 * (In Z-axis units, at the origin, down is positive)
	 *
	 * @property maxPedestal {Number}
	 * @default Infinity
	 */
	maxPedestal: number;
	/**
	 * Max amount to allow scrolling maps up
	 * (In Z-axis units, at the origin, up is negative)
	 *
	 * @property minPedestal {Number}
	 * @default 0
	 */
	minPedestal: number;
	/**
	 * Disable or re-enable user tilt/rotation.
	 *
	 * @property enableRotate {Boolean}
	 * @default true
	 */
	enableRotate: boolean;
	/**
	 * This is actually the minium distance the camera can get from it's anchor on the ground. May be worth changing if your map has very tall buildings to avoid the camera clipping through them.
	 *
	 * @property minZoomAltitude {Number}
	 * @default 0
	 */
	minZoomAltitude: number;
	/**
	 * Maximum distance the camera can get from it's anchor on the ground. Setting this too high will result in parts of the map falling out of the camera's clipping plane and disappearing.
	 *
	 * @property maxZoomAltitude {Number}
	 * @default Infinity
	 */
	maxZoomAltitude: number;
	/**
	 * How far the camera can zoom in towards the ground.
	 *
	 * This is equivalent to the minZoomAltitude property in mercator zoom level units.
	 * @default 0
	 */
	get maxZoomLevel(): number;
	/**
	 * Sets distance the camera can zoom in towards the ground.
	 * @default Infinity
	 */
	setMaxZoomLevel(zoomLevel: number): void;
	/**
	 * The default minimum zoom level of the camera in mercator zoom levels.
	 */
	get defaultMinZoomLevel(): number;
	/**
	 * How far the camera can zoom out away from the ground.
	 *
	 * This is equivalent to the maxZoomAltitude property in mercator zoom level units.
	 */
	get minZoomLevel(): number;
	/**
	 * Sets distance the camera can zoom away from the ground.
	 */
	setMinZoomLevel(zoomLevel: number): void;
	/**
	 * ignoreZoomLimits; use with caution for special effects
	 * @default false
	 */
	ignoreZoomLimits: boolean;
	/**
	 * Multiplier for min and max zoom, for convenience.
	 *
	 * @hidden
	 * @property zoomFactor {Number}
	 * @default 1
	 */
	zoomFactor: number;
	/**
	 * Constrains the camera from panning to far away from the scene. It's set automatically based on the size of the map.
	 * If you want to change anything, you probably want to change the margin property, which is the factor the min and max in
	 * each dimension are multiplied by to give the true bounds. For example, on a truely huge venue a 1.25 margin could get you
	 * way out into space when zoomed in.
	 *
	 * @property panBounds {Object}
	 @property panBounds.min {Object} An x, y pair representing the bounds of one corner of the map.
	 @property panBounds.max {Object} An x, y pair representing the bounds of the other corner of the map.
	 */
	panBounds: PanBounds;
	/**
	 * Minium camera tilt, in radians. If it's anything other than 0, you won't be able to look at the venue from the top down perspective.
	 *
	 * @property minTilt {Number}
	 * @default 0.0
	 */
	minTilt: number;
	/**
	 * Minium camera tilt, in radians. If you set it too high, the camera will be able to tilt down through the geometery of the scene, which will produce clipping issues.
	 *
	 * @property maxTilt {Number}
	 * @default 1.2
	 */
	maxTilt: number;
	/**
	 * If you would really prefer to pan with the right mouse button and tilt/rotate with the left, you can swap the values here to achieve that.
	 *
	 * @property MOUSE_BUTTONS {Object}
	 * @hidden
	 @property mouseButtons.ORBIT=MOUSE.RIGHT {MOUSE} The button to use for tilt/rotation. Defaults to `MOUSE.RIGHT`.
	 @property mouseButtons.ZOOM=MOUSE.MIDDLE {MOUSE} The button to use for zoom behaviour. Don't change
	 @property mouseButtons.PAN=MOUSE.LEFT {MOUSE} The button to use for panning the camera. Defaults to `MOUSE.LEFT`.
	 */
	private readonly MOUSE_BUTTONS;
	private readonly camera;
	private readonly scene;
	private readonly renderer;
	private readonly elevation;
	private readonly orbit;
	private readonly cameraPlane;
	private readonly raycaster;
	private readonly rendererState;
	private readonly options;
	state: CameraControlsState;
	private intersection?;
	private viewState;
	private tweens;
	private clock;
	private coords;
	private touch;
	private scrollTimer;
	private lastWheelTime;
	private resetZoom;
	private zoomStart;
	private pedestalScaleFactor;
	private isUserZooming;
	private stayInsideBounds;
	private userInteracting;
	private cameraMoving;
	private lastCameraMoveTime;
	constructor(camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer, rendererState: RendererState, options: CameraControlsOptions);
	/**
	 * The amount the camera is shifted up/down
	 * (corresponds to scroll amount in multifloor mode)
	 * 100% == camera is as far up as it will go
	 * 0% == camera is as far down as it will go
	 */
	get scrollPercent(): number;
	/**
	 * Returns current field of view(FOV) in degrees
	 */
	get fov(): number;
	/**
	 * Returns whether the maps are scrolled to bottom
	 */
	get scrolledToBottom(): boolean;
	/**
	 * Returns whether the maps are scrolled to top
	 */
	get scrolledToTop(): boolean;
	/**
	 * The camera's current center in [longitude, latitude] degrees.
	 */
	get center(): [
		number,
		number
	];
	/**
	 * @param center The center in [longitude, latitude] degrees.
	 */
	setCenter(longitude: number, latitude: number): void;
	/**
	 * @hidden
	 */
	raycastToFloor: (pos: Vector2) => Vector3;
	/**
	 * Returns true if the the user is currently manipulating the camera.
	 *
	 * @return {Boolean} True if the user is currently manipulating the camera, false otherwise.
	 */
	isUserInteracting: () => boolean;
	/**
	 * Returns the current camera position.
	 *
	 * @return {Object} An {x, y} object of the current camera postion.
	 */
	getPosition: () => Vector3;
	/**
	 * Returns the current camera pedestal zoom level.
	 */
	getPedestal: () => number;
	/**
	 * Pans the camera right and down from the current position
	 *
	 * @param right {Number} The units to move right. Negative will pan left. This is in relation to the global coordinate system, not the current camera rotation.
	 * @param down {Number} The units to move down. Negative will pan up. This is in relation to the global coordinate system, not the current camera rotation.
	 */
	pan: (right: number, down: number) => void;
	/**
	 * Anything we need to do after we render the camera, like update anchors for the mouse/touch controls.
	 *
	 * @hidden
	 */
	postRender: () => void;
	/**
	 * Returns true if the camera is currently animating.
	 * @return {Boolean} True if the camera is animating, false otherwise.
	 */
	get isAnimating(): boolean;
	/**
	 * Returns true if the camera is currently moving (it's animating, the user is manipulating it).
	 *
	 * @return {Boolean} True if the camera is moving, false otherwise.
	 */
	isCameraMoving: () => boolean;
	/**
	 * Returns the most recent time the camera stopped moving.
	 *
	 * @returns {Number} The time in ms the camera stopped moving.
	 */
	lastCameraStoppedMovingTime: () => number;
	/**
	 * Sets the camera anchor to a specifc x/y positon, in the global reference frame. 0,0 will be roughly the middle of the map, and panBounds holds the min/max points.
	 *
	 * @param x {Number} The x position to move the camera to. +x will take you right, from the default camera rotation of 0.
	 * @param y {Number} The y position to move the camera to. +y will take you down (towards the viewer) in the default camera rotation of 0.
	 */
	setPosition: (x: number, y: number) => void;
	private updateCameraPosition;
	/**
	 * Tilts the camera up or down by some number of radians. Bounded by minTilt and maxTilt.
	 *
	 * @param radians {Number} Number of radians to increase or decrease the current tilt by.
	 */
	tilt: (radians: number) => void;
	/**
	 * Zooms the camera in on the center of the current view.
	 *
	 * @param duration {Number} The duration of the zoom animation, in ms.
	 * @param curve {Function} The easing function to use for the zoom animation.
	 * @param callback {Function} A callback that will be executed when the zoom animation is done.
	 */
	zoomIn: (duration: number, curve: (n: number) => number, callback: (...args: any) => void) => void;
	/**
	 * Zooms the camera out from the center of the current view.
	 *
	 * @param duration
	 * @param curve
	 * @param callback
	 */
	zoomOut: (duration: number, curve: (n: number) => number, callback: (...args: any) => void) => void;
	/**
	 * Returns the current camera rotation.
	 *
	 * @return {Number} The current rotation of the camera, in radians.
	 */
	getRotation: () => number;
	/**
	 * Cancel animation- for the new API
	 */
	cancelAnimation: () => void;
	/**
	 * Animates the camera from it's current position to the state specified in target. You only
	 * need to specify the properties you actually want to change.
	 *
	 * You can also specify a duration, animation curve, and a callback for when it's done.
	 *
	 * @param target {Object} A list of optional parameters you can set that represent the camera state.
	 @param [target.position] {Object} An {x, y, z} object representing the position to move to.
	 @param [target.zoom] {Number} The zoom level to end at.
	 @param [target.tilt] {Number} The tilt to end at, in radians.
	 @param [target.rotation] {Number} The rotation to end at, in radians.
	 @param [target.doNotAutoStart=false] {Boolean} Set this to true if you want to start the tween yourself.
	 * @param [duration] {Number} The duration to animate the camera for, in ms.
	 * @param [curve] {Mappedin.Easing} The animation curve to use for the animation.
	 * @param [callback] {Function} A callback that will be executed when the animation is done.
	 * @param [options] {Object} An Options object
	 * @param [options.interruptible=true] {Boolean} Determines if this animation must complete before any new animations start
	 it will cancel and omit any previous animations. Set to "chain" to chain instead
	 *
	 * @return {Mappedin.Tween} The tween being used, if you want to do anything to control it manually. Do not overide it's events.
	 */
	animateCamera: (target: AnimateCameraTarget, duration: number, curve?: (n: number) => number, callback?: (...args: any) => void, cancelledCallback?: (...args: any) => void, options?: {
		interruptible?: boolean;
	}) => Promise<void>;
	/**
	 * Allows you to set any of the Camera's position, zoom, rotation and tilt at once, with one function.
	 *
	 * @param [position] {Object} an {x, y, z} object representing the new position.
	 * @param [zoom] {Number} The new zoom distance.
	 * @param [rotation] {Number} The new rotation, in radians.
	 * @param [tilt] {Number} The new tilt, in radians.
	 */
	setMulti: (position?: {
		x?: number;
		y?: number;
		z?: number;
	}, zoom?: number, rotation?: number, tilt?: number, publishChangeEvent?: boolean) => void;
	/**
	 * Returns the actual zoom minimum based on real-world distance.
	 *
	 * @return {Number} The actual zoom minimum in map units.
	 */
	getZoomScaledMin: () => number;
	/**
	 * Returns the actual zoom maximum based on visible map size.
	 *
	 * @return {Number} The actual zoom maximum in map units.
	 */
	getZoomScaledMax: () => number;
	/**
	 * Sets the rotation to a specific orientation, clockwise in radians. Mostly useful to orient the map a certain way for a physical directory.
	 *
	 * @param radians {Number} Absolute rotation to set the camera to, in radians. 0 in the starting point.
	 * @param silent {Boolean} Whether to avoid emitting events
	 */
	setRotation: (radians: number, silent?: boolean) => void;
	/**
	 * Sets the camera to be a certain distance from the anchor point, along it's tilt and rotation.
	 * Keeps it inside minZoom and maxZoom.
	 *
	 * @param zoom {Number} The distance to set the camera to.
	 */
	setZoomAltitude: (zoom: number) => void;
	/**
	 * Set the camera's zoom level in mercator zoom level units.
	 */
	setZoomLevel: (zoomLevel: number) => void;
	/**
	 * Returns the current camera zoom
	 *
	 * @return {Number} The distance of the camera from the anchor.
	 */
	getZoomAltitude: () => number;
	/**
	 * Current camera zoom in mercator zoom level units.
	 */
	getZoomLevel: () => number;
	/**
	 * Sets the tilt to a specific level, in radians. 0 is top down. Bounded by minTilt and maxTilt.
	 *
	 * @param radians {Number} Tilt to set the camera to, in radians.
	 * @param silent {Boolean} Whether to avoid emitting events.
	 */
	setTilt: (radians: number, silent?: boolean) => void;
	/**
	 * Returns the current camera tilt
	 *
	 * @return {Number} The current tilt of the camera, in radians.
	 */
	getTilt: () => number;
	/**
	 * @param elevation {number}
	 * @hidden
	 */
	setCameraPlaneElevation: (elevation: number) => void;
	/**
	 * Moves the camera towards or away from the camera by a set amount. Positive will zoom in (bringing the distance closer to 0).
	 *
	 * @param zoom {Number} The distance to increase or decrease the zoom.
	 */
	zoom: (zoomDelta: number) => void;
	/**
	 * Returns the current projection scale factor.
	 * @param FOV {number} Field of view
	 * @param canvasHeight {number} Height of the canvas
	 * @param zoom{number} Zoom level
	 */
	getProjectionScaleFactor: (FOV: number, canvasHeight: number, zoom: number) => number;
	/**
	 * Should probably be "pre-render". Anything we need to do before rendering the scene.
	 *
	 * @hidden
	 */
	update: () => void;
	setPedestal: (z: number, emitEvent?: boolean, emitCameraStateChanged?: boolean) => void;
	/**
	 * Disposes of the camera and all of it's events.
	 *
	 * @hidden
	 */
	dispose: () => void;
	private createCameraPlane;
	private addEventListeners;
	private addMouseEventListeners;
	private addMouseMoveEventListeners;
	private removeMouseMoveEventListeners;
	private removeEventListeners;
	private removeMouseUpEventListeners;
	private onContextMenu;
	private onMouseUp;
	private onMouseMove;
	private onTouchStart;
	private onTouchMove;
	private onTouchEnd;
	private handleTouchMovePan;
	private handleTouchStartDolly;
	private handleMouseMovePan;
	private handleTouchStartTilt;
	private handleTouchMovePedestal;
	private handleTouchMoveTilt;
	private handleTouchMoveDolly;
	private handleTouchEnd;
	private handleTouchStartPan;
	private handleTouchStartPedestal;
	private onMouseDown;
	private onMouseWheel;
	private handleMouseWheel;
	private setCameraFromTransformMatrix;
	private makeTransformFromTouchAnchors;
	private updateTouchOrigin;
	private touchToScene;
	private canScrollZoom;
	private mouseToScene;
	private getMousePos;
	private handleMouseDownRotate;
	private handleMouseDownPan;
	private handleMouseDownPedestal;
	private handleMouseMovePedestal;
	private handleMouseMoveRotate;
	private publishUserZoomDebounced;
	private publishUserZoomEvent;
	private setCameraMoving;
	private unsetCameraMoving;
	private setUserInteracting;
	private unsetUserInteracting;
	private publishPedestalChangeEvent;
	/**
	 * Converts the altitude to the mercator zoom level.
	 * @param altitude {number} The altitude in meters.
	 */
	convertAltitudeToZoomLevel: (altitude: number) => number;
	/**
	 * Converts a mercator zoom level to an altitude in meters.
	 * @param zoomLevel{number} The mercator zoom level
	 */
	convertZoomLevelToAltitude: (zoomLevel: number) => number;
	private completeTween;
	static CAMERA_FRAME_PADDING_SIDES: readonly [
		"top",
		"bottom",
		"left",
		"right"
	];
	debugContainer: Object3D<import("three").Object3DEventMap>;
	getCameraFrameForCoordinates(pointCloud: Vector3[], options: CameraFocusOnOptions & {
		padding: InsetPadding;
	}): {
		center: Vector3;
		zoomLevel: number;
	};
	focusOn(pointCloud: Vector3[], options: CameraFocusOnOptions & {
		padding: InsetPadding;
	}): void;
	resize(canvasWidth: number, canvasHeight: number): void;
	computeMetersPerPixelFromZoomLevel(zoomLevel: number): number;
	computeMetersPerPixelFromAltitude(altitude: number): number;
	getCurrentMetersPerPixel(): number;
}
declare class DOMDrawSystem {
	#private;
	state: RendererState;
	constructor(state: RendererState);
	update(isUserInteracting: boolean): void;
}
declare class DOMResizeSystem extends PubSub<{
	"dimensions-update": void;
}> {
	state: RendererState;
	dirty: boolean;
	domTree: Entity2DHTMLDivElementContainer;
	observers: Map<string | number, ResizeObserver>;
	constructor(state: RendererState, domTree: Entity2DHTMLDivElementContainer);
	setupObserver(): void;
	updateDimensions: (mutations: ResizeObserverEntry[]) => void;
	update(): void;
	destroy(): void;
}
type AnimationOptions$1 = {
	duration?: number;
	easing?: EasingCurve;
};
type AnimateElevationOptions = AnimationOptions$1 & {
	interruptible?: boolean;
};
type FocusOnOptions = AnimationOptions$1 & {
	bearing?: number;
	pitch?: number;
	padding?: InsetPaddingOption;
	minZoomLevel?: number;
	maxZoomLevel?: number;
	interruptible?: boolean;
	verticalPadding?: number;
};
type AnimateToOptions = AnimationOptions$1 & {
	center?: Position$1;
	zoomLevel?: number;
	bearing?: number;
	pitch?: number;
	elevation?: number;
	interruptible?: boolean;
};
export declare const ANIMATION_TWEENS: {
	linear: (amount: number) => number;
	"ease-in": (amount: number) => number;
	"ease-out": (amount: number) => number;
	"ease-in-out": (amount: number) => number;
};
declare class Camera$2 {
	#private;
	/**
	 * @internal
	 */
	constructor(core: Core, systems: Systems, state: RendererState);
	/**
	 * The camera's current center in [longitude, latitude] degrees.
	 */
	get center(): Position$1;
	/**
	 * @param center The center in [longitude, latitude] degrees.
	 */
	setCenter(center: Position$1): void;
	/**
	 * Current camera zoom in mercator zoom level units.
	 */
	get zoomLevel(): number;
	/**
	 * Set the camera's zoom level in mercator zoom level units.
	 */
	setZoomLevel(zoomLevel: number): void;
	getState(): {
		zoomLevel: number;
		minZoomLevel: number;
		maxZoomLevel: number;
		minPitch: number;
		maxPitch: number;
		autoMinZoomLevel: boolean;
		panMode: "default" | "elevation";
		screenOffsets: InsetPadding;
		center: [
			number,
			number
		];
		bearing: number;
		pitch: number;
		elevation: number;
	};
	/**
	 * Whether the camera is animating.
	 */
	get isAnimating(): boolean;
	/**
	 * Cancel the last animation.
	 */
	cancelAnimation(): void;
	/**
	 * How far the camera can zoom in towards the ground
	 */
	get maxZoomLevel(): number;
	/**
	 * How far the camera can zoom out away from the ground
	 */
	get minZoomLevel(): number;
	/**
	 * Toggle the mode of the camera to automatically set the minimum zoom level based on the size of the scene.
	 * It will be automatically disabled when the minimum zoom level is set manually.
	 * @param value The new value for the auto min zoom level mode.
	 */
	setAutoMinZoomLevel(value: boolean): void;
	/**
	 * The mode of the camera to automatically set the minimum zoom level based on the size of the scene.
	 */
	get autoMinZoomLevel(): boolean;
	/**
	 * How far out the camera can zoom
	 *
	 * @param zoomLevel  The minimum zoom level in mercator zoom level units.
	 * @default 0
	 */
	setMinZoomLevel(zoomLevel: number, disableAutoMinZoomLevel?: boolean): void;
	/**
	 * How far in the camera can zoom
	 *
	 * @param zoomLevel The maximum zoom level in mercator zoom level units.
	 * @default Infinity
	 */
	setMaxZoomLevel(zoomLevel: number): void;
	/**
	 * The maximum pitch in degrees.
	 */
	get maxPitch(): number;
	/**
	 * The minimum pitch in degrees.
	 */
	get minPitch(): number;
	/**
	 * @param pitch The minimum pitch in degrees.
	 */
	setMinPitch(pitch: number): void;
	/**
	 * @param pitch The maximum pitch in degrees.
	 */
	setMaxPitch(pitch: number): void;
	/**
	 * The camera's current clockwise rotation in degrees from north.
	 */
	get bearing(): number;
	/**
	 * @param bearing The bearing in degrees from north.
	 */
	setBearing(bearing: number): void;
	/**
	 * The camera's current pitch in degrees.
	 */
	get pitch(): number;
	/**
	 *
	 * @param pitch The pitch in degrees.
	 */
	setPitch(pitch: number): void;
	/**
	 * The camera's current elevation in meters from the ground.
	 */
	get elevation(): number;
	/**
	 * @param elevation The elevation in meters.
	 */
	setElevation(elevation: number): void;
	/**
	 * Animate the camera's elevation to a new value.
	 * @param elevation The new elevation in meters.
	 * @param options The animation options.
	 */
	animateElevation(elevation: number, options?: AnimateElevationOptions): Promise<void>;
	/**
	 * The padding around the edges of the map when focusing on a set of coordinates.
	 */
	get insetsPadding(): InsetPadding;
	/**
	 * The camera's current pan mode.
	 */
	get panMode(): "default" | "elevation";
	/**
	 * Set the camera's pan mode. 'elevation' moves the camera up and down, while 'default' allows the camera to pan along the ground.
	 */
	setPanMode(panMode: "default" | "elevation"): void;
	/**
	 *
	 * @param padding The padding around the edges of the map when focusing on a set of coordinates (in screen pixels).
	 */
	setInsetPadding(padding: Partial<InsetPadding>): void;
	animateTo(options: AnimateToOptions): Promise<void>;
	getCameraFrameForCoordinates(coordinates: (Position | Position$1 | string)[], options?: FocusOnOptions): {
		center: Position$1;
		zoomLevel: number;
	};
	/**
	 *  Focuses the camera on a set of coordinates, with optional animation
	 *
	 * @param target list of [longitude, latitude, altitude?] points
	 * @param options {FocusOnOptions}
	 * @returns Promise<void>
	 */
	focusOn(target: (Position | Position$1 | string)[], options?: FocusOnOptions): Promise<void>;
}
declare class PanBoundsSystem extends PubSub<{
	update: void;
}> {
	private currentTotalBoundingBox?;
	private state;
	private cameraSystem;
	private debugMesh;
	dirty: boolean;
	autoMinZoomLevel: boolean;
	constructor(state: RendererState, cameraSystem: CameraSystem);
	/**
	 * Recomputes the pan bounds based on the current 2D and 3D entities in the scene
	 * This is only additive, meaning removing entities will not shrink the pan bounds
	 */
	update(): void;
}
declare const ATTRIBUTION_POSITIONS: readonly [
	"top-left",
	"top-right",
	"bottom-left",
	"bottom-right"
];
type AttributionPosition = (typeof ATTRIBUTION_POSITIONS)[number];
type AttributionControlOptions$1 = {
	custom?: string[];
	position?: AttributionPosition;
	feedback?: boolean;
};
type HTMLControlsSystemOptions = {
	outdoorEnabled?: boolean;
};
declare class HTMLControlsSystem {
	#private;
	controlContainerEl: HTMLDivElement;
	controlPositions: Record<AttributionPosition, HTMLDivElement>;
	compact: boolean | undefined;
	attribContainerEl?: HTMLDetailsElement;
	attribInnerEl?: HTMLDivElement;
	attribButtonEl?: HTMLElement;
	feedbackLinkEl?: HTMLAnchorElement;
	attribHTML: string;
	customAttributions: string[];
	constructor(container: HTMLElement, options?: HTMLControlsSystemOptions);
	addAttributionControl(options?: AttributionControlOptions$1): void;
	toggleAttribution: (e: MouseEvent) => void;
	/**
	 * Updates the attribution based on sources in the map style.
	 */
	private updateAttribution;
	/**
	 * Combines custom and map attributions and updates the display.
	 */
	private updateAttributionDisplay;
	private resizeAttribution;
	destroyAttributionControl(): void;
	resize(canvasWidth: number): void;
	/**
	 * This should fire when Maplibre data changes.
	 */
	updateData(map: Map$1): void;
	destroy(): void;
}
declare class IdleQueue {
	#private;
	/**
	 * Returns the current number of pending jobs in the queue
	 */
	get size(): number;
	/**
	 * Adds a callback to the queue.
	 * The queue will process callbacks during idle time to avoid blocking the main thread.
	 * @param callback - The callback to execute during idle time
	 */
	add(callback: () => void): void;
	/**
	 * Sets a callback to run when all jobs in the queue have completed.
	 * This callback will be invoked after the last job finishes processing.
	 * @param callback - The callback to execute when queue is empty
	 */
	onComplete(callback: () => void): void;
	/**
	 * Clears the completion callback
	 */
	clearOnComplete(): void;
	/**
	 * Clears all pending jobs and the completion callback.
	 * Cancels any in-progress idle callback.
	 * Useful when resetting the queue completely.
	 */
	clearAll(): void;
}
declare class OutlineInterpolationSystem extends PubSub<{
	"needs-render": void;
}> {
	#private;
	private rendererState;
	/**
	 * Set to true when we need to update the outline opacity of all entities, regardless of zoom level.
	 */
	outlineOpacitiesDirty: boolean;
	/**
	 * Use IdleQueue to ensure the thread isn't blocked by building outlines
	 * @internal for unit tests only
	 */
	useIdleFramesOnly: boolean;
	get geometries3DDirty(): boolean;
	set geometries3DDirty(value: boolean);
	/**
	 * Allow the building of outlines to occur when we have idle frames, so it doesn't impact initial load times
	 */
	idleBuildQueue: IdleQueue;
	/**
	 * Based on perf testing computing bounding sphere can take a very long time,
	 * and we only need it for frustum checking, which can wait a little, so putting it into its own idle frame queue
	 */
	idleComputeBoundingSphereQueue: IdleQueue;
	constructor(rendererState: RendererState);
	buildOutlines(geometryGroupEntity: GeometryGroupObject3D): void;
	/**
	 * Update the outline color of all entities with an outline component.
	 * @param zoomLevel - The current zoom level.
	 * @param isCameraZoomDirty - Whether the zoom level has changed since the last update. If this is true, the system will update if zoomLevel falls between range.
	 */
	update(zoomLevel: number, isCameraZoomDirty?: boolean): void;
	destroy(): void;
}
declare class ImageSystem extends PubSub<{
	"image-loaded": void;
}> {
	private rendererState;
	private convertTo3DMapPosition;
	private projectToScreen;
	private initialBearing;
	private naturalBearing;
	private imagePlacementOptions;
	private cameraFrustum;
	constructor(rendererState: RendererState, convertTo3DMapPosition: Core["convertTo3DMapPosition"], projectToScreen: (projectVector: Vector2, position: Vector3) => void, initialBearing?: number, naturalBearing?: number, imagePlacementOptions?: ImagePlacementOptions);
	private createImageMesh;
	private getOrDownloadImage;
	/**
	 * We need to track the loaded state separately from the promise since we can't check
	 * the resolution state of a promise after it settles. This allows components to check
	 * if an image has finished loading without having to await the promise.
	 */
	imageLoadingCache: Map<string, {
		loaded: boolean;
		promise: Promise<Texture>;
	}>;
	private flipIfNeeded;
	currentImageScreenBBoxes: Rectangle[];
	private viewProjectionMatrix;
	update(cameraRotationRadians: number): void;
	updateImageScreenBBoxes(meshComponent: MeshComponent | ImageComponent): void;
}
declare class GeometryInFocusSystem extends PubSub<{
	/**
	 * Returns the list of entities that are likely in focus, sorted by the weight of the raycast.
	 */
	"geometry-in-focus": string[];
}> {
	#private;
	cameraDirty: boolean;
	focusablesDirty: boolean;
	private state;
	private camera;
	private debugEl;
	private raycasters;
	private collisions;
	private focusableEntities;
	private debugRaycasters;
	constructor(state: RendererState, camera: PerspectiveCamera);
	resize(): void;
	/**
	 * Build 5 raycasters, one for the center of the screen, and one for each corner of the screen.
	 * the center one has the highest weight, and the corners have the lowest weight.
	 * this allows us to detect focus closer to the center of the screen more easily.
	 */
	private buildRaycasters;
	private updateFocusableEntities;
	update: (cameraIsMoving?: boolean, cameraStoppedMovingTime?: number) => void;
	updateRaf(): void;
	raycast(): void;
	showRaycasters(): void;
	hideRaycasters(): void;
	destroy(): void;
}
declare class OutdoorLayers {
	#private;
	idleQueue: IdleQueue;
	hideLayersIntersectingPolygons(bbox: BBox, polygons: Feature$1<Polygon$1 | MultiPolygon$1, any>[], layers: string[]): void;
	constructor(map?: Map);
	destroy(): void;
}
declare class MeshDetachmentSystem {
	#private;
	rendererState: RendererState;
	dirty: boolean;
	constructor(rendererState: RendererState);
	updateOne(geometry: All3DTypes | undefined): void;
	update(): void;
	private cleanup;
}
declare class MeshModificationSystem {
	#private;
	rendererState: RendererState;
	dirty: boolean;
	constructor(rendererState: RendererState);
	updateOne(entity?: EntityTypes): void;
	update(): void;
	cleanup(): void;
}
/**
 *  Preload fonts and optionally pre-generate the SDF textures for particular glyphs up front.
 *  This is to avoid ondemand font generation can take long.
 *
 *  If working in CSP-restricted environment, call `disableText3DWorker` before to avoid errors
 *
 *  @param fontUrl - url of the font file served.
 *  @returns  A promise that resolves when the font is loaded
 *
 */
export declare function preloadFont(fontUrl?: string): Promise<string>;
declare class Occlusion2DSystem {
	private state;
	private renderer;
	private renderService;
	private pickingTexture?;
	private pickingMaterial;
	private pixelBuffer?;
	private width;
	private height;
	private scale;
	private color;
	private convertTo3DMapPosition;
	private destroyed;
	private enabled;
	backgroundId: number;
	/**
	 * Applies the id to the geometry which is encoded as a color
	 */
	private applyId;
	private createOccluderMesh;
	constructor(state: RendererState, convertTo3DMapPosition: (position: Position) => Vector3, renderer?: Renderer);
	reserveOccluderId(): number;
	enable(): void;
	disable(): void;
	resize: () => void;
	private shouldShowByXY;
	activeOccluders: Set<unknown>;
	update: () => void;
	destroy(): void;
}
declare class GeometryDisposalSystem {
	private readonly state;
	dirty: boolean;
	constructor(state: RendererState);
	update(): void;
}
declare class TextureSystem extends PubSub<{
	"texture-added": void;
}> {
	dirty: boolean;
	state: RendererState;
	constructor(state: RendererState);
	texturePromiseCache: Map<string, Promise<Texture>>;
	loadTexture(path: string): Promise<Texture | undefined>;
	update(): void;
	destroy(): void;
}
declare class RenderOrderSystem {
	private currentOrder;
	private assignedOrders;
	private state;
	constructor(state: RendererState);
	/**
	 * Assigns a unique render order for an overlay object
	 * @param object - The object to assign render order to
	 * @returns The assigned render order
	 */
	assignOrder(object: object): number;
	/**
	 * Releases the render order for an object
	 * @param object - The object to release render order from
	 * @returns The default render order
	 */
	releaseOrder(object: object): number;
	/**
	 * Gets the current highest render order
	 * @returns The current highest render order
	 */
	getHighestOrder(): number;
	/**
	 * Gets the assigned render order for an object
	 * @param object - The object to get render order for
	 * @returns The render order or undefined if not assigned
	 */
	getOrder(object: object): number | undefined;
	update(): void;
}
declare class ClippingPlaneSystem {
	rendererState: RendererState;
	dirty: boolean;
	constructor(rendererState: RendererState);
	update(): void;
	private process;
	private createHoleFillGeometry;
}
type Systems = {
	cameraSystem: CameraSystem;
	panBoundsSystem: PanBoundsSystem;
	collisionSystem: CollisionSystem;
	interactionSystem: InteractionSystem;
	meshOptimizationSystem: MeshCreationAndOptimizationSystem;
	domVisiblitySystem: DOMVisibilitySystem;
	domMutationSystem: DOMResizeSystem;
	domDrawSystem: DOMDrawSystem;
	twoDProjectionSystem: TwoDProjectionSystem;
	twoDDrawSystem: TwoDDrawSystem;
	drawSystem: DrawSystem;
	twoDVisiblitySystem: TwoDVisibilitySystem;
	renderSystem: RenderSystem;
	watermarkSystem: WatermarkSystem;
	htmlControlsSystem: HTMLControlsSystem;
	exporterSystem: ExporterSystem;
	customGeometrySystem: CustomGeometrySystem;
	outlineInterpolationSystem: OutlineInterpolationSystem;
	outdoorLayersSystem: OutdoorLayers;
	pathSystem: PathSystem;
	imageSystem: ImageSystem;
	geometryInFocusSystem: GeometryInFocusSystem;
	meshDetachmentSystem: MeshDetachmentSystem;
	meshModificationSystem: MeshModificationSystem;
	text3DSystem: Text3DSystem;
	occlusion2DSystem: Occlusion2DSystem;
	geometryDisposalSystem: GeometryDisposalSystem;
	textureSystem: TextureSystem;
	borderSystem: BorderSystem;
	renderOrderSystem: RenderOrderSystem;
	clippingPlaneSystem: ClippingPlaneSystem;
};
export type MapViewState = {
	readonly type: "map-view";
	hoverColor: string;
	text3dHoverColor: string;
};
declare class Core extends PubSub<MapEvent> {
	#private;
	options: Omit<RendererCoreOptions, "outdoorView">;
	container: HTMLElement;
	Debug: Debug;
	/**
	 * The view camera is used for projecting both the outdoor map and our scene
	 */
	get viewCamera(): ThreeCamera;
	get canvasWidth(): number;
	get canvasHeight(): number;
	rendererDomElement: HTMLCanvasElement;
	/**
	 * Returns pixel ratio of the renderer
	 */
	get resolutionScale(): number;
	get aspect(): number;
	camera: Camera$2;
	map: Map$1 | undefined;
	/**
	 * Returns the mode the Renderer is in.
	 */
	get mode(): "standalone" | "outdoors-interleaved" | "outdoors-overlay" | undefined;
	/**
	 * @internal
	 */
	constructor(container: HTMLElement, options?: RendererCoreOptions);
	/**
	 * Add a container that can hold other containers, geometry groups, markers, labels and paths. Use this to group entities together.
	 */
	addGroupContainer(id: string, options?: {
		visible?: boolean;
		altitude?: number;
		interactive?: boolean;
		focusable?: boolean;
		preloadGeometry?: boolean;
	}, parent?: EntityId<GroupContainerState> | string | number | null): EntityId<GroupContainerState>;
	getParentContainer: (parent?: EntityId<GroupContainerState> | EntityId<GeometryState> | string | number | null, defaultToScene?: boolean) => GroupContainerObject3D | undefined;
	/**
	 * Add a custom THREE.js entity to the map. The geometry is placed at the GeoJSON coordinate and includes a `setup` and `update` methods.
	 * Setup is called when the first time the geometry visible, and update is called every render frame.
	 */
	addCustomGeometry(id: string, feature: Feature$1<Point$1>, builder: CustomGeometryBuilder, style?: {
		visible?: boolean;
		altitude?: number;
		interactive?: boolean;
	}, parent?: EntityId<GroupContainerState> | string | number | null): EntityId<ShapeState>;
	/**
	 * Add a geometry group from GeoJSON data
	 */
	addGeometryGroup<T extends FeatureCollection$1<Polygon$1 | MultiPolygon$1 | LineString, any>>(id: string, geometry: T, style?: T extends FeatureCollection$1<LineString, any> ? LineStyle : PaintStyle, parent?: EntityId<GroupContainerState> | string | number | null): EntityId<GeometryGroupState>;
	addOccluder<T extends Feature$1<Polygon$1 | MultiPolygon$1, any>>(feature: T, parent?: EntityId<GroupContainerState> | string | number | null): number;
	addImage(id: string, geometry: Feature$1<Point$1, ImageProperties>, style: ImageStyle, parent?: EntityId<GroupContainerState> | string | null): EntityId<ImageState> | undefined;
	/**
	 * Add a group of models from GeoJSON data. These will be instanced automatically for better performance.
	 */
	addModelGroup(id: string, geometry: FeatureCollection$1<Point$1, ModelProperties>, style: Partial<InitializeModelState>, { parent, onComplete: onAdd, }?: {
		parent?: EntityId<GroupContainerState> | string | null;
		onComplete?: () => void;
	}): EntityId<GeometryGroupState> | undefined;
	/**
	 * Add an HTML Marker at a GeoJSON coordinate.
	 */
	addMarker2D(coordinate: Position$1, contentHTML: string, options?: AddMarkerOptions, parent?: EntityId<GroupContainerState> | string | number | null): EntityId<MarkerState> | undefined;
	addText3D(id: string, geometry: Feature$1<Point$1, FloatingFloorTextProperties>, options: AddText3DOptions, parent?: EntityId<GroupContainerState> | string | null): EntityId<Text3DState>;
	/**
	 * Labels an existing 3D geometry with a text area.
	 *
	 * @param meshGeometryId - The ID of the target 3D geometry to label.
	 * @param content - The text content to display.
	 * @param options - Additional options for adding the text label, including:
	 *   - parentId: Optional ID of the parent container.
	 *   - appearance: Optional appearance settings for the text label.
	 *
	 * @returns An object containing the ID and type of the created or existing text label, or undefined if labeling failed. If geometry is already labeld, the same text id will be returned
	 *
	 * @example
	 * ```typescript
	 * const label = renderer.labelText3D('geometry123', 'Hello World', { parentId: 'parent456', appearance: { color: 'red' } });
	 * if (label) {
	 *   console.log(`Label created with ID: ${label.id}`);
	 * }
	 *
	 */
	labelText3D(meshGeometryId: string, content: string, options?: AddText3DOptions & {
		parentId?: string;
	}): EntityId<Text3DState> | undefined;
	/**
	 * Add a 2D label at a GeoJSON coordinate.
	 */
	addLabel2D(coordinate: Position$1, text: string, options?: AddLabelOptionsInternal, parent?: EntityId<GroupContainerState> | string | null): EntityId<LabelState> | undefined;
	/**
	 * Add a Path along a set of GeoJSON coordinates that can be animated.
	 */
	addPath(geometry: FeatureCollection$1<Point$1, PathProperties>, options?: AddPathOptions, parent?: EntityId<GroupContainerState> | string | null): EntityId<PathState> | undefined;
	/**
	 * Updates the watermark on the map.
	 *
	 * @param options {WatermarkUpdateOptions}
	 */
	updateWatermark(options: WatermarkUpdateOptions): void;
	/**
	 * Remove an entity from the renderer and release associated resources.
	 */
	remove(object: string | number): void;
	remove(object: EntityTypes): void;
	/**
	 * Show collision boxes for 2D entities for debugging
	 */
	showCollisionBoxes: () => void;
	/**
	 * Hide collision boxes for 2D entities for debugging
	 */
	hideCollisionBoxes: () => void;
	/**
	 * Recursively get the state for the whole scene. Can be an expensive operation.
	 */
	getScene(): GroupContainerState;
	getThreeScene(): Scene | undefined;
	getThreeCamera(): PerspectiveCamera;
	setEnvironment(update: EnvMapOptions): Promise<void>;
	getEnvironment(): EnvMapOptions;
	/**
	 * Get the current scene as a GLB file
	 */
	getCurrentSceneGLTF(options: GLTFExportOptions): Promise<Blob>;
	/**
	 * Gets the bounding area (4 corners) in lon,lat of a geometry, geomrtry group, or group container. This can be used with Camera to focus on an entity
	 */
	getBoundingArea(geometryOrGeometryId?: string | number | EntityId<EntityState>): Position$1[] | undefined;
	/**
	 * Check if the state for a given geometry or geometry id exists
	 * @param geometryOrGeometryId - The geometry or geometry id to check
	 * @returns True if the state exists, false otherwise
	 */
	hasState(geometryOrGeometryId: string | number | EntityId<EntityState>): boolean;
	/**
	 * Get the current state of the map view, or any entity that was added, regardless of whether it is visible in the scene
	 */
	getState(): MapViewState;
	getState<T extends EntityId<EntityState>>(geometryOrGeometryId: T): T extends EntityId<LabelState> ? LabelState : T extends EntityId<GeometryState> ? GeometryState : T extends EntityId<MarkerState> ? MarkerState : T extends EntityId<GeometryGroupState> ? GeometryGroupState : T extends EntityId<GroupContainerState> ? GroupContainerState : T extends EntityId<ModelState> ? ModelState : T extends EntityId<PathState> ? PathState : T extends EntityId<ShapeState> ? ShapeState : T extends EntityId<ImageState> ? ImageState : T extends EntityId<Text3DState> ? Text3DState : EntityState;
	getState(geometryOrGeometryId?: Record<string | number, any> | string | number): EntityState;
	getState<T extends EntityState>(geometryOrGeometryId: T["id"]): T extends LabelState ? LabelState : T extends GeometryState ? GeometryState : T extends MarkerState ? MarkerState : T extends GeometryGroupState ? GeometryGroupState : T extends GroupContainerState ? GroupContainerState : T extends ModelState ? ModelState : T extends PathState ? PathState : T extends ShapeState ? ShapeState : T extends ImageState ? ImageState : EntityState;
	/**
	 * Set the state of the map view or any entity that was added, regardless of whether it is visible in the scene.
	 */
	setState(object: Partial<Omit<MapViewState, "type">>): void;
	setState<T extends EntityId<LabelState>>(object: T | T["id"], state: Partial<LabelState>): void;
	setState<T extends EntityId<MarkerState>>(object: T | T["id"], state: Partial<MarkerStateUpdate>): void;
	setState<T extends EntityId<GeometryGroupState>>(object: T | T["id"], state: Partial<GeometryGroupState>): void;
	setState<T extends EntityId<GroupContainerState>>(object: T | T["id"], state: Partial<GroupContainerState>): void;
	setState<T extends EntityId<GeometryState>>(object: T | T["id"], state: Partial<GeometryState>): void;
	setState<T extends EntityId<ShapeState>>(object: T | T["id"], state: Partial<ShapeState>): void;
	setState<T extends EntityId<PathState>>(object: T | T["id"], state: PathUpdateState): void;
	setState<T extends EntityId<ModelState>>(object: T | T["id"], state: Partial<UpdateModelState>): void;
	setState<T extends EntityId<ImageState>>(object: T | T["id"], state: Partial<ImageState>): void;
	setState<T extends EntityId<Text3DState>>(object: T | T["id"], state: Partial<UpdatableText3DState>): void;
	setState<T extends EntityId<PathState>>(object: T | T["id"], state: Partial<PathState>): void;
	setState<T extends EntityState>(object: T | T["id"], state: Partial<T>): void;
	/**
	 * Project a clientX/clientY screen coordinate to a geographic coordinate
	 */
	projectScreenXYToCoordinate: (clientX: MouseEvent["clientX"], clientY: MouseEvent["clientY"], useWorldPlane?: boolean) => {
		coordinate: Position$1;
		groupContainers: GroupContainerObject3D[] | undefined;
	} | undefined;
	/**
	 * Project a geographic coordinate to a screen coordinate
	 */
	projectCoordinateToScreenXY: (coordinate: Position$1) => {
		x: number;
		y: number;
	};
	/**
	 * Convert a GeoJSON position to a 3D map position.
	 *
	 * @param position - The GeoJSON position to convert.
	 * @param vector - Optional vector to copy the result into instead of creating a new vector.
	 * @returns The converted 3D map position.
	 */
	convertTo3DMapPosition(position: Position, vector?: Vector3): Vector3;
	/**
	 * Convert latitude and longitude to a 3D map position.
	 *
	 * @param latitude - The latitude to convert.
	 * @param longitude - The longitude to convert.
	 * @param altitude - Optional altitude to include in the conversion. Defaults to 0.
	 * @param vector - Optional vector to copy the result into instead of creating a new vector.
	 * @returns The converted 3D map position.
	 */
	convertTo3DMapPosition(latitude: number, longitude: number, altitude?: number, vector?: Vector3): Vector3;
	/**
	 * @internal
	 */
	convert3DMapPositionToCoordinate: (v: Vector3) => Position$1;
	/**
	 * Sets the background color of the renderer. Only applies to "standalone mode"
	 */
	setBackgroundColor: (color: string, alpha: number) => void;
	/**
	 * Returns  the background color of the renderer. Only applies to "standalone mode"
	 */
	get backgroundColor(): string;
	/**
	 * Returns  the background alpha of the renderer. Only applies to "standalone mode"
	 */
	get backgroundAlpha(): number;
	/**
	 * internal
	 */
	getThreeRenderer(): Renderer;
	/**
	 * Returns the current scale of the map in meters per pixel.
	 */
	getMetersPerPixel: () => number;
	/**
	 * Filters out layers at a certain point on the outdoor map. This can be used to hide the outdoor building footprint underneath the 3D geometry.
	 * @param bbox The bounding box to filter layers under.
	 * @param polygons The polygons to filter layers under.
	 * @param layers The layers to filter out.
	 */
	hideOutdoorLayersIntersectingPolygons: (bbox: BBox, polygons: Feature$1<Polygon$1 | MultiPolygon$1, any>[], layers: string[]) => void;
	/**
	 * Get the center of a geometry or bounding box.
	 * @param geometryOrBoundingBox Geometry, geometry id, or bounding box to get the center of.
	 */
	getCenter(geometryOrBoundingBox: string | number | EntityId<EntityState> | Position$1[]): [
		number,
		number
	] | undefined;
	/**
	 * Checks if the given entity is within the current camera's view frustum.
	 * This method is useful for determining if an entity is visible on the screen.
	 *
	 * @param target - The entity to check. This can be an object with `id` and `type` properties,
	 *                 a string representing the entity's ID, or an entity state object.
	 * @returns - Returns `true` if the entity is within the camera's view, otherwise `false`.
	 */
	isInView(target: {
		id: EntityState["id"];
		type: EntityState["type"];
	} | string | EntityState): boolean;
	/**
	 * Return a list of Geometry2D IDs currently rendered on screen.
	 *
	 * @param options - The options to query.
	 * @param options.screenOffsets - Optional offsets to account for on the edges of the screen.
	 * @param options.fullyContains - Whether to exclude entities that intersect with the screen edges after accounting for offsets.
	 * @returns A list of IDs.
	 */
	queryGeometry2DInView(options?: {
		screenOffsets?: Partial<InsetPadding>;
		fullyContains?: boolean;
	}): string[];
	/**
	 * Perform a render of the scene. This is called internally when something changes, but can be called when adding external models
	 * The render happens in an animation frame, not matter how frequently it is called
	 * @method render
	 */
	render: () => Promise<any> | undefined;
	/**
	 * Perform a synchronous render of the scene. This bypasses the animation frame and renders immediately.
	 *
	 * Note: Only use this if you have an animation frame setup elsewhere
	 */
	renderSync: () => Promise<any>;
	/**
	 * Register a MapLibre event listener
	 */
	onMapLibreEvent(event: LiteralUnion<keyof MapEventType, string>, handler: (...args: any[]) => void): void;
	/**
	 * Remove a MapLibre event listener
	 */
	offMapLibreEvent(event: keyof MapEventType, handler: (...args: any[]) => void): void;
	/**
	 * Returns true if the renderer has been aborted.
	 */
	get aborted(): boolean;
	/**
	 * Register a handler once to be called when the renderer is aborted.
	 * The handler will be removed after it is called.
	 */
	onAbort(handler: () => void): void;
	/**
	 * @internal for testing
	 */
	getSystems(): Systems;
	/**
	 * @internal for testing
	 */
	getInternalState(): RendererState;
	/** @internal */
	getInternalTweenGroup(): TweenGroup;
	getExternalTweenGroup(): TweenGroup;
	computeMinZOffsetBetweenContainers(lowerContainer: GroupContainerObject3D, upperContainer: GroupContainerObject3D, debug?: boolean): number;
	/**
	 * Subscribe a function to an event.
	 *
	 * @param eventName An event name which, when fired, will call the provided
	 * function.
	 * @param fn A callback that gets called when the corresponding event is fired. The
	 * callback will get passed an argument with a type that's one of event payloads.
	 * @example
	 * // Subscribe to the 'click' event
	 * const handler = (event) => {
	 *  const { coordinate } = event;
	 *  const { latitude, longitude } = coordinate;
	 * 	console.log(`Map was clicked at ${latitude}, ${longitude}`);
	 * };
	 * map.on('click', handler);
	 */
	on: <EventName extends keyof MapEvent>(eventName: EventName, fn: (payload: MapEventPayload<EventName>) => void) => void;
	/**
	 * Unsubscribe a function previously subscribed with {@link on}
	 *
	 * @param eventName An event name to which the provided function was previously
	 * subscribed.
	 * @param fn A function that was previously passed to {@link on}. The function must
	 * have the same reference as the function that was subscribed.
	 * @example
	 * // Unsubscribe from the 'click' event
	 * const handler = (event) => {
	 * 	console.log('Map was clicked', event);
	 * };
	 * map.off('click', handler);
	 */
	off: <EventName extends keyof MapEvent>(eventName: EventName, fn: (payload: MapEventPayload<EventName>) => void) => void;
	/**
	 * @hidden
	 * Returns the current cursor decided by Mappedin. This is useful when integrating with other overlays to show the correct user interaction.
	 */
	getCursor: () => "grabbing" | "grab" | "pointer";
	/**
	 * Destroys instance and frees resources
	 */
	destroy: () => void;
}
type GroupContainerState = {
	readonly id: string | number;
	readonly type: "group-container";
	/**
	 * The states of the children of the group container
	 */
	readonly children: (PathState | MarkerState | LabelState | GroupContainerState | GeometryGroupState)[];
	/**
	 * Whether the group container is visible
	 */
	visible: boolean;
	/**
	 * The altitude of the group container above the ground in meters
	 */
	altitude: number;
	interactive: boolean;
	/**
	 * The opacity of the group container, which sets the opacity of all its children
	 */
	opacity: number;
	/**
	 * If true, the group container will preload geometry for its children even when invisible.
	 */
	readonly preloadGeometry: boolean;
	focusable: boolean;
};
declare class GroupContainerObject3D extends Object3D {
	childrenIds: Set<string | number>;
	children: (GroupContainerObject3D | GeometryGroupObject3D | BatchedText | Geometry2D["object3d"] | NonNullable<Geometry3D["object3d"]>)[];
	readonly type: "group-container";
	userData: {
		entityId: string | number;
		entities2D: Set<string | number>;
		dirty: boolean;
		occluderDirty: boolean;
		occluderId?: number;
		occluderFeature?: Feature$1<Polygon$1 | MultiPolygon$1, any>;
		opacity: number;
		/** The effective opacity of the entity after all parent containers have been considered. */
		computedOpacity: number;
		/**
		 * If true, the group container will preload geometry for its children even when invisible.
		 */
		preloadGeometry: boolean;
	};
	components: [
		InteractionComponent?,
		FocusableComponent?
	];
	constructor(id: string);
	addOccluderFeature(feature: Feature$1<Polygon$1 | MultiPolygon$1, any>, occluderId: number): void;
	addEntity(entityGroupOrContainer: GroupContainerObject3D | GeometryGroupObject3D | Geometry2D | Geometry3DTypes): void;
	removeEntity(entityGroupOrContainer: EntityTypes): void;
	setVisible(visible: boolean): void;
	setAltitude(altitude: number): void;
	set2DGeometryChildrenPositionDirty(): void;
	get altitude(): number;
	setOpacity(opacity: number): void;
	get opacity(): number;
}
type TStyle = {
	top?: number;
	left?: number;
	textLabelVisible?: boolean;
	pinVisibility: PINVISIBILITY;
	textAlign?: TEXTALIGN;
	cachedSymbol?: HTMLCanvasElement;
};
type LabelState = {
	readonly id: string | number;
	readonly type: "label";
	/**
	 * The position of the label in [lon, lat]
	 */
	readonly position: Position$1;
	/**
	 * The parent container of the label
	 */
	readonly parent: EntityId<GroupContainerState>;
	/**
	 * Whether the label is enabled
	 */
	enabled: boolean;
	/**
	 * Whether the label is visible IF is is enabled
	 * this can be used to have more granular control of whether the label shows up,
	 * for example, if someone implements a layer system that shows/hides,
	 */
	visible: boolean;
	/**
	 * Text content of the label
	 */
	text: string;
	/**
	 * The initial rank of the label, which can be used to reset the rank of the label to its initial value.
	 */
	initialRank: CollisionRankingTier;
	/**
	 * Options for the label
	 */
	options: Omit<AddLabelOptionsInternal, "id">;
	/**
	 * vertical offset of the model in meters off the floor
	 */
	verticalOffset: number;
};
type LabelStrategy = {
	name: LabelTextPlacementInternal;
	getBoundingBox: () => number[];
	onStrategySelected: () => void;
};
declare class LabelComponent {
	lines: number;
	id: string;
	rank: number;
	readonly type = "label";
	initialRank: number;
	contextConfigured: boolean;
	fillText: TDrawFn | undefined;
	newStyle: TStyle;
	static testId: number;
	currentOpacity: number;
	visibilityNeedsUpdate: "show" | "hide" | false;
	activePlacement: LabelTextPlacementInternal;
	text: string;
	style: TStyle;
	projection: Vector2;
	labelCacheId?: string;
	_cache: {};
	appearance: LabelAppearanceWithDefaults;
	options: AddLabelOptionsInternal;
	/**
	 * Whether the anchored parent is visible.
	 */
	visible: boolean;
	enabled: boolean;
	isOccluded: boolean;
	offscreen: boolean;
	/**
	 * Whether the label can be shown, which is decided by the collision engine
	 */
	canShow: boolean;
	activeBoundingBox: {
		x: number;
		y: number;
		w: number;
		h: number;
	};
	dimensions: {
		width: number;
		height: number;
	};
	currentStrategyIndex: number;
	totalPinSize: number;
	iconScale: number;
	get scaledPinSize(): number;
	iconPadding: number;
	get scaledIconPadding(): number;
	dirty: boolean;
	textDirty: boolean;
	pinDirty: boolean;
	/** Flag used in 2d-projection system to determine if the parent has changed */
	attachedDirty: boolean;
	collisionDirty: boolean;
	lastTextAlign: any;
	imageHash?: number;
	pinSize: number;
	iconVisible: boolean;
	dp: (v?: number) => number;
	constructor(text: string, options: AddLabelOptionsInternal, state: RendererState);
	calculatePinSize(): void;
	/**
	 * Get the bounding box when the label has no text.
	 * @param margin - The margin to apply to the bounding box.
	 */
	private getNoTextBbox;
	/**
	 * Get the bounding box for the hidden text placement.
	 * @param margin - The margin to apply to the bounding box.
	 */
	private getHiddenTextPlacementBbox;
	private getBoundingBoxForPlacement;
	private getStrategyStyleForPlacement;
	get strategies(): LabelStrategy[];
	animate: boolean;
	recomputeCurrentStrategy(scale?: number): void;
	onStrategySelected: (strategyIndex: any) => void;
	private packedMessage;
	toPackedMessage(isPanning?: boolean): PackedJsonMessage;
	destroy(): void;
}
declare class Geometry2DObject3D extends Object3D {
}
declare class Geometry2D {
	id: string | number;
	get type(): "label" | "marker";
	get parentObject3D(): GroupContainerObject3D | GeometryGroupObject3D | null;
	/** The geometry3D that this 2D entity is attached to */
	get attachedTo(): string | number | undefined;
	verticalOffset: number;
	occluderId?: number;
	object3d: Geometry2DObject3D;
	components: [
		MarkerComponent | LabelComponent,
		InteractionComponent?
	];
	disposed: boolean;
	constructor(ui: MarkerComponent | LabelComponent, position: Vector3, verticalOffset?: number);
	private worldPosition;
	get position(): Vector3;
	/**
	 * When the position of the entity changes, this should be set to true, so that systems like pan bounds can update
	 */
	get positionDirty(): boolean;
	set positionDirty(value: boolean);
	updatePosition(position: Vector3): void;
	setAltitude(z: number): void;
}
type Position$1 = [
	lon: number,
	lat: number
] | [
	lon: number,
	lat: number,
	alt: number
];
export type EnvMapOptions = "basic" | false;
type RendererCoreOptions = Partial<{
	center?: Position$1;
	zoomLevel?: number;
	pitch?: number;
	bearing?: number;
	naturalBearing?: number;
	outdoorView: {
		headers: {
			"x-mappedin-tiles-key": string;
		};
		style?: string;
		enabled: boolean;
		lowDpi?: boolean;
	};
	gl?: WebGLRenderingContext;
	map?: Map$1;
	mode?: "standalone" | "outdoors-interleaved" | "outdoors-overlay";
	antialias?: boolean;
	useStandaloneCamera?: boolean;
	onWebGLRendererError?: (error: Error) => void;
	onWebGLContextCreationError?: (event: Event) => void;
	onWebGLContextLost?: (event: Event) => void;
	onWebGLContextRestored?: (event: Event) => void;
	backgroundColor?: string;
	backgroundAlpha?: number;
	watermark?: WatermarkOptions;
	attribution?: AttributionControlOptions$1;
	imagePlacementOptions?: ImagePlacementOptions;
	/**
	 * environment map for reflections.
	 * @default 'basic'
	 */
	environment?: EnvMapOptions;
	occlusionEnabled?: boolean;
	/** Callback to intercept and modify requests for images. */
	transformImageRequest?: TransformImageRequest;
	useWorkers?: boolean;
	useCollisionWorker?: boolean;
}>;
/**
 * A color string. Color can be one of:
 * - CSS color name, e.g. `DarkGoldenRod`
 * - Hex string, e.g. `#0000FF`
 * - or RGB value, e.g. `rgb(255,0,0)`
 */
export type ColorString = keyof typeof Color.NAMES | (string & NonNullable<unknown>);
type EntityState = GeometryState | GeometryGroupState | GroupContainerState | PathState | ModelState | LabelState | MarkerState | ImageState | Text3DState | ShapeState;
type EntityId<T extends EntityState> = {
	id: T["id"];
	type: T["type"];
};
declare class EntityMesh$1<T> extends Mesh<any> {
	userData: {
		entity: T;
	};
}
type Entity2DHTMLDivElement = HTMLDivElement & {
	userData: {
		entityId: Geometry2D["id"];
	};
};
type Entity2DHTMLDivElementContainer = HTMLDivElement & {
	children: HTMLCollectionOf<HTMLElement & {
		userData: {
			entityId: Geometry2D["id"];
		};
	}>;
};
type BevelState = {
	/**
	 * Whether beveling is enabled.
	 */
	enabled: boolean;
	/**
	 * The thickness of the bevel.
	 * @default 0
	 */
	thickness: number;
	/**
	 * How far from the shape outline the bevel extends inward.
	 * @default Same as thickness
	 */
	size?: number;
	/**
	 * How far from the shape outline the bevel starts.
	 * @default 0
	 */
	offset?: number;
	/**
	 * The number of bevel layers for smoother bevels.
	 * @default 3
	 */
	segments?: number;
};
export type PaintStyle = {
	color: string;
	topColor?: string;
	height?: number;
	altitude?: number;
	opacity?: number;
	visible?: boolean;
	topTexture?: string;
	texture?: string;
	shading?: Shading;
	outline?: boolean;
	showImage?: boolean;
	flipImageToFaceCamera?: boolean;
	side?: MaterialSide;
	renderOrder?: number;
	/**
	 * Bevel configuration for extruded shapes.
	 */
	bevel?: BevelState;
};
export type Shading = {
	start?: number;
	end?: number;
	intensity?: number;
};
export type LineStyle = {
	color: string;
	topColor?: string;
	width: number;
	opacity?: number;
	height?: number;
	altitude?: number;
	visible?: boolean;
	cap?: "round" | "square" | "butt";
	join?: "round" | "bevel" | "miter";
	shading?: Shading;
	outline?: boolean;
	side?: MaterialSide;
	renderOrder?: number;
};
type ModelProperties = {
	rotation?: [
		number,
		number,
		number
	];
	scale?: [
		number,
		number,
		number
	];
	interactive?: boolean;
	id?: string | number;
	verticalOffset?: number;
};
export type InsetPadding = {
	top: number;
	left: number;
	bottom: number;
	right: number;
	/**
	 * The type of padding to use. If 'portion', the padding will be a portion of the canvas size. If 'pixel', the padding will be in pixels.
	 * @defaultValue 'pixel'
	 */
	type: "pixel" | "portion";
};
/**
 * An option for setting the inset padding of the camera.
 * @interface
 */
export type InsetPaddingOption = Omit<InsetPadding, "type"> & {
	/**
	 * The type of padding to use. If 'portion', the padding will be a portion of the canvas size. If 'pixel', the padding will be in pixels.
	 * @defaultValue 'pixel'
	 */
	type?: InsetPadding["type"];
};
type ClickPayload = {
	/**
	 * The coordinate of the interaction.
	 */
	coordinate: Position$1;
	/**
	 * An array of path IDs which the user interaction passed through. Will be empty if no paths were interacted with.
	 */
	paths: (string | number)[] | [
	];
	/**
	 * An array of marker IDs which the user interaction passed through. Will be empty if no markers were interacted with.
	 */
	markers: (string | number)[] | [
	];
	/**
	 * An array of 3D models IDs which the user interaction passed through. Will be empty if no models were interacted with.
	 */
	models: [
		string | number
	] | [
	];
	/**
	 * An array of label IDs which the user interaction passed through. Will be empty if no labels were interacted with.
	 */
	labels: (string | number)[] | [
	];
	/**
	 * An array of geometry IDs which the user interaction passed through. Will be empty if no geometry was interacted with.
	 */
	geometry: (string | number)[] | [
	];
	/**
	 * Details about the pointer event which triggered the interaction.
	 */
	pointerEvent: {
		/**
		 * The button which was clicked. 0 is the left mouse button and 2 is the right mouse button.
		 * On touch devices a tap will have a button of 0.
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
		 */
		button: number;
	};
	/**
	 * An array of group container IDs which the user interaction passed through. Will be empty if no group containers were interacted with.
	 */
	containers: (string | number)[] | [
	];
};
type HoverPayload = Omit<ClickPayload, "pointerEvent">;
type CameraPayload = {
	/**
	 * The camera's current center in [longitude, latitude].
	 */
	center: Position$1;
	/**
	 * The camera's current bearing in degrees from north.
	 */
	bearing: number;
	/**
	 * The camera's current pitch in degrees.
	 */
	pitch: number;
	/**
	 * The camera's current zoom level in mercator zoom level units
	 */
	zoomLevel: number;
	/**
	 * The camera's current elevation in meters from the ground.
	 */
	elevation: number;
};
type MapEvent = {
	/**
	 * Fired when the user hovers over an interactive entity on the map.
	 */
	hover: HoverPayload;
	/**
	 * Fired when the user clicks on an interactive entity on the map.
	 */
	click: ClickPayload;
	/**
	 * Fired when the camera moves, either by user interaction or programmatic change.
	 */
	"camera-change": CameraPayload;
	/**
	 * If outdoor view is enabled, this is fired when the renderer has loaded the outdoor view.
	 */
	"outdoor-view-loaded": undefined;
	/**
	 * If outdoor view is enabled, this is fired when the style first loads or changes.
	 */
	"outdoor-style-loaded": undefined;
	/**
	 * Fired when the user starts interacting with the map.
	 */
	"user-interaction-start": undefined;
	/**
	 * Fired when the user stops interacting with the map.
	 */
	"user-interaction-end": undefined;
	/**
	 * Fired when a geometry is in focus, meaning it occupies the area closest to the center of the screen. Is an array of geometry IDs sorted by most likely to be in focus.
	 * Geometries can be added to the focus listener via `mapView.setState(.., { focusable: true })`.
	 */
	"geometry-in-focus": string[];
	/**
	 * Fired before the scene is rendered. Use this to modify the scene before it is rendered.
	 */
	"pre-render": undefined;
	/**
	 * Fired when the synchronous tasks of the scene render are complete.
	 */
	"post-render": undefined;
	/**
	 * Fired when a render error occurs.
	 */
	"render-error": {
		error: Error;
	};
	resize: undefined;
	"pan-bounds-change": PanBounds;
};
type MapEventPayload<EventName extends keyof MapEvent> = MapEvent[EventName] extends {
	data: null;
} ? MapEvent[EventName]["data"] : MapEvent[EventName];
type All3DTypes = Geometry3DTypes | GeometryGroupObject3D | GroupContainerObject3D;
type RendererState = {
	geometry3DMap: Map<string | number, All3DTypes>;
	geometry2DMap: Map<string | number, Geometry2D>;
	geometry2DIdsInScene: Set<Geometry2D["id"]>;
	geometry3DIdsInScene: Set<All3DTypes["id"]>;
	/**
	 * IDs of geometry groups that need to be loaded, including preloaded geometry groups that are not in the scene yet
	 */
	geometryGroupIdsToLoad: Set<GeometryGroupObject3D["userData"]["entityId"]>;
	entityScene: GroupContainerObject3D;
	hoverColor: string;
	text3dHoverColor: string;
	center?: Position$1;
	insetsPadding: InsetPadding;
	shouldMeasureCanvas: boolean;
	/**
	 * Current clamped pixel ratio of the renderer, based on maplibre's clamping logic (when in interleaved mode)
	 */
	pixelRatio: number;
	canvasWidth: number;
	canvasHeight: number;
	/** Group for all tweens that are created internally by the SDK */
	internalTweenGroup: TweenGroup;
	/** Group for all tweens that are created externally, such as from animateState */
	externalTweenGroup: TweenGroup;
	cameraObject: Camera;
	naturalBearing: number;
	containerOffset: [
		number,
		number
	];
	useStandaloneCamera: boolean;
};
type EntityTypes = Geometry3DTypes | Geometry2D | GeometryGroupObject3D | GroupContainerObject3D;
type TransformImageRequest = (url: string) => Promise<{
	url: string;
}>;
type ImagePlacementMode = "default" | "none" | "fit-nearest-90" | "fit-initial-bearing";
type ImagePlacementOptions = {
	/**
	 * The mode to use for auto image placement. See {@link ImagePlacementMode} for more information.
	 * @defaultValue 'default'
	 */
	mode?: ImagePlacementMode;
	/**
	 * Scale factor applied to the resulting rectangle dimensions.
	 * Values less than 1 create a safety margin inside the polygon.
	 * @defaultValue 0.9
	 */
	scaleFactor?: number;
	/**
	 * Controls the balance between optimizing for rectangle area vs. proximity to center.
	 * Higher values prioritize center alignment over size.
	 * @defaultValue 0.5
	 */
	centerPriority?: number;
	/**
	 * Resolution of the grid used for finding the rectangle.
	 * Higher values provide more precise results but require more computation.
	 * @defaultValue 100
	 */
	resolution?: number;
	/**
	 * Threshold ratio for determining when to fall back to the original rectangle.
	 * If the calculated rectangle is smaller than this ratio of the original,
	 * the original rectangle will be returned instead.
	 * @defaultValue 0.5
	 */
	minimumSizeRatio?: number;
};
declare const collisionRankingTierSchema: z.ZodUnion<readonly [
	z.ZodEnum<{
		low: "low";
		medium: "medium";
		high: "high";
		"always-visible": "always-visible";
	}>,
	z.ZodNumber
]>;
type CollisionRankingTier = z.infer<typeof collisionRankingTierSchema>;
type MarkerState = {
	readonly id: string | number;
	readonly type: "marker";
	/**
	 * The parent container of the marker
	 */
	readonly parent: EntityId<GroupContainerState> | string | number;
	/**
	 * The position of the marker in [lon, lat]
	 */
	readonly position: Position$1;
	/**
	 * Whether the marker is enabled
	 */
	enabled: boolean;
	/**
	 * Whether the marker is visible IF is is enabled
	 * this can be used to have more granular control of whether the label shows up,
	 * for example, if someone implements a layer system that shows/hides
	 */
	visible: boolean;
	/**
	 * HTML content of the marker as text
	 */
	contentHTML?: string;
	/**
	 * Pointer to the HTML element of the marker in the DOM tree
	 */
	element: HTMLElement;
	/**
	 * The initial rank of the marker, which can be used to reset the rank of the marker to its initial value.
	 */
	initialRank: CollisionRankingTier | number;
	options: Omit<AddMarkerOptions, "id"> & {
		lowPriorityPin: LowPriorityPinConfig;
	};
	/**
	 * Placement for the marker. This will determine the alignment of the marker relative to the placement. A list will place the marker in the first empty placement.
	 */
	placement: MarkerPlacement | MarkerPlacement[];
	/**
	 * Dynamic resize of the marker. If set to true, the marker will resize based on the content.
	 */
	dynamicResize: boolean;
};
type MarkerStateUpdate = Omit<MarkerState, "type" | "parent" | "id" | "options"> & {
	options?: Partial<Omit<AddMarkerOptions, "id" | "lowPriorityPin">>;
};
type LowPriorityPinConfig = {
	/**
	 * Size of the low priority pin in pixels.
	 * @default 2
	 */
	size: number;
	/**
	 * Color of the low priority pin.
	 * @default '#666'
	 */
	color: string;
};
type AddMarkerOptions = {
	/**
	 * Optional. Determines the collision ranking tier of the marker, which influences its visibility in relation to other colliders.
	 * For the possible values ('low', 'medium', 'high', 'always-visible') and their impact on label visibility.
	 *
	 * See {@link CollisionRankingTier}.
	 */
	rank?: CollisionRankingTier;
	/**
	 * Whether the Label should be clickable.
	 * If `true` the marker will be registered in the SDK interaction events.
	 * If `'pointer-events-auto'` the marker will receive browser pointer events.
	 * @default false
	 */
	interactive?: boolean | "pointer-events-auto";
	/**
	 * @internal
	 */
	id?: string;
	/**
	 * Placement for the marker. This will determine the alignment of the marker relative to the placement. A list will place the marker in the first empty placement.
	 */
	placement?: MarkerPlacement | MarkerPlacement[];
	/**
	 * Dynamic resize of the marker. If set to true, the marker will resize based on the content.
	 */
	dynamicResize?: boolean;
	/**
	 * @internal
	 */
	occluderId?: number;
	/**
	 * The z-index of the marker. Can be used used in conjunction with rank: 'always-visible' to make certain markers appear over others
	 */
	zIndex?: number;
	/**
	 * The vertical position of the marker relative to the floor.
	 */
	verticalOffset?: number;
	/**
	 * Whether the marker is enabled.
	 * @default true
	 */
	enabled?: boolean;
	/**
	 * The entity to attach the marker to.
	 */
	attachTo?: EntityId<GeometryState> | string | number | null;
	/**
	 * Configuration for the low priority pin fallback strategy.
	 * When enabled, shows a smaller pin version of the marker when all anchor positions have collisions.
	 * @default { size: 2, color: '#666' }
	 */
	lowPriorityPin?: Partial<LowPriorityPinConfig>;
};
type MarkerStrategy = {
	name: MarkerPlacement;
	getBoundingBox: () => number[];
};
declare class MarkerComponent {
	id: string | number;
	readonly type = "marker";
	static testId: number;
	rank: number;
	initialRank: number;
	activePlacement: MarkerPlacement;
	pointerEvents: "auto" | "none";
	options: Required<Omit<AddMarkerOptions, "zIndex" | "attachTo" | "enabled"> & {
		lowPriorityPin: Required<LowPriorityPinConfig>;
	}> & {
		zIndex?: number;
	};
	projection: Vector2;
	enabled: boolean;
	/**
	 * Whether the marker can be shown, which is decided by the collision engine
	 */
	canShow: boolean;
	visible: boolean;
	isOccluded: boolean;
	offscreen: boolean;
	strategyIndex: number;
	activeBoundingBox: {
		x: number;
		y: number;
		w: number;
		h: number;
	};
	private dimensions;
	markerContainer: Entity2DHTMLDivElement;
	containerEl: HTMLElement;
	contentEl: HTMLElement | null;
	contentHtml: string;
	style: {
		top: string;
		left: string;
	};
	dirty: boolean;
	/** Flag used in 2d-projection system to determine if the parent has changed */
	attachedDirty: boolean;
	collisionDirty: boolean;
	visibilityNeedsUpdate: "show" | "hide" | false;
	constructor(contentHtml: string, options?: AddMarkerOptions);
	updateDimensions(width?: number, height?: number): void;
	animation: Animation | null;
	currentStrategyIndex: number;
	onStrategySelected: (strategyIndex: number, force?: boolean) => void;
	get strategies(): MarkerStrategy[];
	private packedMessage;
	toPackedMessage(isPanning?: boolean): PackedJsonMessage;
	/**
	 * Get the index of the low priority pin strategy
	 */
	get lowPriorityPinStrategyIndex(): number;
	destroy(): void;
}
type NodeNeighbor = {
	id: string;
	weight: number;
};
type NodeProperties = {
	/**
	 * Unique identifier for the node.
	 */
	id: string;
	/**
	 * An array of neighboring nodes with associated weights.
	 */
	neighbors: NodeNeighbor[];
	/**
	 * Additional property specific to the navigator based on the 'groupBy' option.
	 * */
	[name: string]: any;
};
type NodeCollection$1 = FeatureCollection$1<Point$1, NodeProperties>;
type NodeFeature = Feature$1<Point$1, NodeProperties>;
declare class Edge {
	/** The originating node of the edge */
	origin: NodeFeature;
	/** The destination node of the edge */
	destination: NodeFeature;
	/** The distance between the origin and the destination nodes */
	distance: number;
	/** The angle of the edge with respect to some reference, in degrees */
	angle: number;
	/** A composite weight of the edge, combining distance and a custom path weight */
	weight: number;
	/**
	 * Constructs a new Edge instance.
	 * @param {NodeFeature} origin - The originating node of the edge.
	 * @param {NodeFeature} destination - The destination node of the edge.
	 * @param {number} [distance=0] - The physical distance between the origin and destination.
	 * @param {number} [angle=0] - The angle of the edge in degrees.
	 * @param {number} [pathWeight=0] - An additional weight factor for the path.
	 */
	constructor({ origin, destination, distance, angle, pathWeight, multiplicativeDistanceWeightScaling, }: {
		origin: NodeFeature;
		destination: NodeFeature;
		distance?: number;
		angle?: number;
		pathWeight?: number;
		multiplicativeDistanceWeightScaling?: boolean;
	});
}
declare class NavigationGraph {
	#private;
	readonly edges: {
		[propName: string]: Edge[];
	};
	readonly nodesById: {
		[propName: string]: NodeFeature;
	};
	readonly nodesByGroup: Map<string, NodeFeature[]>;
	constructor({ nodes, groupBy, multiplicativeDistanceWeightScaling, }: {
		nodes: NodeCollection$1;
		groupBy: string;
		multiplicativeDistanceWeightScaling?: boolean;
	});
	/**
	 * Calculates the shortest Euclidean distance from the origin node to any of the destination nodes.
	 *
	 * @param origin - The origin node.
	 * @param destinations - An array of destination nodes.
	 * @returns The shortest Euclidean distance.
	 */
	getShortestEuclideanDistance(origin: NodeFeature, destinations: NodeFeature[]): number;
	hasLineOfSight: (origin: Position, destination: Position, edges?: Position[][], bufferRadius?: number) => boolean;
	/**
	 * Performs a Dijkstra search to find nodes within a given travel distance that satisfy a goal function, sorted by distance.
	 *
	 * @param originId - Origin node ID.
	 * @param maxTravelDistance - The maximum travel distance.
	 * @param includedNodeIds - Array of node IDs to include in the search.
	 * @param obstructionEdges - Array of obstruction edges for line of sight calculations.
	 * @param useLineOfSight - Whether to use line of sight checking.
	 * @returns An Array of nodes within the travel distance that satisfy the goal function.
	 * - feature: The node feature.
	 * - distance: The distance to the node.
	 * - edges: The edges to the node.
	 */
	dijkstraFindWithinTravelDistance(originId: string, maxTravelDistance: number, includedNodeIds: string[], obstructionEdges: Position[][], useLineOfSight: boolean, limitNumberOfResults: number): {
		feature: NodeFeature;
		distance: number;
	}[];
	/**
	 * Performs A* pathfinding from specified origins to destinations, considering optional constraints like accessibility.
	 *
	 * @param {string[]} originIds - Array of origin node IDs.
	 * @param {string[]} destinationNodeIds - Array of destination node IDs.
	 * @param {Set<string>} [disabledConnectionNodeIds] - Optional set of connection node IDs that are disabled (ie. act as regular nodes).
	 * @param {Set<string>} [disabledNodeIds] - Optional set of node IDs which are ignored during pathfinding.
	 * @returns {Edge[]} An array of edges representing the shortest path, or an empty array if no path is found.
	 */
	aStar({ originIds, destinationNodeIds, disabledConnectionNodeIds, zones, overrideEdgeWeights, disabledNodeIds, }: {
		originIds: string[];
		destinationNodeIds: string[];
		zones: DirectionsZone[];
		disabledConnectionNodeIds?: Set<string>;
		overrideEdgeWeights?: Map<Edge, number>;
		disabledNodeIds?: Set<string>;
	}): Edge[];
}
type DirectionProperties = {
	/**
	 * Unique identifier for the direction.
	 */
	id: string;
	/**
	 * An angle between this point and the destination, in radians.
	 */
	angle?: number;
	/**
	 * Distance to the next point, in meters.
	 */
	distance?: number;
	/**
	 * Group id which the direction belongs to (e.g. floor, building, etc).
	 * It's based on the groupBy property of the navigator.
	 */
	groupBy?: string;
	destination?: string;
	edges: Edge[];
};
type DirectionFeature = Feature$1<Point$1, DirectionProperties>;
type DirectionsCollection = FeatureCollection$1<Point$1, DirectionProperties>;
type SimplifyDirectionsOptions = {
	/**
	 * Enable or disable simplifying.
	 */
	enabled: boolean;
	/**
	 * The radius of the buffer around the path to consider when simplifying, in meters.
	 * @default 0.7
	 */
	bufferRadius?: number;
};
type DirectionsZone = {
	geometry: Feature$1<MultiPolygon$1 | Polygon$1>;
	/**
	 * The additional cost for navigation through the zone.
	 */
	cost: number;
	/**
	 *
	 *  Additional property specific to the navigator based on the 'groupBy' option.
	 */
	[index: string]: any;
};
declare class Navigator$1 {
	private groupBy;
	graph: NavigationGraph;
	private geometryEdgesByMapId;
	private flagDeclarations;
	private disabledNodeIds;
	/**
	 * Constructs a Navigator instance to manage pathfinding with optional obstructions and grouping features.
	 *
	 * @param {NodeCollection} nodes - Collection of nodes for the navigation graph.
	 * @param {ObstructionCollection} [obstructions] - Optional collection of obstructions that could block paths.
	 * @param {SpaceCollection} [spaces] - Optional collection of spaces that could block paths.
	 * @param {string} [groupBy] - Optional property name to group nodes and paths for differentiated processing.
	 */
	constructor({ nodes, geojsonCollection, groupBy, multiplicativeDistanceWeightScaling, flagDeclarations, }: {
		nodes: NodeCollection$1;
		geojsonCollection?: ObstructionCollection | SpaceCollection;
		groupBy?: string;
		multiplicativeDistanceWeightScaling?: boolean;
		flagDeclarations?: NavigationFlagDeclarations;
	});
	private getDisabledNodeIds;
	/**
	 * Calculates and returns a set of directions from origin nodes to destination nodes, including detailed properties.
	 *
	 * @param {DirectionsZone[]} zones - special zones for navigation operations.
	 * @param {string[]} originIds - IDs of origin nodes.
	 * @param {string[]} destinationNodeIds - IDs of destination nodes.
	 * @param {string[]} [disabledConnectionNodeIds] - IDs of connection nodes that are disabled (ie. act as regular nodes).
	 * @param {SimplifyDirectionsOptions} [simplify] - Options to simplify the pathfinding result.
	 * @returns {DirectionsCollection} A collection of directional features representing the path.
	 */
	getDirections({ zones: directionsZones, originIds, destinationNodeIds, disabledConnectionNodeIds, simplify, multiplicativeDistanceWeightScaling, overrideEdgeWeights, }: {
		originIds: string[];
		destinationNodeIds: string[];
		zones?: DirectionsZone[];
		disabledConnectionNodeIds?: string[];
		simplify?: SimplifyDirectionsOptions;
		multiplicativeDistanceWeightScaling?: boolean;
		overrideEdgeWeights?: Map<Edge, number>;
	}): DirectionsCollection;
	/**
	 * Generates a path from a series of edges, constructing a feature collection of directional steps.
	 *
	 * @param {Edge[]} steps - An array of edges representing the path.
	 * @returns {DirectionsCollection} A collection of directional features.
	 */
	private generatePath;
	/**
	 * Simplifies a sequence of steps by reducing unnecessary nodes using a buffer radius to check for obstructions.
	 *
	 * @param {Edge[]} steps - The steps to simplify.
	 * @param {number} bufferRadius - The buffer radius to use
	 * for simplification.
	 * @returns {Edge[]} An array of simplified edges representing a more direct path.
	 */
	private simplifyAllSteps;
	/**
	 * Finds the nearest nodes on the graph within a given travel distance.
	 *
	 * @param originId - The ID of the origin node.
	 * @param maxDistance - The maximum distance to search.
	 * @param floorId - The ID of the floor.
	 * @param includedNodeIds - The IDs of the nodes to include.
	 * @param useLineOfSight - Whether to use line of sight.
	 * @returns An array of nodes within the travel distance that satisfy the goal function.
	 */
	findNearestNodesOnGraph: (originId: string, maxDistance: number, floorId: string, includedNodeIds: string[], useLineOfSight?: boolean, limitNumberOfResults?: number) => {
		feature: NodeFeature;
		distance: number;
	}[];
	/**
	 * Checks if there is a line of sight between two points on the map.
	 *
	 * @param origin - The origin point.
	 * @param destination - The destination point.
	 * @param floorId - The ID of the floor.
	 * @param bufferRadius - The buffer radius to use when checking for line of sight.
	 * @returns True if there is a line of sight, false otherwise.
	 */
	hasLineOfSight: (origin: [
		number,
		number
	], destination: [
		number,
		number
	], floorId: string, bufferRadius?: number) => boolean;
	/**
	 * Simplifies a section of steps by checking direct lines of sight between steps and eliminating intermediate nodes if unobstructed.
	 *
	 * @param {Edge[]} steps - The steps to potentially simplify.
	 * @param {[number, number][][]} geometryEdges - The geometrical edges of the map used to check for line of sight.
	 * @param {number} bufferRadius - The buffer radius to use when simplifying.
	 * @returns {Edge[]} An array of simplified edges.
	 */
	private simplifySteps;
	/**
	 * Calculates the approximate distance between two geographic coordinates on Earth's surface.
	 *
	 * This function uses the equirectangular approximation method to compute the distance, which simplifies
	 * the math and speeds up calculations, but is less accurate over long distances compared to other methods
	 * like the haversine formula.
	 *
	 * @param {Position} point1 - The first point's longitude and latitude as [longitude, latitude].
	 * @param {Position} point2 - The second point's longitude and latitude as [longitude, latitude].
	 * @return
	 * @return {number} The approximate distance between the two points in meters.
	 */
	getDistance: (point1: Position, point2: Position) => number;
	/**
	 * Calculates the angle between two geographic coordinates.
	 *
	 * @param {Position} point1 - The first point's longitude and latitude as [longitude, latitude].
	 * @param {Position} point2 - The second point's longitude and latitude as [longitude, latitude].
	 * @hidden
	 *
	 * @return {number} The angle in radians, calculated clockwise from the north between the two points specified.
	 */
	getAngle: (point1: Position, point2: Position) => number;
}
export declare function enableTestMode(): void;
/**
 * Class representing a label on the {@link MapView}.
 *
 * Labels contain text and an image that are anchored to a specific point on the map. They automatically rotate and show and hide based on priority and zoom level.
 * Use them to inform users about location names, points of interest and more!
 *
 * Effective use of labels allows an app to convey additional information to the user.
 * For example labels can be used to show room names, important points of interest, main entrances or any other piece of contextual information that is useful to the user.
 *
 * Refer to the [Labels Guide](https://developer.mappedin.com/web-sdk/labels) for more information and interactive examples.
 */
export declare class Label implements IFocusable {
	/**
	 * The label's id
	 */
	readonly id: string;
	/**
	 * The label's text
	 */
	readonly text: string;
	/**
	 * The target object where the label is anchored.
	 */
	readonly target: IAnchorable;
	/**
	 * @internal
	 */
	static readonly __type = "label";
	/**
	 * @internal
	 */
	readonly __type = "label";
	/**
	 * Checks if the provided instance is of type Label.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a Label, false otherwise.
	 */
	static is(instance: object): instance is Label;
	/** @internal */
	get focusTarget(): Coordinate;
	/**
	 * @internal
	 */
	constructor(id: string, text: string, target: IAnchorable);
}
/**
 * Mappedin JS allows adding and removing Markers on a map using the {@link Markers} class. Markers are elements containing HTML that Mappedin JS anchors to a {@link Door}, {@link Space}, {@link Coordinate} or {@link Node}.
 * They are automatically rotated and repositioned when the camera moves.
 *
 * Refer to the [Markers Guide](https://developer.mappedin.com/web-sdk/markers) for more information and interactive examples.
 */
export declare class Marker implements IFocusable {
	#private;
	/**
	 * The marker's id
	 */
	id: string;
	/**
	 * @internal
	 */
	static readonly __type = "marker";
	get target(): IAnchorable;
	get coordinate(): Coordinate;
	toJSON(): {
		id: string;
		__type: string;
		target: IAnchorable;
		coordinate: Coordinate;
	};
	/**
	 * @internal
	 */
	readonly __type = "marker";
	/**
	 * The HTML element that represents the marker.
	 */
	readonly contentEl: HTMLElement;
	/**
	 * Checks if the provided instance is of type Marker"
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a Marker, false otherwise.
	 */
	static is(instance: object): instance is Marker;
	/**
	 * @internal
	 */
	constructor(id: string, contentEl: HTMLElement, target: IAnchorable);
	/** @internal */
	get focusTarget(): Coordinate;
	/**
	 * @internal
	 */
	updateTarget(target: IAnchorable): void;
}
/**
 * Class representing an Image on the {@link MapView}.
 */
export declare class Image3DView {
	#private;
	/**
	 * The image's target
	 */
	readonly target: IAnchorable;
	/**
	 * @internal
	 */
	static readonly __type = "image-3d";
	/**
	 * @internal
	 */
	readonly __type = "image-3d";
	/**
	 * Checks if the provided instance is of type Image"
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a Image, false otherwise.
	 */
	static is(instance: object): instance is Image3DView;
	/**
	 * @internal
	 */
	constructor(id: string, url: string, target: IAnchorable);
	/**
	 * The image's id
	 */
	get id(): string;
	/**
	 * The image's url
	 */
	get url(): string;
}
/**
 * Class representing a 3D model on the {@link MapView}.
 *
 * Adding 3D models to a map can be a great way to represent landmarks to help users find key locations. They could also be used to show the location of assets or represent furniture to provide a rich indoor layout.

 * Mappedin JS supports models in Graphics Library Transmission Format (GLTF) and GL Transmission Format Binary (GLB) format. Models with nested meshes are not supported and should not be used.
 *
 * 3D Models can be added to a {@link Coordinate}, {@link Door} or {@link Space}.
 * When adding the same model to multiple locations at the same time always use an array instead of calling the add method multiple times.
 * This allows the SDK to re-use the same instance of the model to reduce RAM usage and rendering time, resulting in better performance.
 *
 * Models are added using {@link Models.add}.
 *
 * Refer to the [3D Models Guide](https://developer.mappedin.com/web-sdk/3d-models) for more information and interactive examples.
 */
export declare class Model {
	#private;
	/**
	 * The model's id
	 */
	id: string;
	/**
	 * The group's id
	 */
	groupId: string;
	/**
	 * @internal
	 */
	static readonly __type = "model";
	/**
	 * @internal
	 */
	readonly __type = "model";
	get target(): IAnchorable;
	/**
	 * Checks if the provided instance is of type Model
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a Marker, false otherwise.
	 */
	static is(instance: object): instance is Model;
	/**
	 * @internal
	 */
	constructor(id: string, groupId: string, target: IAnchorable);
	/**
	 * @internal
	 */
	updateTarget(target: IAnchorable): void;
	toJSON(): {
		id: string;
		__type: string;
		groupId: string;
		target: IAnchorable;
	};
}
/**
 * @experimental
 *
 * A segment of a complete path. This can be a continuous portion of the path on a single floor, or
 * the transition of a path between two floors, or a transition between indoors and outdoors.
 */
export declare class PathSegment implements IFocusable {
	#private;
	readonly id: string;
	readonly coordinates: Coordinate[];
	/**
	 * @internal
	 */
	static readonly __type = "path-segment";
	/**
	 * @internal
	 */
	readonly __type = "path-segment";
	/**
	 * Checks if the provided instance is a PathSegment.
	 */
	static is(instance: object): instance is PathSegment;
	constructor(id: string, coordinates: Coordinate[]);
	/**
	 * Whether the path segment is a connection segment between two floors.
	 */
	get isConnectionSegment(): boolean;
	/**
	 * The distance of the path segment in meters.
	 */
	get distance(): number;
	/** @internal */
	get focusTarget(): Coordinate[];
}
/**
 * Class representing a path on the {@link MapView}.
 *
 * Paths are used to indicate a route on the map and can be added and removed using {@link Paths.add} and {@link Paths.remove}.
 */
export declare class Path implements IFocusable {
	#private;
	/**
	 * The path's id
	 */
	id: string;
	/**
	 * The promise that resolves when the current path animation is complete.
	 */
	animation: Promise<void>;
	/**
	 * The coordinates of the path.
	 */
	coordinates: Coordinate[];
	/**
	 * @experimental
	 *
	 * The segments of the path.
	 */
	segments: PathSegment[];
	/**
	 * @internal
	 */
	static readonly __type = "path";
	/**
	 * @internal
	 */
	readonly __type = "path";
	/**
	 * Checks if the provided instance is a Path.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a Path, false otherwise.
	 */
	static is(instance: object): instance is Path;
	/** @internal */
	get focusTarget(): Coordinate[];
	/**
	 * @internal
	 */
	constructor(id: string, drawAnimation: Promise<void>, coordinates: Coordinate[], segments: {
		id: string | number;
		coordinates: Coordinate[];
	}[]);
	/**
	 * The distance of the path in meters.
	 */
	get distance(): number;
	toJSON(): {
		__type: string;
		id: string;
		coordinates: Coordinate[];
		segments: PathSegment[];
	};
}
type TCreateMarker = boolean | ((instruction: TDirectionInstruction) => Marker);
/**
 * Options for navigation.
 */
export type TNavigationOptions = {
	/**
	 * Controls whether the map should be set to the floor of the connection point when a connection point is clicked.
	 * @default true
	 */
	setMapOnConnectionClick?: boolean;
	/**
	 * Controls whether the map should be set to the floor of the departure point when the path is drawn.
	 * @default true
	 */
	setMapToDeparture?: boolean;
	/**
	 * Controls whether markers are created for the departure, destination, and connection points.
	 */
	createMarkers?: {
		/**
		 * Controls whether a marker is created for the departure point and allows a custom marker to be created.
		 * @default true
		 */
		departure?: TCreateMarker;
		/**
		 * Controls whether a marker is created for the destination point and allows a custom marker to be created.
		 * @default true
		 */
		destination?: TCreateMarker;
		/**
		 * Controls whether markers are created for connection points and allows a custom marker to be created.
		 * @default true
		 */
		connection?: TCreateMarker;
	};
	/**
	 * Path Options for the non-current path in multi-destination mode.
	 */
	inactivePathOptions?: Partial<TAddPathOptions>;
	/**
	 * Controls whether the path drawing is animated across floors.
	 * @default true
	 */
	animatePathDrawing?: boolean;
	/**
	 * Options for the path.
	 */
	pathOptions?: Partial<TAddPathOptions>;
	/**
	 * Options for the markers at the departure and destination.
	 */
	markerOptions?: {
		/**
		 * The color of the departure marker.
		 * @default '#1890FF'
		 */
		departureColor?: string;
		/**
		 * The color of the destination marker.
		 * @default '#722ED1'
		 */
		destinationColor?: string;
	};
};
export type NavigationState = {
	isMultiFloor: boolean;
	floorStacks: FloorStack[];
	floors: Floor[];
	activeDirections?: Directions;
	activePath?: Path;
	paths: Path[];
};
type TNavigationEvents = {
	/**
	 * Emitted when the navigation state changes.
	 */
	"navigation-state-change": NavigationState;
	/**
	 * Emitted when a connection point is clicked.
	 */
	"navigation-connection-click": {
		fromFloor?: Floor;
		toFloor: Floor;
		instruction: TDirectionInstruction;
	};
	/**
	 * Emitted when the active path changes.
	 */
	"navigation-active-path-change": {
		directions: Directions;
		path: Path;
	};
};
/**
 * When a user needs to get from point A to point B, drawing a path on the map helps them to navigate to their destination. It can help them to visualize the route they'll need to take, like a good treasure map.

 * Navigation is a helper class to display wayfinding easily on the map. Functionality of Navigation could be replicated by drawing the paths using {@link Paths} and adding well designed tooltips at connection points.
 *
 * This class is accessed using {@link MapView.Navigation}.
 *
 * {@link Navigation.draw} allows for easily drawing multiple components that make up a wayfinding illustration. It shows a human figure to mark the start point, a path with animated directional arrows, pulses in the direction of travel and a pin to mark the destination. Each of these components can be customized to match an app's style.
 *
 * Refer to the [Drawing Navigation](https://developer.mappedin.com/web-sdk/wayfinding#drawing-navigation) in the Wayfinding Guide for more information and interactive examples.
 */
export declare class Navigation {
	#private;
	/**
	 * Returns true if the navigation is for a multi-floor path.
	 */
	get isMultiFloor(): boolean;
	/**
	 * @internal
	 */
	constructor(geoJSONApi: GeoJsonApi);
	/**
	 * @internal
	 */
	getPathById(id: string): Path | undefined;
	/**
	 * @internal
	 */
	getMarkerById(id: string): {
		instruction: TDirectionInstruction;
		marker: Marker;
	} | undefined;
	/**
	 * @internal
	 */
	get paths(): Path[];
	/**
	 * The currently active directions.
	 */
	get activeDirections(): Directions | undefined;
	/**
	 * The currently active path.
	 */
	get activePath(): Path | undefined;
	/**
	 * The current list of floor stacks along the navigation paths.
	 */
	get floorStacks(): FloorStack[];
	/**
	 * The current list of floors along the navigation paths.
	 */
	get floors(): Floor[];
	/**
	 * Sets the active path by index.
	 */
	setActivePathByIndex(target: number): void;
	/**
	 * Sets the active path.
	 */
	setActivePath(target: Path): void;
	/**
	 * Sets the active path by directions.
	 */
	setActivePathByDirections(target: Directions): void;
	clearHighlightedPathSection(): void;
	/**
	 * Highlights path section between two coordinates. This can be used to highlight any section of the path or indicated the currently traveled path.
	 */
	highlightPathSection(from: Coordinate, to: Coordinate, options?: TPathSectionHighlightOptions): {
		animation: Promise<unknown>;
	} | undefined;
	/**
	 * @internal
	 */
	drawSync(directions: Directions | Directions[], options?: TNavigationOptions): void;
	/**
	 * Draws the specified directions on the map.
	 * @param directions The directions to be drawn.
	 * @param options Optional additional options for the navigation.
	 */
	draw(directions: Directions | Directions[], options?: TNavigationOptions): Promise<void>;
	/**
	 * Clears any drawn navigation paths or directions from the map.
	 */
	clear(): void;
}
type StyleCollectionWithId = {
	[groupId: string]: WithId<PolygonStyle> | WithId<LineStringStyle> | WithId<PointStyle> | undefined;
};
type AggregatedStyleMap = {
	[id: string]: StyleCollectionWithId[keyof StyleCollectionWithId];
};
type WithId<T> = T & {
	id?: string;
};
declare class Layer {
	containerId: string;
	layers: Map<string, string>;
	renderer: Core;
	constructor(renderer: Core, containerId: string, layers?: Map<any, any>);
	get visible(): boolean;
	setVisible(visible: boolean): void;
}
declare class FloorObject implements MVFFloor {
	#private;
	id: string;
	name?: string;
	elevation: number;
	maxHeight?: number;
	containerId: string;
	externalId: string;
	metadata?: Partial<Record<string, unknown>> | undefined;
	shortName?: string | undefined;
	subtitle?: string | undefined;
	occluderId?: number;
	private loaded;
	private styleMap;
	private obstructions?;
	private entrances?;
	private spaces?;
	private floorImages?;
	private floorText?;
	private areas?;
	private renderer;
	private mapObject;
	private options;
	layers: Map<string, Layer>;
	footprint?: Feature<Polygon | MultiPolygon | null, MVFFloor>;
	floorStackId: string;
	private multiFloorView?;
	private mapDataInternal?;
	/** Map of styleId to array of facadeIds for styling */
	facadesByStyleId: Map<string, string[]>;
	get geoJSONBoundingBox(): BBox | undefined;
	constructor(parentId: string, floor: MVFFloor, mapObject: GeojsonApiMapObject, multiFloorView: Required<TShow3DMapOptions["multiFloorView"]>, options: TShow3DMapOptions, mvf?: ParsedMVF, styleMap?: AggregatedStyleMap, mapDataInternal?: MapDataInternal);
	load: () => this;
	/**
	 * Add an occluder to the floor if it has a footprint.
	 */
	addOccluder(): void;
	/**
	 * Whether the floor contains facade geometry.
	 */
	get hasFacadeGeometry(): boolean;
	get visible(): boolean;
	setVisible(visible: boolean): void;
}
declare class FloorStackObject implements Omit<MVFFloorStack, "maps" | "floors" | "defaultFloor" | "footprint"> {
	#private;
	id: MVFFloorStack["id"];
	externalId: MVFFloorStack["externalId"];
	name: MVFFloorStack["name"];
	type: MVFFloorStack["type"];
	floorIds: FloorId[];
	defaultFloorId?: MVFFloorStack["defaultFloor"];
	/** Sorted floor objects by elevation */
	floorObjects: FloorObject[];
	floorObjectsByElevation: Map<number, FloorObject>;
	metadata?: MVFFloorStack["metadata"];
	containerId: string;
	facade?: MVFFacade;
	private renderer;
	constructor(floorStack: MVFFloorStack, parentId: string, renderer: Core, facade?: MVFFacade);
	get defaultFloor(): FloorObject;
	/**
	 * Whether the floorstack is an outdoor stack.
	 * This may not be accurate if the type property is incorrect or if the building contains another facade.
	 *
	 * A floor stack being outdoors is determined by the following:
	 * - The type is 'outdoor'
	 * - It does not have a facade
	 * - One of the floors contains facades
	 */
	get isOutdoors(): boolean;
	addFloor(floor: FloorObject): void;
	loadAllFloors(): void;
}
declare class GeojsonApiMapObject extends PubSub<{
	"floor-change": {
		reason?: TFloorChangeReason;
		floorId: string;
		previousFloorId: string;
	};
	"floor-change-start": {
		reason?: TFloorChangeReason;
		floorId: string;
		previousFloorId: string;
	};
}> {
	#private;
	floorStacksById: Map<string, FloorStackObject>;
	floorsById: Map<string, FloorObject>;
	startingFloorId: string;
	currentFloorId: string;
	currentFloorStackId: string;
	outdoorFloorStacks: Set<string>;
	id: string;
	renderer: Core;
	api: GeoJsonApi;
	mvf: ParsedMVF;
	options: TShow3DMapOptions;
	styleMap: AggregatedStyleMap;
	private animations;
	private floorStackAltitudeMap;
	get currentFloorStack(): FloorStackObject;
	setFloorStack(floorStackId: string, reason?: TFloorChangeReason): void;
	get currentFloor(): FloorObject;
	/** @deprecated use `currentFloorStack.floorObjects` or `floorsById` instead */
	get floors(): FloorObject[];
	processFloorChange(floorId: string): void;
	setFloor(floorId: string, reason?: TFloorChangeReason): void;
	/**
	 * Updates the visibility of path layers across all floors based the value of hidePathsNotOnCurrentFloor
	 * and whether multi-floor view is enabled.
	 */
	updatePathLayersVisibility(): void;
	getFloorStackAltitudeData(floorStackId: string): Map<number, {
		altitude: number;
		effectiveHeight: number;
	}>;
	private cancelAnimation;
	Models: {
		add: (id: string, targets: Coordinate[], opts: TAddModelOptions & {
			floorId?: string;
			url: string;
		}) => (string | number)[];
		remove: (_id: string, _groupId: string) => void;
	};
	Image3D: {
		add: (target: Position$1, url: string, opts: TAddImageOptions & {
			floorId?: string;
		}) => EntityId<ImageState> | undefined;
		remove: (id: string) => void;
		removeAll: () => void;
	};
	Markers: {
		add: (coordinate: Coordinate, html: string, opts: TAddMarkerOptions & {
			attachTo?: string;
		}) => EntityId<MarkerState>;
		remove: (id: string) => void;
		getContentEl: (id: string) => HTMLElement | undefined;
		removeAll: () => void;
		setPosition: (id: string, coordinate: Position$1, targetFloorId: string) => void;
		animateTo: (id: string, coordinate: Position$1, targetFloorId: string, options?: TAnimationOptions) => Promise<void>;
	};
	Exporter: {
		getCurrentSceneGLTF: (options: GLTFExportOptions) => Promise<Blob>;
	};
	Shapes: {
		add: <T extends FeatureCollection$1<Polygon$1 | MultiPolygon$1 | LineString, any>>(geometry: T, style: T extends FeatureCollection$1<LineString, any> ? LineStyle : PaintStyle, opts: {
			floorId?: string;
		}) => string;
		remove: (customGeometry: Shape) => string;
	};
	Text3D: {
		label: (target: Space, content?: string, options?: TAddText3DOptions) => Text3DInfo | undefined;
		labelAll: (option?: TAddText3DOptions) => Text3DInfo[];
		remove: (id: string) => string | undefined;
	};
	Labels: {
		all: ({ onCreate, labelOptions, }: {
			onCreate: (labelId: string | number, text: string, target: IAnchorable) => void;
			labelOptions?: TAddLabelOptions;
		}) => void;
		add: (coordinate: Coordinate, text: string, opts?: AddLabelOptionsInternal & {
			attachTo?: string;
			verticalOffset?: number;
		}) => {
			id: string | number;
		};
		remove: ({ entityId }: {
			entityId: string;
		}) => void;
		removeAll: () => void;
	};
	Paths: {
		add: (coordinates: Coordinate[], options?: TAddPathOptions & {
			id?: string;
		}) => {
			paths: (EntityId<PathState> & {
				coordinates: Coordinate[];
			})[];
			animation: Promise<void>;
		};
		remove: (entityIds: string[]) => void;
	};
	constructor(id: string, mapDataInternal: MapDataInternal | undefined, options: TShow3DMapOptions | undefined, api: GeoJsonApi);
	loadAllFloors(): void;
}
type Text3DInfo = {
	target: Space;
	textInfo: EntityId<Text3DState>;
};
/**
 * ## Shapes in Mappedin JS
 *
 * The Shapes class allows you to draw custom 3D geometry on the map using GeoJSON. You can create polygons, multi-polygons, and line strings to highlight areas, create custom boundaries, or add visual overlays to your indoor map.
 *
 * ### Features
 * - Support for GeoJSON geometry (Polygon, MultiPolygon, LineString)
 * - Customizable styling with colors, opacity, and materials
 * - 3D rendering with height and altitude control
 * - Interactive shapes with click/hover events
 * - Floor-specific placement
 *
 * > **Best Practice:** Use shapes to highlight areas of interest, create custom zones, or add visual overlays. Keep shapes simple for better performance, especially on mobile devices.
 *
 * ### Example Usage
 * ```ts
 * // Create a simple polygon shape
 * const polygon = {
 *   type: 'FeatureCollection',
 *   features: [{
 *     type: 'Feature',
 *     geometry: {
 *       type: 'Polygon',
 *       coordinates: [[[lng1, lat1], [lng2, lat2], [lng3, lat3], [lng1, lat1]]]
 *     }
 *   }]
 * };
 *
 * const shape = mapView.Shapes.add(polygon, { color: 'red' }, mapView.currentFloor);
 *
 * // Create a line string
 * const lineString = {
 *   type: 'FeatureCollection',
 *   features: [{
 *     type: 'Feature',
 *     geometry: {
 *       type: 'LineString',
 *       coordinates: [[lng1, lat1], [lng2, lat2]]
 *     }
 *   }]
 * };
 *
 * const line = mapView.Shapes.add(lineString, { color: 'blue', width: 2 });
 *
 * // Remove a shape
 * mapView.Shapes.remove(shape);
 *
 * // Remove all shapes
 * mapView.Shapes.removeAll();
 * ```
 *
 * ### Styling Options
 * - **Polygons/MultiPolygons**: Use `PaintStyle` with color, opacity, height
 * - **LineStrings**: Use `LineStyle` with color, width, opacity
 * - **Interactive**: Set `interactive: true` for click/hover events
 *
 * ### Advanced
 * - Use `altitude` to position shapes at specific heights.
 * - Use `height` to create 3D extruded shapes.
 * - Use `interactive: true` to make shapes clickable.
 * - Use `floor` parameter to place shapes on specific floors.
 *
 * ### More Information
 * - [Shapes Guide](https://developer.mappedin.com/web-sdk/shapes)
 *
 * This class is accessed using {@link MapView.Shapes}.
 */
export declare class Shapes {
	#private;
	/**
	 * @internal
	 */
	get currentMap(): GeojsonApiMapObject | undefined;
	/**
	 * @internal
	 */
	constructor({ currentMapGetter }: {
		currentMapGetter: CurrentMapGetter;
	});
	/**
	 * @internal
	 */
	getById(id: string): Shape | undefined;
	/**
	 * Adds a custom GeoJSON geometry ({@link Shape}) to the map.
	 *
	 * @param geometry A valid GeoJSON feature collection containing Polygon, MultiPolygon, or LineString features.
	 * @param style Styling options for the geometry (see {@link PaintStyle} for polygons, {@link LineStyle} for lines).
	 * @param floor Optional floor to add the geometry to. If not specified, uses the current floor.
	 * @returns {Shape | undefined} The created shape, or undefined if creation failed.
	 *
	 * @example Add a red polygon shape
	 * ```ts
	 * const polygon = {
	 *   type: 'FeatureCollection',
	 *   features: [{
	 *     type: 'Feature',
	 *     geometry: {
	 *       type: 'Polygon',
	 *       coordinates: [[[lng1, lat1], [lng2, lat2], [lng3, lat3], [lng1, lat1]]]
	 *     }
	 *   }]
	 * };
	 *
	 * const shape = mapView.Shapes.add(polygon, { color: 'red' }, mapView.currentFloor);
	 * ```
	 *
	 * @example Add a blue line string
	 * ```ts
	 * const lineString = {
	 *   type: 'FeatureCollection',
	 *   features: [{
	 *     type: 'Feature',
	 *     geometry: {
	 *       type: 'LineString',
	 *       coordinates: [[lng1, lat1], [lng2, lat2]]
	 *     }
	 *   }]
	 * };
	 *
	 * const line = mapView.Shapes.add(lineString, { color: 'blue', width: 2 });
	 * ```
	 *
	 * @example Add an interactive shape with custom styling
	 * ```ts
	 * const shape = mapView.Shapes.add(geometry, {
	 *   color: 'green',
	 *   opacity: 0.7,
	 *   height: 2,
	 *   interactive: true
	 * }, mapView.currentFloor);
	 * ```
	 *
	 * @see [Shapes Guide](https://developer.mappedin.com/web-sdk/shapes)
	 */
	add<T extends FeatureCollection$1<Polygon$1 | MultiPolygon$1 | LineString, any>>(geometry: T, style: T extends FeatureCollection$1<LineString, any> ? LineStyle : PaintStyle, floor?: Floor): Shape;
	/**
	 * Removes a specific shape ({@link Shape}) from the map.
	 * @param shape The shape to be removed.
	 * @example
	 * mapView.Shapes.remove(shape);
	 */
	remove(shape: Shape): void;
	/**
	 * Removes all Shapes ({@link Shape}) from the map.
	 *
	 * @returns An array of all removed shape IDs.
	 * @example
	 * const removedShapeIds = mapView.Shapes.removeAll();
	 */
	removeAll(): string[];
}
type CurrentMapGetter = () => GeojsonApiMapObject | undefined;
type InspectorState = {
	camera: {
		focusOnClick: boolean;
		padding: [
			number,
			number,
			number,
			number
		];
	};
};
type InspectorOption = Partial<InspectorState>;
export declare class Debug {
	state: Core["Debug"]["state"];
	constructor(core: Core);
	update: Core["Debug"]["update"];
}
export type AutoElements = {
	labels: Label[];
	markers: Marker[];
};
/**
 * ## MapView in Mappedin JS
 *
 * MapView is the main rendering and interaction class for Mappedin maps. It provides comprehensive controls for manipulating map elements, camera, styling, and user interactions.
 *
 * ### Features
 * - **Rendering Control**: Camera, labels, markers, models, paths, and more
 * - **Interactive Elements**: Hover effects, click handling, and state management
 * - **Animation System**: Smooth transitions and state animations
 * - **Multi-floor Support**: Floor switching and stacked maps
 * - **Navigation**: Built-in wayfinding and directions
 * - **Styling**: Dynamic theme and style customization
 * - **Event System**: Comprehensive event handling for user interactions
 *
 * > **Best Practice:** Use the specialized API classes (Camera, Markers, Labels, etc.) for specific functionality.
 *
 * ### Example Usage
 * ```ts
 * // Initialize MapView
 * const mapData = await getMapData({key: 'your-key', secret: 'your-secret', mapId: 'your-map-id'});
 * const mapView = await show3dMap(container, mapData);
 * mapView.on('click', (event) => {
 *   console.log('Clicked:', event.coordinate);
 * });
 * ```
 *
 * ### Core Components
 * - **Camera**: View control, zoom, pan, and rotation
 * - **Markers**: Point-based visual elements
 * - **Labels**: Text overlays on the map
 * - **Paths**: Route visualization and navigation
 * - **Models**: 3D model rendering
 * - **Style**: Theme and appearance customization
 * - **Navigation**: Wayfinding and directions
 *
 * ### State Management
 * - `updateState()`: Immediate state changes
 * - `animateState()`: Smooth animated transitions
 * - `getState()`: Retrieve current element states
 * - `updateGlobalState()`: Apply global styling changes
 *
 * ### Event Handling
 * ```ts
 * // Listen for user interactions
 * mapView.on('click', (event) => {
 *   console.log('Clicked:', event.coordinate);
 * });
 *
 * mapView.on('hover', (event) => {
 *   console.log('Hovered:', event.coordinate);
 * });
 *
 * mapView.on('floorChanged', (event) => {
 *   console.log('Floor changed to:', event.floor);
 * });
 * ```
 *
 * ### More Information
 * - [Getting Started Guide](https://developer.mappedin.com/web-sdk/getting-started)
 * - [Camera Guide](https://developer.mappedin.com/web-sdk/camera)
 * - [Markers Guide](https://developer.mappedin.com/web-sdk/markers)
 * - [Labels Guide](https://developer.mappedin.com/web-sdk/labels)
 * - [Paths Guide](https://developer.mappedin.com/web-sdk/wayfinding#drawing-a-path)
 *
 * The MapView class is the main class for rendering and interacting with the map.
 *
 * It provides a set of controls for manipulating the map's elements and state.
 *
 * For help getting started, refer to the [Getting Started Guide](https://developer.mappedin.com/web-sdk/getting-started).
 */
export declare class MapView {
	#private;
	/**
	 * Controls for the map's camera.
	 *
	 * Provides methods for camera positioning, zooming, panning, and view control.
	 *
	 * @example
	 * ```ts
	 * // Set camera position
	 * mapView.Camera.setPosition(coordinate, { duration: 1000 });
	 *
	 * // Zoom to fit all spaces
	 * mapView.Camera.fitToElements(spaces);
	 *
	 * // Animate camera movement
	 * mapView.Camera.animateTo(coordinate, { duration: 2000 });
	 * ```
	 *
	 * @see [Camera Guide](https://developer.mappedin.com/web-sdk/camera)
	 */
	Camera: Camera$3;
	/**
	 * Controls for the map's labels.
	 *
	 * Manages text overlays, tooltips, and label visibility on the map.
	 *
	 * @example
	 * ```ts
	 * // Add a label
	 * const label = mapView.Labels.add(coordinate, 'Welcome!');
	 *
	 * // Update label style
	 * mapView.Labels.update(label, { color: 'red', fontSize: 16 });
	 *
	 * // Remove label
	 * mapView.Labels.remove(label);
	 * ```
	 *
	 * @see [Labels Guide](https://developer.mappedin.com/web-sdk/labels)
	 */
	Labels: Labels;
	/**
	 * @experimental
	 * Controls for the map's 3D texts.
	 *
	 * Provides 3D text rendering capabilities for enhanced visual effects.
	 *
	 * @example
	 * ```ts
	 * // Add 3D text
	 * const text3d = mapView.Text3D.add(coordinate, '3D Text', {
	 *   height: 10,
	 *   color: 'blue'
	 * });
	 * ```
	 */
	Text3D: Text3D;
	/**
	 * Controls for the map's markers.
	 *
	 * Manages point-based visual elements like pins, icons, and custom markers.
	 *
	 * @example
	 * ```ts
	 * // Add a marker
	 * const marker = mapView.Markers.add(coordinate, {
	 *   color: 'red',
	 *   size: 20,
	 *   label: 'Important Location'
	 * });
	 *
	 * // Update marker
	 * mapView.Markers.update(marker, { color: 'blue' });
	 *
	 * // Remove marker
	 * mapView.Markers.remove(marker);
	 * ```
	 *
	 * @see [Markers Guide](https://developer.mappedin.com/web-sdk/markers)
	 */
	Markers: Markers;
	/**
	 * Controls for the map's 3D images.
	 *
	 * Manages image overlays and custom image elements on the map.
	 *
	 * @example
	 * ```ts
	 * // Add an image
	 * const image = mapView.Image3D.add(coordinate, 'path/to/image.png', {
	 *   width: 100,
	 *   height: 100
	 * });
	 * ```
	 */
	Image3D: Image3D;
	/**
	 * Controls for the map's models.
	 *
	 * Manages 3D model rendering and positioning on the map.
	 *
	 * @example
	 * ```ts
	 * // Add a 3D model
	 * const model = mapView.Models.add(coordinate, 'path/to/model.glb', {
	 *   scale: 1.0,
	 *   rotation: { x: 0, y: 0, z: 0 }
	 * });
	 * ```
	 */
	Models: Models;
	/**
	 * Controls for the map's paths.
	 *
	 * Manages route visualization, navigation paths, and custom path rendering.
	 *
	 * @example
	 * ```ts
	 * // Add a path
	 * const path = mapView.Paths.add(coordinates, {
	 *   color: 'blue',
	 *   width: 3,
	 *   animated: true
	 * });
	 *
	 * // Show navigation route
	 * const directions = mapData.getDirections(space1, space2);
	 * if (directions) {
	 *   mapView.Paths.show(directions);
	 * }
	 * ```
	 *
	 * @see [Paths Guide](https://developer.mappedin.com/web-sdk/wayfinding#drawing-a-path)
	 */
	Paths: Paths;
	/**
	 * Controls for the map's 3D exporter.
	 * @hidden
	 */
	Exporter: Exporter;
	/**
	 * Controls for the map's navigation.
	 */
	Navigation: Navigation;
	/**
	 * Controls for the indoor map's style.
	 */
	Style: Style$2;
	/**
	 * Controls custom GeoJSON geometry on the map.
	 *
	 * Allows adding custom geometric shapes and overlays to the map.
	 *
	 * @example
	 * ```ts
	 * // Add custom shape
	 * const shape = mapView.Shapes.add(geoJSON, {
	 *   color: 'red',
	 *   opacity: 0.5
	 * });
	 * ```
	 */
	Shapes: Shapes;
	/**
	 * Controls for the outdoor map.
	 *
	 * Manages outdoor map integration and outdoor tile rendering.
	 *
	 * @example
	 * ```ts
	 * // Enable outdoor map
	 * mapView.Outdoor.enable();
	 *
	 * // Set outdoor style
	 * mapView.Outdoor.setStyle('satellite');
	 * ```
	 */
	Outdoor: Outdoor;
	/**
	 * @internal
	 */
	constructor(rendererCore: Core);
	/**
	 * Updates the state of a map element immediately.
	 *
	 * This method provides direct control over the visual properties of map elements. Use `animateState()` for smooth transitions.
	 *
	 * The following table maps targets to their available states:
	 *
	 * | Target | State Type | Description |
	 * |--------|------------|-------------|
	 * | {@link Door} | {@link TDoorsUpdateState} | Open/closed state, color |
	 * | {@link Floor} | {@link TFloorUpdateState} | Color, opacity, visibility |
	 * | {@link Label} | {@link TLabelUpdateState} | Text, color, visibility |
	 * | {@link Marker} | {@link TMarkerUpdateState} | Color, size, icon |
	 * | {@link Model} | {@link TModelUpdateState} | Scale, rotation, visibility |
	 * | {@link Path} | {@link TPathUpdateState} | Color, width, visibility |
	 * | {@link Shape} | {@link TShapeUpdateState} | Color, opacity, geometry |
	 * | {@link Space} | {@link TGeometryUpdateState} | Color, opacity, visibility |
	 * | {@link Text3DView} | {@link TText3DUpdateState} | Text, color, height |
	 * | {@link DOORS} | {@link TDoorsUpdateState} | Global door settings |
	 * | {@link WALLS} | {@link TWallsUpdateState} | Global wall settings |
	 *
	 * @param target The map element to update.
	 * @param state The new state to apply.
	 *
	 * @example Update space color
	 * ```ts
	 * const space = mapData.getById('space', 'space-123');
	 * if (space) {
	 *   mapView.updateState(space, { color: 'red' });
	 * }
	 * ```
	 *
	 * @example Update marker properties
	 * ```ts
	 * const marker = mapView.Markers.add(coordinate);
	 * mapView.updateState(marker, {
	 *   contentHTML: 'Updated Content'
	 * });
	 * ```
	 *
	 * @example Update global door settings
	 * ```ts
	 * mapView.updateState('DOORS', {
	 *   color: 'green',
	 *   opacity: 0.8
	 * });
	 * ```
	 *
	 * @example Update path appearance
	 * ```ts
	 * const path = mapView.Paths.add(coordinates);
	 * mapView.updateState(path, {
	 *   color: 'yellow',
	 * });
	 * ```
	 */
	updateState<T extends MapElementsWithState>(target: T, state: TUpdateState<T>): void;
	/**
	 * Animate the state of a given target on the map from the current state to a new state. Only numeric properties and
	 * colors can be animated.
	 *
	 * Use `updateState()` for immediate updates.
	 *
	 * The following table maps targets to their available states:
	 *
	 * | Target | State Type | Description |
	 * |--------|------------|-------------|
	 * | {@link Door} | {@link TDoorsUpdateState} | Open/closed state, color |
	 * | {@link Floor} | {@link TFloorUpdateState} | Color, opacity, visibility |
	 * | {@link Label} | {@link TLabelUpdateState} | Text, color, visibility |
	 * | {@link Marker} | {@link TMarkerUpdateState} | Color, size, icon |
	 * | {@link Model} | {@link TModelUpdateState} | Scale, rotation, visibility |
	 * | {@link Path} | {@link TPathUpdateState} | Color, width, visibility |
	 * | {@link Shape} | {@link TShapeUpdateState} | Color, opacity, geometry |
	 * | {@link Space} | {@link TGeometryUpdateState} | Color, opacity, visibility |
	 * | {@link Text3DView} | {@link TText3DUpdateState} | Text, color, height |
	 * | {@link DOORS} | {@link TDoorsUpdateState} | Global door settings |
	 * | {@link WALLS} | {@link TWallsUpdateState} | Global wall settings |
	 *
	 * @param target The map element to animate.
	 * @param state The target state to animate to.
	 * @param options Animation configuration options.
	 * @param options.duration The duration of the animation in milliseconds (default: 1000).
	 * @param options.easing The easing function to use for the animation.
	 * @returns A cancellable promise that resolves when the animation completes.
	 *
	 * @example Animate label text size and color
	 * ```ts
	 * mapView.animateState(label, {
	 *   appearance: {
	 *     textSize: state.appearance.textSize! + 1,
	 *     textColor: state.appearance.textColor! === '#000000' ? 'purple' : '#000000',
	 *   },
	 * });
	 * ```
	 *
	 * @example When a space is clicked it sets it to non-interactive and animates its height and color and then sets it back
	 * to interactive when the animation completes.
	 *
	 * ```ts
	 * mapView.on('click', ({ spaces }) => {
	 *   if (!spaces) return;
	 *   spaces.forEach(space => {
	 *     const state = mapView.getState(space)!;
	 *     mapView.updateState(space, {
	 *       interactive: false,
	 *     });
	 *     currentAnimation = mapView.animateState(space, {
	 *       height: state.height + 1,
	 *       color: state.color === 'rgb(255, 0, 0)' ? 'blue' : 'rgb(255, 0, 0)',
	 *     });
	 *     currentAnimation.finally(() => {
	 *       mapView.updateState(space, {
	 *         interactive: true,
	 *       });
	 *     });
	 *   });
	 * });
	 * ```
	 */
	animateState<T extends MapElementsWithState>(target: T, state: PartialDeep<ExtractDeep<TGetState<T>, number | string | undefined>>, options?: {
		duration?: number;
		easing?: EasingCurve;
	}): TCancellablePromise<TAnimateStateResult>;
	/**
	 * Update global state of the MapView
	 */
	updateGlobalState(update: UpdateGlobalState): void;
	/**
	 * The options passed in to the {@link show3dMap} method during initialization.
	 */
	get options(): ReadonlyDeep<TShow3DMapOptions>;
	/**
	 * Get global state of the MapView
	 */
	getGlobalState(): ReadonlyDeep<GlobalState>;
	/**
	 * Triggers a manual update of the map view.
	 *
	 * Forces the map to re-render. This is typically not needed as the map updates automatically, but can be useful in certain edge cases.
	 *
	 * @example
	 * ```ts
	 * // Force map update after external changes
	 * mapView.update();
	 * ```
	 */
	update: () => void;
	/**
	 * Gets the current map data associated with this view.
	 *
	 * @returns The current MapData instance, or undefined if no map is loaded.
	 * @example
	 * ```ts
	 * const mapData = mapView.getMapData();
	 * if (mapData) {
	 *   console.log('Map name:', mapData.mapName);
	 *   const spaces = mapData.getByType('space');
	 *   console.log('Number of spaces:', spaces.length);
	 * }
	 * ```
	 */
	getMapData(): MapData;
	/**
	 * Gets the current dimensions of the map container.
	 *
	 * @returns An object containing the width and height of the map container.
	 * @example
	 * ```ts
	 * const dimensions = mapView.getDimensions();
	 * console.log(`Map size: ${dimensions.width}x${dimensions.height}`);
	 * ```
	 */
	getDimensions(): {
		width: number;
		height: number;
	};
	/**
	 * Adds a map to the MapView.
	 * @param mapData The map data to add.
	 * @returns A promise that resolves with the added map data.
	 * @hidden
	 */
	addMap(mapData: MapData, options?: TShow3DMapOptions): Promise<MapData>;
	/**
	 * Sets the current floor of the map.
	 *
	 * Changes the visible floor and updates the camera to focus on the new floor.
	 *
	 * @param floor The floor to set, either as a Floor object or floor ID string.
	 * @param options Optional configuration for the floor change.
	 * @returns A promise that resolves when the floor change is complete.
	 *
	 * @example Set floor by object
	 * ```ts
	 * const floors = mapData.getByType('floor');
	 * const groundFloor = floors.find(f => f.elevation === 0);
	 * if (groundFloor) {
	 *   await mapView.setFloor(groundFloor);
	 * }
	 * ```
	 *
	 * @example Set floor by ID
	 * ```ts
	 * await mapView.setFloor('floor-1');
	 * ```
	 */
	setFloor(floor: Floor | string, options?: TSetFloorOptions): void;
	/**
	 * Sets the current ({@link FloorStack}) of the map.
	 *
	 * Changes to a specific floor stack, which may contain multiple floors for complex buildings.
	 *
	 * @param floorStack The floor stack to set, either as a ({@link FloorStack}) object or ID string.
	 * @param options Optional configuration for the floor stack change defined in ({@link TSetFloorOptions}).
	 * @returns A promise that resolves when the floor stack change is complete.
	 *
	 * @example Set floor stack
	 * ```ts
	 * const floorStacks = mapData.getByType('floor-stack');
	 * const mainBuilding = floorStacks.find(fs => fs.name === 'Main Building');
	 * if (mainBuilding) {
	 *   await mapView.setFloorStack(mainBuilding);
	 * }
	 * ```
	 */
	setFloorStack(floorStack: FloorStack | string, options?: TSetFloorOptions): void;
	/**
	 * Preload floor geometry and outlines for the map at runtime. Can be used when anticipating a large number of floors will be visible at once to
	 * keep the map responsive.
	 * @param floors The floors to preload.
	 */
	preloadFloors(floors: Floor[]): void;
	/**
	 * Create a tween object that will be updated on every render frame.
	 * See https://tweenjs.github.io/tween.js/docs/user_guide.html for more information.
	 *
	 * When creating a large number of tween objects, it may be important to call {@link MapView.removeTween | removeTween} to prevent memory leaks.
	 *
	 * @param object The data to be tweened.
	 * @returns The tween object.
	 */
	tween<T extends Record<string, unknown>>(object: T): Tween<T>;
	/**
	 * Remove a tween created with {@link MapView.tween | tween}.
	 * @param tween The tween to remove.
	 */
	removeTween(tween: Tween<any>): void;
	/**
	 * The group which manages all tweens created with {@link MapView.tween | tween} or {@link MapView.animateState | animateState}.
	 */
	get tweenGroup(): import("@tweenjs/tween.js").Group;
	/**
	 * Gets the current ({@link FloorStack}).
	 *
	 * @returns The current FloorStack, or undefined if no floor stack is set.
	 * @example
	 * ```ts
	 * const currentStack = mapView.currentFloorStack;
	 * if (currentStack) {
	 *   console.log('Current floor stack:', currentStack.name);
	 * }
	 * ```
	 */
	get currentFloorStack(): FloorStack;
	/**
	 * Gets the current ({@link Floor}) of the map.
	 *
	 * @returns The current Floor, or undefined if no floor is set.
	 * @example
	 * ```ts
	 * const currentFloor = mapView.currentFloor;
	 * if (currentFloor) {
	 *   console.log('Current floor:', currentFloor.name);
	 *   console.log('Floor level:', currentFloor.level);
	 * }
	 * ```
	 */
	get currentFloor(): Floor;
	/**
	 * Updates the watermark on the map.
	 *
	 * @param options {WatermarkOptions}
	 * @hidden
	 */
	updateWatermark(options: WatermarkUpdateOptions): void;
	/**
	 * Gets the current state of a map element.
	 *
	 * Retrieves the current visual properties and state of a map element.
	 *
	 * @param target The map element to get the state for.
	 * @returns The current state of the element.
	 *
	 * @example Get space state
	 * ```ts
	 * const space = mapData.getById('space', 'space-123');
	 * if (space) {
	 *   const state = mapView.getState(space);
	 *   console.log('Space color:', state.color);
	 *   console.log('Space opacity:', state.opacity);
	 * }
	 * ```
	 *
	 * @example Get marker state
	 * ```ts
	 * const marker = mapView.Markers.add(coordinate);
	 * const state = mapView.getState(marker);
	 * console.log('Marker rank:', state.rank);
	 * console.log('Marker placement:', state.placement);
	 * ```
	 */
	getState<T extends MapElementsWithState>(target: T): TGetState<T>;
	/**
	 * Sets the hover color for map elements.
	 *
	 * @param c The color to use for hover effects.
	 * @example
	 * ```ts
	 * mapView.setHoverColor('#ff0000');
	 * ```
	 */
	setHoverColor(c: string): void;
	/**
	 * Gets the current hover color.
	 *
	 * @returns The current hover color.
	 * @example
	 * ```ts
	 * const hoverColor = mapView.getHoverColor();
	 * console.log('Hover color:', hoverColor);
	 * ```
	 */
	getHoverColor(): string | undefined;
	/**
	 * @internal
	 */
	convertAltitudeToMercatorZoomLevel(altitude: number): number;
	/**
	 * @internal
	 */
	convertMercatorZoomLevelToAltitude(zoomLevel: number): number;
	/**
	 * Determines if a given target is within the viewport.
	 *
	 * This method checks if the specified target, such as a Space, MapObject, Label, Marker, or string identifier,
	 * is currently within the visible area of the map viewport. Note that this method returns `true` even if the
	 * target is not visible (e.g., its visibility is set to false).
	 *
	 * @param target - The target to check for viewport inclusion. This can be a Space, MapObject, Label, Marker, or string identifier.
	 * @returns A boolean indicating whether the target is within the viewport.
	 */
	isInView(target: Space | MapObject | Label | Marker | string): boolean;
	/**
	 * Gets the map elements that are currently in view.
	 *
	 * @param type The type of map element to get.
	 * @param options Optional configuration for the in view check.
	 * @returns An array of map elements that are currently in view.
	 */
	getInView<T extends string>(type: T, options?: TGetInViewOptions): MapFeatureOfType<T>[];
	/**
	 * Returns the current scale of the map in meters per pixel.
	 * @returns
	 * @example
	 * ```ts
	 * const metersPerPixel = mapView.getMetersPerPixel();
	 * console.log('Meters per pixel:', metersPerPixel);
	 * ```
	 */
	getMetersPerPixel(): number;
	/**
	 * @deprecated Use the async version instead. This method will be made truly async in the upcoming future.
	 * @internal
	 */
	__LEGACY_GET_DIRECTIONS_SYNC: (from: TNavigationTarget | TNavigationTarget[], to: TNavigationTarget | TNavigationTarget[], options?: TGetDirectionsOptions) => Directions | undefined;
	/**
	 * Calculates ({@link Directions}) from one navigable point ({@link TNavigationTarget}) to another on the map.
	 *
	 * Provides turn-by-turn navigation instructions and route visualization. This method delegates to the MapData instance.
	 *
	 * @note In enterprise mode, path smoothing is disabled by default. Use the `smoothing` option to explicitly enable it if needed.
	 *
	 * @param from The starting location(s).
	 * @param to The destination location(s).
	 * @param options Optional configuration for the directions calculation.
	 * @returns A Promise resolving to a {@link Directions} object containing the route, or undefined if no route is found.
	 *
	 * @example Get directions between spaces
	 * ```ts
	 * const space1 = mapData.getById('space', 'space-123');
	 * const space2 = mapData.getById('space', 'space-456');
	 *
	 * if (space1 && space2) {
	 *   const directions = await mapView.getDirections(space1, space2);
	 *   if (directions) {
	 *     // Show the route on the map
	 *     mapView.Paths.show(directions);
	 *     console.log(`Distance: ${directions.distance}m`);
	 *   }
	 * }
	 * ```
	 *
	 * @see [Wayfinding Guide](https://developer.mappedin.com/web-sdk/wayfinding)
	 */
	getDirections: (from: TNavigationTarget | TNavigationTarget[], to: TNavigationTarget | TNavigationTarget[], options?: TGetDirectionsOptions) => Promise<Directions | undefined>;
	/**
	 * Calculates directions ({@link Directions}) from one navigable point ({@link TNavigationTarget}) to multiple destination points on the map synchronously.
	 *
	 * Provides routes from a single starting point to multiple destinations. This method delegates to the MapData instance.
	 *
	 * @param from The starting location.
	 * @param to An array of destination locations or arrays of destinations.
	 * @param options Optional configuration for the directions calculation.
	 * @returns An array of {@link Directions} objects, one for each destination.
	 *
	 * @example Get directions to multiple destinations
	 * ```ts
	 * const start = mapData.getById('space', 'entrance');
	 * const destinations = [
	 *   mapData.getById('space', 'store-1'),
	 *   mapData.getById('space', 'store-2'),
	 *   mapData.getById('space', 'restaurant')
	 * ].filter(Boolean);
	 *
	 * const allDirections = mapView.getDirectionsMultiDestinationSync(start, destinations);
	 * allDirections.forEach((directions, index) => {
	 *   console.log(`Route ${index + 1}: ${directions.distance}m`);
	 * });
	 * ```
	 *
	 * @deprecated Use the async version instead. This method will be made truly async in the upcoming future.
	 * @internal
	 */
	__LEGACY_GET_DIRECTIONS_MULTI_DESTINATION_SYNC: (from: TNavigationTarget, to: (TNavigationTarget | TNavigationTarget[])[], options?: TGetDirectionsOptions) => Directions[] | undefined;
	/**
	 * Calculates directions ({@link Directions}) from one navigable point ({@link TNavigationTarget}) to multiple destination points on the map.
	 *
	 * Provides routes from a single starting point to multiple destinations. This method delegates to the MapData instance.
	 *
	 * @note In enterprise mode, path smoothing is disabled by default. Use the `smoothing` option to explicitly enable it if needed.
	 *
	 * @param from The starting location.
	 * @param to An array of destination locations or arrays of destinations.
	 * @param options Optional configuration for the directions calculation.
	 * @returns A Promise resolving to an array of {@link Directions} objects, one for each destination.
	 *
	 * @example Get directions to multiple destinations
	 * ```ts
	 * const start = mapData.getById('space', 'entrance');
	 * const destinations = [
	 *   mapData.getById('space', 'store-1'),
	 *   mapData.getById('space', 'store-2'),
	 *   mapData.getById('space', 'restaurant')
	 * ].filter(Boolean);
	 *
	 * const allDirections = await mapView.getDirectionsMultiDestination(start, destinations);
	 * allDirections.forEach((directions, index) => {
	 *   console.log(`Route ${index + 1}: ${directions.distance}m`);
	 * });
	 * ```
	 */
	getDirectionsMultiDestination: (from: TNavigationTarget, to: (TNavigationTarget | TNavigationTarget[])[], options?: TGetDirectionsOptions) => Promise<Directions[] | undefined>;
	/**
	 * Calculates the walking distance between two navigable points ({@link TNavigationTarget}) on the map.
	 *
	 * Returns the walking distance between two points. This method delegates to the MapData instance.
	 *
	 * @param from The starting location.
	 * @param to The destination location.
	 * @returns The distance in meters.
	 *
	 * @example Calculate distance between spaces
	 * ```ts
	 * const space1 = mapData.getById('space', 'space-123');
	 * const space2 = mapData.getById('space', 'space-456');
	 *
	 * if (space1 && space2) {
	 *   const distance = mapView.getDistance(space1, space2);
	 *   console.log(`Direct distance: ${distance}m`);
	 * }
	 * ```
	 *
	 * @example Calculate distance from coordinate
	 * ```ts
	 * const coordinate = mapData.mapCenter;
	 * const space = mapData.getByType('space')[0];
	 * const distance = mapView.getDistance(coordinate, space);
	 * console.log(`Distance from center: ${distance}m`);
	 * ```
	 */
	getDistance(from: Space | Door | Coordinate | MapObject | PointOfInterest | Annotation | Node$1 | EnterpriseLocation, to: Space | Door | Coordinate | MapObject | PointOfInterest | Annotation | Node$1 | EnterpriseLocation): number | undefined;
	/**
	 * Creates a {@link Coordinate} on the map.
	 *
	 * @param latitude The latitude of the coordinate.
	 * @param longitude The longitude of the coordinate.
	 * @param floor Optional floor information if applicable.
	 * @returns The created Coordinate object.
	 * @example
	 * // Create a coordinate at the CN Tower.
	 * const coord = map.createCoordinate(43.642567, -79.387054);
	 *
	 * // Alternatively, you can directly use the Coordinate constructor:
	 * import { Coordinate } from '@mappedin/mappedin-js';
	 * const coord = new Coordinate(43.642567, -79.387054, floor?.id);
	 */
	createCoordinate(latitude: number, longitude: number, floor?: Floor): Coordinate;
	/**
	 * Creates a {@link Coordinate} on the map using a params object.
	 *
	 * @param params An object containing the coordinate parameters.
	 * @param params.latitude The latitude of the coordinate in decimal degrees.
	 * @param params.longitude The longitude of the coordinate in decimal degrees.
	 * @param params.floorId Optional ID of the floor this coordinate is on.
	 * @param params.verticalOffset Optional vertical offset from the floor in meters.
	 * @returns The created Coordinate object.
	 * @example
	 * // Create a coordinate at the CN Tower using params object.
	 * const coord = map.createCoordinate({
	 *   latitude: 43.642567,
	 *   longitude: -79.387054
	 * });
	 *
	 * // Alternatively, you can directly use the Coordinate constructor:
	 * import { Coordinate } from '@mappedin/mappedin-js';
	 * const coord = new Coordinate({
	 *   latitude: 43.642567,
	 *   longitude: -79.387054,
	 *   floorId: 'floor1',
	 *   verticalOffset: 10
	 * });
	 */
	createCoordinate(params: TCoordinateParams): Coordinate;
	/**
	 * Create a {@link Coordinate} from an X and Y position measured in pixels from the top left
	 * corner of the map canvas.
	 *
	 * @experimental
	 */
	createCoordinateFromScreenCoordinate(x: number, y: number, floor?: Floor): Coordinate | undefined;
	/**
	 * Get the X and Y of a {@link Coordinate} measured from the top left corner of the map canvas.
	 *
	 * @experimental
	 */
	getScreenCoordinateFromCoordinate(coordinate: Coordinate): {
		x: number;
		y: number;
	};
	/**
	 * @experimental
	 *
	 * This is an experimental feature that may undergo significant changes,
	 * including breaking changes, renaming, or complete removal in future versions.
	 * Do not rely on this API in production environments.
	 *
	 * Automatically creates labels, markers, and updates state of map elements provided with default settings.
	 * @param mapElements - A custom array of map elements to automatically create labels, markers, and update state of.
	 * If not provided, all map elements will be used.
	 *
	 * @returns An object containing auto-created labels and markers.
	 */
	__EXPERIMENTAL__auto(mapElements?: MapDataElements[]): Promise<AutoElements>;
	/**
	 * Subscribe a function to an event.
	 *
	 * @param eventName An event name which, when fired, will call the provided
	 * function.
	 * @param fn A callback that gets called when the corresponding event is fired. The
	 * callback will get passed an argument with a type that's one of event payloads.
	 * @example
	 * // Subscribe to the 'click' event
	 * const handler = (event) => {
	 *  const { coordinate } = event;
	 *  const { latitude, longitude } = coordinate;
	 * 	console.log(`Map was clicked at ${latitude}, ${longitude}`);
	 * };
	 * mapView.on('click', handler);
	 */
	on: <EventName extends keyof TEvents>(eventName: EventName, fn: (payload: TEventPayload<EventName>) => void) => void;
	/**
	 * Unsubscribe a function previously subscribed with {@link on}
	 *
	 * @param eventName An event name to which the provided function was previously
	 * subscribed.
	 * @param fn A function that was previously passed to {@link on}. The function must
	 * have the same reference as the function that was subscribed.
	 * @example
	 * // Unsubscribe from the 'click' event
	 * const handler = (event) => {
	 *  const { coordinate } = event;
	 *  const { latitude, longitude } = coordinate;
	 * 	console.log(`Map was clicked at ${latitude}, ${longitude}`);
	 * };
	 * mapView.off('click', handler);
	 */
	off: <EventName extends keyof TEvents>(eventName: EventName, fn: (payload: TEventPayload<EventName>) => void) => void;
	/**
	 * @internal
	 */
	get __core(): Core;
	/**
	 * The container element of the map.
	 */
	get container(): HTMLElement;
	/**
	 * @internal
	 */
	publishAllState(): void;
	/**
	 * Clears all added elements from the map.
	 */
	clear(): void;
	/**
	 * Destroys the MapView.
	 */
	destroy(): void;
	/**
	 * @experimental
	 * Enable debug interface. Learn more about the debug interface in the [Debug Mode Guide](https://developer.mappedin.com/web-sdk/getting-started#debug-mode).
	 */
	enableDebug(opitons?: InspectorOption): Promise<void>;
	/**
	 * @experimental
	 * @internal
	 */
	Debug: Debug;
	/**
	 * Takes a screenshot of the current scene and returns it as a data URL.
	 *
	 * NOTE: This only captures the 3D scene, and optionally the outdoor context, not the UI elements like labels, markers, etc.
	 * Also, this does not cause the screenshot to be saved to the user's device, it only returns
	 * the data.
	 *
	 * @param options - Options for taking a screenshot.
	 * @param options.withOutdoorContext - Whether to include the outdoor context in the screenshot.
	 * @default false
	 *
	 * @returns A Promise that resolves with the screenshot as a base64-encoded data URL string
	 * @experimental
	 */
	takeScreenshot(options?: TTakeScreenshotOptions): Promise<string>;
	/**
	 * @internal
	 * @hidden
	 * Whether the floor visibility is being self managed or automatically handled by the SDK.
	 */
	get manualFloorVisibility(): boolean;
	/**
	 * @internal
	 * @hidden
	 * Disables the default behavior of the SDK to automatically hide floors on setFloor.
	 */
	set manualFloorVisibility(value: boolean);
	/**
	 * @internal
	 * @hidden
	 * @experimental
	 * Computes the optimal visual distance between floors
	 */
	getOptimalVisualDistanceBetweenFloors(floors: Floor[]): number | undefined;
	/**
	 * @internal
	 * @deprecated For legacy use only
	 *
	 * If true, the map will hide paths not on the current floor.
	 *
	 * @default false
	 */
	get __INTERNAL__hidePathsNotOnCurrentFloor(): boolean;
	/**
	 * @internal
	 * @deprecated For legacy use only
	 *
	 * If true, the map will hide paths not on the current floor.
	 *
	 * @default false
	 */
	set __INTERNAL__hidePathsNotOnCurrentFloor(value: boolean);
}
/**
 * ## Camera in Mappedin JS
 *
 * The Camera class controls the map's viewpoint, including position, pitch, bearing, and zoom. It can instantly reposition or animate to a new location, and can focus on one or more map elements.
 *
 * ### Features
 * - Focus on any map element (space, coordinate, marker, etc.)
 * - Smooth animation and custom easing
 * - Control pan, zoom, bearing, and pitch
 * - Set safe screen areas (insets) for UI overlays
 *
 * > **Best Practice:** Use `focusOn` for user-driven navigation (e.g., "Show this store"), and `animateTo` for smooth transitions between known camera states.
 *
 * ### Example Usage
 * ```ts
 * // Focus on a single space
 * mapView.Camera.focusOn(space, { minZoomLevel: 5 });
 *
 * // Animate to a specific camera target
 * mapView.Camera.animateTo({ center: coordinate, zoomLevel: 6, bearing: 45 });
 *
 * // Set the camera instantly
 * mapView.Camera.set({ center: coordinate, zoomLevel: 7 });
 *
 * // Set safe screen insets (e.g., for a sidebar)
 * mapView.Camera.setScreenOffsets({ left: 300, top: 0, right: 0, bottom: 0 });
 * ```
 *
 * ### Advanced
 * - Use `getFocusOnTransform` to calculate the camera transform before applying it.
 * - Use `interactions.set` to enable/disable pan, zoom, or rotation.
 *
 * ### More Information
 * - [Camera Guide](https://developer.mappedin.com/web-sdk/camera)
 *
 * This class is accessed using {@link MapView.Camera}.
 */
declare class Camera$3 {
	#private;
	/**
	 * @internal
	 */
	constructor(api: GeoJsonApi);
	/**
	 * Controls which camera interactions are enabled/disabled.
	 *
	 * @example
	 * // Disable zoom and rotation
	 * mapView.Camera.interactions.set({ zoom: false, bearingAndPitch: false });
	 *
	 * // Enable all interactions
	 * mapView.Camera.interactions.enable();
	 *
	 * // Disable all interactions
	 * mapView.Camera.interactions.disable();
	 */
	interactions: {
		set: (options: TCameraInteractionsSetOptions) => void;
		enable: () => void;
		disable: () => void;
	};
	/**
	 * Define an area of the screen that is safe for the camera. Anything outside the safe area is assumed to be covered in some way. The camera will not place any map elements there when calling {@link Camera.focusOn}.
	 *
	 * @param padding The padding to apply. Can specify individual sides and optionally the type.
	 * - `type`: 'pixel' (absolute pixels) or 'portion' (fraction of canvas, 0-1). Defaults to 'pixel'.
	 * - When updating without specifying type, the existing type is preserved.
	 * @example
	 * // Reserve 300px on the left for a sidebar
	 * mapView.Camera.setScreenOffsets({ left: 300, top: 0, right: 0, bottom: 0 });
	 *
	 * @example
	 * // Reserve 20% of the screen height at the top using portion type
	 * mapView.Camera.setScreenOffsets({ top: 0.2, type: 'portion' });
	 *
	 * @example
	 * // Update only the bottom padding, preserving existing type and other values
	 * mapView.Camera.setScreenOffsets({ bottom: 50 });
	 */
	setScreenOffsets(padding: Partial<InsetPadding>): void;
	get screenOffsets(): InsetPadding;
	/**
	 * The camera's current pan mode.
	 */
	get panMode(): "default" | "elevation";
	/**
	 * Set the camera's pan mode. 'elevation' moves the camera up and down, while 'default' allows the camera to pan in all directions.
	 * @experimental
	 * @param panMode The new pan mode.
	 */
	setPanMode(panMode: "default" | "elevation"): void;
	/**
	 * Get the camera transform that can be used to focus on a target or array of targets. Similar to {@link Camera.focusOn} but returns the transform directly.
	 * @param target The target(s) to get the camera transform for.
	 * @param options Optional settings for the camera transform.
	 * @returns The camera transform which can then be passed to {@link Camera.set} or {@link Camera.animateTo}.
	 *
	 * @example
	 * // Focus on a single space
	 * const transform = mapView.Camera.getFocusOnTransform(space, { minZoomLevel: 5 });
	 * mapView.Camera.animateTo(transform);
	 */
	getFocusOnTransform(target: IFocusable | IFocusable[], options?: TFocusOnOptions): TCameraTarget;
	/**
	 * Focuses the camera on a specific target or array of targets.
	 *
	 * @param target The target(s) to focus on, either a single element or an array of elements.
	 * @param options Optional settings for focusing the camera (see {@link TFocusOnOptions}).
	 * @returns A promise that resolves when the camera animation is complete.
	 *
	 * @example Focus on a single space
	 * ```ts
	 * mapView.Camera.focusOn(space, { minZoomLevel: 5 });
	 * ```
	 *
	 * @example Focus on multiple elements
	 * ```ts
	 * mapView.Camera.focusOn([space1, space2], { pitch: 45 });
	 * ```
	 *
	 * @see [Camera Guide](https://developer.mappedin.com/web-sdk/camera)
	 */
	focusOn(target: IFocusable | IFocusable[], options?: TFocusOnOptions): Promise<void>;
	/**
	 * Animates the camera to a specific target.
	 *
	 * @param target The camera target ({@link TCameraTarget}) to animate to.
	 * @param options Optional animation options (see {@link TCameraAnimationOptions}).
	 * @returns A promise that resolves when the animation is complete.
	 *
	 * @example
	 * mapView.Camera.animateTo({ center: coordinate, zoomLevel: 6, bearing: 45 }, { duration: 1000 });
	 */
	animateTo(target: TCameraTarget, options?: TCameraAnimationOptions): Promise<void>;
	/**
	 * Instantly sets the camera to a specific target.
	 *
	 * @param target The camera target ({@link TCameraTarget}) to set.
	 *
	 * @example
	 * mapView.Camera.set({ center: coordinate, zoomLevel: 7 });
	 */
	set(target: TCameraTarget): void;
	/**
	 * The current center coordinate ({@link Coordinate}) of the camera.
	 */
	get center(): Coordinate;
	/**
	 * Toggle the mode of the camera to automatically set the minimum zoom level based on the size of the scene.
	 * It will be automatically disabled when the minimum zoom level is set manually.
	 * @param value The new value for the auto min zoom level mode.
	 */
	setAutoMinZoomLevel(value: boolean): void;
	/**
	 * The mode of the camera to automatically set the minimum zoom level based on the size of the scene.
	 */
	get autoMinZoomLevel(): boolean;
	/**
	 * The current zoom level of the camera in mercator zoom levels.
	 *
	 * @see https://wiki.openstreetmap.org/wiki/Zoom_levels
	 */
	get zoomLevel(): number;
	/**
	 * The current pitch of the camera in degrees.
	 */
	get pitch(): number;
	/**
	 * The minimum pitch of the camera in degrees.
	 */
	get minPitch(): number;
	/**
	 * The maximum pitch of the camera in degrees.
	 */
	get maxPitch(): number;
	/**
	 * Update the minimum pitch of the camera in degrees.
	 * @param minPitch The new minimum pitch.
	 */
	setMinPitch: (minPitch: number) => void;
	/**
	 * Update the maximum pitch of the camera in degrees.
	 * @param maxPitch The new maximum pitch.
	 */
	setMaxPitch: (maxPitch: number) => void;
	/**
	 * The current bearing of the camera in degrees clockwise from North. 0 degrees is North, 90 degrees is East, 180 degrees is South, and 270 degrees is West.
	 */
	get bearing(): number;
	/**
	 * The minimum zoom level of the camera in mercator zoom levels.
	 *
	 * @see https://wiki.openstreetmap.org/wiki/Zoom_levels
	 */
	get minZoomLevel(): number;
	/**
	 * Update the minimum zoom level of the camera in mercator zoom levels.
	 * @param zoomLevel The new minimum zoom level.
	 * @see https://wiki.openstreetmap.org/wiki/Zoom_levels
	 */
	setMinZoomLevel: (zoomLevel: number) => void;
	/**
	 * The maximum zoom level of the camera in mercator zoom levels.
	 *
	 * @see https://wiki.openstreetmap.org/wiki/Zoom_levels
	 */
	get maxZoomLevel(): number;
	/**
	 * Update the maximum zoom level of the camera in mercator zoom levels.
	 * @param zoomLevel The new maximum zoom level.
	 * @see https://wiki.openstreetmap.org/wiki/Zoom_levels
	 * @default 22
	 * @max 24
	 * @min 0
	 */
	setMaxZoomLevel: (zoomLevel: number) => void;
	/**
	 * Set the camera's elevation in meters.
	 * @experimental
	 * @param elevation The new elevation in meters.
	 */
	setElevation(elevation: number): void;
	/**
	 * The current elevation of the camera in meters.
	 */
	get elevation(): number;
	/**
	 * Animate the camera's elevation to a specified elevation.
	 * @experimental
	 * @param elevation The target elevation in meters.
	 * @param options Optional settings for the camera animation.
	 */
	animateElevation(elevation: number, options?: TCameraAnimationOptions): Promise<void>;
	/**
	 * The current pan boundary of the camera.
	 */
	get bounds(): CameraBounds;
	get isAnimating(): boolean;
	cancelAnimation(): void;
	/**
	 * @internal
	 * @experimental
	 * Force an update of the facades in view.
	 */
	updateFacadesInView(): void;
}
/**
 * API to export the scene.
 *
 * @hidden
 */
export declare class Exporter {
	#private;
	/**
	 * @internal
	 */
	get currentMap(): GeojsonApiMapObject | undefined;
	/**
	 * @internal
	 */
	constructor({ currentMapGetter }: {
		currentMapGetter: CurrentMapGetter$1;
	});
	/**
	 * Exports the current scene as a GLTF file.
	 *
	 * @hidden
	 */
	getCurrentSceneGLTF(userOptions: GLTFExportOptions): Promise<Blob>;
}
type CurrentMapGetter$1 = () => GeojsonApiMapObject | undefined;
/**
 * ## Labels in Mappedin JS
 *
 * Labels are text elements anchored to map objects that automatically rotate, show/hide based on priority and zoom level, and manage collisions with other labels. They're perfect for displaying location names, points of interest, and contextual information.
 *
 * ### Features
 * - Automatic collision management and visibility ranking
 * - Customizable appearance (color, font, background, etc.)
 * - Support for interactivity (click, hover)
 * - Automatic rotation and positioning
 * - Batch operations for adding all labels at once
 *
 * > **Best Practice:** Use the `rank` option to control label visibility priority. Use `interactive: true` to enable click/hover events for important labels.
 *
 * ### Example Usage
 * ```ts
 * // Add a single label
 * mapView.Labels.add(space, 'Welcome', { appearance: { color: 'blue' } });
 *
 * // Add a label with high priority
 * mapView.Labels.add(space, 'Main Entrance', { rank: 'always-visible' });
 *
 * // Add all labels automatically (experimental)
 * mapView.Labels.__EXPERIMENTAL__all();
 *
 * // Remove a specific label
 * mapView.Labels.remove(label);
 *
 * // Remove all labels
 * mapView.Labels.removeAll();
 * ```
 *
 * ### Advanced
 * - Use `appearance` to customize colors, fonts, and backgrounds.
 * - Use `rank` to control collision priority ('low', 'medium', 'high', 'always-visible').
 * - Use `__EXPERIMENTAL__all()` to automatically add labels for all map objects with predefined text (experimental feature).
 *
 * ### More Information
 * - [Labels Guide](https://developer.mappedin.com/web-sdk/labels)
 *
 * This class is accessed using {@link MapView.Labels}.
 */
export declare class Labels {
	#private;
	/**
	 * @internal
	 */
	get currentMap(): GeojsonApiMapObject | undefined;
	/**
	 * @internal
	 */
	constructor({ currentMapGetter }: {
		currentMapGetter: CurrentMapGetter$2;
	});
	getAll(): Label[];
	/**
	 * @internal
	 */
	getById(id: string): {
		label: Label;
		entityId: string;
	} | undefined;
	/**
	 * Adds a label ({@link Label}) to the map.
	 *
	 * @param target The target object ({@link IAnchorable}) where the label should be added (e.g., {@link Space}, {@link Door}, {@link Coordinate}, or {@link Node}).
	 * @param text The text content of the label.
	 * @param options Optional additional options for the label (see {@link TAddLabelOptions}).
	 * @returns {Label | undefined} The created label, or undefined if creation failed.
	 *
	 * @example Add a simple label
	 * ```ts
	 * mapView.Labels.add(space, 'Welcome', { appearance: { color: 'blue' } });
	 * ```
	 *
	 * @example Add a high-priority interactive label
	 * ```ts
	 * mapView.Labels.add(space, 'Main Entrance', {
	 *   rank: 'always-visible',
	 *   interactive: true,
	 *   appearance: {
	 *     color: 'red',
	 *     backgroundColor: 'white',
	 *     fontSize: 14
	 *   }
	 * });
	 * ```
	 *
	 * @see [Labels Guide](https://developer.mappedin.com/web-sdk/labels)
	 */
	add(target: IAnchorable, text: string, options?: TAddLabelOptions | undefined): Label;
	/**
	 * @experimental
	 * @warning **EXPERIMENTAL FEATURE UNDER CONSTRUCTION**
	 *
	 * This is an experimental feature that may undergo significant changes,
	 * including breaking changes, renaming, or complete removal in future versions.
	 * Do not rely on this API in production environments.
	 *
	 * Automatically adds all the labels ({@link Label}) to the map.
	 *
	 * The text, appearance, priority, etc. of the labels will be automatically determined based on the external data from the map.
	 *
	 * @param options Optional additional options for the labels, similar to those in the `add` method (see {@link TAddLabelOptions}).
	 * @returns An array of all created {@link Label} instances.
	 *
	 * @example Add all labels with default settings
	 * ```ts
	 * const labels = mapView.Labels.__EXPERIMENTAL__all();
	 * ```
	 *
	 * @example Add all labels with custom appearance
	 * ```ts
	 * const labels = mapView.Labels.__EXPERIMENTAL__all({
	 *   appearance: { color: 'darkblue' },
	 *   rank: 'high'
	 * });
	 * ```
	 */
	__EXPERIMENTAL__all(options?: TAddLabelOptions): Label[];
	/**
	 * Removes a label ({@link Label}) from the map.
	 *
	 * @param label The label which should be removed.
	 * @example
	 * mapView.Labels.remove(label);
	 */
	remove(label: Label): void;
	/**
	 * Removes all the labels ({@link Label}) from the map.
	 *
	 * @returns An array of all removed {@link Label} instances.
	 * @example
	 * const removedLabels = mapView.Labels.removeAll();
	 */
	removeAll(): Label[];
}
type CurrentMapGetter$2 = () => GeojsonApiMapObject | undefined;
/**
 * ## Markers in Mappedin JS
 *
 * Markers are interactive HTML elements anchored to a {@link Door}, {@link Space}, {@link Coordinate}, or {@link Node} on the map. They automatically rotate and reposition as the camera moves, making them ideal for highlighting points of interest, custom icons, or interactive UI overlays.
 *
 * ### Features
 * - Fully customizable HTML content
 * - Automatic collision management and visibility ranking
 * - Support for interactivity (click, hover, etc.)
 * - Dynamic resizing and animation
 *
 * > **Best Practice:** Use the `rank` option to control marker visibility priority. Use `interactive: true` to enable SDK-level click/hover events, or `'pointer-events-auto'` for native browser pointer events.
 *
 * ### Example Usage
 * ```ts
 * // Add a simple marker
 * mapView.Markers.add(coordinate, '<div>Marker Content</div>', { interactive: true });
 *
 * // Add a marker with custom placement and high priority
 * mapView.Markers.add(space, '<div>Shop</div>', { placement: 'top', rank: 'always-visible' });
 *
 * // Remove a marker
 * mapView.Markers.remove(marker);
 *
 * // Remove all markers
 * mapView.Markers.removeAll();
 *
 * // Move a marker to a new coordinate
 * mapView.Markers.setPosition(marker, newCoordinate);
 *
 * // Animate a marker to a new coordinate
 * mapView.Markers.animateTo(marker, newCoordinate, { duration: 1000 });
 * ```
 *
 * ### Advanced
 * - Dynamic resizing is enabled by default - use `dynamicResize: false` for static content.
 * - Use `zIndex` and `rank: 'always-visible'` to keep important markers on top.
 *
 * ### More Information
 * - [Markers Guide](https://developer.mappedin.com/web-sdk/markers)
 *
 * This class is accessed using {@link MapView.Markers}.
 */
export declare class Markers {
	#private;
	/**
	 * @internal
	 */
	get currentMap(): GeojsonApiMapObject | undefined;
	/**
	 * @internal
	 */
	constructor({ currentMapGetter }: {
		currentMapGetter: CurrentMapGetter$3;
	});
	getAll(): Marker[];
	/**
	 * @internal
	 */
	getById(id: string): {
		marker: Marker;
		entityId: string;
	} | undefined;
	/**
	 * Adds a marker to the map.
	 *
	 * @param target The target object ({@link IAnchorable}) for the marker (e.g., {@link Space}, {@link Door}, {@link Coordinate}, or {@link Node}).
	 * @param html The HTML content for the {@link Marker}.
	 * @param options Optional additional options for the {@link Marker} (see {@link TAddMarkerOptions}).
	 * @returns {Marker | undefined} The created {@link Marker}, or undefined if creation failed.
	 *
	 * @example Add an interactive marker with custom HTML
	 * ```ts
	 * mapView.Markers.add(coordinate, '<div>Marker Content</div>', { interactive: true });
	 * ```
	 *
	 * @example Add a marker with high priority and custom placement
	 * ```ts
	 * mapView.Markers.add(space, '<div>Shop</div>', { placement: 'top', rank: 'always-visible' });
	 * ```
	 *
	 * @see [Markers Guide](https://developer.mappedin.com/web-sdk/markers)
	 */
	add(target: IAnchorable, html: string, options?: TAddMarkerOptions): Marker;
	/**
	 * Removes a marker from the map.
	 *
	 * @param marker {Marker} The {@link Marker} which should be removed.
	 * @example
	 * mapView.Markers.remove(marker);
	 */
	remove(marker: Marker): void;
	/**
	 * Remove all the markers from the map.
	 *
	 * @example
	 * mapView.Markers.removeAll();
	 */
	removeAll(): Marker[];
	/**
	 * Update the position of a marker.
	 * @param marker The {@link Marker} which should be moved.
	 * @param target The new target object ({@link Space}, {@link Door}, or {@link Coordinate}) for the marker.
	 * @example
	 * const marker = mapView.Markers.add(coordinate, '<div>Marker Content</div>');
	 * mapView.Markers.setPosition(marker, newCoordinate);
	 */
	setPosition(marker: Marker, target: IAnchorable): void;
	/**
	 * Update the position of a marker with an animation.
	 * @param marker The {@link Marker} which should be updated.
	 * @param target The new target object ({@link Space}, {@link Door}, or {@link Coordinate}) for the marker.
	 * @param options Optional additional options for the animation (see {@link TAnimationOptions}).
	 * @returns {Promise<void>} A promise that resolves when the animation is complete.
	 * @example
	 * const marker = mapView.Markers.add(coordinate, '<div>Marker Content</div>');
	 * mapView.Markers.animateTo(marker, newCoordinate, { duration: 1000 });
	 */
	animateTo(marker: Marker, target: IAnchorable, options?: TAnimationOptions): Promise<void>;
}
type CurrentMapGetter$3 = () => GeojsonApiMapObject | undefined;
/**
 * ## 3D images in Mappedin JS
 *
 * Images can enhance indoor maps by adding custom branding, highlighting important features, or providing additional visual information. They can be placed on any {@link Door}, {@link Space}, or {@link Coordinate} and support various positioning and styling options.
 *
 * ### Features
 * - Support for JPEG and PNG formats
 * - Automatic caching and reuse of identical URLs
 * - Customizable size, rotation, and vertical offset
 * - Option to face the camera automatically
 * - Memory-efficient rendering
 *
 * > **Best Practice:** Consider image memory usage carefully. The SDK caches images with the same URL, so reuse images when possible. Large images can impact performance on mobile devices.
 *
 * ### Memory Usage Calculation
 * Formula: `width * height * 4 bytes/pixel = memory used`
 * - 512 x 512 Pixel Image: `512px * 512px * 4 bytes/pixel = 1MB`
 * - 4096 x 4096 Pixel Image: `4096px * 4096px * 4 bytes/pixel = 64MB`
 *
 * ### Example Usage
 * ```ts
 * // Add a simple image
 * mapView.Image3D.add(coordinate, 'https://example.com/logo.png', { width: 2, height: 1 });
 *
 * // Add an image with custom positioning
 * mapView.Image3D.add(space, 'https://example.com/banner.jpg', {
 *   width: 3,
 *   height: 1.5,
 *   rotation: 45,
 *   verticalOffset: 2
 * });
 *
 * // Add an image that faces the camera
 * mapView.Image3D.add(coordinate, 'https://example.com/icon.png', {
 *   width: 1,
 *   height: 1,
 *   flipImageToFaceCamera: true
 * });
 *
 * // Remove an image
 * mapView.Images.remove(image);
 *
 * // Remove all images
 * mapView.Images.removeAll();
 * ```
 *
 * ### Advanced
 * - Use `flipImageToFaceCamera: true` for billboard-style images that always face the user.
 * - Use `verticalOffset` to position images above or below the anchor point.
 * - Use `rotation` to orient images in specific directions.
 *
 * ### Performance Tips
 * - Reuse image URLs to take advantage of caching.
 * - Use appropriately sized images for your use case.
 * - Consider using smaller images on mobile devices.
 *
 * ### More Information
 * - [Images Guide](https://developer.mappedin.com/web-sdk/images-textures)
 *
 * This class is accessed using {@link MapView.Image3D}.
 */
export declare class Image3D {
	#private;
	/**
	 * @internal
	 */
	get currentMap(): GeojsonApiMapObject | undefined;
	/**
	 * @internal
	 */
	constructor({ currentMapGetter }: {
		currentMapGetter: CurrentMapGetter$4;
	});
	/**
	 * @internal
	 */
	getById(id: string): {
		image: Image3DView;
		entityId: string;
	} | undefined;
	/**
	 * Adds an image to the map.
	 *
	 * @param target The target object ({@link IAnchorable}) for the image (e.g., {@link Space}, {@link Door}, or {@link Coordinate}).
	 * @param url The URL of the image (JPEG or PNG format).
	 * @param options Configuration options for the image (see {@link TAddImageOptions}).
	 * @returns {Image | undefined} The created {@link Image}, or undefined if creation failed.
	 *
	 * @example Add a simple image
	 * ```ts
	 * mapView.Image3D.add(coordinate, 'https://example.com/logo.png', { width: 2, height: 1 });
	 * ```
	 *
	 * @example Add an image with custom positioning
	 * ```ts
	 * mapView.Image3D.add(space, 'https://example.com/banner.jpg', {
	 *   width: 3,
	 *   height: 1.5,
	 *   rotation: 45,
	 *   verticalOffset: 2
	 * });
	 * ```
	 *
	 * @example Add a billboard-style image
	 * ```ts
	 * mapView.Image3D.add(coordinate, 'https://example.com/icon.png', {
	 *   width: 1,
	 *   height: 1,
	 *   flipImageToFaceCamera: true
	 * });
	 * ```
	 *
	 * @see [Images Guide](https://developer.mappedin.com/web-sdk/images-textures)
	 */
	add(target: IAnchorable, url: string, options: TAddImageOptions): Image3DView;
	/**
	 * Removes an image from the map.
	 *
	 * @param image {Image} The {@link Image} which should be removed.
	 * @example
	 * mapView.Images.remove(image);
	 */
	remove(image: Image3DView): void;
	/**
	 * Remove all the images from the map.
	 *
	 * @returns An array of all removed {@link Image} instances.
	 * @example
	 * const removedImages = mapView.Images.removeAll();
	 */
	removeAll(): Image3DView[];
}
type CurrentMapGetter$4 = () => GeojsonApiMapObject | undefined;
type CurrentMapGetter$5 = () => GeojsonApiMapObject | undefined;
/**
 * ## 3D Models in Mappedin JS
 *
 * 3D models can be used to represent landmarks, assets, or furniture, providing a rich and interactive indoor map experience. Mappedin JS supports models in GLTF and GLB formats. **Models with nested meshes are not supported.**
 *
 * ### Supported Formats
 * - GLTF (.gltf)
 * - GLB (.glb)
 * - Inline base64 models (from the Mappedin 3D Assets Library)
 *
 * ### Adding 3D Models
 * Use the `add` method to place a model at a specific {@link Coordinate}.
 *
 * ### Mappedin 3D Assets Library
 * Mappedin provides a library of ready-to-use 3D models for common indoor objects. You can install it via npm:
 *
 * ```bash
 * npm install @mappedin/3d-assets
 * ```
 *
 * - [Mappedin 3D Assets on npm](https://www.npmjs.com/package/@mappedin/3d-assets)
 *
 * #### Usage (Self-hosted GLB files)
 * ```ts
 * const coordinate = mapView.createCoordinate(45, -75);
 * mapView.Models.add(coordinate, 'https://your-domain.com/assets/model.glb');
 * ```
 *
 * #### Usage (Direct base64 imports)
 * ```ts
 * import { bed } from '@mappedin/3d-assets/inline';
 * const coordinate = mapView.createCoordinate(45, -75);
 * mapView.Models.add(coordinate, bed);
 * ```
 *
 * > **Best Practice:** Use self-hosted GLB files for smaller download size and better caching. Use direct imports for convenience and rapid prototyping.
 *
 * ### Performance Tips
 * - Avoid using models with nested meshes.
 *
 * ### More Information
 * - [3D Models Guide](https://developer.mappedin.com/web-sdk/3d-models)
 * - [Mappedin 3D Assets Library](https://www.npmjs.com/package/@mappedin/3d-assets)
 *
 * This class is accessed using {@link MapView.Models}.
 */
export declare class Models {
	#private;
	/**
	 * @internal
	 */
	get currentMap(): GeojsonApiMapObject | undefined;
	/**
	 * @internal
	 */
	constructor({ currentMapGetter }: {
		currentMapGetter: CurrentMapGetter$5;
	});
	/**
	 * @internal
	 */
	getById(id: string): {
		model: Model;
		entityId: string;
		groupId: string;
	} | undefined;
	/**
	 * Adds a 3D model to the map at the specified coordinate.
	 *
	 * @param coordinate - The {@link Coordinate} where the model will be placed.
	 * @param url - The URL to the GLTF or GLB model file, or an inline base64 encoded 3D asset from the [Mappedin 3D Assets Library](https://www.npmjs.com/package/@mappedin/3d-assets).
	 * @param options - Configuration options for the model using {@link TAddModelOptions}.
	 * @returns A {@link Model} instance representing the added 3D model.
	 *
	 * @example Add a model from a self-hosted GLB file
	 * ```ts
	 * const coordinate = mapView.createCoordinate(45, -75);
	 * mapView.Models.add(coordinate, 'https://your-domain.com/assets/model.glb', {
	 *   scale: [1, 1, 1],
	 *   rotation: [0, 0, 0],
	 *   interactive: true
	 * });
	 * ```
	 *
	 * @example Add a model from the Mappedin 3D Assets Library (base64 import)
	 * ```ts
	 * import { bed } from '@mappedin/3d-assets/inline';
	 * const coordinate = mapView.createCoordinate(45, -75);
	 * mapView.Models.add(coordinate, bed, {
	 *   scale: [0.5, 0.5, 0.5],
	 *   rotation: [0, 90, 0],
	 *   interactive: true
	 * });
	 * ```
	 *
	 * @see [3D Models Guide](https://developer.mappedin.com/web-sdk/3d-models)
	 * @see [Mappedin 3D Assets Library](https://www.npmjs.com/package/@mappedin/3d-assets)
	 */
	add(coordinate: Coordinate, url: string, options?: TAddModelOptions): Model;
	/**
	 * Removes a model from the map.
	 *
	 * @param model - The {@link Model} instance which should be removed.
	 * @example
	 * mapView.Models.remove(model);
	 */
	remove(model: Model): void;
	/**
	 * Remove all the models from the map.
	 *
	 * @returns An array of all removed {@link Model} instances.
	 * @example
	 * const removedModels = mapView.Models.removeAll();
	 */
	removeAll(): Model[];
}
/**
 * ## Paths in Mappedin JS
 *
 * Paths allow you to draw custom routes on the map, from simple straight lines between coordinates to complex navigation paths that avoid obstacles. While {@link Navigation} provides complete turn-by-turn directions, Paths give you fine-grained control over route visualization.
 *
 * ### Features
 * - Draw paths between any coordinates
 * - Customizable styling (color, width, animation, etc.)
 * - Integration with navigation directions
 * - Animated path drawing and pulse effects
 * - Support for dashed lines and arrows
 *
 * > **Best Practice:** Use `MapData.getDirections()` to generate navigation-aware paths that avoid walls and follow walkable routes, rather than drawing straight lines between coordinates.
 *
 * ### Example Usage
 * ```ts
 * // Draw a simple straight path
 * const path = mapView.Paths.add([coord1, coord2], { color: '#ff0000' });
 *
 * // Draw a navigation path using directions
 * const directions = await mapView.getDirections(space1, space2);
 * if (directions) {
 *   const path = mapView.Paths.add(directions.path, {
 *     color: '#4b90e2',
 *     showPulse: true,
 *     animateDrawing: true
 *   });
 * }
 *
 * // Remove a path
 * mapView.Paths.remove(path);
 *
 * // Remove all paths
 * mapView.Paths.removeAll();
 * ```
 *
 * ### Path Styling Options
 * - `color`: Path color (default: '#4b90e2')
 * - `width`: Path width. Can be a number or an {@link Interpolation}.
 * - `showPulse`: Animated pulse indicating direction
 * - `animateDrawing`: Animate path drawing
 * - `displayArrowsOnPath`: Show direction arrows
 * - `dashed`: Use dashed line style
 *
 * ### Advanced
 * - Use `interactive: true` to make paths clickable.
 *
 * ### More Information
 * - [Wayfinding Guide](https://developer.mappedin.com/web-sdk/wayfinding#drawing-a-path)
 *
 * This class is accessed using {@link MapView.Paths}.
 */
export declare class Paths {
	#private;
	/**
	 * @internal
	 */
	get currentMap(): GeojsonApiMapObject | undefined;
	/**
	 * @internal
	 */
	constructor({ currentMapGetter }: {
		currentMapGetter: CurrentMapGetter$6;
	});
	/**
	 * @internal
	 */
	getById(id: string): Path | undefined;
	/**
	 * Adds a path ({@link Path}) to the map.
	 * @param coordinates Array of coordinates ({@link Coordinate}) to form the path.
	 * @param options Optional styling and behavior options (see {@link TAddPathOptions}).
	 * @returns A {@link Path} instance representing the created path.
	 *
	 * @example Draw a simple red path
	 * ```ts
	 * const path = mapView.Paths.add([coord1, coord2], { color: '#ff0000' });
	 * ```
	 *
	 * @example Draw a navigation path with animation
	 * ```ts
	 * const directions = await mapView.getDirections(space1, space2);
	 * if (directions) {
	 *   const path = mapView.Paths.add(directions.path, {
	 *     color: '#4b90e2',
	 *     showPulse: true,
	 *     animateDrawing: true,
	 *     displayArrowsOnPath: true
	 *   });
	 * }
	 * ```
	 *
	 * @example Draw a dashed path with custom width
	 * ```ts
	 * const path = mapView.Paths.add(coordinates, {
	 *   color: '#00ff00',
	 *   dashed: true,
	 *   width: 1,
	 * });
	 * ```
	 *
	 * @see [Wayfinding Guide](https://developer.mappedin.com/web-sdk/wayfinding#drawing-a-path)
	 */
	add(coordinates: Coordinate[], options?: {
		id?: string;
	} & TAddPathOptions): Path;
	/**
	 *
	 * Highlights a section of a path between two coordinates.
	 *
	 * @param path The path to highlight.
	 * @param start The start coordinate.
	 * @param end The end coordinate.
	 * @param options The options for the highlight.
	 */
	highlightPathSection(path: Path, start: Coordinate, end: Coordinate, options?: TPathSectionHighlightOptions): {
		animation: Promise<unknown>;
	} | undefined;
	/**
	 * Clears the highlighted section of a path.
	 * @param path The path to clear the highlight from.
	 */
	clearHighlightedPathSection(path: Path): void;
	/**
	 * Clears the highlighted section of all paths.
	 */
	clearAllHighlightedPathSections(): void;
	/**
	 * Removes a specific path ({@link Path}) from the map.
	 * @param path The path to be removed.
	 * @example
	 * mapView.Paths.remove(path);
	 */
	remove(path: Path): void;
	/**
	 * Removes all paths ({@link Path}) from the map.
	 *
	 * @returns An array of all removed {@link Path} instances.
	 * @example
	 * const removedPaths = mapView.Paths.removeAll();
	 */
	removeAll(): Path[];
}
type CurrentMapGetter$6 = () => GeojsonApiMapObject | undefined;
declare class Style$2 {
	#private;
	/**
	 * @internal
	 */
	get currentMap(): GeojsonApiMapObject | undefined;
	/**
	 * @internal
	 */
	constructor({ currentMapGetter }: {
		currentMapGetter: CurrentMapGetter$7;
	});
	setFromStyleCollection(styleCollection: StyleCollection): void;
}
type CurrentMapGetter$7 = () => GeojsonApiMapObject | undefined;
type HiddenOutdoorGeometry = [
	BBox,
	polygons: Feature$1<Polygon$1 | MultiPolygon$1, any>[],
	layers: string[]
];
/**
 * The outdoor map shown around the Mappedin indoor map can be manipulated to show or hide additional information. It can be used to add GeoJSON based geometry, images, deck.gl layers and more.
 *
 * The outdoor map is accessed using {@link MapView.Outdoor}, which returns a maplibregl.Map object.
 * [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) is a TypeScript library that uses WebGL to render interactive maps from vector tiles in a browser. The Mappedin SDK makes use of it to display the outdoor map.
 *
 * By providing access to the MapLibre map used to draw the outdoor map, the Mappedin SDK enables developers to draw on and manipulate the outdoor map.
 * Developers can use most capabilities of MapLibre GL JS with key exceptions being Interactivity and Camera, which are not available.
 *
 * User touch and click events are handled by Mappedin JS and are not propagated to the outdoor map layer. Camera movement is also handled by Mappedin JS and cannot be manipulated using MapLibre controls.
 *
 * Refer to the [Outdoor Map Guide](https://developer.mappedin.com/web-sdk/outdoor-map) for more information and interactive examples.
 */
export declare class Outdoor {
	#private;
	/**
	 * @internal
	 */
	constructor(core: Core, hiddenOutdoorGeometry?: HiddenOutdoorGeometry[]);
	/**
	 * Set the style of the outdoor map. Use one of [Mappedin's predefined styles](https://developer.mappedin.com/web-sdk/outdoor-map#styles) or link to a custom style.
	 * @param style {any}
	 */
	setStyle(style: any): void;
	/**
	 * Returns a Maplibre map for advanced usage.
	 *
	 * @returns {object} Maplibre map instance
	 *
	 * Limitations:
	 * - Maplibre interaction events are not supported, use Mappedin JS interaction events.
	 * - Maplibre markers and labels may overlap as they are not integrated with the Mappedin JS collision engine.
	 */
	get map(): Map$1 | undefined;
	/**
	 * Whether the outdoorView is enabled.
	 */
	get enabled(): boolean;
	/**
	 * Whether the outdoorView is visible.
	 */
	get visible(): boolean;
	/**
	 * Show the outdoor map.
	 */
	show(): void;
	/**
	 * Hide the outdoor map.
	 * @param excludedStyleLayerIds {string[]}
	 */
	hide(excludedStyleLayerIds?: string[]): void;
	/**
	 * Set outdoor view opacity.
	 * @param targetOpacity {number | 'initial'}
	 * @param excludedStyleLayerIds {string[]}
	 */
	setOpacity(targetOpacity: number | "initial", excludedStyleLayerIds?: string[]): void;
}
/**
 * Disables the Text3D web worker and falls back to processing on the main thread.
 *
 * This function should be called when using Text3D features in environments
 * with strict Content Security Policy (CSP) that blocks web workers from
 * being created using blob: URLs or unsafe-eval directives.
 *
 * While disabling the worker may slightly impact performance for complex text
 * rendering, it enables Text3D functionality in CSP-restricted environments.
 *
 * Ensure calling this before calling preloadFont
 *
 * @example
 * ```typescript
 * import {disableText3DWorker} from '@mappedin/mappedin-js';
 * // Disable Text3D worker for CSP compatibility
 * disableText3DWorker();
 *
 * // Then use Text3D features as normal
 * mapView.Text3D.labelAll();
 * ```
 */
export declare function disableText3DWorker(): void;
/**
 * ## Text3D in Mappedin JS
 *
 * Text3D creates three-dimensional text labels that are rendered directly in the 3D scene. These labels are perfect for displaying space names, room numbers, or any text that needs to be visible from any angle in the 3D environment.
 *
 * ### Features
 * - 3D text rendering with depth and perspective
 * - Automatic text wrapping and sizing
 * - Customizable fonts, colors, and materials
 * - Performance-optimized with web worker support
 *
 * ### Example Usage
 * ```ts
 * // Create labels for all spaces
 * const labels = mapView.Text3D.labelAll();
 *
 * // Create a label for a specific space
 * const label = mapView.Text3D.label(space, "Room 101", { fontSize: 12 });
 *
 * // Remove a specific label
 * mapView.Text3D.remove(label);
 *
 * // Remove all labels
 * mapView.Text3D.removeAll();
 * ```
 *
 * ### Performance Considerations
 * - Use `labelAll()` for better performance when creating multiple labels.
 *
 * ### Advanced
 * - Customize text appearance with fonts, colors, and materials.
 * - Use `labelAll()` with options to apply consistent styling to all labels.
 * - Text3D labels are automatically positioned and sized based on space geometry.
 *
 * This class is accessed using {@link MapView.Text3D}.
 */
export declare class Text3D {
	#private;
	/**
	 * @internal
	 */
	constructor({ currentMapGetter }: {
		currentMapGetter: CurrentMapGetter$5;
	});
	/**
	 * Creates polygon labels for all spaces.
	 *
	 * @param options Configuration options for text label creation (see {@link AddText3DOptions}).
	 * @returns An array of Text3DView instances representing the created labels. If a space is already labeled, the existing Text3D instance will be returned.
	 *
	 * @example Create labels for all spaces with default settings
	 * ```ts
	 * const labels = mapView.Text3D.labelAll();
	 * ```
	 *
	 * @example Create labels with custom styling
	 * ```ts
	 * const labels = mapView.Text3D.labelAll({
	 *   fontSize: 14,
	 *   color: 'white',
	 *   backgroundColor: 'rgba(0, 0, 0, 0.7)'
	 * });
	 * ```
	 *
	 * @see [Text3D Guide](https://developer.mappedin.com/web-sdk/text3d)
	 */
	labelAll(options?: TAddText3DOptions): Text3DView[];
	/**
	 * Creates a 3D text label for a given space.
	 *
	 * @param target The target space to label.
	 * @param content The content of the label. If not provided, target.name will be used.
	 * @param options Configuration options for the text label creation (see {@link AddText3DOptions}).
	 * @returns A Text3DView instance representing the created label, or undefined if creation failed.
	 *
	 * @throws {Error} If the target is not a Space.
	 *
	 * @example Create a label with custom text
	 * ```ts
	 * const label = mapView.Text3D.label(space, "Conference Room A", { fontSize: 12 });
	 * ```
	 *
	 * @example Create a label using space name
	 * ```ts
	 * const label = mapView.Text3D.label(space); // Uses space.name
	 * ```
	 *
	 * @example Create a label with custom styling
	 * ```ts
	 * const label = mapView.Text3D.label(space, "VIP Room", {
	 *   fontSize: 16,
	 *   color: 'gold',
	 *   backgroundColor: 'rgba(0, 0, 0, 0.8)'
	 * });
	 * ```
	 *
	 * @see [Text3D Guide](https://developer.mappedin.com/web-sdk/text3d)
	 */
	label(target: Space, content?: string, options?: TAddText3DOptions): Text3DView | undefined;
	/**
	 * Removes one or more Text3D labels from the map.
	 *
	 * @param target Can be either:
	 * - A single Text3DView instance
	 * - An array of Text3DView instances
	 * - A string ID of the Text3DView to remove
	 *
	 * @example Remove a single text label
	 * ```ts
	 * mapView.Text3D.remove(text3dView);
	 * ```
	 *
	 * @example Remove multiple text labels
	 * ```ts
	 * mapView.Text3D.remove([text3dView1, text3dView2]);
	 * ```
	 *
	 * @example Remove by ID
	 * ```ts
	 * mapView.Text3D.remove("text3d-123");
	 * ```
	 */
	remove(target: Text3DView): void;
	remove(target: string): void;
	/**
	 * Removes all Text3D labels from the current map.
	 *
	 * @example
	 * ```ts
	 * mapView.Text3D.removeAll();
	 * ```
	 */
	removeAll(): void;
}
declare const doorsStateSchemaPartial: z.ZodObject<{
	type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"doors">>>;
	color: z.ZodOptional<z.ZodDefault<z.ZodString>>;
	topColor: z.ZodOptional<z.ZodOptional<z.ZodString>>;
	texture: z.ZodOptional<z.ZodOptional<z.ZodObject<{
		url: z.ZodOptional<z.ZodString>;
	}, z.core.$strip>>>;
	topTexture: z.ZodOptional<z.ZodOptional<z.ZodObject<{
		url: z.ZodOptional<z.ZodString>;
	}, z.core.$strip>>>;
	visible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	opacity: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, z.core.$strip>;
declare const doorsStateSchemaStrict: z.ZodObject<{
	type: z.ZodDefault<z.ZodLiteral<"doors">>;
	color: z.ZodDefault<z.ZodString>;
	topColor: z.ZodOptional<z.ZodString>;
	texture: z.ZodOptional<z.ZodObject<{
		url: z.ZodOptional<z.ZodString>;
	}, z.core.$strip>>;
	topTexture: z.ZodOptional<z.ZodObject<{
		url: z.ZodOptional<z.ZodString>;
	}, z.core.$strip>>;
	visible: z.ZodDefault<z.ZodBoolean>;
	opacity: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export type TDoorsState = z.infer<typeof doorsStateSchemaStrict>;
export type TDoorsUpdateState = z.infer<typeof doorsStateSchemaPartial>;
declare const facadeStateSchemaPartial: z.ZodObject<{
	type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"facade">>>;
	opacity: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	visible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.core.$strip>;
declare const facadeStateSchemaStrict: z.ZodObject<{
	type: z.ZodDefault<z.ZodLiteral<"facade">>;
	opacity: z.ZodDefault<z.ZodNumber>;
	visible: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strict>;
export type TFacadeState = z.infer<typeof facadeStateSchemaStrict>;
export type TFacadeUpdateState = z.infer<typeof facadeStateSchemaPartial>;
declare const floorStateSchemaPartial: z.ZodObject<{
	geometry: z.ZodOptional<z.ZodObject<{
		type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"floor.geometry">>>;
		opacity: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
		visible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	}, z.core.$strip>>;
	labels: z.ZodOptional<z.ZodObject<{
		type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"floor.labels">>>;
		enabled: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	}, z.core.$strip>>;
	markers: z.ZodOptional<z.ZodObject<{
		type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"floor.markers">>>;
		enabled: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	}, z.core.$strip>>;
	images: z.ZodOptional<z.ZodObject<{
		type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"floor.images">>>;
		visible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	}, z.core.$strip>>;
	footprint: z.ZodOptional<z.ZodObject<{
		type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"floor.footprint">>>;
		altitude: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
		visible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
		height: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
		opacity: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
		side: z.ZodOptional<z.ZodEnum<{
			double: "double";
			front: "front";
			back: "back";
		}>>;
		color: z.ZodOptional<z.ZodDefault<z.ZodString>>;
	}, z.core.$strip>>;
	occlusion: z.ZodOptional<z.ZodObject<{
		type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"floor.occlusion">>>;
		enabled: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	}, z.core.$strip>>;
	paths: z.ZodOptional<z.ZodObject<{
		type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"floor.paths">>>;
		visible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	}, z.core.$strip>>;
	areas: z.ZodOptional<z.ZodObject<{
		type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"floor.areas">>>;
		visible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	}, z.core.$strip>>;
	type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"floor">>>;
	visible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	altitude: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, z.core.$strip>;
declare const floorStateSchemaStrict: z.ZodObject<{
	geometry: z.ZodObject<{
		type: z.ZodDefault<z.ZodLiteral<"floor.geometry">>;
		opacity: z.ZodDefault<z.ZodNumber>;
		visible: z.ZodDefault<z.ZodBoolean>;
	}, z.core.$strict>;
	labels: z.ZodObject<{
		type: z.ZodDefault<z.ZodLiteral<"floor.labels">>;
		enabled: z.ZodDefault<z.ZodBoolean>;
	}, z.core.$strict>;
	markers: z.ZodObject<{
		type: z.ZodDefault<z.ZodLiteral<"floor.markers">>;
		enabled: z.ZodDefault<z.ZodBoolean>;
	}, z.core.$strict>;
	images: z.ZodObject<{
		type: z.ZodDefault<z.ZodLiteral<"floor.images">>;
		visible: z.ZodDefault<z.ZodBoolean>;
	}, z.core.$strict>;
	footprint: z.ZodObject<{
		type: z.ZodDefault<z.ZodLiteral<"floor.footprint">>;
		altitude: z.ZodDefault<z.ZodNumber>;
		visible: z.ZodDefault<z.ZodBoolean>;
		height: z.ZodDefault<z.ZodNumber>;
		opacity: z.ZodDefault<z.ZodNumber>;
		side: z.ZodEnum<{
			double: "double";
			front: "front";
			back: "back";
		}>;
		color: z.ZodDefault<z.ZodString>;
	}, z.core.$strict>;
	occlusion: z.ZodObject<{
		type: z.ZodDefault<z.ZodLiteral<"floor.occlusion">>;
		enabled: z.ZodDefault<z.ZodBoolean>;
	}, z.core.$strict>;
	paths: z.ZodObject<{
		type: z.ZodDefault<z.ZodLiteral<"floor.paths">>;
		visible: z.ZodDefault<z.ZodBoolean>;
	}, z.core.$strict>;
	areas: z.ZodObject<{
		type: z.ZodDefault<z.ZodLiteral<"floor.areas">>;
		visible: z.ZodDefault<z.ZodBoolean>;
	}, z.core.$strict>;
	type: z.ZodDefault<z.ZodLiteral<"floor">>;
	visible: z.ZodDefault<z.ZodBoolean>;
	altitude: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export type TFloorState = z.infer<typeof floorStateSchemaStrict>;
export type TFloorUpdateState = z.infer<typeof floorStateSchemaPartial>;
declare const geometryStateSchemaPartial: z.ZodObject<{
	type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"geometry">>>;
	visible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	color: z.ZodOptional<z.ZodDefault<z.ZodUnion<readonly [
		z.ZodString,
		z.ZodLiteral<"initial">
	]>>>;
	topColor: z.ZodOptional<z.ZodOptional<z.ZodUnion<readonly [
		z.ZodString,
		z.ZodLiteral<"initial">
	]>>>;
	hoverColor: z.ZodOptional<z.ZodOptional<z.ZodUnion<readonly [
		z.ZodString,
		z.ZodLiteral<"initial">
	]>>>;
	interactive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	opacity: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	height: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	altitude: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	texture: z.ZodOptional<z.ZodOptional<z.ZodObject<{
		url: z.ZodString;
	}, z.core.$strip>>>;
	topTexture: z.ZodOptional<z.ZodOptional<z.ZodObject<{
		url: z.ZodString;
	}, z.core.$strip>>>;
	flipImageToFaceCamera: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	enableImageCollisions: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	borderVisible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	borderColor: z.ZodOptional<z.ZodOptional<z.ZodString>>;
	borderWidth: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
declare const geometryStateSchemaStrict: z.ZodObject<{
	type: z.ZodDefault<z.ZodLiteral<"geometry">>;
	visible: z.ZodDefault<z.ZodBoolean>;
	color: z.ZodDefault<z.ZodUnion<readonly [
		z.ZodString,
		z.ZodLiteral<"initial">
	]>>;
	topColor: z.ZodOptional<z.ZodUnion<readonly [
		z.ZodString,
		z.ZodLiteral<"initial">
	]>>;
	hoverColor: z.ZodOptional<z.ZodUnion<readonly [
		z.ZodString,
		z.ZodLiteral<"initial">
	]>>;
	interactive: z.ZodDefault<z.ZodBoolean>;
	opacity: z.ZodDefault<z.ZodNumber>;
	height: z.ZodDefault<z.ZodNumber>;
	altitude: z.ZodDefault<z.ZodNumber>;
	texture: z.ZodOptional<z.ZodObject<{
		url: z.ZodString;
	}, z.core.$strip>>;
	topTexture: z.ZodOptional<z.ZodObject<{
		url: z.ZodString;
	}, z.core.$strip>>;
	flipImageToFaceCamera: z.ZodDefault<z.ZodBoolean>;
	enableImageCollisions: z.ZodDefault<z.ZodBoolean>;
	borderVisible: z.ZodDefault<z.ZodBoolean>;
	borderColor: z.ZodOptional<z.ZodString>;
	borderWidth: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
/**
 * Defines the state for geometry elements like {@link Space} when updated.
 */
export type TGeometryState = z.infer<typeof geometryStateSchemaStrict>;
export type TGeometryUpdateState = z.infer<typeof geometryStateSchemaPartial>;
declare const labelStateSchema: z.ZodObject<{
	type: z.ZodDefault<z.ZodLiteral<"label">>;
	text: z.ZodString;
	rank: z.ZodCustom<TCollisionRankingTier | "initial", TCollisionRankingTier | "initial">;
	appearance: z.ZodCustom<LabelAppearance, LabelAppearance>;
	interactive: z.ZodDefault<z.ZodBoolean>;
	enabled: z.ZodDefault<z.ZodBoolean>;
	textPlacement: z.ZodDefault<z.ZodUnion<readonly [
		z.ZodEnum<{
			hidden: "hidden";
			right: "right";
			left: "left";
			top: "top";
			center: "center";
		}>,
		z.ZodArray<z.ZodEnum<{
			hidden: "hidden";
			right: "right";
			left: "left";
			top: "top";
			center: "center";
		}>>
	]>>;
}, z.core.$strip>;
declare const labelStateSchemaPartial: z.ZodObject<{
	type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"label">>>;
	text: z.ZodOptional<z.ZodString>;
	rank: z.ZodOptional<z.ZodCustom<TCollisionRankingTier | "initial", TCollisionRankingTier | "initial">>;
	appearance: z.ZodOptional<z.ZodCustom<LabelAppearance, LabelAppearance>>;
	interactive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	enabled: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	textPlacement: z.ZodOptional<z.ZodDefault<z.ZodUnion<readonly [
		z.ZodEnum<{
			hidden: "hidden";
			right: "right";
			left: "left";
			top: "top";
			center: "center";
		}>,
		z.ZodArray<z.ZodEnum<{
			hidden: "hidden";
			right: "right";
			left: "left";
			top: "top";
			center: "center";
		}>>
	]>>>;
}, z.core.$strip>;
export type TLabelState = z.infer<typeof labelStateSchema>;
export type TLabelUpdateState = z.infer<typeof labelStateSchemaPartial>;
declare const markerStateSchema: z.ZodObject<{
	type: z.ZodDefault<z.ZodLiteral<"marker">>;
	rank: z.ZodCustom<TCollisionRankingTier | "initial", TCollisionRankingTier | "initial">;
	placement: z.ZodOptional<z.ZodUnion<readonly [
		z.ZodEnum<{
			"top-left": "top-left";
			"top-right": "top-right";
			"bottom-left": "bottom-left";
			"bottom-right": "bottom-right";
			hidden: "hidden";
			right: "right";
			left: "left";
			top: "top";
			center: "center";
			bottom: "bottom";
		}>,
		z.ZodArray<z.ZodEnum<{
			"top-left": "top-left";
			"top-right": "top-right";
			"bottom-left": "bottom-left";
			"bottom-right": "bottom-right";
			hidden: "hidden";
			right: "right";
			left: "left";
			top: "top";
			center: "center";
			bottom: "bottom";
		}>>
	]>>;
	interactive: z.ZodDefault<z.ZodUnion<readonly [
		z.ZodBoolean,
		z.ZodLiteral<"pointer-events-auto">
	]>>;
	dynamicResize: z.ZodDefault<z.ZodBoolean>;
	enabled: z.ZodDefault<z.ZodBoolean>;
	zIndex: z.ZodOptional<z.ZodNumber>;
	lowPriorityPin: z.ZodOptional<z.ZodObject<{
		enabled: z.ZodOptional<z.ZodBoolean>;
		size: z.ZodOptional<z.ZodNumber>;
		color: z.ZodOptional<z.ZodString>;
	}, z.core.$strip>>;
	element: z.ZodCustom<HTMLElement, HTMLElement>;
	contentHTML: z.ZodString;
}, z.core.$strip>;
declare const markerStateSchemaPartial: z.ZodObject<{
	type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"marker">>>;
	enabled: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	interactive: z.ZodOptional<z.ZodDefault<z.ZodUnion<readonly [
		z.ZodBoolean,
		z.ZodLiteral<"pointer-events-auto">
	]>>>;
	rank: z.ZodOptional<z.ZodCustom<TCollisionRankingTier | "initial", TCollisionRankingTier | "initial">>;
	placement: z.ZodOptional<z.ZodOptional<z.ZodUnion<readonly [
		z.ZodEnum<{
			"top-left": "top-left";
			"top-right": "top-right";
			"bottom-left": "bottom-left";
			"bottom-right": "bottom-right";
			hidden: "hidden";
			right: "right";
			left: "left";
			top: "top";
			center: "center";
			bottom: "bottom";
		}>,
		z.ZodArray<z.ZodEnum<{
			"top-left": "top-left";
			"top-right": "top-right";
			"bottom-left": "bottom-left";
			"bottom-right": "bottom-right";
			hidden: "hidden";
			right: "right";
			left: "left";
			top: "top";
			center: "center";
			bottom: "bottom";
		}>>
	]>>>;
	dynamicResize: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	zIndex: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
	lowPriorityPin: z.ZodOptional<z.ZodOptional<z.ZodObject<{
		enabled: z.ZodOptional<z.ZodBoolean>;
		size: z.ZodOptional<z.ZodNumber>;
		color: z.ZodOptional<z.ZodString>;
	}, z.core.$strip>>>;
	contentHTML: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type TMarkerState = z.infer<typeof markerStateSchema>;
export type TMarkerUpdateState = z.infer<typeof markerStateSchemaPartial>;
declare const pathStateSchemaPartial: z.ZodObject<{
	type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"path">>>;
	color: z.ZodOptional<z.ZodDefault<z.ZodString>>;
	width: z.ZodOptional<z.ZodType<number | Interpolation<"zoom-level", number[]>, unknown, z.core.$ZodTypeInternals<number | Interpolation<"zoom-level", number[]>, unknown>>>;
	completeFraction: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	visible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	verticalOffset: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	highlightStartFraction: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	highlightEndFraction: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	highlightColor: z.ZodOptional<z.ZodDefault<z.ZodString>>;
	highlightWidthMultiplier: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	highlightCompleteFraction: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, z.core.$strip>;
declare const pathStateSchemaStrict: z.ZodObject<{
	type: z.ZodDefault<z.ZodLiteral<"path">>;
	color: z.ZodDefault<z.ZodString>;
	width: z.ZodType<number | Interpolation<"zoom-level", number[]>>;
	completeFraction: z.ZodDefault<z.ZodNumber>;
	visible: z.ZodDefault<z.ZodBoolean>;
	verticalOffset: z.ZodDefault<z.ZodNumber>;
	highlightStartFraction: z.ZodDefault<z.ZodNumber>;
	highlightEndFraction: z.ZodDefault<z.ZodNumber>;
	highlightColor: z.ZodDefault<z.ZodString>;
	highlightWidthMultiplier: z.ZodDefault<z.ZodNumber>;
	highlightCompleteFraction: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export type TPathState = z.infer<typeof pathStateSchemaStrict>;
export type TPathUpdateState = z.infer<typeof pathStateSchemaPartial>;
declare const shapeStateSchemaPartial: z.ZodObject<{
	type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"shape">>>;
	visible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	altitude: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	color: z.ZodOptional<z.ZodDefault<z.ZodString>>;
	height: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	opacity: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	interactive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	bevel: z.ZodOptional<z.ZodOptional<z.ZodObject<{
		enabled: z.ZodOptional<z.ZodBoolean>;
		thickness: z.ZodOptional<z.ZodNumber>;
		size: z.ZodOptional<z.ZodNumber>;
		offset: z.ZodOptional<z.ZodNumber>;
		segments: z.ZodOptional<z.ZodNumber>;
	}, z.core.$strip>>>;
}, z.core.$strip>;
declare const shapeStateSchemaStrict: z.ZodObject<{
	type: z.ZodDefault<z.ZodLiteral<"shape">>;
	visible: z.ZodDefault<z.ZodBoolean>;
	altitude: z.ZodDefault<z.ZodNumber>;
	color: z.ZodDefault<z.ZodString>;
	height: z.ZodDefault<z.ZodNumber>;
	opacity: z.ZodDefault<z.ZodNumber>;
	interactive: z.ZodDefault<z.ZodBoolean>;
	bevel: z.ZodOptional<z.ZodObject<{
		enabled: z.ZodOptional<z.ZodBoolean>;
		thickness: z.ZodOptional<z.ZodNumber>;
		size: z.ZodOptional<z.ZodNumber>;
		offset: z.ZodOptional<z.ZodNumber>;
		segments: z.ZodOptional<z.ZodNumber>;
	}, z.core.$strip>>;
}, z.core.$strict>;
/**
 * Represents the state of a shape.
 */
export type TShapeState = z.infer<typeof shapeStateSchemaStrict>;
export type TShapeUpdateState = z.infer<typeof shapeStateSchemaPartial>;
declare const imageStateSchema: z.ZodObject<{
	type: z.ZodDefault<z.ZodLiteral<"image3d">>;
	visible: z.ZodDefault<z.ZodBoolean>;
	opacity: z.ZodDefault<z.ZodNumber>;
	position: z.ZodCustom<Coordinate, Coordinate>;
	width: z.ZodDefault<z.ZodNumber>;
	height: z.ZodDefault<z.ZodNumber>;
	rotation: z.ZodDefault<z.ZodNumber>;
	verticalOffset: z.ZodDefault<z.ZodNumber>;
	flipImagesToFaceCamera: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
declare const imageStateSchemaPartial: z.ZodObject<{
	type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"image3d">>>;
	visible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	opacity: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	position: z.ZodOptional<z.ZodCustom<Coordinate, Coordinate>>;
	width: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	height: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	rotation: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	verticalOffset: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	flipImagesToFaceCamera: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.core.$strip>;
type TImage3DState = z.infer<typeof imageStateSchema>;
type TImage3DUpdateState = z.infer<typeof imageStateSchemaPartial>;
declare const modelStateUpdateSchema: z.ZodObject<{
	altitude: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
	id: z.ZodOptional<z.ZodOptional<z.ZodUnion<readonly [
		z.ZodNumber,
		z.ZodString
	]>>>;
	type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"model">>>;
	color: z.ZodOptional<z.ZodOptional<z.ZodString>>;
	position: z.ZodOptional<z.ZodCustom<Coordinate, Coordinate>>;
	visible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	verticalOffset: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	opacity: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	material: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
		color: z.ZodString;
	}, z.core.$strip>>>>;
	interactive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	clippingPlaneZOffset: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	clippingPlaneTopColor: z.ZodOptional<z.ZodDefault<z.ZodString>>;
	clippingPlaneTopVisible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	scale: z.ZodOptional<z.ZodUnion<readonly [
		z.ZodNumber,
		z.ZodTuple<[
			z.ZodNumber,
			z.ZodNumber,
			z.ZodNumber
		], null>
	]>>;
	rotation: z.ZodOptional<z.ZodUnion<readonly [
		z.ZodNumber,
		z.ZodTuple<[
			z.ZodNumber,
			z.ZodNumber,
			z.ZodNumber
		], null>
	]>>;
}, z.core.$strip>;
declare const modelStateSchemaStrict: z.ZodObject<{
	altitude: z.ZodOptional<z.ZodNumber>;
	id: z.ZodOptional<z.ZodUnion<readonly [
		z.ZodNumber,
		z.ZodString
	]>>;
	type: z.ZodDefault<z.ZodLiteral<"model">>;
	color: z.ZodOptional<z.ZodString>;
	position: z.ZodCustom<Coordinate, Coordinate>;
	visible: z.ZodDefault<z.ZodBoolean>;
	rotation: z.ZodDefault<z.ZodTuple<[
		z.ZodNumber,
		z.ZodNumber,
		z.ZodNumber
	], null>>;
	scale: z.ZodDefault<z.ZodTuple<[
		z.ZodNumber,
		z.ZodNumber,
		z.ZodNumber
	], null>>;
	verticalOffset: z.ZodDefault<z.ZodNumber>;
	opacity: z.ZodDefault<z.ZodNumber>;
	material: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
		color: z.ZodString;
	}, z.core.$strip>>>;
	interactive: z.ZodDefault<z.ZodBoolean>;
	clippingPlaneZOffset: z.ZodDefault<z.ZodNumber>;
	clippingPlaneTopColor: z.ZodDefault<z.ZodString>;
	clippingPlaneTopVisible: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strict>;
/**
 * Represents the state of a model.
 */
export type TModelState = z.infer<typeof modelStateSchemaStrict>;
export type TModelUpdateState = z.infer<typeof modelStateUpdateSchema>;
declare const text3DUpdateStateSchema: z.ZodObject<{
	visible: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
	color: z.ZodOptional<z.ZodOptional<z.ZodString>>;
	flipToFaceCamera: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
	font: z.ZodOptional<z.ZodOptional<z.ZodOptional<z.ZodString>>>;
	fontSize: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
	outlineColor: z.ZodOptional<z.ZodOptional<z.ZodString>>;
	outlineOpacity: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
	outlineBlur: z.ZodOptional<z.ZodOptional<z.ZodUnion<readonly [
		z.ZodNumber,
		z.ZodString
	]>>>;
	outlineWidth: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
	outlineOffsetX: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
	outlineOffsetY: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
	strokeWidth: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
	strokeOpacity: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
	strokeColor: z.ZodOptional<z.ZodOptional<z.ZodString>>;
	fillOpacity: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
	hoverColor: z.ZodOptional<z.ZodOptional<z.ZodOptional<z.ZodString>>>;
	type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"text3d">>>;
	position: z.ZodOptional<z.ZodCustom<Coordinate, Coordinate>>;
}, z.core.$strict>;
declare const text3DStateSchemaStrict: z.ZodObject<{
	visible: z.ZodBoolean;
	color: z.ZodString;
	flipToFaceCamera: z.ZodBoolean;
	font: z.ZodOptional<z.ZodString>;
	fontSize: z.ZodNumber;
	margin: z.ZodUnion<readonly [
		z.ZodNumber,
		z.ZodTuple<[
			z.ZodNumber,
			z.ZodNumber,
			z.ZodNumber,
			z.ZodNumber
		], null>
	]>;
	outlineColor: z.ZodString;
	outlineOpacity: z.ZodNumber;
	outlineBlur: z.ZodUnion<readonly [
		z.ZodNumber,
		z.ZodString
	]>;
	outlineWidth: z.ZodNumber;
	outlineOffsetX: z.ZodNumber;
	outlineOffsetY: z.ZodNumber;
	strokeWidth: z.ZodNumber;
	maxWidth: z.ZodOptional<z.ZodNumber>;
	maxHeight: z.ZodOptional<z.ZodNumber>;
	strokeOpacity: z.ZodNumber;
	strokeColor: z.ZodString;
	fillOpacity: z.ZodNumber;
	hoverColor: z.ZodOptional<z.ZodString>;
	id: z.ZodUnion<readonly [
		z.ZodString,
		z.ZodNumber
	]>;
	content: z.ZodString;
	type: z.ZodDefault<z.ZodLiteral<"text3d">>;
	position: z.ZodCustom<Coordinate, Coordinate>;
}, z.core.$strict>;
export type TText3DState = z.infer<typeof text3DStateSchemaStrict>;
export type TText3DUpdateState = z.infer<typeof text3DUpdateStateSchema>;
declare const wallsStateSchemaPartial: z.ZodObject<{
	type: z.ZodOptional<z.ZodDefault<z.ZodLiteral<"walls">>>;
	color: z.ZodOptional<z.ZodDefault<z.ZodString>>;
	topColor: z.ZodOptional<z.ZodOptional<z.ZodString>>;
	texture: z.ZodOptional<z.ZodUnion<[
		z.ZodObject<{
			url: z.ZodString;
		}, z.core.$strip>,
		z.ZodUndefined
	]>>;
	topTexture: z.ZodOptional<z.ZodUnion<[
		z.ZodObject<{
			url: z.ZodString;
		}, z.core.$strip>,
		z.ZodUndefined
	]>>;
	visible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	height: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	opacity: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, z.core.$strip>;
declare const wallsStateSchemaStrict: z.ZodObject<{
	type: z.ZodDefault<z.ZodLiteral<"walls">>;
	color: z.ZodDefault<z.ZodString>;
	topColor: z.ZodOptional<z.ZodString>;
	texture: z.ZodUnion<[
		z.ZodObject<{
			url: z.ZodString;
		}, z.core.$strip>,
		z.ZodUndefined
	]>;
	topTexture: z.ZodUnion<[
		z.ZodObject<{
			url: z.ZodString;
		}, z.core.$strip>,
		z.ZodUndefined
	]>;
	visible: z.ZodDefault<z.ZodBoolean>;
	height: z.ZodDefault<z.ZodNumber>;
	opacity: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export type TWallsState = z.infer<typeof wallsStateSchemaStrict>;
export type TWallsUpdateState = z.infer<typeof wallsStateSchemaPartial>;
/**
 * Centralized mapping of element types to their get state types.
 */
export type MapElementToGetState = {
	[Marker.__type]: ReadonlyDeep<TMarkerState>;
	[Label.__type]: ReadonlyDeep<TLabelState>;
	[Shape.__type]: ReadonlyDeep<TShapeState>;
	[Model.__type]: ReadonlyDeep<TModelState>;
	[Path.__type]: ReadonlyDeep<TPathState>;
	[PathSegment.__type]: ReadonlyDeep<TPathState>;
	[Text3DView.__type]: ReadonlyDeep<TText3DState>;
	[Image3DView.__type]: ReadonlyDeep<TImage3DState>;
	[Space.__type]: ReadonlyDeep<TGeometryState>;
	[MapObject.__type]: ReadonlyDeep<TGeometryState>;
	[Floor.__type]: ReadonlyDeep<TFloorState>;
	[Facade.__type]: ReadonlyDeep<TFacadeState>;
	[Door.__type]: ReadonlyDeep<TDoorsState>;
	[Area.__type]: ReadonlyDeep<TGeometryState>;
	[WALLS.Exterior]: ReadonlyDeep<TWallsState>;
	[WALLS.Interior]: ReadonlyDeep<TWallsState>;
	[DOORS.Exterior]: ReadonlyDeep<TDoorsState>;
	[DOORS.Interior]: ReadonlyDeep<TDoorsState>;
};
/**
 * Centralized mapping of element types to their update state types.
 */
export type MapElementToUpdateState = {
	[Marker.__type]: TMarkerUpdateState;
	[Label.__type]: TLabelUpdateState;
	[Shape.__type]: TShapeUpdateState;
	[Model.__type]: TModelUpdateState;
	[Path.__type]: TPathUpdateState;
	[PathSegment.__type]: TPathUpdateState;
	[Text3DView.__type]: TText3DUpdateState;
	[Image3DView.__type]: TImage3DUpdateState;
	[Space.__type]: TGeometryUpdateState;
	[MapObject.__type]: TGeometryUpdateState;
	[Floor.__type]: TFloorUpdateState;
	[Facade.__type]: TFacadeUpdateState;
	[Door.__type]: TDoorsUpdateState;
	[Area.__type]: TGeometryUpdateState;
	[WALLS.Exterior]: TWallsUpdateState;
	[WALLS.Interior]: TWallsUpdateState;
	[DOORS.Exterior]: TDoorsUpdateState;
	[DOORS.Interior]: TDoorsUpdateState;
};
declare class GeoJsonApi extends PubSub<TNavigationEvents> {
	#private;
	core: Core;
	mapObjects: GeojsonApiMapObject[];
	id: string;
	mapDataExternal: {
		[key in string]: MapData;
	};
	private mapsByFloorId;
	mapData?: MapData;
	currentMap: GeojsonApiMapObject;
	hiddenOutdoorGeometries: [
		BBox,
		polygons: Feature$1<Polygon$1 | MultiPolygon$1, any>[],
		layers: string[]
	][];
	private lastFacadeIntersected?;
	mapView: MapView;
	/**
	 * External event bus for MapView - bridges internal API events to public API.
	 *
	 * Internal systems publish events here which are then exposed to developers via
	 * MapView.on() and MapView.off().
	 */
	externalPubSub: PubSub<TEvents>;
	get manualFloorVisibility(): boolean;
	set manualFloorVisibility(value: boolean);
	get hidePathsNotOnCurrentFloor(): boolean;
	set hidePathsNotOnCurrentFloor(value: boolean);
	Camera: Camera$3;
	Labels: Labels;
	Text3D: Text3D;
	Markers: Markers;
	Models: Models;
	Paths: Paths;
	Exporter: Exporter;
	Navigation: Navigation;
	Outdoor: Outdoor;
	Shapes: Shapes;
	Style: Style$2;
	Image3D: Image3D;
	constructor(rendererCore: Core, mapView: MapView, externalPubSub: PubSub<TEvents>);
	preloadFloors(floors: Floor[]): void;
	updateState<T extends MapElementsWithState>(target: T, state: TUpdateState<T>): void;
	updateState<T extends string & NonNullable<unknown>>(target: T, state: ValueOf<MapElementToUpdateState>): void;
	updateState<T extends MapElementsWithState | string>(target: T, state: TUpdateState<T>): void;
	private getMapDataObject;
	update: () => void;
	getMapDataInternal(): MapDataInternal | undefined;
	getMapData(): MapData | undefined;
	addMap(mapData: MapData, options?: TShow3DMapOptions): Promise<MapData>;
	setFloor(floor: Floor | string, reason?: TFloorChangeReason): void;
	setFloorStack(floorStack: FloorStack | string, reason?: TFloorChangeReason): void;
	updateWatermark(options: WatermarkUpdateOptions): void;
	get currentFloorStack(): FloorStack;
	get currentFloor(): Floor;
	getState<T extends MapElementsWithState | string>(target: T): TGetState<T>;
	setHoverColor(c: string): void;
	getHoverColor(): string | undefined;
	/**
	 * Create a coordinate from a screen coordinate
	 * @param x - The x coordinate of the screen
	 * @param y - The y coordinate of the screen
	 * @param floor - The floor to use for the coordinate
	 * @returns The coordinate
	 */
	createCoordinateFromScreenCoordinate(x: number, y: number, floor?: Floor): Coordinate | undefined;
	getScreenCoordinateFromCoordinate(coordinate: Coordinate): {
		x: number;
		y: number;
	};
	isInView(target: Space | MapObject | Label | Marker | string): boolean;
	getInView<T extends string>(type: T, options?: TGetInViewOptions): MapFeatureOfType<T>[];
	__EXPERIMENTAL__auto(mapElements?: MapDataElements[]): Promise<AutoElements>;
	tween<T extends Record<string, unknown>>(object: T): Tween<T>;
	removeTween(tween: Tween<any>): void;
	tweenGroup(): import("@tweenjs/tween.js").Group;
	/**
	 * @internal
	 */
	get __core(): Core;
	/**
	 * Get camera state for synchronization
	 * @private
	 */
	private getCameraState;
	/**
	 * Get navigation state for synchronization
	 * @private
	 */
	private getNavigationState;
	/**
	 * Get all current state information for synchronization
	 * @internal
	 */
	getAllState(): Partial<{
		currentFloor: Floor;
		currentFloorStack: FloorStack;
		Camera: TCameraStateChangePayload;
		Navigation: NavigationState;
		manualFloorVisibility: boolean;
	}>;
	/**
	 * Publish all current state information
	 * @internal
	 */
	publishAllState(): void;
	clear(): void;
	destroy(): void;
	getOptimalVisualDistanceBetweenFloors(floors: Floor[], debug?: boolean): number | undefined;
}
/**
 * Sets the base URL directory where worker scripts are hosted for CSP compatibility.
 *
 * This function configures both the MapLibre and collision system workers to load from
 * external URLs instead of using inline blob URLs. The SDK expects two specific worker
 * files to be available in the provided directory:
 * - `maplibre-worker.csp.js` - For MapLibre map rendering
 * - `collision-worker.csp.js` - For the collision detection system
 *
 * Using this approach enables compatibility with strict Content Security Policies
 * that block unsafe-eval and blob: URLs.
 *
 * @param baseUrl - Base URL directory where worker scripts are hosted (without trailing slash)
 *                  Example: "https://cdn.example.com/workers"
 *
 * @example
 * ```typescript
 * import { setWorkersUrl } from '@mappedin/mappedin-js';
 *
 * // Call before initializing any maps
 * setWorkersUrl('https://cdn.example.com/workers');
 * // This will load:
 * // - https://cdn.example.com/workers/maplibre-worker.csp.js
 * // - https://cdn.example.com/workers/collision-worker.csp.js
 * ```
 *
 * @remarks
 * - The worker files can be found in the published package at:
 *   `node_modules/@mappedin/mappedin-js/lib/esm/workers/`
 * - For deployment, copy these files to your web server or CDN
 * - A better approach is to add these files to your build process to ensure
 *   they're always in sync with your application
 * - Call this function before creating any map instances
 */
export declare function setWorkersUrl(baseUrl: string): void;
/**
 * Represents a set of directions between two points.
 *
 * Directions are used to represent the path between two points on the map,
 * as well as the instructions to follow the path.
 */
export declare class Directions {
	#private;
	id: string;
	/**
	 * @internal
	 */
	constructor(directions: DirectionsCollection, mapData: MapDataInternal, departure: TNavigationTarget, destination: TNavigationTarget, options?: {
		id?: string;
	});
	/**
	 * @internal
	 */
	get path(): Node$1[];
	/**
	 * The selected departure.
	 */
	departure: TNavigationTarget;
	/**
	 * The selected destination.
	 */
	destination: TNavigationTarget;
	/**
	 * All the coordinates ({@link Coordinate}) of the directions.
	 */
	get coordinates(): Coordinate[];
	/**
	 * The total distance of the path in meters.
	 */
	get distance(): number;
	/**
	 * The array of instructions ({@link TDirectionInstruction}).
	 */
	get instructions(): TDirectionInstruction[];
	/**
	 * Serializes the directions to JSON.
	 * All getter properties are evaluated and included in the serialized output.
	 *
	 * @returns An object representing the directions with all properties evaluated.
	 */
	toJSON(): {
		id: string;
		directions: DirectionFeature[];
		__type: string;
		from: TNavigationTarget;
		to: TNavigationTarget;
	};
}
declare class DirectionsInternal {
	#private;
	navigator: Navigator$1;
	private readonly connections;
	/**
	 * @hidden
	 */
	constructor({ nodes, geojsonCollection, connections, groupBy, multiplicativeDistanceWeightScaling, flagDeclarations, }: {
		nodes: ParsedMVF["node.geojson"];
		geojsonCollection: ParsedMVF["obstruction"] | ParsedMVF["space"];
		connections: ParsedMVF["connection.json"];
		groupBy?: string;
		multiplicativeDistanceWeightScaling?: boolean;
		flagDeclarations?: ParsedMVF["navigationFlags.json"];
	});
	processTargets(fromNodesByTarget: Map<TNavigationTarget, string[]>, toNodesByTarget: Map<TNavigationTarget, string[]>): {
		originIds: string[];
		destinationNodeIds: string[];
		featureToNodeIdsMap: Map<TNavigationTarget, string[]>;
	};
	getDirections: (from: TNavigationTarget[], to: TNavigationTarget[], options: {
		accessible: boolean;
		smoothing: {
			enabled: boolean;
			radius: number;
		};
		zones: TDirectionZone[];
		excludedConnections: Connection[];
		connectionIdWeightMap: Record<string, number>;
	}, mapData: MapDataInternal) => Promise<Directions | undefined>;
	/** @deprecated use getDirections instead */
	getDirectionsSync: (from: TNavigationTarget[], to: TNavigationTarget[], options: {
		accessible: boolean;
		smoothing: {
			enabled: boolean;
			radius: number;
		};
		zones: TDirectionZone[];
		excludedConnections: Connection[];
		connectionIdWeightMap: Record<string, number>;
	}, mapData: MapDataInternal) => Directions | undefined;
	/**
	 * Get the node IDs of connections that do not match the accessibility setting provided.
	 * A disabled connection node is a connection node that acts as a regular node
	 * (ie. the edges that would cause a floor change are ignored).
	 *
	 * @hidden
	 * @param accessible {boolean}
	 */
	getDisabledConnectionNodeIds: (accessible: boolean) => string[];
	/**
	 * If the navigation targets are coordinates, make sure to include them in the final directions. For other
	 * data types (e.g. POIs, Doors, Spaces), the coordinate should have a coincidental node generated in the
	 * navigation graph already, so this is unnecessary.
	 *
	 * @hidden
	 * @param directions
	 * @param from {TNavigationTarget[]}
	 * @param to {TNavigationTarget[]}
	 */
	private addCoordinateDirections;
	/**
	 * Create an geojson collection from the parsed MVF.
	 *
	 * @hidden
	 * @param obstructions
	 */
	private createCollection;
	/**
	 * Create a direction feature.
	 *
	 * @hidden
	 * @param coordinate
	 * @param angle
	 * @param distance
	 */
	private createDirectionFeature;
}
interface CameraTransformOptions {
	/**
	 * Number of decimal places for coordinate precision.
	 * Default: 7 (centimeter accuracy)
	 * Set to -1 to disable coordinate rounding.
	 *
	 * Note: ZoomLevel is always rounded to 5 decimal places for consistency
	 */
	precision?: number;
}
/**
 * Class representing camera transformation data.
 */
export declare class CameraTransform {
	#private;
	/**
	 * @internal
	 */
	constructor(camera: Camera$3, options?: CameraTransformOptions);
	toJSON(): {
		center: Coordinate;
		bearing: number;
		pitch: number;
		zoomLevel: number;
	};
	/**
	 * Getter for the center coordinate of the camera.
	 *
	 * @returns Center Coordinate with precision applied (default: 7 decimal places for centimeter accuracy).
	 */
	get center(): Coordinate;
	/**
	 * Getter for the camera's bearing in degrees.
	 *
	 * @returns Camera bearing in degrees.
	 */
	get bearing(): number;
	/**
	 * Getter for the camera's pitch in degrees.
	 *
	 * @returns Camera pitch in degrees.
	 */
	get pitch(): number;
	/**
	 * Getter for the camera's zoom level in mercator zoom levels.
	 * Rounded to 5 decimal places for consistency.
	 *
	 * @see https://wiki.openstreetmap.org/wiki/Zoom_levels
	 *
	 * @returns Zoom level in mercator zoom levels, rounded to 5 decimal places.
	 */
	get zoomLevel(): number;
}
/**
 * Class representing GeoJSON shape on the {@link MapView}.
 *
 * Refer to the [Shapes Guide](https://developer.mappedin.com/web-sdk/shapes) for more information and interactive examples.
 */
export declare class Shape implements IFocusable {
	/**
	 * id of Shape
	 */
	readonly id: string;
	/**
	 * @internal
	 */
	static readonly __type = "shape";
	/**
	 * @internal
	 */
	readonly __type = "shape";
	/**
	 * Checks if the provided instance is of type Shape.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a Shape, false otherwise.
	 */
	static is(instance: object): instance is Shape;
	/** @internal */
	get focusTarget(): this;
	/**
	 * @internal
	 */
	constructor(id: string);
}
/**
 * Class representing an Text3D on the {@link MapView}.
 */
export declare class Text3DView {
	/**
	 * The text3d's id
	 */
	readonly id: string;
	/**
	 * @internal
	 */
	constructor(id: string, target: Space | EnterpriseLocation);
	/**
	 * The text3d's target
	 */
	readonly target: Space | EnterpriseLocation;
	/**
	 * @internal
	 */
	static readonly __type = "text-3d";
	readonly __type = "text-3d";
	/**
	 * Checks if the provided instance is of type Text3D
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a text3d, false otherwise.
	 */
	static is(instance: object): instance is Text3DView;
}
export type TFloorChangeReason = "blue-dot-floor-change" | "navigation-connection-click" | string;
export type TClickPayload = {
	/**
	 * The coordinate of the interaction.
	 */
	coordinate: Coordinate;
	/**
	 * The interactive paths which the user interaction passed through.
	 */
	paths?: Path[];
	/**
	 * The interactive spaces which the user interaction passed through.
	 */
	spaces?: Space[];
	/**
	 * The interactive objects which the user interaction passed through.
	 */
	objects?: MapObject[];
	/**
	 * The interactive areas which the user interaction passed through.
	 */
	areas?: Area[];
	/**
	 * The markers which the user interaction passed through.
	 */
	markers?: Marker[];
	/**
	 * The models which the user interaction passed through.
	 */
	models?: Model[];
	/**
	 * The interactive labels which the user interaction passed through.
	 */
	labels?: Label[];
	/**
	 * The interactive floors which the user interaction passed through.
	 */
	floors?: Floor[];
	/**
	 * Details about the pointer event which triggered the interaction.
	 */
	pointerEvent: ClickPayload["pointerEvent"];
	/**
	 * The interactive facades which the user interaction passed through.
	 */
	facades?: Facade[];
	/**
	 * The interactive shapes which the user interaction passed through.
	 */
	shapes?: Shape[];
};
export type THoverPayload = Omit<TClickPayload, "pointerEvent">;
type TCameraStateChangePayload = CameraSystemState & {
	autoMinZoomLevel: Core["camera"]["autoMinZoomLevel"];
	screenOffsets: Core["camera"]["insetsPadding"];
	panMode: Core["camera"]["panMode"];
};
/**
 * Consolidated state payload for React Native SDK internal use
 * @internal
 */
export type TStateChangedInternalPayload = Partial<{
	currentFloor: Floor;
	currentFloorStack: FloorStack;
	Camera: TCameraStateChangePayload;
	Navigation: NavigationState;
	manualFloorVisibility: boolean;
}>;
type TFloorChangePayload = {
	/**
	 * The floor that is being changed to.
	 */
	floor: Floor;
	/**
	 * The floor that is being changed from.
	 */
	previousFloor: Floor;
	/**
	 * The reason for the floor change.
	 */
	reason?: TFloorChangeReason;
};
/**
 * The pan bounds of the camera.
 */
export type CameraBounds = {
	/**
	 * Center point of the bounds. The radius expands from this point.
	 */
	center: Coordinate;
	/**
	 * The radius of the bounds in meters.
	 */
	radius: number;
};
/**
 * Defines the structure and types of events emitted in the context of the map.
 */
export type TEvents = {
	/**
	 * Emitted when the map is clicked or tapped on a touch screen.
	 */
	click: TClickPayload;
	/**
	 * Emitted when the map is hovered over with a mouse.
	 */
	hover: Omit<THoverPayload, "pointerEvent">;
	/**
	 * Emitted when the camera's view changes.
	 */
	"camera-change": CameraTransform;
	/**
	 * Emitted when the pan bounds of the camera changes.
	 */
	"camera-bounds-change": CameraBounds;
	/**
	 * Emitted when a floor change starts.
	 */
	"floor-change-start": TFloorChangePayload;
	/**
	 * Emitted after the floor change is complete.
	 */
	"floor-change": TFloorChangePayload;
	/**
	 *
	 * Emitted when a different facade recieves focus due to the camera moving.
	 * This always occurs when the active floor changes to a different floor stack,
	 * but may also occur when the camera moves without the active floor changing.
	 *
	 * @property {Facade[]} facades - The facades that are in focus.
	 *
	 */
	"facades-in-view-change": {
		facades: Facade[];
	};
	/**
	 * Emitted when the outdoor view is fully loaded and displayed.
	 */
	"outdoor-view-loaded": undefined;
	/**
	 * Emitted when the outdoor style is loaded or changed.
	 */
	"outdoor-style-loaded": undefined;
	/**
	 * Emitted when a user interaction with the map starts (e.g., dragging the map).
	 */
	"user-interaction-start": undefined;
	/**
	 * Emitted when a user interaction with the map ends.
	 */
	"user-interaction-end": undefined;
	/**
	 * Emitted when a navigation connection is clicked.
	 */
	"navigation-connection-click": {
		fromFloor?: Floor;
		toFloor: Floor;
		instruction: TDirectionInstruction;
	};
	/**
	 * Emitted when the active path changes.
	 */
	"navigation-active-path-change": {
		directions: Directions;
		path: Path;
	};
	/**
	 * Consolidated state change event for React Native SDK internal use
	 * @internal
	 */
	"state-change-internal": TStateChangedInternalPayload;
	/**
	 * Emitted before the scene is drawn to the screen.
	 */
	"pre-render": undefined;
	/**
	 * Emitted when resize happened.
	 */
	resize: undefined;
	/**
	 * Emitted after the scene is drawn to the screen.
	 */
	"post-render": undefined;
	/**
	 * Emitted when a render error occurs.
	 * @internal
	 */
	"render-error": {
		/**
		 * The render error that occurred.
		 */
		error: MappedinRenderError;
	};
};
export type TEventPayload<EventName extends keyof TEvents> = TEvents[EventName] extends {
	data: null;
} ? TEvents[EventName]["data"] : TEvents[EventName];
export type TMapDataEvents = {
	"language-change": {
		code: string;
		name: string;
	};
};
/**
 * A class that implements IAnchorable can have 2D elements like {@link Label}s and {@link Marker}s anchored to it.
 */
export interface IAnchorable {
	get anchorTarget(): Coordinate;
}
/**
 * A class that implements IFocusable can be focused on by the camera.
 */
export interface IFocusable {
	get focusTarget(): TFocusTarget | TFocusTarget[];
}
/**
 * A class that implements INavigatable can be navigated to via directions.
 */
export interface INavigatable {
	get navigationTarget(): TNavigationTarget | TNavigationTarget[];
}
/**
 * A class that implements IGeoJSONData has a underlying GeoJSON datathat can be accessed.
 */
export interface IGeoJSONData {
	/** Gets the underlying GeoJSON Feature representation of this object. */
	geoJSON: Feature$1<any, null>;
}
export type TAnimateStateResult = {
	result: "completed" | "cancelled";
};
export type TCancellablePromise<T> = Promise<T> & {
	cancel: () => void;
};
export declare enum ACTION_TYPE {
	Departure = "Departure",
	TakeConnection = "TakeConnection",
	ExitConnection = "ExitConnection",
	Turn = "Turn",
	Arrival = "Arrival"
}
export type TActionType = keyof typeof ACTION_TYPE;
export declare enum BEARING_TYPE {
	Straight = "Straight",
	Right = "Right",
	SlightRight = "SlightRight",
	Left = "Left",
	SlightLeft = "SlightLeft",
	Back = "Back"
}
export type TBearingType = keyof typeof BEARING_TYPE;
export declare enum CONNECTION_TYPE {
	stairs = "stairs",
	elevator = "elevator",
	escalator = "escalator",
	door = "door",
	ramp = "ramp",
	slide = "slide",
	portal = "portal",
	security = "security",
	shuttle = "shuttle",
	ladder = "ladder"
}
export type TConnectionType = keyof typeof CONNECTION_TYPE;
/**
 * Represents an action within a direction instruction.
 */
export type TDirectionInstructionAction = {
	/**
	 * Type of action required at this step (e.g., 'Departure', 'Arrival', 'Turn').
	 */
	type: TActionType;
	/**
	 * Bearing direction for this action (e.g., 'Straight', 'Right', 'Left').
	 */
	bearing?: TBearingType;
	/**
	 * A reference position for the action.
	 *
	 * @internal
	 */
	referencePosition?: string;
	/**
	 * The {@link Floor} from which this action starts.
	 */
	fromFloor?: Floor;
	/**
	 * The target {@link Floor}  for this action.
	 */
	toFloor?: Floor;
	/**
	 * Connection object related to the action.
	 * This represents the specific connection (e.g., elevator, stairs) involved in the current direction step.
	 */
	connection?: Connection;
	/**
	 * The direction of the connection (e.g., 'up', 'down').
	 */
	direction?: "up" | "down" | "none";
	/**
	 * The type of the connection (e.g., 'elevator', 'escalator').
	 * @deprecated in favor of `connection.type`
	 */
	connectionType?: TConnectionType;
};
/**
 * Represents a single instruction in a set of directions between two points.
 */
export type TDirectionInstruction = {
	/**
	 * The action ({@link TDirectionInstructionAction}) to be taken for this instruction.
	 */
	action: TDirectionInstructionAction;
	/**
	 * Distance in meters covered in this instruction step.
	 */
	distance: number;
	/**
	 * The {@link Coordinate} at which this instruction applies.
	 */
	coordinate: Coordinate;
	/**
	 * @internal
	 */
	node: Node$1;
};
export declare enum WALLS {
	Exterior = "exterior-walls",
	Interior = "interior-walls"
}
export declare enum DOORS {
	Interior = "interior-doors",
	Exterior = "exterior-doors"
}
/**
 * Elements created by the MapData.
 */
export type MapDataElements = Space | MapObject | Door | Facade | Floor | FloorStack | Connection | Annotation | Area | PointOfInterest | EnterpriseLocation | EnterpriseCategory | LocationProfile | Node$1 | EnterpriseVenue;
/**
 * Elements created by the MapView.
 */
export type MapViewElements = Label | Marker | Model | Shape | Text3DView | Path | PathSegment | Image3DView;
/**
 * Options for {@link Camera} animations on the map.
 */
export type TCameraAnimationOptions = {
	/**
	 * Duration of the animation in milliseconds.
	 */
	duration?: number;
	/**
	 * Easing function to use for the animation.
	 */
	easing?: TEasingFunction;
	/**
	 * Whether the current animation will be interrupted, or must complete before starting any new animations
	 * @default: true
	 */
	interruptible?: boolean;
};
/**
 * Options for controlling animations on the map.
 */
export type TAnimationOptions = {
	/**
	 * Duration of the animation in milliseconds.
	 * @default 1000
	 */
	duration?: number;
	/**
	 * Easing function to use for the animation.
	 * @default 'ease-in-out'
	 */
	easing?: TEasingFunction;
};
/**
 * Types of easing for animations.
 *
 * Linear: This function implies a constant rate of change. It means the animation proceeds at the same speed from start to end. There's no acceleration or deceleration, giving a very mechanical feel.
 *
 * Ease-in: This function causes the animation to start slowly and then speed up as it progresses. Initially, there's gradual acceleration, and as the function moves forward, the rate of change increases.
 *
 * Ease-out: Contrary to ease-in, ease-out makes the animation start quickly and then slow down towards the end. It begins with a faster rate of change and gradually decelerates.
 *
 * Ease-in-out: This function combines both ease-in and ease-out. The animation starts slowly, speeds up in the middle, and then slows down again towards the end. It offers a balance of acceleration and deceleration.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function
 */
export type TEasingFunction = "linear" | "ease-in" | "ease-out" | "ease-in-out";
/**
 * Options for focusing the {@link Camera} on a target.
 */
export type TFocusOnOptions = TCameraAnimationOptions & {
	/**
	 * Minimum zoom level when focusing on a target in mercator zoom levels.
	 *
	 * @see https://wiki.openstreetmap.org/wiki/Zoom_levels
	 */
	minZoomLevel?: number;
	/**
	 * Maximum zoom level when focusing on a target in mercator zoom levels.
	 *
	 * @see https://wiki.openstreetmap.org/wiki/Zoom_levels
	 */
	maxZoomLevel?: number;
	/**
	 * Camera bearing when focusing on a target in degrees clockwise from North. 0 degrees is North, 90 degrees is East, 180 degrees is South, and 270 degrees is West.
	 */
	bearing?: number;
	/**
	 * Camera pitch when focusing on a target, in degrees.
	 */
	pitch?: number;
	/**
	 * Axis aligned padding to add to the bounding box in meters.
	 */
	axisAlignedPadding?: {
		/**
		 * Vertical padding to add to the bounding box in meters along the elevation axis.
		 */
		vertical?: number;
	};
	screenOffsets?: InsetPaddingOption;
	/**
	 * Whether the current animation will be interrupted, or must complete before starting any new animations
	 * @default: true
	 */
	interruptible?: boolean;
};
/**
 * Defines the target for camera operations.
 */
export type TCameraTarget = {
	/**
	 * Center {@link Coordinate} for the camera target.
	 */
	center?: Coordinate;
	/**
	 * Zoom level for the camera target in mercator zoom levels.
	 *
	 * @see https://wiki.openstreetmap.org/wiki/Zoom_levels
	 */
	zoomLevel?: number;
	/**
	 * Bearing for the camera target in degrees clockwise from North. 0 degrees is North, 90 degrees is East, 180 degrees is South, and 270 degrees is West.
	 */
	bearing?: number;
	/**
	 * Pitch for the camera target in degrees.
	 */
	pitch?: number;
};
/**
 * Defines the target for navigation operations.
 */
export type TNavigationTarget = LocationProfile | Annotation | Space | MapObject | Coordinate | Door | PointOfInterest | Connection | EnterpriseLocation | Node$1 | Area | Facade;
/**
 * Defines the special zone for navigation operations.
 */
export type TDirectionZone = {
	/**
	 * The zone geometry.
	 */
	geometry: Feature$1<MultiPolygon$1 | Polygon$1>;
	/**
	 * The additional cost for navigation through the zone, from 0 to Infinity.
	 * The final cost is calculated as the sum of basic cost that comes from the {@link MapData}
	 * and the additional zone cost.
	 * A additional zone cost of 0 will make the zone free to navigate through
	 * A additional zone cost of Infinity will make the zone impossible to navigate through
	 */
	cost: number;
	/**
	 * The zone's floor, defaults to the all floors if not provided.
	 */
	floor?: Floor;
};
/**
 * Options for controlling the behavior of a {@link Path}.
 */
export type TAddPathOptions = {
	/**
	 * Path Colour. Color can be set using CSS colors names `DarkGoldenRod`, as Hex strings `#0000FF` or the rgb values `rgb(255,0,0)`.
	 *
	 * @defaultValue #4b90e2
	 */
	color?: string;
	/**
	 * Accent color that is applied to the path pulse and path arrows
	 *
	 * @defaultValue '#ffffff'
	 */
	accentColor?: string;
	/**
	 * Number of iterations to pulse to indicate direction.
	 *
	 * @defaultValue 1
	 */
	pulseIterations?: number;
	/**
	 * How many milliseconds to wait before starting the next pulse after the current pulse travels the entirety of the path.
	 *
	 * @defaultValue 750
	 */
	pulsePauseDuration?: number;
	/**
	 * The width of the path in meters. Can be a number or an {@link Interpolation}.
	 *
	 * @defaultValue Interpolation { on: 'zoom-level', input: [17, 22], output: [0.8, 0.4] }
	 */
	width?: number | Interpolation<"zoom-level", number[]>;
	/**
	 * Duration of path drawing in milliseconds.
	 *
	 * @defaultValue 1500
	 */
	drawDuration?: number;
	/**
	 * Show arrows on path.
	 *
	 * @defaultValue false
	 */
	displayArrowsOnPath?: boolean;
	/**
	 * Animate arrows on path.
	 *
	 * @defaultValue true
	 */
	animateArrowsOnPath?: boolean;
	/**
	 * Flatten the path to a 2D line.
	 *
	 * @defaultValue false
	 */
	flattenPath?: boolean;
	/**
	 * Show an animated pulse indicating the direction of travel.
	 *
	 * @defaultValue true
	 */
	showPulse?: boolean;
	/**
	 * Animate the drawing of the path in the direction of travel.
	 *
	 * @defaultValue true
	 */
	animateDrawing?: boolean;
	/**
	 * Whether the path should be clickable.
	 *
	 * @defaultValue false
	 */
	interactive?: boolean;
	/**
	 * How much the path hovers above the floor plane in meters.
	 *
	 * @defaultValue 0.1
	 */
	verticalOffset?: number;
	/**
	 * Whether the path should be dashed.
	 *
	 * @defaultValue false
	 */
	dashed?: boolean;
	/**
	 * Whether the path should be visible.
	 *
	 * @defaultValue true
	 */
	visible?: boolean;
	/**
	 * @internal
	 *
	 * Whether the path should be visible through geometry. Can be used to create paths that are visible through walls and floors.
	 *
	 * @defaultValue false
	 */
	visibleThroughGeometry?: boolean;
};
/**
 * Defines the priority levels for collider collision handling, allowing customization of collider visibility in congested areas.
 *
 * | Value  | Description                                                                                                                             |
 * |--------|-----------------------------------------------------------------------------------------------------------------------------------------|
 * | low    | Colliders with this ranking have a low visibility priority and will be hidden in favor of higher-ranked colliders in crowded areas.     |
 * | medium | Colliders with this ranking have a standard visibility priority and may be hidden in favor of higher-ranked colliders in crowded areas. |
 * | high   | These colliders are given higher visibility priority than 'medium' priority.                                                            |
 * | always-visible | Colliders with this ranking will not be hidden, ensuring their constant visibility regardless of crowding. |
 *
 * Use this type to fine-tune the visibility of colliders, enhancing map readability and user experience by prioritizing important information.
 */
export type TCollisionRankingTier = "low" | "medium" | "high" | "always-visible";
/**
 * Defines the placement position for a Marker, offering a selection of intuitive string options to pinpoint how the marker should be aligned. Choose from:
 *
 * | Value    | Description                                                                   |
 * |----------|-------------------------------------------------------------------------------|
 * | 'center' | Aligns the marker at its center, offering a balanced and centered appearance.|
 * | 'top'    | Aligns the marker at the top, ideal for marking locations from above.        |
 * | 'left'   | Aligns the marker on the left side, useful for when space is limited on the right.|
 * | 'bottom' | Aligns the marker at the bottom, suitable for hanging markers or when space is limited above.|
 * | 'top-left'  | Aligns the marker at the top-left corner. |
 * | 'top-right'  | Aligns the marker at the top-right corner. |
 * | 'bottom-left'  | Aligns the marker at the bottom-left corner. |
 * | 'bottom-right'  | Aligns the marker at the bottom-right corner. |
 *
 */
export type TMarkerPlacement = MarkerPlacement;
/**
 * Options for controlling the behavior of the {@link Directions}.
 */
export type TGetDirectionsOptions = {
	/**
	 * If true directions will only take accessible routes
	 *
	 * @default false
	 */
	accessible?: boolean;
	/**
	 * Enable or disable line-of-sight directions smoothing.
	 * With this option enabled, the directions will be simplified to provide a more visually appealing path and shorter instructions.
	 *
	 * Can be a boolean to enable or disable smoothing, or an object with a radius property to specify the line of sight radius in metres.
	 *
	 * @default true for non-enterprise mode, false for enterprise mode
	 *
	 * @example
	 * ```ts
	 * // Enable smoothing with a radius of 3 metres
	 * mapView.getDirections(firstSpace, secondSpace, {
	 * 	 smoothing: {
	 *     radius: 3,
	 *   }
	 * })
	 *
	 * // Explicitly enable smoothing in enterprise mode
	 * mapView.getDirections(firstSpace, secondSpace, {
	 *   smoothing: true
	 * })
	 * ```
	 */
	smoothing?: boolean | {
		enabled?: boolean;
		radius: number;
	};
	/**
	 * Defines the special zones for navigation operations.
	 *
	 * @example
	 * ```ts
	 * mapView.getDirections(firstSpace, secondSpace, {
	 *   zones: [
	 *     {
	 *       geometry: polygon as Feature<Polygon>,
	 *       // The additional cost for navigation through the zone, from 0 to Infinity.
	 *       // The final cost is calculated as the sum of basic cost that comes from the {@MapData}
	 *       // and the additional zone cost.
	 *       // A additional cost of 0 will make the zone free to navigate through
	 *       // A additional cost of Infinity will make the zone impossible to navigate through
	 *       cost: Infinity,
	 *       floor: mapView.currentFloor,
	 *     },
	 *   ],
	 * });
	 * ```
	 */
	zones?: TDirectionZone[];
	/**
	 * @experimental
	 * Enterprise only. Connections that should not be used for directions.
	 *
	 * If a connection is excluded, it will not be used in the directions even if it is the shortest (or only) path.
	 * If there is no path that does not include the these connections, the directions will be undefined.
	 */
	excludedConnections?: Connection[];
	/**
	 * Override the default weights for specific connection ids.
	 */
	connectionIdWeightMap?: Record<string, number>;
};
/**
 * The target for the add model operation.
 */
export type TAddModel = {
	/**
	 * The target for the model to be placed on.
	 */
	target: IAnchorable;
	/**
	 * Optional. Determines the opacity of the model.
	 * @default 1
	 */
	opacity?: number;
	/**
	 * Optional. Determines the rotation of the model, in degrees.
	 * @default [0, 0, 0]
	 */
	rotation?: [
		number,
		number,
		number
	];
	/**
	 * Optional. Determines the scale of the model. Can be a single number to scale uniformly in all dimensions,
	 * or an array of three numbers [x, y, z] to scale differently in each dimension.
	 * @default [1, 1, 1]
	 */
	scale?: number | [
		number,
		number,
		number
	];
	/**
	 * Whether the Model should be clickable
	 * @default false
	 */
	interactive?: boolean;
	/**
	 * Vertical offset of the model in meters.
	 */
	verticalOffset?: number;
};
/**
 * Options for controlling the behavior of a {@link Model}.
 */
export type TAddModelOptions = Omit<InitializeModelState, "scale" | "url"> & {
	scale?: number | [
		number,
		number,
		number
	];
};
type TAddText3DOptions = AddText3DOptions;
/**
 * Options for controlling the behavior of an {@link Image}.
 */
export type TAddImageOptions = {
	/**
	 * @internal
	 */
	id?: string;
	/**
	 * Width of the image in meters.
	 */
	width: number;
	/**
	 * Height of the image in meters.
	 */
	height: number;
	/**
	 * Rotation of the image in degrees clockwise from North. 0 degrees is North, 90 degrees is East, 180 degrees is South, and 270 degrees is West.
	 *
	 * @default 0
	 */
	rotation?: number;
	/**
	 * Vertical offset of the image in meters.
	 *
	 * @default 0
	 */
	verticalOffset?: number;
	/**
	 * Attempt to keep the image facing the camera as much as possible
	 *
	 * @default false
	 */
	flipImageToFaceCamera?: boolean;
};
/**
 * Options for controlling the behavior of a {@link Marker}.
 */
export type TAddMarkerOptions = {
	/**
	 * Optional. Determines the collision ranking tier of the marker, which influences its visibility in relation to other colliders.
	 * For the possible values ('medium', 'high', 'always-visible') and their impact on label visibility, see {@link TCollisionRankingTier}.
	 */
	rank?: TCollisionRankingTier | "initial";
	/**
	 * Optional. Specifies the placement of the marker, determining its position relative to its coordinates.
	 * If a list is provided, the marker will be aligned to the first placement that is available.
	 *
	 * The active placement will be exposed as a DOM attribute `data-placement` on the marker element.
	 *
	 * For the possible values and their descriptions, see {@link TMarkerPlacement}.
	 */
	placement?: TMarkerPlacement | TMarkerPlacement[];
	/**
	 * Whether the {@link Marker} should be clickable.
	 * If `true` the marker will be registered in the SDK interaction events.
	 * If `'pointer-events-auto'` the marker will receive browser pointer events.
	 * @default false
	 */
	interactive?: boolean | "pointer-events-auto";
	/**
	 * @internal
	 */
	id?: string;
	/**
	 * When true, the marker's collision boundary automatically adjusts when the marker's content or size changes.
	 * Set to false for markers with static content that won't change after creation to improve performance.
	 * @default true
	 */
	dynamicResize?: boolean;
	/**
	 * Whether the marker is enabled.
	 * @default true
	 */
	enabled?: boolean;
	/**
	 * The z-index of the marker. Can be used used in conjunction with rank: 'always-visible' override the default distance from the camera based
	 * sorting of markers and show certain markers always in front
	 */
	zIndex?: number;
	/**
	 * Configuration for the low priority pin fallback strategy.
	 * When enabled, shows a smaller pin version of the marker when all anchor positions have collisions.
	 * @default { enabled: true, size: 2, color: '#666' }
	 */
	lowPriorityPin?: {
		/**
		 * Whether to enable low priority pin strategy when all anchor positions have collisions.
		 * @default true
		 */
		enabled?: boolean;
		/**
		 * Size of the low priority pin in pixels.
		 * @default 2
		 */
		size?: number;
		/**
		 * Color of the low priority pin.
		 * @default '#666'
		 */
		color?: string;
	};
};
/**
 * Options for creating a new {@link Label} with {@link Labels.add}.
 */
export type TAddLabelOptions = {
	/**
	 * Optional. Determines the collision ranking tier of the label, which influences its visibility in relation to other colliders.
	 * For the possible values ('medium', 'high', 'always-visible') and their impact on label visibility, see {@link TCollisionRankingTier}.
	 */
	rank?: TCollisionRankingTier | "initial";
	/**
	 * Customize the appearance of the {@link Label} and its pin
	 */
	appearance?: LabelAppearance;
	/**
	 * Whether the Label should be clickable.
	 * @default false
	 */
	interactive?: boolean;
	/**
	 * @internal
	 */
	id?: string;
	/**
	 * Whether the label is enabled.
	 */
	enabled?: boolean;
	/**
	 * The placement of the text relative to the pin.
	 */
	textPlacement?: LabelTextPlacement[];
};
type LanguagePackHydrationItem = {
	language: Language;
	localePack: ParsedMVFLocalePack;
};
/**
 * All map elements which have state.
 */
export type MapElementsWithState = WithState<MapDataElements | MapViewElements | DOORS | WALLS>;
type WithState<T> = T extends {
	__type: infer U;
} ? U extends keyof MapElementToGetState ? T : never : T extends string ? T extends keyof MapElementToGetState ? T : never : never;
/**
 * The type for updating the state of map elements (colors, texts, etc.).
 * Accepts partial state updates for all element types.
 */
export type TUpdateState<T extends MapElementsWithState | string> = T extends {
	__type: infer U;
} ? U extends keyof MapElementToUpdateState ? MapElementToUpdateState[U] : never : T extends string ? T extends keyof MapElementToUpdateState ? MapElementToUpdateState[T] : Record<string, any> : never;
/**
 * The type for getting the state of map elements.
 * Returns the full state type for all element types.
 */
export type TGetState<T extends MapElementsWithState | string> = T extends {
	__type: infer U;
} ? U extends keyof MapElementToGetState ? MapElementToGetState[U] : never : T extends string ? T extends keyof MapElementToGetState ? MapElementToGetState[T] : Record<string, any> : never;
export type GlobalState = {
	/**
	 * The color of the background, in hex format(#000000).
	 */
	backgroundColor: string;
	/**
	 * The alpha value of the background, between 0 and 1.
	 * @default 1
	 */
	backgroundAlpha: number;
	/**
	 * environment map for reflections.
	 * @default 'basic'
	 */
	environment: EnvMapOptions;
	text3d: {
		/**
		 * hover color of the text3d
		 */
		hoverColor: string;
	};
	geometry: {
		/**
		 * hover color of the geometries
		 */
		hoverColor: string;
	};
};
type UpdateGlobalState = PartialDeep<GlobalState>;
/**
 * A map element that can be focused on by the camera.
 */
export type TFocusTarget = Coordinate | Space | Area | MapObject | Floor | Shape;
/**
 * Associates MapData type strings with their corresponding classes.
 */
export type TMapDataObjectTypes = {
	[LocationProfile.__type]: LocationProfile;
	[LocationCategory.__type]: LocationCategory;
	[Node$1.__type]: Node$1;
	[Space.__type]: Space;
	[Door.__type]: Door;
	[Floor.__type]: Floor;
	[FloorStack.__type]: FloorStack;
	[Connection.__type]: Connection;
	[MapObject.__type]: MapObject;
	[PointOfInterest.__type]: PointOfInterest;
	[Annotation.__type]: Annotation;
	[EnterpriseLocation.__type]: EnterpriseLocation;
	[EnterpriseCategory.__type]: EnterpriseCategory;
	[EnterpriseVenue.__type]: EnterpriseVenue;
	[Area.__type]: Area;
	[Facade.__type]: Facade;
};
type TMapViewObjectTypes = {
	[Label.__type]: Label;
	[Marker.__type]: Marker;
	[Model.__type]: Model;
	[Shape.__type]: Shape;
	[Path.__type]: Path;
	[PathSegment.__type]: PathSegment;
	[Image3DView.__type]: Image3DView;
	[Text3DView.__type]: Text3DView;
};
type TMapFeatureTypes = TMapDataObjectTypes & TMapViewObjectTypes;
type MapFeatureOfType<T extends string> = T extends keyof TMapFeatureTypes ? TMapFeatureTypes[T] : never;
type TImagePlacementOptions = ImagePlacementOptions;
type TCameraInteractionsSetOptions = {
	/**
	 * Whether to enable panning.
	 */
	pan?: boolean;
	/**
	 * Whether to enable zooming.
	 */
	zoom?: boolean;
	/**
	 * Whether to enable bearing and pitch.
	 */
	bearingAndPitch?: boolean;
};
export type TSetFloorOptions = {
	/**
	 * Optionally provide the context for the floor change which will be published as the `reason` for the `floor-change` event.
	 */
	context?: TFloorChangeReason;
};
/**
 * Options for controlling multi-floor view.
 * When enabled, displays all floors in a building stacked vertically below the active floor,
 * allowing users to see the building's vertical structure and navigate between floors.
 * The active floor is fully rendered while lower floors appear as semi-transparent footprints.
 */
export type TMultiFloorViewOptions = {
	/**
	 * Enable multi-floor view to show floors stacked vertically below the active floor.
	 * @default true
	 */
	enabled?: boolean;
	/**
	 * The vertical spacing between floors, measured in meters.
	 * This controls how far apart the floors appear when stacked.
	 * If a number is provided, this value will be used for all floors.
	 * If 'auto' is provided, then the gap will be calculated based on the sum of all previous floors' max height
	 * or the default gap of 10 meters if no max height is present for any of the provided floors.
	 * @default 'auto'
	 */
	floorGap?: number | "auto";
	/**
	 * Automatically adjust the camera elevation when switching floors to match the floor's altitude.
	 * @default true
	 */
	updateCameraElevationOnFloorChange?: boolean;
};
type TGetInViewOptions = Partial<{
	screenOffsets: Partial<InsetPadding>;
	fullyContains: boolean;
}>;
type TPathSectionHighlightOptions = {
	/**
	 * The color of the highlight.
	 */
	color?: string;
	/**
	 * The width multiplier of the highlight.
	 */
	widthMultiplier?: number;
	/**
	 * The duration of the highlight animation.
	 */
	animationDuration?: number;
};
/**
 * Options for taking a screenshot.
 */
export type TTakeScreenshotOptions = {
	/**
	 * Whether to include the outdoor context in the screenshot.
	 * @default false
	 */
	withOutdoorContext?: boolean;
};
type TCoordinateParams = {
	/**
	 * The latitude of the coordinate in decimal degrees.
	 */
	latitude: number;
	/**
	 * The longitude of the coordinate in decimal degrees.
	 */
	longitude: number;
	/**
	 * Optional ID of the floor this coordinate is on.
	 */
	floorId?: string;
	/**
	 * Optional vertical offset from the floor in meters.
	 */
	verticalOffset?: number;
};
/**
 * Class representing a pseudo-mercator coordinate.
 *
 * The Pseudo-Mercator projection is a type of cylindrical and conformal map projection.
 * It is identified as EPSG:3857 ({@link https://epsg.io/3857}).
 * This projection is a modified version of the traditional Mercator projection,
 * which is commonly used in marine navigation.
 */
export declare class Coordinate implements IFocusable, IAnchorable {
	/**
	 * @internal
	 */
	static readonly __type = "coordinate";
	/**
	 * @internal
	 */
	readonly __type = "coordinate";
	id: string;
	/**
	 * The latitude of the coordinate.
	 * @type {number}
	 */
	readonly latitude: number;
	/**
	 * The longitude of the coordinate.
	 * @type {number}
	 */
	readonly longitude: number;
	/**
	 * The floor ID of the coordinate.
	 */
	readonly floorId?: string;
	/**
	 * The vertical position of the coordinate, offset from the floor.
	 */
	readonly verticalOffset: number;
	/**
	 * Checks if the provided instance is of type Coordinate.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a Coordinate, false otherwise.
	 */
	static is(instance: object): instance is Coordinate;
	/**
	 * Creates a new Coordinate instance.
	 *
	 * @param latitudeOrParams Either a latitude number or a TCoordinateParams object containing coordinate details
	 */
	constructor(latitudeOrParams: TCoordinateParams);
	/**
	 * @deprecated
	 * @internal
	 */
	constructor(latitudeOrParams: number, longitude: number, floorId?: string);
	/**
	 * @internal
	 */
	get anchorTarget(): this;
	/**
	 * @internal
	 */
	get focusTarget(): this;
	/**
	 * Checks if this coordinate is equal to another coordinate.
	 *
	 * @param coordinate The coordinate to compare with.
	 * @returns {boolean} True if coordinates are equal, false otherwise.
	 */
	isEqual(coordinate: Coordinate): boolean;
	/**
	 * Serializes the coordinate data to JSON.
	 *
	 * @returns An object representing the coordinate.
	 */
	toJSON(): {
		__type: string;
		latitude: number;
		longitude: number;
		floorId: string | undefined;
		verticalOffset: number;
	};
	toGeoJSON(): {
		type: string;
		coordinates: number[];
	};
	/**
	 * Cleans up resources used by the instance.
	 *
	 * @internal
	 */
	destroy(): void;
}
declare abstract class BaseMetaData {
	/**
	 * The identity of the map metadata.
	 */
	readonly id: string;
	constructor(id: string);
}
/**
 * Represents the opening hours of a location.
 */
export declare class OpeningHours {
	#private;
	constructor(mvfData: OpeningHoursSpecification[]);
	/**
	 * Gets the raw opening hours data.
	 */
	get raw(): OpeningHoursSpecification[];
}
/**
 * A class representing hyperlink link data within the map.
 */
export declare class Hyperlink extends BaseMetaData {
	#private;
	/**
	 * @internal
	 */
	static readonly __type = "hyperlink";
	/**
	 * @internal
	 */
	readonly __type = "hyperlink";
	/**
	 * Checks if the provided instance is of type Hyperlink.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a Hyperlink, false otherwise.
	 */
	static is(instance: object): instance is Hyperlink;
	/**
	 * @internal
	 */
	constructor(options: {
		mvfData: MVFHyperlink | LocationLink;
	});
	/**
	 * Gets the url of the hyperlink.
	 *
	 * @returns {string} The url of the hyperlink.
	 */
	get url(): string;
	/**
	 * Gets the name of the hyperlink.
	 *
	 * @returns {string | undefined } The name of the hyperlink.
	 */
	get name(): string | undefined;
	/**
	 * Serializes the hyperlink data to JSON.
	 *
	 * @returns An object representing the hyperlink.
	 */
	toJSON(): {
		__type: string;
		id: string;
		url: string;
		name: string | undefined;
	};
	/**
	 * Cleans up resources used by the instance.
	 *
	 * @internal
	 */
	destroy(): void;
}
/**
 * A class representing image link data within the map.
 */
export declare class ImageMetaData extends BaseMetaData {
	#private;
	/**
	 * @internal
	 */
	static readonly __type = "image";
	/**
	 * @internal
	 */
	readonly __type = "image";
	/**
	 * Checks if the provided instance is of type Image.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a Image, false otherwise.
	 */
	static is(instance: object): instance is ImageMetaData;
	/**
	 * @internal
	 */
	constructor(options: {
		mvfData: MVFImage;
		mapData: MapDataInternal;
	});
	/**
	 * Gets the url of the image.
	 *
	 * @returns {string | undefined} The url of the image.
	 */
	get url(): string | undefined;
	/**
	 * Gets the alt text of the image.
	 *
	 * @returns {string | undefined } The alt text of the image.
	 * @deprecated Use {@link altText} instead.
	 */
	get name(): string | undefined;
	/**
	 * Gets the alt text of the image.
	 *
	 * @returns {string | undefined } The alt text of the image.
	 */
	get altText(): string | undefined;
	/**
	 * Serializes the image data to JSON.
	 *
	 * @returns An object representing the image.
	 */
	toJSON(): {
		__type: string;
		id: string;
		url: string | undefined;
		name: string | undefined;
	};
	/**
	 * Cleans up resources used by the instance.
	 *
	 * @internal
	 */
	destroy(): void;
}
type LocationData = Omit<MVFLocation, "categories" | "spaces" | "obstructions" | "entrances" | "shapes" | "connections" | "annotations" | "areas" | "openingHoursSpecification" | "links" | "pictures" | "website" | "icon"> & {
	links: Hyperlink[];
	images: ImageMetaData[];
	icon?: ImageMetaData;
};
export declare class LocationProfile extends BaseMetaData implements LocationData, IFocusable, INavigatable {
	#private;
	/**
	 * Checks if the provided instance is of type EnterpriseLocation.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a EnterpriseLocation, false otherwise.
	 */
	static is(instance: object): instance is LocationProfile;
	/**
	 * @internal
	 */
	static readonly __type = "location-profile";
	/**
	 * @internal
	 */
	readonly __type = "location-profile";
	id: LocationId;
	name: string;
	externalId?: string;
	description?: string;
	/**
	 * The location's logo
	 *
	 * @format uri
	 */
	logo?: string;
	phone?: string;
	/**
	 * The location's social media links.
	 */
	social: LocationSocial[];
	/**
	 * The location's pictures
	 */
	images: ImageMetaData[];
	/**
	 * Web links for the location
	 */
	links: Hyperlink[];
	/**
	 * The location's website
	 */
	website?: Hyperlink;
	/**
	 * The location's icon to display. Will be either a logo, category, or image
	 *
	 * @format uri
	 */
	icon?: ImageMetaData;
	constructor(data: MapDataInternal, options: {
		mvfData: MVFLocation;
	});
	/**
	 * Gets the {@link Space}s associated with the location.
	 *
	 * @returns {Space[]} The spaces array.
	 */
	get spaces(): Space[];
	/**
	 * Gets the {@link PointOfInterest}s associated with the location.
	 *
	 * @returns {PointOfInterest[]} The points of interest array.
	 */
	get points(): PointOfInterest[];
	/**
	 * Gets the {@link Door}s associated with the location.
	 *
	 * @returns {Door[]} The doors array.
	 */
	get doors(): Door[];
	/**
	 * Gets the {@link Connection}s associated with the location.
	 *
	 * @returns {Connection[]} The connections array.
	 */
	get connections(): Connection[];
	/**
	 * Gets the {@link Annotation}s associated with the location.
	 *
	 * @returns {Annotation[]} The annotations array.
	 */
	get annotations(): Annotation[];
	/**
	 * Gets the {@link LocationCategory}s associated with the location.
	 *
	 * @returns {LocationCategory[]} The location categories array.
	 */
	get categories(): LocationCategory[];
	/**
	 * Gets the {@link MapObject}s associated with the location.
	 *
	 * @returns {MapObject[]} The map objects array.
	 */
	get mapObjects(): MapObject[];
	/**
	 * Gets the {@link Area}s associated with the location.
	 *
	 * @returns {Area[]} The areas array.
	 */
	get areas(): Area[];
	/** @internal */
	get focusTarget(): TFocusTarget[];
	/**
	 * Gets the {@link OpeningHours} associated with the location.
	 *
	 * @returns {OpeningHours} The opening hours.
	 */
	get openingHours(): OpeningHours;
	/**
	 * @internal
	 */
	get navigationTarget(): TNavigationTarget[];
	toJSON(): {
		__type: string;
		id: string;
		name: string;
	};
}
declare abstract class BaseMapData {
	#private;
	/**
	 * The identity of the map data.
	 */
	readonly id: string;
	constructor(id: string, _data: MapDataInternal);
	/**
	 * Gets the bounding box of the geoJSON geometry.
	 *
	 * @returns {BBox} The bounding box of the geoJSON geometry
	 */
	get geoJSONBoundingBox(): BBox | undefined;
	get geoJSON(): Feature$1<Polygon$1 | MultiPolygon$1 | LineString | Point$1, null>;
}
type PropertiesWithDetails = {
	id: string;
	externalId?: string;
	details?: Details;
};
declare abstract class DetailedMapData<MVFData extends MVFFeature<Geometry, PropertiesWithDetails>> extends BaseMapData {
	#private;
	constructor(data: MapDataInternal, mvfData: MVFData);
	/**
	 * Gets the external identifier of the map feature.
	 *
	 * @returns {string} The external ID of the map feature, or an empty string if no external ID exists.
	 */
	get externalId(): string;
	/**
	 * Gets the name of the map feature.
	 *
	 * @returns {string} The name of the map feature.
	 */
	get name(): string;
	/**
	 * Gets the URL of the icon for the map feature.
	 *
	 * @returns {ImageMetaData | undefined} The icon of the map feature.
	 */
	get icon(): ImageMetaData | undefined;
	/**
	 * Gets the description of the map feature.
	 *
	 * @returns {string} The description of the map feature, or an empty string if no description exists.
	 */
	get description(): string;
	/**
	 * Gets the array of {@link ImageMetaData}s associated with this map feature.
	 *
	 * @returns {ImageMetaData[]} An array of Image objects, or an empty array if no images exist.
	 */
	get images(): ImageMetaData[];
	/**
	 * Gets the array of {@link Hyperlink}s associated with this map feature.
	 *
	 * @returns {Hyperlink[]} An array of Hyperlink objects, or an empty array if no links exist.
	 */
	get links(): Hyperlink[];
	/**
	 * Gets the {@link LocationProfile}s attached to this feature.
	 *
	 * @returns {LocationProfile[]} An array of location profiles.
	 */
	get locationProfiles(): LocationProfile[];
}
/**
 * An Area represents some grouping of multiple pieces of geometry, not
 * necessarily bounded by walls or any other physical feature of the map.
 *
 * Areas are currently in a preview state, and may have changes to existing
 * functionality or new features added in the future.
 */
export declare class Area extends DetailedMapData<AreaCollection["features"][number]> implements IGeoJSONData, IFocusable, IAnchorable {
	#private;
	/**
	 * @internal
	 */
	static readonly __type = "area";
	/**
	 * @internal
	 */
	readonly __type = "area";
	/**
	 * Checks if the provided instance is of type Area.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a Area, false otherwise.
	 */
	static is(instance: object): instance is Area;
	/**
	 * @internal
	 */
	constructor(data: MapDataInternal, options: {
		floorId: string;
		mvfData: AreaCollection["features"][number];
	});
	/**
	 * Gets the center {@link Coordinate} of the area.
	 *
	 * @returns {Coordinate} The area's center coordinate.
	 */
	get center(): Coordinate;
	/**
	 * Gets the {@link Floor} object associated with the area.
	 *
	 * @returns {Floor} The floor object.
	 * @throws Will throw an error if the floor is not found.
	 */
	get floor(): Floor;
	/**
	 * Gets the underlying GeoJSON Feature representation of this Area.
	 */
	get geoJSON(): {
		properties: null;
		type: import("@mappedin/mvf-v2").FeatureType;
		geometry: import("@mappedin/mvf-v2").Polygon;
	};
	/** @internal */
	get focusTarget(): this;
	/** @internal */
	get anchorTarget(): Coordinate;
	/**
	 * Serializes the space data to JSON.
	 *
	 * @returns An object representing the space.
	 */
	toJSON(): {
		__type: string;
		id: string;
		name: string;
		floor: string;
	};
	/**
	 * Cleans up resources used by the instance.
	 *
	 * @internal
	 */
	destroy(): void;
}
/**
 * A class representing door data within the map.
 *
 * Doors are hidden by default. Doors can be made visible by setting their `visible` property to `true`.
 *
 * ```typescript
 * //Make interior doors visible and brown.
 * mapView.updateState(DOORS.Interior, {
 * 	visible: true,
 * 	color: '#5C4033',
 * 	opacity: 0.6,
 * });

 * //Make exterior doors visible and black.
 * mapView.updateState(DOORS.Exterior, {
 * 	visible: true,
 * 	color: 'black',
 * 	opacity: 0.6,
 * });
 * ```
 * Doors can also be made visible on an individual basis by passing in a {@link Door} object to {@link MapView.updateState}.
 *
 * Refer to the [Door Guide](https://developer.mappedin.com/web-sdk/spaces#doors) for more information and interactive examples.
 *
 * Door appearance can be customized by changing the color or adding a texture to the top or sides of a door.
 * Refer to the [Textures & Colors Guide](https://developer.mappedin.com/web-sdk/images-textures#textures--colors) for more information and interactive examples.
 *
 */
export declare class Door extends DetailedMapData<EntranceFeature> implements IGeoJSONData, IFocusable, IAnchorable {
	#private;
	/**
	 * @internal
	 */
	static readonly __type = "door";
	/**
	 * @internal
	 */
	readonly __type = "door";
	/**
	 * Checks if the provided instance is of type Door.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a Door, false otherwise.
	 */
	static is(instance: object): instance is Door;
	/**
	 * @internal
	 */
	constructor(data: MapDataInternal, options: {
		floorId: string;
		mvfData: EntranceFeature;
	});
	/**
	 * Gets the {@link Floor} object associated with the door.
	 *
	 * @returns {Floor} The floor object.
	 * @throws Will throw an error if the floor is not found.
	 */
	get floor(): Floor;
	/**
	 * Calculates and gets the center {@link Coordinate} of the door.
	 *
	 * @returns {Coordinate} The center coordinate.
	 */
	get center(): Coordinate;
	/**
	 * Gets whether this door is an exterior door.
	 */
	get isExterior(): boolean;
	/**
	 * Gets the underlying GeoJSON Feature representation of this Door.
	 */
	get geoJSON(): {
		properties: null;
		type: import("@mappedin/mvf-v2").FeatureType;
		geometry: import("@mappedin/mvf-v2").LineString;
	};
	/** @internal */
	get focusTarget(): Coordinate;
	/** @internal */
	get anchorTarget(): Coordinate;
	/**
	 * Converts the door information to a JSON object.
	 *
	 * @returns An object representing the door.
	 */
	toJSON(): {
		__type: string;
		id: string;
		name: string;
		floor: string;
		center: {
			__type: string;
			latitude: number;
			longitude: number;
			floorId: string | undefined;
			verticalOffset: number;
		};
	};
	/**
	 * Cleans up resources used by the instance.
	 *
	 * @internal
	 */
	destroy(): void;
}
/**
 * Represents the various types of spaces that can be defined within a map.
 * - 'room': A standard room or enclosed area.
 * - 'hallway': A passageway connecting rooms.
 * - 'exterior': An outdoor area.
 * - 'void': An undefined or non-specific space.
 */
export type TSpaceType = "room" | "hallway" | "exterior" | "void" | "gate";
/**
 * A Space represents an area enclosed by walls, such as a hall or room. Spaces can be Interactive and have Labels and Markers added to them.
 * Spaces can also be customized with a color, texture and hover color.
 *
 * Refer to the [Spaces Guide](https://developer.mappedin.com/web-sdk/spaces) for more information and interactive examples.
 */
export declare class Space extends DetailedMapData<SpaceFeature> implements IGeoJSONData, IFocusable, IAnchorable {
	#private;
	/**
	 * @internal
	 */
	static readonly __type = "space";
	/**
	 * @internal
	 */
	readonly __type = "space";
	/**
	 * Checks if the provided instance is of type Space.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a Space, false otherwise.
	 */
	static is(instance: object): instance is Space;
	/**
	 * @internal
	 */
	constructor(data: MapDataInternal, options: {
		floorId: string;
		mvfData: SpaceFeature;
	});
	/**
	 * Gets the type/kind of the space.
	 *
	 * @returns {TSpaceType} The type of the space.
	 */
	get type(): TSpaceType;
	/**
	 * @internal
	 */
	get locations(): EnterpriseLocation[];
	/**
	 * Gets the {@link Floor} object associated with the space.
	 *
	 * @returns {Floor} The floor object.
	 * @throws Will throw an error if the floor is not found.
	 */
	get floor(): Floor;
	/**
	 * Gets the array of {@link Door}s associated with the space.
	 *
	 * @returns {Door[]} The doors array.
	 */
	get doors(): Door[];
	/**
	 * Gets the center {@link Coordinate} of the space.
	 *
	 * @returns {Coordinate} The space's center coordinate.
	 */
	get center(): Coordinate;
	/**
	 * Gets the underlying GeoJSON Feature representation of this Space.
	 */
	get geoJSON(): {
		properties: null;
		type: import("@mappedin/mvf-v2").FeatureType;
		geometry: import("@mappedin/mvf-v2").Point | import("@mappedin/mvf-v2").LineString | import("@mappedin/mvf-v2").Polygon;
	};
	/** @internal */
	get focusTarget(): Coordinate | this;
	/** @internal */
	get anchorTarget(): Coordinate;
	/**
	 * Serializes the space data to JSON.
	 *
	 * @returns An object representing the space.
	 */
	toJSON(): {
		__type: string;
		id: string;
		name: string;
		type: TSpaceType;
		floor: string;
		center: {
			__type: string;
			latitude: number;
			longitude: number;
			floorId: string | undefined;
			verticalOffset: number;
		};
	};
	/**
	 * Cleans up resources used by the instance.
	 *
	 * @internal
	 */
	destroy(): void;
}
/**
 * A class representing point of interest data within the map.
 *
 * Points of interest are used to represent specific points
 * on the map with additional information(e.g. ATMs, Water Fountains).
 */
export declare class PointOfInterest extends DetailedMapData<FeatureCollection<Point, SpaceProperties>["features"][number]> implements IGeoJSONData, IFocusable, IAnchorable {
	#private;
	/**
	 * @internal
	 */
	static readonly __type = "point-of-interest";
	/**
	 * @internal
	 */
	readonly __type = "point-of-interest";
	/**
	 * Checks if the provided instance is of type PointOfInterest.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a PointOfInterest, false otherwise.
	 */
	static is(instance: object): instance is PointOfInterest;
	/**
	 * @internal
	 */
	constructor(data: MapDataInternal, options: {
		floorId: string;
		mvfData: FeatureCollection<Point, SpaceProperties>["features"][number];
	});
	/**
	 * Gets the {@link Floor} object associated with the POI.
	 *
	 * @returns {Floor} The floor object.
	 * @throws Will throw an error if the floor is not found.
	 */
	get floor(): Floor;
	/**
	 * Gets the {@link Coordinate} of the POI.
	 *
	 * @returns {Coordinate} The POI's coordinate.
	 */
	get coordinate(): Coordinate;
	/**
	 * Gets the underlying GeoJSON Feature representation of this PointOfInterest.
	 */
	get geoJSON(): {
		properties: null;
		type: import("@mappedin/mvf-v2").FeatureType;
		geometry: Point;
	};
	/** @internal */
	get focusTarget(): Coordinate;
	/** @internal */
	get anchorTarget(): Coordinate;
	/**
	 * Serializes the POI data to JSON.
	 *
	 * @returns An object representing the POI.
	 */
	toJSON(): {
		__type: string;
		id: string;
		name: string;
		floor: string;
		coordinate: {
			__type: string;
			latitude: number;
			longitude: number;
			floorId: string | undefined;
			verticalOffset: number;
		};
	};
	/**
	 * Cleans up resources used by the instance.
	 *
	 * @internal
	 */
	destroy(): void;
}
/**
 * A class representing annotation data within the map.
 *
 * Annotations are used to mark specific points or areas on the map with additional information.
 * It includes some details on a map that may be relevant to safety or accessibility (e.g. Fire Extinguishers).
 * Refer to the [Annotation Guide](https://developer.mappedin.com/web-sdk/annotations) for more information.
 */
export declare class Annotation extends DetailedMapData<AnnotationCollection["features"][number]> implements IGeoJSONData, IFocusable, IAnchorable {
	#private;
	/**
	 * @internal
	 */
	static readonly __type = "annotation";
	/**
	 * @internal
	 */
	readonly __type = "annotation";
	/**
	 * Checks if the provided instance is of type Annotation.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is an Annotation, false otherwise.
	 */
	static is(instance: object): instance is Annotation;
	/**
	 * @internal
	 */
	constructor(data: MapDataInternal, options: {
		floorId: string;
		mvfData: AnnotationCollection["features"][number];
		symbol?: AnnotationSymbol;
	});
	/**
	 * Gets the group of the annotation.
	 *
	 * @returns {string} The annotation group.
	 */
	get group(): string;
	/**
	 * Gets the type of the annotation.
	 *
	 * @returns {string} The annotation type.
	 */
	get type(): string;
	/**
	 * Gets the center {@link Coordinate} of the annotation.
	 *
	 * @returns {Coordinate} The annotation's coordinate.
	 */
	get coordinate(): Coordinate;
	/**
	 * Gets the {@link Floor} object associated with the annotation.
	 *
	 * @returns {Floor} The floor object.
	 * @throws Will throw an error if the floor is not found.
	 */
	get floor(): Floor;
	/**
	 * Gets the name of the annotation.
	 *
	 * @returns {string} The annotation's name.
	 */
	get name(): string;
	/**
	 * Gets the icon for the annotation.
	 *
	 * @returns {ImageMetaData | undefined} The icon of the annotation.
	 */
	get icon(): ImageMetaData | undefined;
	/**
	 * Gets the underlying GeoJSON Feature representation of this Annotation.
	 */
	get geoJSON(): {
		properties: null;
		type: import("@mappedin/mvf-v2").FeatureType;
		geometry: import("@mappedin/mvf-v2").Point;
	};
	/** @internal */
	get focusTarget(): Coordinate;
	/** @internal */
	get anchorTarget(): Coordinate;
	/**
	 * Converts the annotation information to a JSON object.
	 *
	 * @returns An object representing the annotation.
	 */
	toJSON(): {
		__type: string;
		id: string;
		group: string;
		type: string;
		coordinate: {
			__type: string;
			latitude: number;
			longitude: number;
			floorId: string | undefined;
			verticalOffset: number;
		};
	};
	/**
	 * Cleans up resources used by the instance.
	 *
	 * @internal
	 */
	destroy(): void;
}
/**
 * A class representing connection data within the map.
 *
 * Connections are used to represent pathways between different map nodes.
 */
export declare class Connection extends DetailedMapData<Feature<Point, SpaceProperties> | Feature<Point, MVFConnection>> implements IFocusable {
	#private;
	/**
	 * @internal
	 */
	static readonly __type = "connection";
	/**
	 * @internal
	 */
	readonly __type = "connection";
	/**
	 * Checks if the provided instance is of type Connection.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a Connection, false otherwise.
	 */
	static is(instance: object): instance is Connection;
	/**
	 * @internal
	 */
	constructor(data: MapDataInternal, options: {
		mvfDataByFloorId: Record<string, FeatureCollection<Point, SpaceProperties>["features"][number]> | Record<string, Feature<Point, MVFConnection>>;
		accessible?: boolean;
	});
	/**
	 * Whether the connection is accessible. For example elevators are accessible while stairs are not.
	 *
	 * @returns {boolean} Whether the connection is accessible.
	 */
	get accessible(): boolean;
	/**
	 * Gets the type of the connection.
	 *
	 * @returns {TConnectionType} The type of the connection.
	 */
	get type(): TConnectionType;
	/**
	 * Extra properties of the connection.
	 *
	 * @returns {Record<string, unknown> | undefined} Extra properties of the connection.
	 */
	get extra(): Record<string, unknown> | undefined;
	/**
	 * Gets the coordinates ({@link Coordinate}) of the connection.
	 *
	 * @returns {Coordinate[]} An array of coordinates for the connection.
	 */
	get coordinates(): Coordinate[];
	/**
	 * Gets the nodes ({@link Node}) associated with the connection.
	 */
	get nodes(): Node$1[];
	/**
	 * Gets the floors ({@link Floor}) associated with the connection.
	 *
	 * @returns {Floor[]} An array of floors for the connection.
	 */
	get floors(): Floor[];
	/**
	 * Gets the location profiles ({@link LocationProfile}) associated with the connection.
	 */
	get locationProfiles(): LocationProfile[];
	/** @internal */
	get focusTarget(): Coordinate[];
	/**
	 * Serializes the connection data to JSON.
	 *
	 * @returns An object representing the connection.
	 */
	toJSON(): {
		__type: string;
		id: string;
		name: string;
		type: "door" | "stairs" | "elevator" | "escalator" | "ramp" | "slide" | "portal" | "security" | "shuttle" | "ladder";
		externalId: string;
		coordinates: {
			__type: string;
			latitude: number;
			longitude: number;
			floorId: string | undefined;
			verticalOffset: number;
		}[];
		floors: string[];
		extra: Record<string, unknown> | undefined;
	};
	/**
	 * Cleans up resources used by the instance.
	 *
	 * @internal
	 */
	destroy(): void;
}
/**
 * A class representing generic map object data within the map.
 *
 * It could represent various objects on the map, such as desks, chairs, etc.
 *
 * MapObject appearance can be customized by changing the color or adding a texture to its top or sides.
 * Refer to the [Textures & Colors Guide](https://developer.mappedin.com/web-sdk/images-textures#textures--colors) for more information and interactive examples.
 */
export declare class MapObject extends DetailedMapData<ObstructionFeature> implements IGeoJSONData, IFocusable, IAnchorable {
	#private;
	/**
	 * @internal
	 */
	static readonly __type = "object";
	/**
	 * @internal
	 */
	readonly __type = "object";
	/**
	 * Checks if the provided instance is of type MapObject.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a MapObject, false otherwise.
	 */
	static is(instance: object): instance is MapObject;
	/**
	 * @internal
	 */
	constructor(data: MapDataInternal, options: {
		floorId: string;
		mvfData: ObstructionFeature;
	});
	/**
	 * Gets the type of the MapObject.
	 *
	 * @returns {string} The kind of the object.
	 */
	get type(): string;
	/**
	 * @internal
	 */
	get locations(): EnterpriseLocation[];
	/**
	 * Gets the {@link Floor} associated with the MapObject.
	 *
	 * @returns {Floor} The floor object.
	 * @throws Will throw an error if the floor is not found.
	 */
	get floor(): Floor;
	/**
	 * Gets the center {@link Coordinate} of the MapObject.
	 *
	 * @returns {Coordinate} The object's center coordinate.
	 */
	get center(): Coordinate;
	/**
	 * Gets the underlying GeoJSON Feature representation of this Object.
	 */
	get geoJSON(): {
		properties: null;
		type: import("@mappedin/mvf-v2").FeatureType;
		geometry: import("@mappedin/mvf-v2").LineString | import("@mappedin/mvf-v2").Polygon;
	};
	/** @internal */
	get anchorTarget(): Coordinate;
	/** @internal */
	get focusTarget(): Coordinate | this;
	/**
	 * Serializes the MapObject data to JSON.
	 *
	 * @returns An object representing the MapObject.
	 */
	toJSON(): {
		__type: string;
		id: string;
		name: string;
		type: string;
		floor: string;
		center: {
			__type: string;
			latitude: number;
			longitude: number;
			floorId: string | undefined;
			verticalOffset: number;
		};
	};
	/**
	 * Cleans up resources used by the instance.
	 *
	 * @internal
	 */
	destroy(): void;
}
type TokenWithExpiration = {
	token: string;
	expires?: number;
};
type TokenManagerOptions = {
	baseUri?: string;
	baseAuthUri?: string;
	customAuthUri?: string;
	key?: string;
	secret?: string;
	accessToken?: string;
	enterprise?: boolean;
};
type TokenManagerEvents = {
	"access-token-refreshed": {
		accessToken: TokenWithExpiration;
	};
	"sas-tokens-refreshed": {
		sasTokens: Record<string, TokenWithExpiration>;
	};
};
type TokenManagerPubSub = PubSub<TokenManagerEvents>;
declare class TokenManager {
	#private;
	constructor(mapIds: string[], options: TokenManagerOptions);
	/**
	 * Set the map IDs that the token manager will manage.
	 */
	setMapIds(mapIds: string[]): void;
	/**
	 * Set the enterprise flag.
	 */
	setEnterprise(enterprise: boolean): void;
	/**
	 * Preload tokens so they can be retrieved synchronously. This will also refresh tokens on an
	 * interval so they remain valid synchronously.
	 */
	readySync(): Promise<void>;
	/**
	 * Get a promise that resolves when the tokens are refreshed, but does not trigger token
	 * refreshing.
	 */
	refreshing(): Promise<unknown[]>;
	/**
	 * Get an access token for the current set of API keys. If an access token was passed in, that
	 * will be returned instead.
	 */
	getAccessTokenAsync(): Promise<TokenWithExpiration>;
	/**
	 * Get SAS tokens for all maps. If any SAS token are expired, all SAS tokens will be refreshed.
	 */
	getSasTokensAsync(): Promise<{
		tokens: Record<string, TokenWithExpiration>;
		expires: number;
	}>;
	/**
	 * Get an access token synchronously. `readySync()` must be called first.
	 */
	getAccessToken(): TokenWithExpiration;
	/**
	 * Get a SAS token for a specific map synchronously. `readySync()` must be called first.
	 */
	getSasToken(mapId: string): TokenWithExpiration;
	/**
	 * Check if the token manager is in enterprise mode.
	 */
	isEnterpriseMode(): boolean;
	/**
	 * Subscribe to events emitted by the token manager.
	 */
	on: TokenManagerPubSub["on"];
	/**
	 * Unsubscribe from events emitted by the token manager.
	 */
	off: TokenManagerPubSub["off"];
	/**
	 * Clean up the token manager.
	 */
	destroy(): void;
}
/**
 * Places are the main objects that can be searched for.
 */
export type Places = Space | Floor | Door | Connection | MapObject | PointOfInterest | Annotation | Area;
type LocationWithLocale = PartialExcept<MvfEnterpriseLocation, "id">;
type CategoryWithLocale = PartialExcept<MvfEnterpriseCategory, "id">;
type FloorStackWithLocale = PartialExcept<MvfFloorStack, "id">;
type FloorWithLocale = PartialExcept<MvfFloor, "id">;
type LanguagePackRecords = {
	"enterprise-location": Record<string, LocationWithLocale> | undefined;
	"enterprise-category": Record<string, CategoryWithLocale> | undefined;
	"floor-stack": Record<string, FloorStackWithLocale> | undefined;
	floor: Record<string, FloorWithLocale> | undefined;
};
type LanguagePack = {
	type: "downloaded";
	data: ParsedMVFLocalePack;
	optimized: LanguagePackRecords;
} | {
	type: "initial";
	optimized: LanguagePackRecords;
};
type TMapDataInternalOptions = {
	env?: EnvControl;
	enterprise?: boolean;
	outdoorViewToken?: string;
	localePacksUrls?: LocalePackUrls;
	languagePacks?: LanguagePackHydrationItem[];
	binaryBundle?: Uint8Array;
	tokenManager?: TokenManager;
	getMapDataOptions?: TGetMapDataOptions;
};
type MVFNodeFeature = MVFNodeCollection["features"][number];
type MVFFloorFeature = FloorCollection["features"][number];
/**
 * A class representing floor data within the map.
 *
 * Floors are used to represent different levels within a map, each containing various map elements.
 */
export declare class Floor extends BaseMapData implements IFocusable {
	#private;
	/**
	 * @internal
	 */
	static readonly __type = "floor";
	/**
	 * @internal
	 */
	readonly __type = "floor";
	/**
	 * Checks if the provided instance is of type Floor.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a Floor, false otherwise.
	 */
	static is(instance: object): instance is Floor;
	/**
	 * @internal
	 */
	constructor(data: MapDataInternal, options: {
		mvfData: MVFFloorFeature;
	});
	/** @internal */
	get focusTarget(): this;
	/**
	 * Gets the name of the floor.
	 *
	 * @returns {string} The name of the floor.
	 */
	get name(): string;
	/**
	 * Gets the short name of the floor (i.e. "F1", "L, "2", etc.).
	 * Used in space constrained lists and Often aligns with what is displayed on an elevator.
	 *
	 * @returns {string} The short name of the floor.
	 */
	get shortName(): string;
	/**
	 * Gets the subtitle of the floor.
	 *
	 * @returns {string} The subtitle of the floor.
	 */
	get subtitle(): string;
	/**
	 * Gets the external ID of the floor.
	 *
	 * @returns {string} The external ID of the floor.
	 */
	get externalId(): string;
	/**
	 * Gets the elevation of the floor.
	 *
	 * @returns {number} The elevation of the floor.
	 */
	get elevation(): number;
	/**
	 * Gets the max height of the floor if there is one.
	 *
	 * @returns {number | undefined} The max height of the floor.
	 */
	get maxHeight(): number | undefined;
	/**
	 * Gets the spaces ({@link Space}) located on this floor.
	 *
	 * @returns {Space[]} An array of Space objects on this floor.
	 */
	get spaces(): Space[];
	/**
	 * Gets the underlying GeoJSON Feature representation of this Space.
	 */
	get geoJSON(): Feature<Polygon | MultiPolygon, null>;
	/**
	 * Gets the objects ({@link MapObject}) located on this floor.
	 *
	 * @returns {MapObject[]} An array of MapObject objects on this floor.
	 */
	get objects(): MapObject[];
	/**
	 * Gets the connections ({@link Connection}) associated with this floor.
	 *
	 * @returns {Connection[]} An array of Connection objects linked to this floor.
	 */
	get connections(): Connection[];
	/**
	 * Gets the doors ({@link Door}) located on this floor.
	 *
	 * @returns {Door[]} An array of Door objects on this floor.
	 */
	get doors(): Door[];
	/**
	 * Gets the annotations ({@link Annotation}) associated with this floor.
	 *
	 * @returns {Annotation[]} An array of Annotation objects linked to this floor.
	 */
	get annotations(): Annotation[];
	/**
	 * Gets the points of interest ({@link PointOfInterest}) located on this floor.
	 *
	 * @returns {PointOfInterest[]} An array of PointOfInterest objects on this floor.
	 */
	get pois(): PointOfInterest[];
	/**
	 * Gets the FloorStack ({@link FloorStack}) that this floor belongs to.
	 *
	 * @returns {FloorStack} The FloorStack that this floor belongs to.
	 */
	get floorStack(): FloorStack;
	get center(): Coordinate;
	/**
	 * Serializes the floor data to JSON.
	 *
	 * @returns An object representing the floor.
	 */
	toJSON(): {
		__type: string;
		id: string;
		name: string;
		shortName: string;
		subtitle: string;
		elevation: number;
		maxHeight: number | undefined;
		spaces: string[];
		objects: string[];
		connections: string[];
		doors: string[];
		annotations: string[];
		pois: string[];
	};
	/**
	 * Cleans up resources used by the instance.
	 *
	 * @internal
	 */
	destroy(): void;
}
/**
 * A class representing {@link Path} node data within the map.
 *
 * Nodes are used to define points in the map's pathfinding graph.
 *
 */
declare class Node$1 extends BaseMetaData implements IGeoJSONData, IFocusable, IAnchorable {
	#private;
	/**
	 * @internal
	 */
	static readonly __type = "node";
	/**
	 * @internal
	 */
	readonly __type = "node";
	/**
	 * Checks if the provided instance is of type Node.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a Node, false otherwise.
	 */
	static is(instance: object): instance is Node$1;
	/**
	 * @internal
	 */
	constructor(data: MapDataInternal, options: {
		floorId: string;
		mvfData: MVFNodeFeature;
	});
	/** @internal */
	get locations(): EnterpriseLocation[];
	/**
	 * Gets the {@link Space} object associated with the node.
	 */
	get space(): Space | undefined;
	/**
	 * Gets the {@link MapObject} object associated with the node.
	 */
	get object(): MapObject | undefined;
	/**
	 * Gets the {@link Floor} associated with the node.
	 *
	 * @returns {Floor} The floor object.
	 * @throws Will throw an error if the floor is not found.
	 */
	get floor(): Floor;
	/**
	 * Gets the {@link Coordinate} of the node.
	 *
	 * @returns {Coordinate} The node's coordinate.
	 */
	get coordinate(): Coordinate;
	/**
	 * Gets the external ID of the node.
	 *
	 * @returns {string} The external ID of the node.
	 */
	get externalId(): string;
	/**
	 * Gets the neighboring nodes of this node.
	 *
	 * @returns {Node[]} An array of neighboring Node objects.
	 */
	get neighbors(): Node$1[];
	/**
	 * Gets the navigation flags of the node.
	 *
	 * Navigation flags are string identifiers that describe properties of this node for navigation,
	 * such as `accessible` for wheelchair accessibility or `outdoors` for outdoor routes.
	 *
	 * @returns {string[]} An array of navigation flags present on this node.
	 */
	get navigationFlags(): readonly string[];
	/**
	 * Gets the underlying GeoJSON Feature representation of this Node.
	 */
	get geoJSON(): {
		properties: null;
		type: import("@mappedin/mvf-v2").FeatureType;
		geometry: import("@mappedin/mvf-v2").Point;
	};
	/** @internal */
	get focusTarget(): Coordinate;
	/** @internal */
	get anchorTarget(): Coordinate;
	/**
	 * Serializes the node data to JSON.
	 *
	 * @returns An object representing the node.
	 */
	toJSON(): {
		__type: string;
		id: string;
		floor: string;
		coordinate: {
			__type: string;
			latitude: number;
			longitude: number;
			floorId: string | undefined;
			verticalOffset: number;
		};
		neighbors: string[];
	};
	/**
	 * Cleans up resources used by the instance.
	 *
	 * @internal
	 */
	destroy(): void;
}
/**
 * A class representing floor stack data within the map.
 *
 * FloorStacks are used to represent a group of floors that are part of a single entity.
 */
export declare class FloorStack extends BaseMapData {
	#private;
	/**
	 * @internal
	 */
	static readonly __type = "floor-stack";
	/**
	 * @internal
	 */
	readonly __type = "floor-stack";
	/**
	 * Checks if the provided instance is of type FloorStack.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a FloorStack, false otherwise.
	 */
	static is(instance: object): instance is FloorStack;
	/**
	 * @internal
	 */
	constructor(data: MapDataInternal, options: {
		mvfData: MVFFloorStack;
		facadeId?: string;
	});
	/**
	 * Gets the type of FloorStack.
	 */
	get type(): MVFFloorStack["type"];
	/**
	 * Gets the name of the FloorStack.
	 *
	 * @returns {string} The name of the FloorStack.
	 */
	get name(): string;
	/**
	 * Gets the short name of the FloorStack.
	 *
	 * @returns {string} The short name of the FloorStack.
	 */
	get shortName(): string;
	/**
	 * Gets the externalId of FloorStack
	 */
	get externalId(): string;
	/**
	 * Gets the floors ({@link Floor}) included in this FloorStack.
	 *
	 * @returns {Floor[]} An array of Floor objects in this FloorStack.
	 */
	get floors(): [
		Floor,
		...Floor[]
	];
	/**
	 * Get the default floor for this floor stack
	 */
	get defaultFloor(): Floor;
	/**
	 * Gets the facade ({@link Facade}) representing this floor stack, if it exists.
	 */
	get facade(): Facade | undefined;
	/**
	 * Serializes the FloorStack data to JSON.
	 *
	 * @returns An object representing the FloorStack.
	 */
	toJSON(): {
		__type: string;
		id: string;
		name: string;
		shortName: string;
		type: "Building" | "Outdoor" | undefined;
		floors: string[];
	};
	/**
	 * Cleans up resources used by the instance.
	 *
	 * @internal
	 */
	destroy(): void;
}
/**
 * A Facade is a collection of spaces that make up the exterior representation of a Floor Stack ({@link FloorStack}).
 */
export declare class Facade extends BaseMapData implements IFocusable, IAnchorable {
	#private;
	static readonly __type = "facade";
	readonly __type = "facade";
	/**
	 * Checks if the provided instance is of type Floor.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a Floor, false otherwise.
	 */
	static is(instance: object): instance is Facade;
	/** @internal */
	constructor(data: MapDataInternal, options: {
		mvfData: MVFFacade;
		floorStackId: string;
	});
	/**
	 * Gets the floor stack that this Facade represents.
	 */
	get floorStack(): FloorStack;
	/**
	 * Gets the collection of spaces that make up this Facade.
	 */
	get spaces(): Space[];
	/**
	 * Gets the center {@link Coordinate} of the Facade.
	 */
	get center(): Coordinate;
	/** @internal */
	get focusTarget(): Space[];
	/** @internal */
	get anchorTarget(): Coordinate;
	toJSON(): {
		id: string;
		__type: string;
		floorStackId: string;
		floorStack: FloorStack;
		spaces: Space[];
	};
}
type MapDataRecords = {
	spacesById: Record<string, Space>;
	nodesById: Record<string, Node$1>;
	objectsById: Record<string, MapObject>;
	floorsById: Record<string, Floor>;
	floorStacksById: Record<string, FloorStack>;
	facadesById: Record<string, Facade>;
	facadesBySpaceId: Record<string, Facade>;
	connectionsById: Record<string, Connection>;
	doorsById: Record<string, Door>;
	doorsByNodeId: Record<string, Door>;
	poisById: Record<string, PointOfInterest>;
	annotationsById: Record<string, Annotation>;
	areasById: Record<AreaId, Area>;
	spaceIdsByNodeId: Record<string, SpaceId[]>;
	objectIdsByNodeId: Record<string, ObstructionId[]>;
	destinationNodesIdsBySpaceId: Record<SpaceId, NodeId[]>;
	/**
	 * Map of space id to door-linked node ids for fast routing.
	 */
	entranceNodeIdsBySpaceId?: Record<string, string[]>;
	locationProfilesById: Record<string, LocationProfile>;
	locationCategoriesById: Record<string, LocationCategory>;
	locationProfilesByCategoryId: Record<string, LocationProfile[]>;
	locationCategoriesByParentId: Record<string, LocationCategory[]>;
	spacesByExternalId: Record<string, Space[]>;
	nodesByExternalId: Record<string, Node$1[]>;
	poisByExternalId: Record<string, PointOfInterest[]>;
	doorsByExternalId: Record<string, Door[]>;
	floorStacksByExternalId: Record<string, FloorStack[]>;
	floorsByExternalId: Record<string, Floor[]>;
	objectsByExternalId: Record<string, MapObject[]>;
	areasByExternalId: Record<string, Area[]>;
	locationProfilesByExternalId: Record<string, LocationProfile[]>;
	objectEntranceNodeIdsByObstructionId: Record<string, string[]>;
	obstructionIdByEntranceId: Record<string, string>;
	connectionIdsByLatLon: Record<string, string[]>;
	mvfConnectionIdsByLatLon: Record<string, string[]>;
	locationProfilesByAttachedFeatureId: Record<string, LocationProfile[]>;
	mvfSpacesById: Record<string, SpaceCollection["features"][number]>;
	mvfNodesById: Record<string, NodeCollection["features"][number]>;
	mvfObstructionById: Record<string, ObstructionCollection["features"][number]>;
	mvfFloorsById: Record<string, MVFFloor>;
	mvfFloorStacksById: Record<string, MVFFloorStack>;
	mvfConnectionsById: Record<string, MVFConnection>;
	mvfConnectionsByNodeId: Record<string, MVFConnection>;
	mvfEntrancesById: Record<string, EntranceCollection["features"][number]>;
	mvfAnnotationsById: Record<string, AnnotationCollection["features"][number]>;
	mvfNodesByFloorId: {
		[floorId: string]: NodeCollection["features"][number][];
	};
	mvfSpacesByFloorId: {
		[floorId: string]: SpaceCollection["features"][number][];
	};
	mvfPoisByFloorId: {
		[floorId: string]: FeatureCollection<Point, SpaceProperties>["features"][number][];
	};
	mvfEntrancesByFloorId: {
		[floorId: string]: EntranceCollection["features"][number][];
	};
	mvfAnnotationsByFloorId: {
		[floorId: string]: AnnotationCollection["features"][number][];
	};
	mvfAreasById: Record<AreaId, AreaCollection["features"][number]>;
};
type EnterpriseMapDataRecords = {
	connectionsByExternalId: Record<string, Connection[]>;
	locationsByExternalId: Record<string, EnterpriseLocation[]>;
	categoriesByExternalId: Record<string, EnterpriseCategory[]>;
	locationsById: Record<MVFEnterpriseLocationId, EnterpriseLocation>;
	categoriesById: Record<MVFEnterpriseCategoryId, EnterpriseCategory>;
	locationIdsByNodeId: Record<string, MVFEnterpriseLocationId[]>;
	locationInstancesById: Record<string, EnterpriseLocationInstance>;
	venue: MVFEnterpriseVenue;
	mvfCategoriesById: Record<string, MVFEnterpriseCategory>;
	mvfLocationsById: Record<string, MVFEnterpriseLocation>;
	mvfLocationsByGeometryId: Record<string, MVFEnterpriseLocation[]>;
};
/**
 * An EnterpriseLocation contains metadata about a location, such as its name, description, logo, phone number, social medial links, hours of operation and more.
 * They can be accessed using the {@link MapData.getByType} method as shown below.
 *
 * ```typescript
 * const allLocations = mapData.getByType('enterprise-location');
 * ```
 *
 * Refer to the [EnterpriseLocation Guide](https://developer.mappedin.com/web-sdk/enterprise-data#enterprise-locations) for more information and interactive examples.
 */
export declare class EnterpriseLocation extends BaseMetaData implements Omit<MVFEnterpriseLocation, "polygons" | "nodes" | "links" | "spaces" | "categories">, IFocusable {
	#private;
	/**
	 * @internal
	 */
	static readonly __type = "enterprise-location";
	/**
	 * @internal
	 */
	readonly __type = "enterprise-location";
	/**
	 * The description of the location.
	 */
	description?: string | undefined;
	/**
	 * The name of the location.
	 */
	name: string;
	/**
	 * The amenity of the location.
	 */
	amenity?: string | undefined;
	/**
	 * The external ID of the location.
	 */
	externalId: string;
	/**
	 * Extra properties of the location.
	 */
	extra?: Record<string, unknown> | undefined;
	/**
	 * The gallery of the location.
	 */
	gallery?: {
		caption?: string | null;
		image: string;
		embeddedUrl?: string | null;
	}[] | undefined;
	/**
	 * Specific instances of this location with different properties.
	 * Typically, there will be at least one node or polygon defined,
	 * plus one or more other properties that are different from the parent.
	 * The remaining properties will be the same as the parent.

	 * For example, suppose there is a location like this:
	 *
	 * ```json
	 * {
	 *   "id": "location-id-1",
	 *   "name": "Location 1",
	 *   "nodes": ["node-1", "node-2"],
	 *   "polygons": ["polygon-1", "polygon-2"],
	 *   "externalId": "externalId-1",
	 *   "description": "Description 1",
	 * }
	 * ```
	 *
	 * (Note that for clarity, this example puts strings in for nodes and polygons, but in practice they would be objects.)
	 *
	 * Then suppose it had an `instances` array that contained an object that looked like this:
	 *
	 * ```json
	 * {
	 *   "id": "instance-id-1",
	 *   "name": "Location 1 - A",
	 *   "nodes": ["node-1"],
	 *   "polygons": ["polygon-1"],
	 *   "externalId": "externalId-1-A",
	 *   "description": "Description 1",
	 * }
	 * ```
	 * This says "Location 1" is the parent location, and "Location 1 - A" is an instance of it. The instance has a different name, and a different external ID, and it only applies to node `node-1` and polygon `polygon-1`.
	 * The ID will always be different, but other properties (like the description) are the same as the parent.
	 *
	 * Example use cases:
	 * - A Mall may have a location with two nodes and one polygon. It may then have an instance with one of the nodes, and operating hours
	 * that are different from the parent. This indicates that this instance is an entrance for the location that is accessible at different times, perhaps for an interior mall entrance, when the main location (and other, exterior entrance) is open later than the rest of the mall.
	 * - An airport may have a location with several polygons and nodes, and an instance for each node (and corresponding polygon, if any) with a different siblingGroup. The location in the sibling group may be the airport terminal, or airside vs landside.
	 * This would allow an application to show the location once in a search result, but offer UX to select the instance that is in the right terminal.
	 *
	 * Note: Instances are actual EnterpriseLocations. This means they have all the properties of a normal EnterpriseLocation, including an `instances` property, that will always be undefined. They also do NOT have a parent property, or any other explicit reference to the parent location. These instances are
	 * only referenced from their parent location, and will not show up in other places in the map data. However, they should otherwise behave like normal EnterpriseLocations, being targetable for things like navigation and focus.
	 */
	instances?: EnterpriseLocation[] | undefined;
	/**
	 * A URL to the logo of the location.
	 */
	logo?: string | undefined;
	/**
	 * The operation hours of the location.
	 */
	operationHours?: OperationHours[] | undefined;
	/**
	 * The phone number of the location.
	 */
	phone?: {
		number: string;
		extension?: string;
	} | undefined;
	/**
	 * A URL to the picture of the location.
	 */
	picture?: string | undefined;
	/**
	 * The short name of the location.
	 */
	shortName?: string | undefined;
	/**
	 * Whether to show the floating label when an image is present.
	 */
	showFloatingLabelWhenImagePresent?: boolean | undefined;
	/**
	 * Whether to show the logo.
	 */
	showLogo?: boolean | undefined;
	/**
	 * The sibling groups of the location.
	 */
	siblingGroups?: SiblingGroup[] | undefined;
	/**
	 * The social media links of the location.
	 */
	social?: {
		facebook?: string;
		instagram?: string;
		twitter?: string;
		website?: string;
	} | undefined;
	/**
	 * The sort order of the location.
	 */
	sortOrder: number;
	/**
	 * The {@link LocationState}s of the location.
	 */
	states?: LocationState[] | undefined;
	/**
	 * The tags of the location.
	 */
	tags?: string[] | undefined;
	/**
	 * The type of the location.
	 */
	type: string;
	/**
	 * Whether the location has been marked as hidden.
	 */
	hidden: boolean;
	primaryCategory?: string | undefined;
	/**
	 * Checks if the provided instance is of type EnterpriseLocation.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a EnterpriseLocation, false otherwise.
	 */
	static is(instance: object): instance is EnterpriseLocation;
	/**
	 * @internal
	 */
	constructor(data: MapDataInternal, options: {
		mvfData: MVFEnterpriseLocation;
		categoryIds: string[];
		locationInstances?: EnterpriseLocation[];
		parentId?: string;
	});
	/** @internal */
	get focusTarget(): Space[];
	get categories(): EnterpriseCategory[];
	get coordinates(): Coordinate[];
	get nodes(): Node$1[];
	get points(): PointOfInterest[];
	get spaces(): Space[];
	get objects(): MapObject[];
	/**
	 * Serializes the EnterpriseLocation data to JSON.
	 *
	 * @returns An object representing the EnterpriseLocation.
	 */
	toJSON(): {
		__type: string;
		id: string;
		name: string;
	};
	/**
	 * Cleans up resources used by the instance.
	 *
	 * @internal
	 */
	destroy(): void;
}
/**
 * An EnterpriseCategory groups one or more EnterpriseLocation. These allow similar locations to be sorted in a logical fashion.
 * For example a mall may group locations into Food Court, Footwear and Women's Fashion. They can be accessed using the {@link MapData.getByType} method as shown below.
 *
 * ```typescript
 * const categories = mapData.getByType('enterprise-category');
 * ```
 *
 * Refer to the [EnterpriseCategory Guide](https://developer.mappedin.com/web-sdk/enterprise-data#enterprise-categories) for more information and interactive examples.
 */
export declare class EnterpriseCategory extends BaseMetaData implements Omit<MVFEnterpriseCategory, "children" | "locations"> {
	#private;
	/**
	 * @internal
	 */
	static readonly __type = "enterprise-category";
	/**
	 * @internal
	 */
	readonly __type = "enterprise-category";
	/**
	 * The name of the category.
	 */
	name: string;
	/**
	 * The color of the category.
	 */
	color?: string | undefined;
	/**
	 * The external ID of the category.
	 */
	externalId: string;
	/**
	 * Extra properties of the category.
	 */
	extra?: Record<string, unknown> | undefined;
	/**
	 * A URL to the icon of the category.
	 */
	icon?: string | undefined;
	/**
	 * The icon from the default list of icons.
	 */
	iconFromDefaultList?: string | null | undefined;
	/**
	 * The sort order of the category.
	 */
	sortOrder: number;
	/**
	 * A URL to the picture of the category.
	 */
	picture?: string | undefined;
	/**
	 * Checks if the provided instance is of type EnterpriseCategory.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a EnterpriseCategory, false otherwise.
	 */
	static is(instance: object): instance is EnterpriseCategory;
	/**
	 * @internal
	 */
	constructor(data: MapDataInternal, options: {
		mvfData: MVFEnterpriseCategory;
	});
	/**
	 * The child categories of the category.
	 */
	get children(): EnterpriseCategory[];
	/**
	 * The {@link EnterpriseLocation}s within this category.
	 */
	get locations(): EnterpriseLocation[];
	/**
	 * Serializes the EnterpriseCategory data to JSON.
	 *
	 * @returns An object representing the EnterpriseCategory.
	 */
	toJSON(): {
		__type: string;
		id: string;
		name: string;
	};
	/**
	 * Cleans up resources used by the instance.
	 *
	 * @internal
	 */
	destroy(): void;
}
/**
 * The EnterpriseVenue class holds metadata bout the map, which includes the map name, supported languages, default language, top locations and more.
 * It can be accessed using the {@link MapData.getByType} method as shown below.
 *
 * ```typescript
 * const venue = mapData.getByType('enterprise-venue');
 * ```
 *
 * Refer to the [EnterpriseVenue Guide](https://developer.mappedin.com/web-sdk/enterprise-data#enterprise-venue) for more information.
 */
export declare class EnterpriseVenue extends BaseMetaData implements MVFEnterpriseVenue {
	#private;
	/**
	 * @internal
	 */
	static readonly __type = "enterprise-venue";
	/**
	 * @internal
	 */
	readonly __type = "enterprise-venue";
	/**
	 * The country code of the venue.
	 */
	countrycode?: string | undefined;
	/**
	 * The venue's cover image.
	 * @format uri
	 */
	coverImage?: string | undefined;
	/**
	 * The external ID of the venue.
	 */
	externalId: string;
	/**
	 * The default language of the venue.
	 */
	defaultLanguage: Language;
	/**
	 * The default floor of the venue.
	 */
	defaultFloor?: string | undefined;
	/**
	 * Extra properties of the venue.
	 */
	extra?: Record<string, unknown> | undefined;
	/**
	 * A URL to the icon of the venue.
	 */
	icon?: string | undefined;
	/**
	 * The languages supported by the venue.
	 */
	languages: Language[];
	/**
	 * The links of the venue.
	 */
	links: Hyperlink[];
	/**
	 * A URL to the logo of the venue.
	 */
	logo?: string | undefined;
	/**
	 * A URL to a web page with [Mappedin Web](https://developer.mappedin.com/docs/enterprise-apps/mappedin-web-v2) for this venue.
	 */
	mappedinWebUrl?: string | undefined;
	/**
	 * When this venue is open.
	 */
	operationHours?: OperationHours[] | undefined;
	/**
	 * The slug of the venue.
	 */
	slug: string;
	/**
	 * The top locations of the venue.
	 */
	topLocations?: string[] | undefined;
	/**
	 * The timezone ID of the venue.
	 */
	tzid?: string | undefined;
	/**
	 * Checks if the provided instance is of type EnterpriseVenue.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a EnterpriseVenue, false otherwise.
	 */
	static is(instance: object): instance is EnterpriseVenue;
	/**
	 * @internal
	 */
	constructor(_data: MapDataInternal, options: {
		mvfData: MVFEnterpriseVenue;
	});
	/**
	 * Gets the name of the EnterpriseVenue.
	 *
	 * @returns {string} The name of the EnterpriseVenue.
	 */
	get name(): string;
	/**
	 * @deprecated Use `defaultFloor` instead
	 * The default map of the venue.
	 */
	get defaultMap(): string;
	/**
	 * Serializes the EnterpriseVenue data to JSON.
	 *
	 * @returns An object representing the EnterpriseVenue.
	 */
	toJSON(): {
		__type: string;
		id: string;
		name: string;
	};
	/**
	 * Cleans up resources used by the instance.
	 *
	 * @internal
	 */
	destroy(): void;
}
export type TQueriables = PointOfInterest | Door | Annotation | Node$1 | Space;
/**
 * Query allows users to query for nodes, locations, categories, and other points of interest within the venue.
 */
export declare class Query {
	#private;
	/**
	 * @internal
	 */
	constructor(mapDataInternal: MapDataInternal);
	/**
	 * @internal
	 */
	__LEGACY_NEAREST_SYNC: <T extends TQueriables>(origin: Coordinate | PointOfInterest | Door | Annotation | Node$1, include: T[], options?: TFindNearestOptions) => TFindNearestResult<T> | undefined;
	/**
	 * Find the nearest feature to the origin
	 * @param origin - The origin object
	 * @param include - The features to include in the query
	 * @param options - The options for the query
	 * @returns Objects with the distance and the feature, sorted by distance
	 */
	nearest<T extends TQueriables>(origin: Coordinate | PointOfInterest | Door | Annotation | Node$1, include: T[], options?: TFindNearestOptions): Promise<TFindNearestResult<T> | undefined>;
}
export type TFindNearestResult<T extends TQueriables> = {
	distance: number;
	feature: T;
}[];
export type TFindNearestOptions = {
	/**
	 * Limit query to a set of floors. Only applies if the origin has floor information. If it doesn't, it limits the query to all floor-stacks' default floors.
	 *
	 * @default 'same-floor'
	 */
	limit?: "same-floor"
	/**
	 * Limit query to all floors at the same elevation as the origin
	 */
	 | "same-elevation";
	/**
	 * Whether to use line of sight checks to filter results. This ensures that results aren't obstructed by walls, etc.
	 * When 'auto', heuristics are used to determine whether to use line of sight checks. These are currently experimental, and are subject to change.
	 * @experimental
	 * @default 'auto'
	 */
	lineOfSight?: boolean | "auto";
	/**
	 * The mode to use for the query
	 */
	mode?: "travel-distance" | "absolute-distance";
	/**
	 * The max distance to search for features within
	 */
	maxDistance?: number;
	/**
	 * The maximum number of results to return, the lower the number, the faster the query will be
	 * @default 1
	 */
	maxResults?: number;
};
export declare class LocationCategory extends BaseMetaData implements Omit<MVFCategory, "parent"> {
	#private;
	/**
	 * Checks if the provided instance is of type EnterpriseLocation.
	 *
	 * @param instance The instance to check.
	 * @returns {boolean} True if the instance is a EnterpriseLocation, false otherwise.
	 */
	static is(instance: object): instance is LocationCategory;
	/**
	 * @internal
	 */
	static readonly __type = "location-category";
	/**
	 * @internal
	 */
	readonly __type = "location-category";
	id: CategoryId;
	name: string;
	/**
	 * The category's icon
	 *
	 * @format uri
	 */
	icon: string;
	constructor(data: MapDataInternal, options: {
		mvfData: MVFCategory;
	});
	/**
	 * Gets the parent {@link LocationCategory}.
	 *
	 * @returns {LocationCategory | undefined} The parent location category.
	 */
	get parent(): LocationCategory | undefined;
	/**
	 * Gets the children {@link LocationCategory}s.
	 */
	get children(): LocationCategory[];
	/**
	 * Gets the {@link LocationProfile}s that are associated with this category.
	 */
	get locationProfiles(): LocationProfile[];
	toJSON(): {
		__type: string;
		id: string;
		name: string;
	};
}
export type TFindPreferredLanguageInVenueOptions = {
	/**
	 * Preferred language code to use.
	 */
	languageCode?: string;
	/**
	 * Whether to use browser's language settings as fallback if the supplied language code is not available.
	 * @default true
	 * */
	fallbackToNavigatorLanguage?: boolean;
};
/**
 * Finds the ideal language for the venue based on the following priority:
 * 1. User specified language (if it exists in venue languages)
 * 2. Browser navigator languages (if fallback is enabled)
 * 3. Venue's default language
 *
 * @param venue - The MappedinVenue object containing available languages
 * @param options - Configuration options
 * @returns An object containing the selected language code and name, or undefined if no language is found
 */
export declare function findPreferredLanguageInVenue(venue: EnterpriseVenue, options?: TFindPreferredLanguageInVenueOptions): Language;
declare class MapDataInternal extends PubSub<{
	"language-change": {
		code: string;
		name: string;
	};
}> {
	#private;
	Analytics: AnalyticsInternal;
	Query: Query;
	/**
	 * Represents the parsed Mappedin Venue Format (MVF) data.
	 */
	readonly mvf: ParsedMVF;
	/**
	 * The token is used to fetch outdoor tiles, which will then be rendered.
	 */
	readonly outdoorViewToken?: string;
	/**
	 * Represents a map of obstruction IDs to entrance node IDs.
	 */
	readonly objectEntranceNodeIdsByObstructionId: Record<string, string[]>;
	/**
	 * Represents a map of entrance IDs to obstruction IDs.
	 */
	readonly obstructionIdByEntranceId: Record<string, string>;
	readonly venue?: EnterpriseVenue;
	readonly tokenManager?: TokenManager;
	directions: DirectionsInternal;
	enterpriseMode: boolean;
	nodesById: MapDataRecords["nodesById"];
	spacesById: MapDataRecords["spacesById"];
	floorsById: MapDataRecords["floorsById"];
	floorStacksById: MapDataRecords["floorStacksById"];
	facadesById: MapDataRecords["facadesById"];
	facadesBySpaceId: MapDataRecords["facadesBySpaceId"];
	connectionsById: MapDataRecords["connectionsById"];
	objectsById: MapDataRecords["objectsById"];
	doorsById: MapDataRecords["doorsById"];
	pointsOfInterestById: MapDataRecords["poisById"];
	annotationsById: MapDataRecords["annotationsById"];
	areasById: MapDataRecords["areasById"];
	locationProfilesById: MapDataRecords["locationProfilesById"];
	locationCategoriesById: MapDataRecords["locationCategoriesById"];
	locationProfilesByExternalId: MapDataRecords["locationProfilesByExternalId"];
	locationProfilesByCategoryId: MapDataRecords["locationProfilesByCategoryId"];
	locationCategoriesByParentId: MapDataRecords["locationCategoriesByParentId"];
	doorsByNodeId: MapDataRecords["doorsByNodeId"];
	mvfAnnotationsById: MapDataRecords["mvfAnnotationsById"];
	mvfConnectionsById: MapDataRecords["mvfConnectionsById"];
	mvfConnectionsByNodeId: MapDataRecords["mvfConnectionsByNodeId"];
	mvfConnectionIdsByLatLon: MapDataRecords["mvfConnectionIdsByLatLon"];
	mvfEntrancesById: MapDataRecords["mvfEntrancesById"];
	mvfNodesById: MapDataRecords["mvfNodesById"];
	mvfObstructionById: MapDataRecords["mvfObstructionById"];
	mvfSpacesById: MapDataRecords["mvfSpacesById"];
	mvfFloorsById: MapDataRecords["mvfFloorsById"];
	mvfFloorStacksById: MapDataRecords["mvfFloorStacksById"];
	mvfAreasById: MapDataRecords["mvfAreasById"];
	spacesByExternalId: MapDataRecords["spacesByExternalId"];
	nodesByExternalId: MapDataRecords["nodesByExternalId"];
	objectsByExternalId: MapDataRecords["objectsByExternalId"];
	poisByExternalId: MapDataRecords["poisByExternalId"];
	floorsByExternalId: MapDataRecords["floorsByExternalId"];
	floorStacksByExternalId: MapDataRecords["floorStacksByExternalId"];
	doorsByExternalId: MapDataRecords["doorsByExternalId"];
	areasByExternalId: MapDataRecords["areasByExternalId"];
	connectionSpaceIdsByLatLon: MapDataRecords["connectionIdsByLatLon"];
	locationProfilesByAttachedFeatureId: MapDataRecords["locationProfilesByAttachedFeatureId"];
	entranceNodeIdsBySpaceId?: MapDataRecords["entranceNodeIdsBySpaceId"];
	locationsById: EnterpriseMapDataRecords["locationsById"];
	categoriesById: EnterpriseMapDataRecords["categoriesById"];
	mvfLocationsByGeometryId: EnterpriseMapDataRecords["mvfLocationsByGeometryId"];
	locationIdsByNodeId: EnterpriseMapDataRecords["locationIdsByNodeId"];
	spaceIdsByNodeId: MapDataRecords["spaceIdsByNodeId"];
	objectIdsByNodeId: MapDataRecords["objectIdsByNodeId"];
	connectionsByExternalId: EnterpriseMapDataRecords["connectionsByExternalId"];
	locationsByExternalId: EnterpriseMapDataRecords["locationsByExternalId"];
	categoriesByExternalId: EnterpriseMapDataRecords["categoriesByExternalId"];
	destinationNodesIdsBySpaceId: MapDataRecords["destinationNodesIdsBySpaceId"];
	mvfNodesByFloorId: MapDataRecords["mvfNodesByFloorId"];
	mvfSpacesByFloorId: MapDataRecords["mvfSpacesByFloorId"];
	mvfPoisByFloorId: MapDataRecords["mvfPoisByFloorId"];
	mvfEntrancesByFloorId: MapDataRecords["mvfEntrancesByFloorId"];
	mvfAnnotationsByFloorId: MapDataRecords["mvfAnnotationsByFloorId"];
	localePacksUrls: LocalePackUrls;
	currentLanguage?: Language;
	/**
	 * These represent maps of diffed objects that are used to store the translated values
	 */
	languagePacks: {
		[languageCode: string]: LanguagePack;
	};
	tilesets: {
		[tilesetId: string]: TilesetStyle;
	};
	navigationFlags: NavigationFlagDeclarations;
	binaryBundle?: Uint8Array;
	envControl: EnvControl;
	getMapDataOptions?: TGetMapDataOptions;
	/**
	 * @internal
	 */
	constructor(mvf: ParsedMVF, options: TMapDataInternalOptions);
	getEnv(): {
		readonly baseUri: string;
		readonly baseAuthUri: string;
		readonly analyticsBaseUri: string;
		readonly tileServerUri: string;
	};
	/**
	 * Retrieves the map name.
	 *
	 * @returns {string} The name of the map.
	 */
	get mapName(): string;
	get organizationId(): string;
	get mapCenter(): Coordinate;
	get naturalBearing(): number;
	/**
	 * Retrieves all spaces in the map.
	 *
	 * @returns {Space[]} An array of Space objects.
	 */
	get spaces(): Space[];
	/**
	 * Retrieves all objects in the map.
	 *
	 * @returns {MapObject[]} An array of MapObject objects.
	 */
	get objects(): MapObject[];
	/**
	 * Retrieves all connections in the map.
	 *
	 * @returns {Connection[]} An array of Connection objects.
	 */
	get connections(): Connection[];
	/**
	 * Retrieves all floors in the map.
	 *
	 * @returns {Floor[]} An array of Floor objects.
	 */
	get floors(): Floor[];
	get floorStacks(): FloorStack[];
	get facades(): Facade[];
	/**
	 * Retrieves all doors in the map.
	 *
	 * @internal
	 * @hidden
	 * @returns {Door[]} An array of Door objects.
	 */
	get doors(): Door[];
	/**
	 * Retrieves all points of interest in the map.
	 *
	 * @returns {PointOfInterest[]} An array of PointOfInterest objects.
	 */
	get pointsOfInterest(): PointOfInterest[];
	/**
	 * Retrieves all annotations in the map.
	 *
	 * @returns {Annotation[]} An array of Annotation objects.
	 */
	get annotations(): Annotation[];
	get areas(): Area[];
	/**
	 * Retrieves all nodes in the map.
	 *
	 * @returns {Annotation[]} An array of Annotation objects.
	 */
	get nodes(): Node$1[];
	get locations(): EnterpriseLocation[];
	get categories(): EnterpriseCategory[];
	get locationProfiles(): LocationProfile[];
	get locationCategories(): LocationCategory[];
	get mvfFloors(): MVFFloor[];
	get mvfFloorStacks(): MVFFloorStack[];
	getByType(type: string): object[];
	getByType(type: "location-profile"): LocationProfile[];
	getByType(type: "location-category"): LocationCategory[];
	getByType(type: "space"): Space[];
	getByType(type: "area"): Area[];
	getByType(type: "door"): Door[];
	getByType(type: "floor"): Floor[];
	getByType(type: "floor-stack"): FloorStack[];
	getByType(type: "connection"): Connection[];
	getByType(type: "object"): MapObject[];
	getByType(type: "point-of-interest"): PointOfInterest[];
	getByType(type: "annotation"): Annotation[];
	getByType(type: "node"): Node$1[];
	getByType(type: "enterprise-location"): EnterpriseLocation[];
	getByType(type: "enterprise-category"): EnterpriseCategory[];
	getByType(type: "enterprise-venue"): EnterpriseVenue | undefined;
	getByType(type: "facade"): Facade[];
	/**
	 * Retrieves all map data objects that match any of the specified types.
	 * If a list of elements is provided, it filters only those elements by type.
	 * Otherwise, it retrieves all objects for the specified types from this dataset.
	 *
	 * @param types - A set of type names to filter/retrieve
	 * @param elements - Optional. A list of elements to filter by the provided types
	 * @returns An array of map data objects matching any of the specified types
	 */
	getAllOfTypes<T extends MapDataElements["__type"]>(types: ReadonlySet<T> | readonly T[], elements?: readonly MapDataElements[]): Extract<MapDataElements, {
		__type: T;
	}>[];
	/**
	 * Retrieves an object by its type and ID.
	 *
	 * @param type The type of the object (e.g., 'space', 'door').
	 * @param id The ID of the object.
	 * @returns The requested object, or undefined if not found.
	 */
	getById<T extends keyof Omit<TMapDataObjectTypes, "enterprise-venue"> | "unknown">(type: T, id: string): (T extends keyof TMapDataObjectTypes ? TMapDataObjectTypes[T] : TMapDataObjectTypes[keyof TMapDataObjectTypes]) | undefined;
	getById<T extends keyof Omit<TMapDataObjectTypes, "enterprise-venue">>(type: T, id: string): TMapDataObjectTypes[T] | undefined;
	getById<T extends keyof Omit<TMapDataObjectTypes, "enterprise-venue"> | "unknown">(type: "unknown", id: string): (T extends keyof TMapDataObjectTypes ? TMapDataObjectTypes[T] : TMapDataObjectTypes[keyof TMapDataObjectTypes]) | undefined;
	getByExternalId<T extends keyof Omit<TMapDataObjectTypes, "annotation" | "facade">>(type: T, externalId: string): TMapDataObjectTypes[T][];
	getMapDataById(id: string): MapDataElements | undefined;
	/**
	 * Retrieves a feature by its type and ID from the Mappedin Venue Format (MVF) data.
	 *
	 * @param type The type of the feature (e.g., 'space', 'node').
	 * @param id The ID of the feature.
	 * @returns The requested MVF feature or undefined if not found.
	 */
	getMVFFeatureById(type: "space", id: string): SpaceCollection["features"][number] | undefined;
	getMVFFeatureById(type: "node", id: string): NodeCollection["features"][number] | undefined;
	getMVFFeatureById(type: "obstruction", id: string): ObstructionCollection["features"][number] | undefined;
	getMVFFeatureById(type: "floor", id: string): MVFFloor | undefined;
	getMVFFeatureById(type: "floor-stack", id: string): MVFFloorStack | undefined;
	getMVFFeatureById(type: "connection", id: string): MVFConnection | undefined;
	getMVFFeatureById(type: "entrance", id: string): EntranceCollection["features"][number] | undefined;
	getMVFFeatureById(type: "annotation", id: string): AnnotationCollection["features"][number] | undefined;
	getMVFFeatureById(type: "area", id: string): AreaCollection["features"][number] | undefined;
	getMVFFeatureById(type: string, id: string): object | undefined;
	getMVFFeatureByNodeId(type: "connection", id: string): MVFConnection | undefined;
	/**
	 * Retrieves all MVF features of a given type. Safer than referencing the mvf's deprecated collections directly.
	 */
	getMVFFeatureByType(type: "floor-stack"): MVFFloorStack[];
	getMVFFeatureByType(type: "floor"): MVFFloor[];
	propTranslationCache: Map<number, Record<string, unknown>>;
	getPropTranslation<T extends keyof LanguagePackRecords, P extends keyof NonNullable<NonNullable<LanguagePackRecords[T]>[string]>>(type: T, prop: P, id: string, fallback: NonNullable<NonNullable<LanguagePackRecords[T]>[string]>[P]): unknown;
	findPreferredLanguage(options?: TFindPreferredLanguageInVenueOptions): Language | undefined;
	/**
	 * Changes the language of the map data.
	 *
	 * @param languageCode The language code to change to.
	 * @param preferred Whether to fallback to the preferred language in the venue.
	 */
	changeLanguage(languageCode: string): Promise<void>;
	/**
	 * @deprecated Use the async version instead. This method will be made truly async in the upcoming future.
	 * @internal
	 */
	__LEGACY_GET_DIRECTIONS_MULTI_DESTINATION_SYNC: (from: TNavigationTarget | TNavigationTarget[], to: TNavigationTarget | (TNavigationTarget | TNavigationTarget[])[], opt?: TGetDirectionsOptions) => Directions | Directions[] | undefined;
	/**
	 * @internal
	 */
	__LEGACY_GET_DIRECTIONS_SYNC: (from: TNavigationTarget | TNavigationTarget[], to: TNavigationTarget | (TNavigationTarget | TNavigationTarget[])[], opt?: TGetDirectionsOptions & {
		multiDestination?: boolean;
	}) => Directions | Directions[] | undefined;
	getDirections: (from: TNavigationTarget | TNavigationTarget[], to: TNavigationTarget | TNavigationTarget[], opt?: TGetDirectionsOptions) => Promise<Directions | undefined>;
	getDirectionsMultiDestination: (from: TNavigationTarget | TNavigationTarget[], to: TNavigationTarget | (TNavigationTarget | TNavigationTarget[])[], opt?: TGetDirectionsOptions) => Promise<Directions[] | undefined>;
	getDistance(from: Space | Door | Coordinate | MapObject | PointOfInterest | Annotation | Node$1 | EnterpriseLocation | Area, to: Space | Door | Coordinate | MapObject | PointOfInterest | Annotation | Node$1 | EnterpriseLocation | Area): number;
	transformImageRequest: (url: string) => Promise<{
		url: string;
	}>;
	toJSONBundle({ downloadLanguagePacks, }?: {
		downloadLanguagePacks?: boolean;
	}): Promise<THydrateMapDataBundle>;
	toBinaryBundle({ downloadLanguagePacks, }?: {
		downloadLanguagePacks?: boolean;
	}): Promise<THydrateMapDataBundle | void>;
	/**
	 * Cleans up resources used by the instance.
	 *
	 * @internal
	 */
	destroy(): void;
}
declare class InternalSearch {
	#private;
	private mapData;
	private indexes;
	private ready;
	constructor(mapData: MapData);
	/**
	 * Populates the search indexes with the map data.
	 * @returns A promise that resolves when the indexes are populated.
	 */
	populate(): Promise<any[]>;
	search(term: string, options?: SearchOptions): Promise<SearchResult>;
	suggest(term: string, options?: SuggestOptions): Promise<Suggestion[]>;
}
export type SearchResultItem<T extends Places | EnterpriseLocation | EnterpriseCategory> = {
	type: T["__type"];
	match: MiniSearchResult["match"];
	score: number;
	item: T;
};
/**
 * @interface
 */
export type SearchResultEnterpriseCategory = SearchResultItem<EnterpriseCategory>;
/**
 * @interface
 */
export type SearchResultEnterpriseLocations = SearchResultItem<EnterpriseLocation>;
/**
 * @interface
 */
export type SearchResultPlaces = SearchResultItem<Places>;
/**
 * Search results
 */
export type SearchResult = {
	/**
	 * Places search results
	 */
	places: SearchResultPlaces[];
	/**
	 * Enterprise Locations search results
	 */
	enterpriseLocations?: SearchResultEnterpriseLocations[];
	/**
	 * Enterprise Categories search results
	 */
	enterpriseCategories?: SearchResultEnterpriseCategory[];
};
declare const searchOptionsSchema: z.ZodObject<{
	places: z.ZodOptional<z.ZodObject<{
		fields: z.ZodOptional<z.ZodObject<{
			name: z.ZodOptional<z.ZodBoolean>;
			description: z.ZodOptional<z.ZodBoolean>;
		}, z.core.$strip>>;
		limit: z.ZodOptional<z.ZodNumber>;
	}, z.core.$strip>>;
	enterpriseCategories: z.ZodOptional<z.ZodObject<{
		fields: z.ZodOptional<z.ZodObject<{
			name: z.ZodOptional<z.ZodBoolean>;
			description: z.ZodOptional<z.ZodBoolean>;
			"locations.name": z.ZodOptional<z.ZodBoolean>;
		}, z.core.$strip>>;
		limit: z.ZodOptional<z.ZodNumber>;
	}, z.core.$strip>>;
	enterpriseLocations: z.ZodOptional<z.ZodObject<{
		fields: z.ZodOptional<z.ZodObject<{
			name: z.ZodOptional<z.ZodBoolean>;
			tags: z.ZodOptional<z.ZodBoolean>;
			description: z.ZodOptional<z.ZodBoolean>;
		}, z.core.$strip>>;
		limit: z.ZodOptional<z.ZodNumber>;
	}, z.core.$strip>>;
}, z.core.$strip>;
declare const suggestOptionsSchema: z.ZodObject<{
	places: z.ZodOptional<z.ZodObject<{
		enabled: z.ZodOptional<z.ZodBoolean>;
	}, z.core.$strip>>;
	enterpriseLocations: z.ZodOptional<z.ZodObject<{
		enabled: z.ZodOptional<z.ZodBoolean>;
	}, z.core.$strip>>;
}, z.core.$strip>;
/**
 * @interface
 */
export type SearchOptions = z.infer<typeof searchOptionsSchema>;
type SuggestOptions = z.infer<typeof suggestOptionsSchema>;
/**
 * Search allows users to search for locations, categories, and other points of interest within the venue.
 *
 * Refer to the [Search Guide](https://developer.mappedin.com/web-sdk/enterprise-data#enterprise-search) for more information and interactive examples.
 */
export declare class Search {
	#private;
	private searchInstance?;
	/**
	 * Whether the search is enabled.
	 * @default false
	 */
	enabled: boolean;
	/**
	 * @internal
	 */
	constructor(mapData: MapData, mapDataInternal: MapDataInternal, { enabled }?: {
		enabled?: boolean;
	});
	/**
	 * Use query to search for locations based on a string input:
	 *
	 * - {@link EnterpriseLocation}: Specific places such as stores, restaurants, or washrooms.
	 * - {@link EnterpriseCategory}: Groups of locations, such as "Food Court" or "Electronics."
	 * - {@link Places}: Any main objects that can be searched for such as Space, Door, Point of Interest
	 *
	 * Search query returns a list of matching {@	link SearchResult} based on the input string.
	 *
	 * {@link SearchResult} include information about the type of match, the score (relevance), and detailed metadata about the matching items.
	 *
	 * @param term - The search term.
	 * @param options - The search options.
	 * @returns The search results.
	 * @example
	 * ```ts
	 * const results = await search.query('Coffee Shop');
	 * console.log(results.locations);
	 * ```
	 */
	query(term: string, options?: SearchOptions): ReturnType<typeof InternalSearch.prototype.search>;
	/**
	 * Suggests the names of places, locations, and categories based on partial input. This is useful for creating an autocomplete feature for a search bar.
	 * @param term - The search term.
	 * @param options - The suggest options.
	 * @returns The search suggestions.
	 * @example
	 * ```ts
	 * const suggestions = await search.suggest('Coffee');
	 * console.log(suggestions);
	 * ```
	 */
	suggest(term: string, options?: SuggestOptions): Promise<Suggestion[]>;
	/**
	 * Enables the search.
	 */
	enable(): Promise<void>;
}
export type THydrateMapDataBundle = {
	type: "binary";
	options?: {
		version?: "2.0.0" | "3.0.0";
		enterprise?: boolean;
	};
	languagePacks?: {
		language: {
			code: string;
			name: string;
		};
		localePack: Uint8Array;
	}[];
	main: Uint8Array;
} | {
	type: "json";
	options?: {
		version?: "2.0.0" | "3.0.0";
		enterprise?: boolean;
	};
	languagePacks?: {
		language: {
			code: string;
			name: string;
		};
		localePack: ParsedMVFLocalePack;
	}[];
	main: TMVF;
};
/**
 * Load a MapData instance from a backup including language packs. Pass in userOptions to ensure outdoor view is available.
 */
export declare const hydrateMapData: (backup: THydrateMapDataBundle | TMVF, userOptions?: TGetMapDataOptions) => Promise<MapData>;
/**
 * ## MapData in Mappedin JS
 *
 * MapData is the core data container for all map information, providing access to spaces, floors, points of interest, and navigation capabilities. It serves as the foundation for building interactive indoor mapping applications.
 *
 * ### Features
 * - Access to all map elements (spaces, floors, doors, etc.)
 * - Built-in search functionality with suggestions
 * - Navigation and wayfinding capabilities
 * - Multi-language support
 * - Analytics tracking
 * - Data export and serialization
 *
 * > **Best Practice:** Use `getByType()` to retrieve collections of map elements, and `getById()` for specific elements. Enable search functionality when you need location discovery features.
 *
 * ### Example Usage
 * ```ts
 * // Get all spaces on the map
 * const spaces = mapData.getByType('space');
 *
 * // Find a specific space by ID
 * const space = mapData.getById('space', 'space-123');
 *
 * // Get directions between two locations
 * const directions = mapData.getDirections(space1, space2);
 *
 * // Enable and use search
 * await mapData.Search.enable();
 * const results = await mapData.Search.query('Coffee Shop');
 *
 * // Change language
 * await mapData.changeLanguage('es');
 * ```
 *
 * ### Data Access Patterns
 * - **Collections**: Use `getByType()` for all elements of a type
 * - **Specific Elements**: Use `getById()` for individual elements
 * - **External IDs**: Use `getByExternalId()` for custom identifiers
 * - **GeoJSON**: Use `getGeoJSON()` for geometric data
 *
 * ### Navigation Features
 * - `getDirections()`: Route between two locations
 * - `getDirectionsMultiDestination()`: Route with multiple destinations
 * - `getDistance()`: Calculate distance between locations
 *
 * ### More Information
 * - [Getting Started Guide](https://developer.mappedin.com/web-sdk/getting-started)
 * - [Search Guide](https://developer.mappedin.com/web-sdk/enterprise-data#enterprise-search)
 * - [Wayfinding Guide](https://developer.mappedin.com/web-sdk/wayfinding)
 *
 * Represents the data for a map, providing access to map elements
 * like spaces, floors, and points of interest.
 */
export declare class MapData {
	#private;
	Analytics: Analytics;
	/**
	 * Search API for MapData
	 *
	 * Provides full-text search capabilities across all map locations, with support for suggestions, filtering, and result ranking.
	 *
	 * @example Enable search and perform a query
	 * ```ts
	 * // Enable search
	 * const mapData = await getMapData({ search: { enabled: true } });
	 * // or
	 * await mapData.Search.enable();
	 *
	 * // Perform a search query
	 * const results = await mapData.Search.query('Coffee Shop');
	 * console.log(results.locations);
	 * ```
	 *
	 * @example Get search suggestions
	 * ```ts
	 * // Get search suggestions
	 * const suggestions = await mapData.Search.suggest('Coff');
	 * console.log(suggestions);
	 * ```
	 *
	 * @example Search with filters
	 * ```ts
	 * const results = await mapData.Search.query('Shop', {
	 *   categories: ['retail'],
	 *   floor: mapData.getByType('floor')[0]
	 * });
	 * ```
	 *
	 * @see [Search Guide](https://developer.mappedin.com/web-sdk/enterprise-data#enterprise-search)
	 */
	Search: Search;
	/**
	 * Query API for advanced data filtering and retrieval.
	 *
	 * Provides powerful querying capabilities to filter and find map elements based on various criteria.
	 *
	 * @example
	 * ```ts
	 * // Find all spaces with specific properties
	 * const results = mapData.Query.spaces()
	 *   .where('category', 'retail')
	 *   .where('floor', floor)
	 *   .execute();
	 * ```
	 */
	Query: Query;
	/**
	 * @internal
	 */
	internal: MapDataInternal;
	/**
	 * Constructs a new instance of {@link MapData}.
	 *
	 * @internal
	 */
	constructor(internal: MapDataInternal, { search }?: {
		search?: TSearchOptions;
	});
	/**
	 * Subscribe to MapData events.
	 *
	 * Listen for events emitted by the MapData instance such as language changes.
	 *
	 * @param eventName The name of the event to listen for.
	 * @param fn The callback function to execute when the event is emitted.
	 *
	 * @example Listen for language changes
	 * ```ts
	 * mapData.on('language-change', ({ code, name }) => {
	 *   console.log(`Language changed to ${name} (${code})`);
	 *
	 *   // Update UI to reflect new language
	 * 	updateInterfaceLanguage(code);
	 * });
	 * ```
	 */
	on: <EventName extends keyof TMapDataEvents>(eventName: EventName, fn: (payload: TMapDataEvents[EventName] extends {
		data: null;
	} ? TMapDataEvents[EventName]["data"] : TMapDataEvents[EventName]) => void) => void;
	/**
	 * Unsubscribe from MapData events.
	 *
	 * @param eventName The name of the event to unsubscribe from.
	 * @param fn The callback function that was previously registered with `on()`.
	 *
	 * @example Remove language change listener
	 * ```ts
	 * const handleLanguageChange = ({ code, name }) => {
	 *   console.log(`Language changed to ${name}`);
	 * };
	 *
	 * // Add listener
	 * mapData.on('language-change', handleLanguageChange);
	 *
	 * // Later, remove the listener
	 * mapData.off('language-change', handleLanguageChange);
	 * ```
	 */
	off: <EventName extends keyof TMapDataEvents>(eventName: EventName, fn: (payload: TMapDataEvents[EventName] extends {
		data: null;
	} ? TMapDataEvents[EventName]["data"] : TMapDataEvents[EventName]) => void) => void;
	/**
	 * Get the current environment configuration.
	 *
	 * Returns the environment settings including API endpoints and configuration.
	 *
	 * @returns Environment configuration object
	 * @example
	 * ```ts
	 * const env = mapData.getEnv();
	 * console.log(env.baseUri); // Get the API URL for the current environment
	 * ```
	 */
	getEnv(): {
		readonly baseUri: string;
		readonly baseAuthUri: string;
		readonly analyticsBaseUri: string;
		readonly tileServerUri: string;
	};
	/**
	 * Get an access token for use with Mappedin's API.
	 *
	 * Returns the current access token that can be used for authenticated API requests.
	 *
	 * @returns {string} The current access token
	 * @example
	 * ```ts
	 * const token = mapData.getAccessToken();
	 * // Use token for API requests
	 * ```
	 */
	getAccessToken(): string | undefined;
	/**
	 * The name of the map.
	 *
	 * @returns {string} The name of the map.
	 * @example
	 * ```ts
	 * console.log(mapData.mapName); // "Downtown Mall"
	 * ```
	 */
	get mapName(): string;
	/**
	 * The unique identifier for the map.
	 *
	 * @returns {string | undefined} The map ID.
	 * @example
	 * ```ts
	 * console.log(mapData.mapId); // "map-12345"
	 * ```
	 */
	get mapId(): string | undefined;
	/**
	 * The approximate center coordinate ({@link Coordinate}) of the map.
	 *
	 * @returns {Coordinate} The center coordinate of the map.
	 * @example
	 * ```ts
	 * const center = mapData.mapCenter;
	 * console.log(`Map center: ${center.latitude}, ${center.longitude}`);
	 * ```
	 */
	get mapCenter(): Coordinate;
	/**
	 * The organization ID of the map.
	 *
	 * @returns {string} The organization ID of the map.
	 * @example
	 * ```ts
	 * console.log(mapData.organizationId); // "org-12345"
	 * ```
	 */
	get organizationId(): string;
	/**
	 * The token used to fetch outdoor tiles for outdoor map integration.
	 *
	 * @returns {string | undefined} The outdoor view token.
	 * @example
	 * ```ts
	 * const outdoorToken = mapData.outdoorViewToken;
	 * if (outdoorToken) {
	 *   // Configure outdoor map with token
	 * }
	 * ```
	 */
	get outdoorViewToken(): string | undefined;
	/**
	 * Retrieves all map elements of a specific type.
	 *
	 * This is the primary method for accessing collections of map elements. Use the typed overloads for better TypeScript support.
	 *
	 * @param type The type of elements to retrieve.
	 * @returns An array of elements of the given type.
	 *
	 * @example Get all spaces
	 * ```ts
	 * const spaces = mapData.getByType('space');
	 * console.log(`Found ${spaces.length} spaces`);
	 * ```
	 *
	 * @example Get all floors
	 * ```ts
	 * const floors = mapData.getByType('floor');
	 * floors.forEach(floor => console.log(floor.name));
	 * ```
	 *
	 * @example Get all doors
	 * ```ts
	 * const doors = mapData.getByType('door');
	 * const entranceDoors = doors.filter(door => door.type === 'entrance');
	 * ```
	 */
	getByType(type: string): MapDataElements[];
	/**
	 * @returns The spaces ({@link Space}) on the map.
	 * @example
	 * ```ts
	 * const spaces = mapData.getByType('space');
	 * const retailSpaces = spaces.filter(space => space.category === 'retail');
	 * ```
	 */
	getByType(type: "space"): Space[];
	/**
	 * @returns The doors ({@link Door}) on the map.
	 * @example
	 * ```ts
	 * const doors = mapData.getByType('door');
	 * const entranceDoors = doors.filter(door => door.type === 'entrance');
	 * ```
	 */
	getByType(type: "door"): Door[];
	/**
	 * @returns The floors ({@link Floor}) on the map.
	 * @example
	 * ```ts
	 * const floors = mapData.getByType('floor');
	 * const groundFloor = floors.find(floor => floor.level === 0);
	 * ```
	 */
	getByType(type: "floor"): Floor[];
	/**
	 * @returns The stacks of floors ({@link FloorStack}) within the map.
	 * @example
	 * ```ts
	 * const floorStacks = mapData.getByType('floor-stack');
	 * const mainBuilding = floorStacks.find(stack => stack.name === 'Main Building');
	 * ```
	 */
	getByType(type: "floor-stack"): FloorStack[];
	/**
	 * @returns The facades ({@link Facade}) within the map.
	 * @example
	 * ```ts
	 * const facades = mapData.getByType('facade');
	 * const northFacade = facades.find(facade => facade.name === 'North');
	 * ```
	 */
	getByType(type: "facade"): Facade[];
	/**
	 * @returns The connections ({@link Connection}) on the map.
	 * @example
	 * ```ts
	 * const connections = mapData.getByType('connection');
	 * const elevators = connections.filter(conn => conn.type === 'elevator');
	 * ```
	 */
	getByType(type: "connection"): Connection[];
	/**
	 * @returns The objects ({@link MapObject}) on the map.
	 * @example
	 * ```ts
	 * const objects = mapData.getByType('object');
	 * const furniture = objects.filter(obj => obj.category === 'furniture');
	 * ```
	 */
	getByType(type: "object"): MapObject[];
	/**
	 * @returns The points of interest ({@link PointOfInterest}) on the map.
	 * @example
	 * ```ts
	 * const pois = mapData.getByType('point-of-interest');
	 * const restrooms = pois.filter(poi => poi.category === 'restroom');
	 * ```
	 */
	getByType(type: "point-of-interest"): PointOfInterest[];
	/**
	 * @returns The annotations ({@link Annotation}) on the map.
	 * @example
	 * ```ts
	 * const annotations = mapData.getByType('annotation');
	 * const infoAnnotations = annotations.filter(ann => ann.type === 'info');
	 * ```
	 */
	getByType(type: "annotation"): Annotation[];
	/**
	 * @returns The nodes ({@link Node}) on the map.
	 * @example
	 * ```ts
	 * const nodes = mapData.getByType('node');
	 * const navigationNodes = nodes.filter(node => node.type === 'navigation');
	 * ```
	 */
	getByType(type: "node"): Node$1[];
	/**
	 * @returns The areas ({@link Area}) on the map.
	 * @example
	 * ```ts
	 * const areas = mapData.getByType('area');
	 * const parkingAreas = areas.filter(area => area.category === 'parking');
	 * ```
	 */
	getByType(type: "area"): Area[];
	/**
	 * @returns The enterprise locations ({@link EnterpriseLocation}) on the map.
	 * @example
	 * ```ts
	 * const locations = mapData.getByType('enterprise-location');
	 * const stores = locations.filter(loc => loc.category === 'store');
	 * ```
	 */
	getByType(type: "enterprise-location"): EnterpriseLocation[];
	/**
	 * @returns The enterprise categories ({@link EnterpriseCategory}) on the map.
	 * @example
	 * ```ts
	 * const categories = mapData.getByType('enterprise-category');
	 * const retailCategories = categories.filter(cat => cat.type === 'retail');
	 * ```
	 */
	getByType(type: "enterprise-category"): EnterpriseCategory[];
	/**
	 * @returns The enterprise venues ({@link EnterpriseVenue}) on the map.
	 * @example
	 * ```ts
	 * const venues = mapData.getByType('enterprise-venue');
	 * const malls = venues.filter(venue => venue.type === 'mall');
	 * ```
	 */
	getByType(type: "enterprise-venue"): EnterpriseVenue | undefined;
	/**
	 * @returns The location profiles ({@link LocationProfile}) on the map.
	 * @example
	 * ```ts
	 * const profiles = mapData.getByType('location-profile');
	 * const featuredProfiles = profiles.filter(profile => profile.featured);
	 * ```
	 */
	getByType(type: "location-profile"): LocationProfile[];
	/**
	 * @returns The location categories ({@link LocationCategory}) on the map.
	 * @example
	 * ```ts
	 * const categories = mapData.getByType('location-category');
	 * const mainCategories = categories.filter(cat => cat.parent === null);
	 * ```
	 */
	getByType(type: "location-category"): LocationCategory[];
	/**
	 * Retrieves a specific map feature by its type and ID.
	 *
	 * Use this method to find individual map elements when you know their exact ID. This is more efficient than filtering collections for specific elements.
	 *
	 * @param type The type of element to retrieve.
	 * @param id The unique identifier of the element.
	 * @returns The map element if found, undefined otherwise.
	 *
	 * @example Find a specific space
	 * ```ts
	 * const space = mapData.getById('space', 'space-123');
	 * if (space) {
	 *   console.log(`Found space: ${space.name}`);
	 * }
	 * ```
	 *
	 * @example Find a specific floor
	 * ```ts
	 * const floor = mapData.getById('floor', 'floor-1');
	 * if (floor) {
	 *   console.log(`Floor level: ${floor.level}`);
	 * }
	 * ```
	 *
	 * @example Find a door
	 * ```ts
	 * const door = mapData.getById('door', 'door-main-entrance');
	 * if (door) {
	 *   console.log(`Door type: ${door.type}`);
	 * }
	 * ```
	 *
	 * @example Find an element by ID when you don't know the type.
	 *
	 * In general, it is better to specify the type if you know it, since you get better type safety.
	 * ```ts
	 * const element = mapData.getById('unknown', 'element-123');
	 * if (!element) {
	 *   console.log(`Element not found`);
	 * } else if (Space.is(element)) {
	 *   console.log(`Found space: ${element.name}`);
	 * } else if (Door.is(element)) ...
	 * ```
	 */
	getById<T extends keyof Omit<TMapDataObjectTypes, "enterprise-venue"> | "unknown">(type: T, id: string): (T extends keyof TMapDataObjectTypes ? TMapDataObjectTypes[T] : TMapDataObjectTypes[keyof TMapDataObjectTypes]) | undefined;
	getById<T extends keyof TMapDataObjectTypes>(type: T, id: string): TMapDataObjectTypes[T] | undefined;
	getById<T extends "unknown">(type: T, id: string): TMapDataObjectTypes[keyof TMapDataObjectTypes] | undefined;
	/**
	 * Retrieves map elements by their external ID.
	 *
	 * External IDs are custom identifiers that can be assigned to map elements. This is useful for integrating with external systems or databases.
	 *
	 * @param type The type of element to retrieve.
	 * @param externalId The external identifier to search for.
	 * @returns An array of elements with the matching external ID.
	 *
	 * @example Find spaces by external ID
	 * ```ts
	 * const spaces = mapData.getByExternalId('space', 'STORE-001');
	 * spaces.forEach(space => console.log(`Found space: ${space.name}`));
	 * ```
	 *
	 * @example Find locations by external ID
	 * ```ts
	 * const locations = mapData.getByExternalId('enterprise-location', 'RESTAURANT-ABC');
	 * locations.forEach(location => console.log(`Found location: ${location.name}`));
	 * ```
	 */
	getByExternalId<T extends keyof Omit<TMapDataObjectTypes, "annotation" | "facade">>(type: T, externalId: string): TMapDataObjectTypes[T][];
	/**
	 * Retrieves the GeoJSON representation of a map element.
	 *
	 * Returns the geometric data for a map element in GeoJSON format, which can be used for custom rendering, analysis, or integration with mapping libraries.
	 *
	 * @param mapDataObject The map element to get GeoJSON for.
	 * @returns The GeoJSON representation of the element.
	 *
	 * @example Get GeoJSON for a space
	 * ```ts
	 * const space = mapData.getById('space', 'space-123');
	 * if (space) {
	 *   const geoJSON = mapData.getGeoJSON(space);
	 *   console.log('Space geometry:', geoJSON.geometry);
	 *   console.log('Space properties:', geoJSON.properties);
	 * }
	 * ```
	 *
	 * @example Get GeoJSON for a floor
	 * ```ts
	 * const floor = mapData.getByType('floor')[0];
	 * const geoJSON = mapData.getGeoJSON(floor);
	 * console.log('Floor bounds:', geoJSON.geometry.coordinates);
	 * ```
	 */
	getGeoJSON<T extends IGeoJSONData>(mapDataObject: T): T["geoJSON"];
	/**
	 * Changes the language of the map data.
	 *
	 * Updates all text content (names, descriptions, etc.) to the specified language. The map will emit a 'language-change' event when the language is updated.
	 *
	 * @param localeCode The ISO 639-1 language code to change to (e.g., 'en' for English, 'fr' for French). Check ({@link EnterpriseVenue.languages}) for available
	 languages
	 * @returns A promise that resolves when the language change is complete.
	 *
	 * @example Change to Spanish
	 * ```ts
	 * await mapData.changeLanguage('es');
	 * console.log('Map language changed to Spanish');
	 * ```
	 *
	 * @example Change to French
	 * ```ts
	 * await mapData.changeLanguage('fr');
	 * console.log('Map language changed to French');
	 * ```
	 *
	 * @example Listen for language changes
	 * ```ts
	 * mapData.on('language-change', ({ code, name }) => {
	 *   console.log(`Language changed to ${name} (${code})`);
	 * });
	 * ```
	 */
	changeLanguage(localeCode: string): Promise<void>;
	/**
	 * Gets the current language of the map data.
	 *
	 * @returns The current language code and name.
	 * @example
	 * ```ts
	 * const language = mapData.currentLanguage;
	 * console.log(`Current language: ${language.name} (${language.code})`);
	 * ```
	 */
	get currentLanguage(): import("@mappedin/mvf-v2").Language | undefined;
	/**
	 * Gets the natural bearing of the map.
	 *
	 * The natural bearing represents the orientation of the map relative to true north. This is useful for aligning the map with compass directions or external mapping systems.
	 *
	 * @returns The natural bearing in degrees.
	 * @example
	 * ```ts
	 * const bearing = mapData.naturalBearing;
	 * console.log(`Map is oriented ${bearing} degrees from true north`);
	 * ```
	 */
	get naturalBearing(): number;
	/**

	 * @deprecated Use the async version instead. This method will be made truly async in the upcoming future.
	 * @internal
	 */
	__LEGACY_GET_DIRECTIONS_SYNC: (from: TNavigationTarget | TNavigationTarget[], to: TNavigationTarget | TNavigationTarget[], options?: TGetDirectionsOptions) => Directions | undefined;
	/**
	 * Calculates directions between two or more locations.
	 *
	 * Provides turn-by-turn navigation instructions and a path between the specified locations. The path avoids obstacles and follows walkable routes.
	 *
	 * @param from The starting location(s).
	 * @param to The destination location(s).
	 * @param options Optional configuration for the directions calculation.
	 * @returns A {@link Directions} object containing the route, or undefined if no route is found.
	 *
	 * @example Get directions between two spaces
	 * ```ts
	 * const space1 = mapData.getById('space', 'space-123');
	 * const space2 = mapData.getById('space', 'space-456');
	 *
	 * if (space1 && space2) {
	 *   const directions = await mapData.getDirections(space1, space2);
	 *   if (directions) {
	 *     console.log(`Distance: ${directions.distance}m`);
	 *     console.log(`Duration: ${directions.duration}s`);
	 *     directions.instructions.forEach(instruction => {
	 *       console.log(instruction.action.type);
	 *     });
	 *   }
	 * }
	 * ```
	 *
	 * @example Get directions with options
	 * ```ts
	 * const directions = await mapData.getDirections(space1, space2, {
	 *   accessible: true,
	 *   smoothing: { radius: 3 }
	 * });
	 * ```
	 *
	 * @example Get directions from multiple starting points
	 * ```ts
	 * const directions = await mapData.getDirections([space1, space2], destination);
	 * ```
	 *
	 * @see [Wayfinding Guide](https://developer.mappedin.com/web-sdk/wayfinding)
	 */
	getDirections: (from: TNavigationTarget | TNavigationTarget[], to: TNavigationTarget | TNavigationTarget[], options?: TGetDirectionsOptions) => Promise<Directions | undefined>;
	/**
	 * @deprecated Use the async version instead. This method will be made truly async in the upcoming future.
	 * @internal
	 */
	__LEGACY_GET_DIRECTIONS_MULTI_DESTINATION_SYNC: (from: TNavigationTarget, to: (TNavigationTarget | TNavigationTarget[])[], options?: TGetDirectionsOptions) => Directions[] | undefined;
	/**
	 * Calculates directions to multiple destinations.
	 *
	 * Provides routes from a single starting point to multiple destinations. Useful for finding the best route when visiting multiple locations.
	 *
	 * @param from The starting location.
	 * @param to An array of destination locations or arrays of destinations.
	 * @param options Optional configuration for the directions calculation.
	 * @returns An array of {@link Directions} objects, one for each destination.
	 *
	 * @example Get directions to multiple destinations
	 * ```ts
	 * const start = mapData.getById('space', 'entrance');
	 * const destinations = [
	 *   mapData.getById('space', 'store-1'),
	 *   mapData.getById('space', 'store-2'),
	 *   mapData.getById('space', 'restaurant')
	 * ].filter(Boolean);
	 *
	 * const allDirections = await mapData.getDirectionsMultiDestination(start, destinations);
	 * allDirections.forEach((directions, index) => {
	 *   console.log(`Route ${index + 1}: ${directions.distance}m`);
	 * });
	 * ```
	 *
	 * @example Get directions with alternative routes
	 * ```ts
	 * const directions = await mapData.getDirectionsMultiDestination(start, [
	 *   [destination1, destination2], // First route option
	 *   [destination3, destination4]  // Second route option
	 * ]);
	 * ```
	 */
	getDirectionsMultiDestination: (from: TNavigationTarget, to: (TNavigationTarget | TNavigationTarget[])[], options?: TGetDirectionsOptions) => Promise<Directions[] | undefined>;
	/**
	 * Calculates the straight-line distance between two locations.
	 *
	 * Returns the direct distance between two points, not following walkable paths. For navigation distances, use {@link getDirections}.
	 *
	 * @param from The starting location.
	 * @param to The destination location.
	 * @returns The distance in meters.
	 *
	 * @example Calculate distance between spaces
	 * ```ts
	 * const space1 = mapData.getById('space', 'space-123');
	 * const space2 = mapData.getById('space', 'space-456');
	 *
	 * if (space1 && space2) {
	 *   const distance = mapData.getDistance(space1, space2);
	 *   console.log(`Direct distance: ${distance}m`);
	 * }
	 * ```
	 *
	 * @example Calculate distance from coordinate
	 * ```ts
	 * const coordinate = mapData.mapCenter;
	 * const space = mapData.getByType('space')[0];
	 * const distance = mapData.getDistance(coordinate, space);
	 * console.log(`Distance from center: ${distance}m`);
	 * ```
	 */
	getDistance(from: Space | Door | Coordinate | MapObject | PointOfInterest | Annotation | Node$1 | EnterpriseLocation | Area, to: Space | Door | Coordinate | MapObject | PointOfInterest | Annotation | Node$1 | EnterpriseLocation | Area): number;
	/**
	 * Creates a backup of the map data including language packs.
	 * @internal
	 */
	toBinaryBundle({ downloadLanguagePacks }?: {
		downloadLanguagePacks?: boolean;
	}): Promise<void | THydrateMapDataBundle>;
	/**
	 * Exports the map data as a JSON bundle.
	 *
	 * Creates a JSON representation of the map data that can be easily parsed and manipulated. Useful for data analysis, debugging, or integration with other systems.
	 *
	 * @param options Configuration options for the export.
	 * @param options.downloadLanguagePacks Whether to include language packs in the export.
	 * @returns A JSON bundle containing the map data.
	 *
	 * @example Export map data as JSON
	 * ```ts
	 * const jsonBundle = mapData.toJSONBundle({ downloadLanguagePacks: true });
	 * console.log('Map data exported:', jsonBundle);
	 * ```
	 *
	 * @example Export for analysis
	 * ```ts
	 * const jsonBundle = mapData.toJSONBundle({ downloadLanguagePacks: false });
	 * // Use JSON data for analysis or processing
	 * ```
	 */
	toJSONBundle({ downloadLanguagePacks }?: {
		downloadLanguagePacks?: boolean;
	}): Promise<THydrateMapDataBundle>;
}
export declare const MAPPEDIN_COLORS: {
	orange: string;
	teal: string;
	lightTeal: string;
};
export type VisibilityState = {
	outdoorOpacity: number;
	floorStates: {
		floor?: Floor;
		state: TFloorState;
	}[];
};
export declare function getMultiFloorState(floors: Floor[], currentFloor: Floor, floorGap: (number | "auto") | undefined, floorIdsInNavigation: Floor["id"][], floorsVisualHeightMap?: Map<number, {
	altitude: number;
	effectiveHeight: number;
}>): VisibilityState;
/**
 * @internal
 * @hidden
 * Must be called before {@link show3dMap}
 */
export declare function __setWatermarkOnClickFn(fn: () => void): void;
/**
 * Represents all the available antialiasing options.
 */
export type TAntialiasingOptions = {
	/**
	 * Enable antialiasing. Only works when device supports WebGL2.
	 *
	 * @default true
	 */
	enabled?: boolean;
	/**
	 * Change the quality of antialiasing in the scene. Greater quality means less noise, but worse performance.
	 *
	 * @default 'medium'
	 */
	quality?: "low" | "medium" | "high" | "ultra";
};
/**
 * @interface
 * Options for the watermark.
 */
export type TWatermarkOptions = WatermarkUpdateOptions;
/**
 * Options for showing a 3D map.
 *
 * @experimental
 */
export type TShow3DMapOptions = {
	/**
	 * The outdoor view options.
	 */
	outdoorView?: {
		/**
		 * The token is used to fetch outdoor tiles, which will then be rendered.
		 */
		token?: string;
		/**
		 * A url to a style specification conforming to the [Maplibre Style Spec](https://maplibre.org/maplibre-style-spec/).
		 * Use the {@link Environment | `environment`} setting to switch environments.
		 */
		style?: string;
		/**
		 * Enable or disable the outdoor view.
		 * @default true
		 */
		enabled?: boolean;
		/**
		 * Layers that should be hidden by geometry. This is useful when you want to hide certain layers when they are below the geometry.
		 * @default ['building', 'building-top']
		 */
		layersHiddenByGeometry?: string[];
		/**
		 * Reduces the pixel ratio for MapLibre rendering to improve framerate performance.
		 * When enabled, the rendering quality will be lower but performance will be better,
		 * which can be useful on devices with high-DPI displays or limited GPU capabilities.
		 *
		 * @default false
		 */
		lowDpi?: boolean;
	};
	/**
	 * The initial bearing of the map, in degrees.
	 *
	 * @default 0
	 */
	bearing?: number;
	/**
	 * The initial pitch of the map, in degrees.
	 *
	 * @default 45
	 */
	pitch?: number;
	/**
	 * The initial zoom level of the map, in mercator zoom levels.
	 * If it is not specified, it will default to the level that fits the map bounds.
	 */
	zoomLevel?: number;
	/**
	 * The screen offsets of the map, in screen pixels.
	 */
	screenOffsets?: InsetPadding;
	/**
	 * Antialiasing settings.
	 *
	 * @hidden
	 * @default true
	 */
	antialiasing?: boolean | TAntialiasingOptions;
	/**
	 * @experimental
	 *
	 * Enable debug mode to check the visual representation of performance stats.
	 * @default false
	 */
	debug?: boolean;
	/**
	 * Options when showing the watermark.
	 *
	 * @hidden
	 */
	watermark?: TWatermarkOptions;
	/**
	 * Options for the attribution control.
	 *
	 * @hidden
	 */
	attribution?: {
		/**
		 * Custom attribution content.
		 */
		custom?: string[];
		/**
		 * Attribution position.
		 * @default 'bottom-right'
		 */
		position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
		/**
		 * Whether to show a feedback link next to the attributions.
		 * @default true
		 */
		feedback?: boolean;
	};
	/**
	 * First floor to be rendered.
	 * By default, floor with the elevation that's closest to 0 is rendered. All floors will be sorted by elevation in ascending order.
	 */
	initialFloor?: Floor | string;
	/**
	 * Enable shading of bottoms of geometry along with outlines to make geometry stand out.
	 * @default true
	 * @deprecated Use `style.shading`.
	 */
	shadingAndOutlines?: boolean;
	/**
	 * Specify a color for the top of wall geometry.
	 * @deprecated Use `style.wallTopColor`.
	 */
	wallTopColor?: string;
	/**
	 * Style options for the map.
	 * @experimental
	 */
	style?: {
		/**
		 * Background color. Only relevant if outdoor map is disabled.
		 */
		backgroundColor?: string;
		/**
		 * Background alpha value. Only relevant if outdoor map is disabled.
		 */
		backgroundAlpha?: number;
		/**
		 * Set the global shading for all elements. True will use default values, false will disable shading.
		 * @default true
		 */
		shading?: boolean | Shading;
		/**
		 * Set the global outlines for all elements. True will enable outlines, false will disable them.
		 * @default true
		 */
		outlines?: boolean;
		/**
		 * Specify a color for the top of wall geometry.
		 */
		wallTopColor?: string;
	};
	/**
	 * Options for controlling multi-floor view.
	 */
	multiFloorView?: TMultiFloorViewOptions;
	/**
	 * @experimental
	 * @internal
	 */
	imagePlacementOptions?: TImagePlacementOptions;
	/**
	 * Enable or disable the flip of images to face the camera.
	 * @default true
	 */
	flipImagesToFaceCamera?: boolean;
	/**
	 * Automatically inject necessary styles into the document head. If `false`, the `index.css` file needs to be manually imported.
	 *
	 * ```ts
	 * import '@mappedin/mappedin-js/lib/index.css';
	 * ...
	 * await show3dMap(...);
	 * ```
	 *
	 * @default true
	 */
	injectStyles?: boolean;
	/**
	 * @hidden
	 * @internal
	 */
	onWebGLContextCreationError?: (event: Event) => void;
	/**
	 * @hidden
	 * @internal
	 */
	onWebGLContextLost?: (event: Event) => void;
	/**
	 * @hidden
	 * @internal
	 */
	onWebGLContextRestored?: (event: Event) => void;
	/**
	 * @hidden
	 * @internal
	 */
	onWebGLRendererError?: (error: Error) => void;
	/**
	 * @experimental
	 * @internal
	 *
	 * If true, the map will use a standalone camera for rendering instead of syncing with MapLibre's camera.
	 * This enables environment map reflections to update with camera movement in interleaved and overlay modes.
	 * Note: This disables building occlusion since the depth buffer is no longer synchronized with MapLibre.
	 *
	 * @default false
	 */
	useStandaloneCamera?: boolean;
	/**
	 *
	 * Preload floors for the map. Allows floors to appear faster but requires more time and memory up front.
	 */
	preloadFloors?: Floor[];
	/**
	 * If true, the map will not use web workers. This will turn off outdoor context, and may negatively impact performance of labels and markers.
	 * @internal
	 *
	 * ⚠️ **WARNING**: Setting this to true is not recommended and should only be used for environments where the CSP does not allow web workers.
	 * Disabling web workers may significantly degrade performance and disable outdoor map functionality.
	 * @default false
	 */
	disableWorkers?: boolean;
};
/**
 * @internal
 * @deprecated Use {@link hydrateMapData} instead.
 *
 * Returns a {@link MapData} instance from a parsed MVF object.
 */
export declare const hydrateMapDataFromMVF: (mvf: TMVF, options?: TGetMapDataWithCredentialsOptions & {
	languagePacks?: LanguagePackHydrationItem[];
}) => Promise<MapData>;
/**
 * @internal
 * @deprecated Use {@link getMapData} and enterprise will be inferred from key/secret.
 */
export declare function setUseEnterpriseAPI(value: boolean): void;
/**
 * @internal
 * @hidden
 *
 * If true, the SDK will create enterprise locations in addition to location profiles. Use this to allow
 * legacy applications to load platform maps.
 */
export declare function forceEnterpriseLocations(value: boolean): void;
/**
 * @hidden
 * @internal
 *
 * See {@link forceEnterpriseLocations}
 */
export declare function shouldForceEnterpriseLocations(): boolean;
/**
 * Asynchronously retrieves map data ({@link MapData}) based on user-provided options.
 *
 * @experimental
 * @param userOptions {TGetMapDataOptions} Options provided by the user to retrieve map data.
 * @returns {Promise<MapData>} Promise resolving to the MapData.
 * @example
 * const data = await getMapData({ key: 'api_key', secret: 'api_secret', mapId: 'id' });
 */
export declare const getMapData: (userOptions: TGetMapDataOptions) => Promise<MapData>;
/**
 * @internal
 * @deprecated Use {@link getMapData} and enterprise will be inferred from key/secret.
 */
export declare const getMapDataEnterprise: (userOptions: TGetMapDataOptions) => Promise<MapData>;
/**
 * @internal
 *
 * Note: had to add this here to avoid a circular reference when I put it in options
 * TODO: investigate
 *
 * Check if the worker urls are valid
 * @returns false if workers have not been set, and an object with the worker urls if they are set
 */
export declare const checkWorkerUrls: () => Promise<false | {
	collision: boolean;
	maplibre: boolean;
}>;
export declare const show3dMap: (el: HTMLElement, mapData: MapData, options?: TShow3DMapOptions) => Promise<MapView>;
/**
 * Returns the package version of the SDK.
 */
export declare const getVersion: () => string | undefined;
/**
 * @internal
 * @deprecated Use {@link show3dMap} instead.
 */
export declare const show3dMapGeojson: (el: HTMLElement, mapData: MapData, options?: TShow3DMapOptions) => Promise<MapView>;

declare namespace coerce {
	export { ZodCoercedBigInt, ZodCoercedBoolean, ZodCoercedDate, ZodCoercedNumber, ZodCoercedString, bigint$2 as bigint, boolean$2 as boolean, date$3 as date, number$2 as number, string$2 as string };
}
declare namespace schemas {
	export { $InferEnumInput, $InferEnumOutput, $InferInnerFunctionType, $InferInnerFunctionTypeAsync, $InferObjectInput, $InferObjectOutput, $InferOuterFunctionType, $InferOuterFunctionTypeAsync, $InferTupleInputType, $InferTupleOutputType, $InferUnionInput, $InferUnionOutput, $InferZodRecordInput, $InferZodRecordOutput, $PartsToTemplateLiteral, $ZodAny, $ZodAnyDef, $ZodAnyInternals, $ZodArray, $ZodArrayDef, $ZodArrayInternals, $ZodBase64, $ZodBase64Def, $ZodBase64Internals, $ZodBase64URL, $ZodBase64URLDef, $ZodBase64URLInternals, $ZodBigInt, $ZodBigIntDef, $ZodBigIntFormat, $ZodBigIntFormatDef, $ZodBigIntFormatInternals, $ZodBigIntInternals, $ZodBoolean, $ZodBooleanDef, $ZodBooleanInternals, $ZodCIDRv4, $ZodCIDRv4Def, $ZodCIDRv4Internals, $ZodCIDRv6, $ZodCIDRv6Def, $ZodCIDRv6Internals, $ZodCUID, $ZodCUID2, $ZodCUID2Def, $ZodCUID2Internals, $ZodCUIDDef, $ZodCUIDInternals, $ZodCatch, $ZodCatchCtx, $ZodCatchDef, $ZodCatchInternals, $ZodCodec, $ZodCodecDef, $ZodCodecInternals, $ZodCustom, $ZodCustomDef, $ZodCustomInternals, $ZodCustomStringFormat, $ZodCustomStringFormatDef, $ZodCustomStringFormatInternals, $ZodDate, $ZodDateDef, $ZodDateInternals, $ZodDefault, $ZodDefaultDef, $ZodDefaultInternals, $ZodDiscriminatedUnion, $ZodDiscriminatedUnionDef, $ZodDiscriminatedUnionInternals, $ZodE164, $ZodE164Def, $ZodE164Internals, $ZodEmail, $ZodEmailDef, $ZodEmailInternals, $ZodEmoji, $ZodEmojiDef, $ZodEmojiInternals, $ZodEnum, $ZodEnumDef, $ZodEnumInternals, $ZodFile, $ZodFileDef, $ZodFileInternals, $ZodFunction, $ZodFunctionArgs, $ZodFunctionDef, $ZodFunctionIn, $ZodFunctionInternals, $ZodFunctionOut, $ZodFunctionParams, $ZodGUID, $ZodGUIDDef, $ZodGUIDInternals, $ZodIPv4, $ZodIPv4Def, $ZodIPv4Internals, $ZodIPv6, $ZodIPv6Def, $ZodIPv6Internals, $ZodISODate, $ZodISODateDef, $ZodISODateInternals, $ZodISODateTime, $ZodISODateTimeDef, $ZodISODateTimeInternals, $ZodISODuration, $ZodISODurationDef, $ZodISODurationInternals, $ZodISOTime, $ZodISOTimeDef, $ZodISOTimeInternals, $ZodIntersection, $ZodIntersectionDef, $ZodIntersectionInternals, $ZodJWT, $ZodJWTDef, $ZodJWTInternals, $ZodKSUID, $ZodKSUIDDef, $ZodKSUIDInternals, $ZodLazy, $ZodLazyDef, $ZodLazyInternals, $ZodLiteral, $ZodLiteralDef, $ZodLiteralInternals, $ZodLooseShape, $ZodMap, $ZodMapDef, $ZodMapInternals, $ZodNaN, $ZodNaNDef, $ZodNaNInternals, $ZodNanoID, $ZodNanoIDDef, $ZodNanoIDInternals, $ZodNever, $ZodNeverDef, $ZodNeverInternals, $ZodNonOptional, $ZodNonOptionalDef, $ZodNonOptionalInternals, $ZodNull, $ZodNullDef, $ZodNullInternals, $ZodNullable, $ZodNullableDef, $ZodNullableInternals, $ZodNumber, $ZodNumberDef, $ZodNumberFormat, $ZodNumberFormatDef, $ZodNumberFormatInternals, $ZodNumberInternals, $ZodObject, $ZodObjectConfig, $ZodObjectDef, $ZodObjectInternals, $ZodObjectJIT, $ZodOptional, $ZodOptionalDef, $ZodOptionalInternals, $ZodPipe, $ZodPipeDef, $ZodPipeInternals, $ZodPrefault, $ZodPrefaultDef, $ZodPrefaultInternals, $ZodPromise, $ZodPromiseDef, $ZodPromiseInternals, $ZodReadonly, $ZodReadonlyDef, $ZodReadonlyInternals, $ZodRecord, $ZodRecordDef, $ZodRecordInternals, $ZodRecordKey, $ZodSet, $ZodSetDef, $ZodSetInternals, $ZodShape, $ZodStandardSchema, $ZodString, $ZodStringDef, $ZodStringFormat, $ZodStringFormatDef, $ZodStringFormatInternals, $ZodStringFormatTypes, $ZodStringInternals, $ZodSuccess, $ZodSuccessDef, $ZodSuccessInternals, $ZodSymbol, $ZodSymbolDef, $ZodSymbolInternals, $ZodTemplateLiteral, $ZodTemplateLiteralDef, $ZodTemplateLiteralInternals, $ZodTemplateLiteralPart, $ZodTransform, $ZodTransformDef, $ZodTransformInternals, $ZodTuple, $ZodTupleDef, $ZodTupleInternals, $ZodType, $ZodTypeDef, $ZodTypeInternals, $ZodTypes, $ZodULID, $ZodULIDDef, $ZodULIDInternals, $ZodURL, $ZodURLDef, $ZodURLInternals, $ZodUUID, $ZodUUIDDef, $ZodUUIDInternals, $ZodUndefined, $ZodUndefinedDef, $ZodUndefinedInternals, $ZodUnion, $ZodUnionDef, $ZodUnionInternals, $ZodUnknown, $ZodUnknownDef, $ZodUnknownInternals, $ZodVoid, $ZodVoidDef, $ZodVoidInternals, $ZodXID, $ZodXIDDef, $ZodXIDInternals, $catchall, $loose, $partial, $strict, $strip, CheckFn, ConcatenateTupleOfStrings, ConvertPartsToStringTuple, File$1 as File, ParseContext, ParseContextInternal, ParsePayload, SomeType, ToTemplateLiteral, _$ZodType, _$ZodTypeInternals, clone, isValidBase64, isValidBase64URL, isValidJWT };
}
declare namespace util {
	export { AnyFunc, AssertEqual, AssertExtends, AssertNotEqual, BIGINT_FORMAT_RANGES, BuiltIn, Class, CleanKey, Constructor, EmptyObject, EmptyToNever, EnumLike, EnumValue, Exactly, Extend, ExtractIndexSignature, Flatten, FromCleanMap, HasLength, HasSize, HashAlgorithm, HashEncoding, HashFormat, IPVersion, Identity, InexactPartial, IsAny, IsProp, JSONType, JWTAlgorithm, KeyOf, Keys, KeysArray, KeysEnum, Literal, LiteralArray, LoosePartial, MakePartial, MakeReadonly, MakeRequired, Mapped, Mask, MaybeAsync, MimeTypes, NUMBER_FORMAT_RANGES, NoNever, NoNeverKeys, NoUndefined, Normalize, Numeric, Omit$1 as Omit, OmitIndexSignature, OmitKeys, ParsedTypes, Prettify, Primitive, PrimitiveArray, PrimitiveSet, PropValues, SafeParseError, SafeParseResult, SafeParseSuccess, SchemaClass, SomeObject, ToCleanMap, ToEnum, TupleItems, Whatever, Writeable, aborted, allowsEval, assert, assertEqual, assertIs, assertNever, assertNotEqual, assignProp, base64ToUint8Array, base64urlToUint8Array, cached, captureStackTrace, cleanEnum, cleanRegex, clone, cloneDef, createTransparentProxy, defineLazy, esc, escapeRegex, extend, finalizeIssue, floatSafeRemainder, getElementAtPath, getEnumValues, getLengthableOrigin, getParsedType, getSizableOrigin, hexToUint8Array, isObject, isPlainObject, issue, joinValues, jsonStringifyReplacer, merge, mergeDefs, normalizeParams, nullish, numKeys, objectClone, omit, optionalKeys, partial, pick, prefixIssues, primitiveTypes, promiseAllObject, propertyKeyTypes, randomString, required, safeExtend, shallowClone, stringifyPrimitive, uint8ArrayToBase64, uint8ArrayToBase64url, uint8ArrayToHex, unwrapMessage };
}
declare namespace JSONSchema$1 {
	export { ArraySchema, BaseSchema, BooleanSchema, IntegerSchema, JSONSchema, NullSchema, NumberSchema, ObjectSchema, Schema, StringSchema, _JSONSchema };
}
declare namespace regexes {
	export { _null as null, _undefined as undefined, base64, base64url, bigint, boolean, browserEmail, cidrv4, cidrv6, cuid, cuid2, date, datetime, domain, duration, e164, email, emoji, extendedDuration, guid, hex, hostname, html5Email, idnEmail, integer, ipv4, ipv6, ksuid, lowercase, md5_base64, md5_base64url, md5_hex, nanoid, number, rfc5322Email, sha1_base64, sha1_base64url, sha1_hex, sha256_base64, sha256_base64url, sha256_hex, sha384_base64, sha384_base64url, sha384_hex, sha512_base64, sha512_base64url, sha512_hex, string, time, ulid, unicodeEmail, uppercase, uuid, uuid4, uuid6, uuid7, xid };
}
declare namespace locales {
	export { _default as ar, _default$1 as az, _default$10 as es, _default$11 as fa, _default$12 as fi, _default$13 as fr, _default$14 as frCA, _default$15 as he, _default$16 as hu, _default$17 as id, _default$18 as is, _default$19 as it, _default$2 as be, _default$20 as ja, _default$21 as ka, _default$22 as kh, _default$23 as km, _default$24 as ko, _default$25 as lt, _default$26 as mk, _default$27 as ms, _default$28 as nl, _default$29 as no, _default$3 as bg, _default$30 as ota, _default$31 as ps, _default$32 as pl, _default$33 as pt, _default$34 as ru, _default$35 as sl, _default$36 as sv, _default$37 as ta, _default$38 as th, _default$39 as tr, _default$4 as ca, _default$40 as ua, _default$41 as uk, _default$42 as ur, _default$43 as vi, _default$44 as zhCN, _default$45 as zhTW, _default$46 as yo, _default$5 as cs, _default$6 as da, _default$7 as de, _default$8 as en, _default$9 as eo };
}
declare namespace schemas$1 {
	export { SafeExtendShape, ZodAny, ZodArray, ZodBase64, ZodBase64URL, ZodBigInt, ZodBigIntFormat, ZodBoolean, ZodCIDRv4, ZodCIDRv6, ZodCUID, ZodCUID2, ZodCatch, ZodCodec, ZodCustom, ZodCustomStringFormat, ZodDate, ZodDefault, ZodDiscriminatedUnion, ZodE164, ZodEmail, ZodEmoji, ZodEnum, ZodFile, ZodFloat32, ZodFloat64, ZodFunction, ZodGUID, ZodIPv4, ZodIPv6, ZodInt, ZodInt32, ZodIntersection, ZodJSONSchema, ZodJSONSchemaInternals, ZodJWT, ZodKSUID, ZodLazy, ZodLiteral, ZodMap, ZodNaN, ZodNanoID, ZodNever, ZodNonOptional, ZodNull, ZodNullable, ZodNumber, ZodNumberFormat, ZodObject, ZodOptional, ZodPipe, ZodPrefault, ZodPromise, ZodReadonly, ZodRecord, ZodSet, ZodString, ZodStringFormat, ZodSuccess, ZodSymbol, ZodTemplateLiteral, ZodTransform, ZodTuple, ZodType, ZodUInt32, ZodULID, ZodURL, ZodUUID, ZodUndefined, ZodUnion, ZodUnknown, ZodVoid, ZodXID, _ZodBigInt, _ZodBoolean, _ZodDate, _ZodNumber, _ZodString, _ZodType, _catch$1 as catch, _default$48 as _default, _enum$1 as enum, _function, _function as function, _instanceof as instanceof, _null$2 as null, _undefined$2 as undefined, _void$1 as void, any, array, base64$1 as base64, base64url$1 as base64url, bigint$1 as bigint, boolean$1 as boolean, check, cidrv4$1 as cidrv4, cidrv6$1 as cidrv6, codec, cuid$1 as cuid, cuid2$1 as cuid2, custom, date$1 as date, discriminatedUnion, e164$1 as e164, email$1 as email, emoji$1 as emoji, file, float32, float64, guid$1 as guid, hash, hex$1 as hex, hostname$1 as hostname, httpUrl, int, int32, int64, intersection, ipv4$1 as ipv4, ipv6$1 as ipv6, json, jwt, keyof, ksuid$1 as ksuid, lazy, literal, looseObject, map, nan, nanoid$1 as nanoid, nativeEnum, never, nonoptional, nullable, nullish$1 as nullish, number$1 as number, object, optional, partialRecord, pipe, prefault, preprocess, promise, readonly, record, refine, set, strictObject, string$1 as string, stringFormat, stringbool, success, superRefine, symbol, templateLiteral, transform, tuple, uint32, uint64, ulid$1 as ulid, union, unknown, url, uuid$1 as uuid, uuidv4, uuidv6, uuidv7, xid$1 as xid };
}
declare namespace core {
	export { $Decode, $DecodeAsync, $Encode, $EncodeAsync, $InferEnumInput, $InferEnumOutput, $InferInnerFunctionType, $InferInnerFunctionTypeAsync, $InferObjectInput, $InferObjectOutput, $InferOuterFunctionType, $InferOuterFunctionTypeAsync, $InferTupleInputType, $InferTupleOutputType, $InferUnionInput, $InferUnionOutput, $InferZodRecordInput, $InferZodRecordOutput, $Parse, $ParseAsync, $PartsToTemplateLiteral, $RefinementCtx, $SafeDecode, $SafeDecodeAsync, $SafeEncode, $SafeEncodeAsync, $SafeParse, $SafeParseAsync, $ZodAny, $ZodAnyDef, $ZodAnyInternals, $ZodAnyParams, $ZodArray, $ZodArrayDef, $ZodArrayInternals, $ZodArrayParams, $ZodAsyncError, $ZodBase64, $ZodBase64Def, $ZodBase64Internals, $ZodBase64Params, $ZodBase64URL, $ZodBase64URLDef, $ZodBase64URLInternals, $ZodBase64URLParams, $ZodBigInt, $ZodBigIntDef, $ZodBigIntFormat, $ZodBigIntFormatDef, $ZodBigIntFormatInternals, $ZodBigIntFormatParams, $ZodBigIntFormats, $ZodBigIntInternals, $ZodBigIntParams, $ZodBoolean, $ZodBooleanDef, $ZodBooleanInternals, $ZodBooleanParams, $ZodBranded, $ZodCIDRv4, $ZodCIDRv4Def, $ZodCIDRv4Internals, $ZodCIDRv4Params, $ZodCIDRv6, $ZodCIDRv6Def, $ZodCIDRv6Internals, $ZodCIDRv6Params, $ZodCUID, $ZodCUID2, $ZodCUID2Def, $ZodCUID2Internals, $ZodCUID2Params, $ZodCUIDDef, $ZodCUIDInternals, $ZodCUIDParams, $ZodCatch, $ZodCatchCtx, $ZodCatchDef, $ZodCatchInternals, $ZodCatchParams, $ZodCheck, $ZodCheckBase64Params, $ZodCheckBase64URLParams, $ZodCheckBigIntFormat, $ZodCheckBigIntFormatDef, $ZodCheckBigIntFormatInternals, $ZodCheckBigIntFormatParams, $ZodCheckCIDRv4Params, $ZodCheckCIDRv6Params, $ZodCheckCUID2Params, $ZodCheckCUIDParams, $ZodCheckDef, $ZodCheckE164Params, $ZodCheckEmailParams, $ZodCheckEmojiParams, $ZodCheckEndsWith, $ZodCheckEndsWithDef, $ZodCheckEndsWithInternals, $ZodCheckEndsWithParams, $ZodCheckGUIDParams, $ZodCheckGreaterThan, $ZodCheckGreaterThanDef, $ZodCheckGreaterThanInternals, $ZodCheckGreaterThanParams, $ZodCheckIPv4Params, $ZodCheckIPv6Params, $ZodCheckISODateParams, $ZodCheckISODateTimeParams, $ZodCheckISODurationParams, $ZodCheckISOTimeParams, $ZodCheckIncludes, $ZodCheckIncludesDef, $ZodCheckIncludesInternals, $ZodCheckIncludesParams, $ZodCheckInternals, $ZodCheckJWTParams, $ZodCheckKSUIDParams, $ZodCheckLengthEquals, $ZodCheckLengthEqualsDef, $ZodCheckLengthEqualsInternals, $ZodCheckLengthEqualsParams, $ZodCheckLessThan, $ZodCheckLessThanDef, $ZodCheckLessThanInternals, $ZodCheckLessThanParams, $ZodCheckLowerCase, $ZodCheckLowerCaseDef, $ZodCheckLowerCaseInternals, $ZodCheckLowerCaseParams, $ZodCheckMaxLength, $ZodCheckMaxLengthDef, $ZodCheckMaxLengthInternals, $ZodCheckMaxLengthParams, $ZodCheckMaxSize, $ZodCheckMaxSizeDef, $ZodCheckMaxSizeInternals, $ZodCheckMaxSizeParams, $ZodCheckMimeType, $ZodCheckMimeTypeDef, $ZodCheckMimeTypeInternals, $ZodCheckMimeTypeParams, $ZodCheckMinLength, $ZodCheckMinLengthDef, $ZodCheckMinLengthInternals, $ZodCheckMinLengthParams, $ZodCheckMinSize, $ZodCheckMinSizeDef, $ZodCheckMinSizeInternals, $ZodCheckMinSizeParams, $ZodCheckMultipleOf, $ZodCheckMultipleOfDef, $ZodCheckMultipleOfInternals, $ZodCheckMultipleOfParams, $ZodCheckNanoIDParams, $ZodCheckNumberFormat, $ZodCheckNumberFormatDef, $ZodCheckNumberFormatInternals, $ZodCheckNumberFormatParams, $ZodCheckOverwrite, $ZodCheckOverwriteDef, $ZodCheckOverwriteInternals, $ZodCheckProperty, $ZodCheckPropertyDef, $ZodCheckPropertyInternals, $ZodCheckPropertyParams, $ZodCheckRegex, $ZodCheckRegexDef, $ZodCheckRegexInternals, $ZodCheckRegexParams, $ZodCheckSizeEquals, $ZodCheckSizeEqualsDef, $ZodCheckSizeEqualsInternals, $ZodCheckSizeEqualsParams, $ZodCheckStartsWith, $ZodCheckStartsWithDef, $ZodCheckStartsWithInternals, $ZodCheckStartsWithParams, $ZodCheckStringFormat, $ZodCheckStringFormatDef, $ZodCheckStringFormatInternals, $ZodCheckStringFormatParams, $ZodCheckULIDParams, $ZodCheckURLParams, $ZodCheckUUIDParams, $ZodCheckUUIDv4Params, $ZodCheckUUIDv6Params, $ZodCheckUUIDv7Params, $ZodCheckUpperCase, $ZodCheckUpperCaseDef, $ZodCheckUpperCaseInternals, $ZodCheckUpperCaseParams, $ZodCheckXIDParams, $ZodChecks, $ZodCodec, $ZodCodecDef, $ZodCodecInternals, $ZodConfig, $ZodCustom, $ZodCustomDef, $ZodCustomInternals, $ZodCustomParams, $ZodCustomStringFormat, $ZodCustomStringFormatDef, $ZodCustomStringFormatInternals, $ZodDate, $ZodDateDef, $ZodDateInternals, $ZodDateParams, $ZodDefault, $ZodDefaultDef, $ZodDefaultInternals, $ZodDefaultParams, $ZodDiscriminatedUnion, $ZodDiscriminatedUnionDef, $ZodDiscriminatedUnionInternals, $ZodDiscriminatedUnionParams, $ZodE164, $ZodE164Def, $ZodE164Internals, $ZodE164Params, $ZodEmail, $ZodEmailDef, $ZodEmailInternals, $ZodEmailParams, $ZodEmoji, $ZodEmojiDef, $ZodEmojiInternals, $ZodEmojiParams, $ZodEncodeError, $ZodEnum, $ZodEnumDef, $ZodEnumInternals, $ZodEnumParams, $ZodError, $ZodErrorClass, $ZodErrorMap, $ZodErrorTree, $ZodFile, $ZodFileDef, $ZodFileInternals, $ZodFileParams, $ZodFlattenedError, $ZodFormattedError, $ZodFunction, $ZodFunctionArgs, $ZodFunctionDef, $ZodFunctionIn, $ZodFunctionInternals, $ZodFunctionOut, $ZodFunctionParams, $ZodGUID, $ZodGUIDDef, $ZodGUIDInternals, $ZodGUIDParams, $ZodIPv4, $ZodIPv4Def, $ZodIPv4Internals, $ZodIPv4Params, $ZodIPv6, $ZodIPv6Def, $ZodIPv6Internals, $ZodIPv6Params, $ZodISODate, $ZodISODateDef, $ZodISODateInternals, $ZodISODateParams, $ZodISODateTime, $ZodISODateTimeDef, $ZodISODateTimeInternals, $ZodISODateTimeParams, $ZodISODuration, $ZodISODurationDef, $ZodISODurationInternals, $ZodISODurationParams, $ZodISOTime, $ZodISOTimeDef, $ZodISOTimeInternals, $ZodISOTimeParams, $ZodInternalIssue, $ZodIntersection, $ZodIntersectionDef, $ZodIntersectionInternals, $ZodIntersectionParams, $ZodIssue, $ZodIssueBase, $ZodIssueCode, $ZodIssueCustom, $ZodIssueInvalidElement, $ZodIssueInvalidKey, $ZodIssueInvalidStringFormat, $ZodIssueInvalidType, $ZodIssueInvalidUnion, $ZodIssueInvalidValue, $ZodIssueNotMultipleOf, $ZodIssueStringCommonFormats, $ZodIssueStringEndsWith, $ZodIssueStringIncludes, $ZodIssueStringInvalidJWT, $ZodIssueStringInvalidRegex, $ZodIssueStringStartsWith, $ZodIssueTooBig, $ZodIssueTooSmall, $ZodIssueUnrecognizedKeys, $ZodJWT, $ZodJWTDef, $ZodJWTInternals, $ZodJWTParams, $ZodKSUID, $ZodKSUIDDef, $ZodKSUIDInternals, $ZodKSUIDParams, $ZodLazy, $ZodLazyDef, $ZodLazyInternals, $ZodLazyParams, $ZodLiteral, $ZodLiteralDef, $ZodLiteralInternals, $ZodLiteralParams, $ZodLooseShape, $ZodMap, $ZodMapDef, $ZodMapInternals, $ZodMapParams, $ZodNaN, $ZodNaNDef, $ZodNaNInternals, $ZodNaNParams, $ZodNanoID, $ZodNanoIDDef, $ZodNanoIDInternals, $ZodNanoIDParams, $ZodNever, $ZodNeverDef, $ZodNeverInternals, $ZodNeverParams, $ZodNonOptional, $ZodNonOptionalDef, $ZodNonOptionalInternals, $ZodNonOptionalParams, $ZodNull, $ZodNullDef, $ZodNullInternals, $ZodNullParams, $ZodNullable, $ZodNullableDef, $ZodNullableInternals, $ZodNullableParams, $ZodNumber, $ZodNumberDef, $ZodNumberFormat, $ZodNumberFormatDef, $ZodNumberFormatInternals, $ZodNumberFormatParams, $ZodNumberFormats, $ZodNumberInternals, $ZodNumberParams, $ZodObject, $ZodObjectConfig, $ZodObjectDef, $ZodObjectInternals, $ZodObjectJIT, $ZodObjectParams, $ZodOptional, $ZodOptionalDef, $ZodOptionalInternals, $ZodOptionalParams, $ZodPipe, $ZodPipeDef, $ZodPipeInternals, $ZodPipeParams, $ZodPrefault, $ZodPrefaultDef, $ZodPrefaultInternals, $ZodPromise, $ZodPromiseDef, $ZodPromiseInternals, $ZodPromiseParams, $ZodRawIssue, $ZodReadonly, $ZodReadonlyDef, $ZodReadonlyInternals, $ZodReadonlyParams, $ZodRealError$1 as $ZodRealError, $ZodRecord, $ZodRecordDef, $ZodRecordInternals, $ZodRecordKey, $ZodRecordParams, $ZodRegistry, $ZodSet, $ZodSetDef, $ZodSetInternals, $ZodSetParams, $ZodShape, $ZodStandardSchema, $ZodString, $ZodStringBoolParams, $ZodStringDef, $ZodStringFormat, $ZodStringFormatChecks, $ZodStringFormatDef, $ZodStringFormatInternals, $ZodStringFormatIssues, $ZodStringFormatParams, $ZodStringFormatTypes, $ZodStringFormats, $ZodStringInternals, $ZodStringParams, $ZodSuccess, $ZodSuccessDef, $ZodSuccessInternals, $ZodSuccessParams, $ZodSuperRefineIssue, $ZodSymbol, $ZodSymbolDef, $ZodSymbolInternals, $ZodSymbolParams, $ZodTemplateLiteral, $ZodTemplateLiteralDef, $ZodTemplateLiteralInternals, $ZodTemplateLiteralParams, $ZodTemplateLiteralPart, $ZodTransform, $ZodTransformDef, $ZodTransformInternals, $ZodTransformParams, $ZodTuple, $ZodTupleDef, $ZodTupleInternals, $ZodTupleParams, $ZodType, $ZodTypeDef, $ZodTypeDiscriminable, $ZodTypeDiscriminableInternals, $ZodTypeInternals, $ZodTypes, $ZodULID, $ZodULIDDef, $ZodULIDInternals, $ZodULIDParams, $ZodURL, $ZodURLDef, $ZodURLInternals, $ZodURLParams, $ZodUUID, $ZodUUIDDef, $ZodUUIDInternals, $ZodUUIDParams, $ZodUUIDv4Params, $ZodUUIDv6Params, $ZodUUIDv7Params, $ZodUndefined, $ZodUndefinedDef, $ZodUndefinedInternals, $ZodUndefinedParams, $ZodUnion, $ZodUnionDef, $ZodUnionInternals, $ZodUnionParams, $ZodUnknown, $ZodUnknownDef, $ZodUnknownInternals, $ZodUnknownParams, $ZodVoid, $ZodVoidDef, $ZodVoidInternals, $ZodVoidParams, $ZodXID, $ZodXIDDef, $ZodXIDInternals, $ZodXIDParams, $brand, $catchall, $constructor, $input, $loose, $output, $partial, $replace, $strict, $strip, CheckFn, CheckParams, CheckStringFormatParams, CheckTypeParams, ConcatenateTupleOfStrings, ConvertPartsToStringTuple, Doc, File$1 as File, GlobalMeta, JSONSchema$1 as JSONSchema, JSONSchemaGenerator, JSONSchemaMeta, NEVER, Params, ParseContext, ParseContextInternal, ParsePayload, SomeType, StringFormatParams, TimePrecision, ToTemplateLiteral, TypeParams, _$ZodType, _$ZodTypeInternals, _any, _array, _base64, _base64url, _bigint, _boolean, _catch, _check, _cidrv4, _cidrv6, _coercedBigint, _coercedBoolean, _coercedDate, _coercedNumber, _coercedString, _cuid, _cuid2, _custom, _date, _decode, _decodeAsync, _default$47 as _default, _discriminatedUnion, _e164, _email, _emoji, _encode, _encodeAsync, _endsWith, _enum, _file, _float32, _float64, _gt, _gte, _gte as _min, _guid, _includes, _int, _int32, _int64, _intersection, _ipv4, _ipv6, _isoDate, _isoDateTime, _isoDuration, _isoTime, _jwt, _ksuid, _lazy, _length, _literal, _lowercase, _lt, _lte, _lte as _max, _map, _maxLength, _maxSize, _mime, _minLength, _minSize, _multipleOf, _nan, _nanoid, _nativeEnum, _negative, _never, _nonnegative, _nonoptional, _nonpositive, _normalize, _null$1 as _null, _nullable, _number, _optional, _overwrite, _parse, _parseAsync, _pipe, _positive, _promise, _property, _readonly, _record, _refine, _regex, _safeDecode, _safeDecodeAsync, _safeEncode, _safeEncodeAsync, _safeParse, _safeParseAsync, _set, _size, _startsWith, _string, _stringFormat, _stringbool, _success, _superRefine, _symbol, _templateLiteral, _toLowerCase, _toUpperCase, _transform, _trim, _tuple, _uint32, _uint64, _ulid, _undefined$1 as _undefined, _union, _unknown, _uppercase, _url, _uuid, _uuidv4, _uuidv6, _uuidv7, _void, _xid, clone, config, decode, decodeAsync, encode, encodeAsync, flattenError, formatError, globalConfig, globalRegistry, input, isValidBase64, isValidBase64URL, isValidJWT, locales, output, output as infer, parse, parseAsync, prettifyError, regexes, registry, safeDecode, safeDecodeAsync, safeEncode, safeEncodeAsync, safeParse, safeParseAsync, toDotPath, toJSONSchema, treeifyError, util, version };
}
declare namespace iso {
	export { ZodISODate, ZodISODateTime, ZodISODuration, ZodISOTime, date$2 as date, datetime$1 as datetime, duration$1 as duration, time$1 as time };
}
declare namespace z {
	export { $RefinementCtx as RefinementCtx, $ZodErrorMap as ZodErrorMap, $ZodFlattenedError as ZodFlattenedError, $ZodFormattedError as ZodFormattedError, $ZodTypes as ZodFirstPartySchemaTypes, $brand, $input, $output, BRAND, GlobalMeta, IssueData, NEVER, SafeExtendShape, TimePrecision, ZodAny, ZodArray, ZodBase64, ZodBase64URL, ZodBigInt, ZodBigIntFormat, ZodBoolean, ZodCIDRv4, ZodCIDRv6, ZodCUID, ZodCUID2, ZodCatch, ZodCodec, ZodCoercedBigInt, ZodCoercedBoolean, ZodCoercedDate, ZodCoercedNumber, ZodCoercedString, ZodCustom, ZodCustomStringFormat, ZodDate, ZodDefault, ZodDiscriminatedUnion, ZodE164, ZodEmail, ZodEmoji, ZodEnum, ZodError, ZodFile, ZodFirstPartyTypeKind, ZodFloat32, ZodFloat64, ZodFunction, ZodGUID, ZodIPv4, ZodIPv6, ZodISODate, ZodISODateTime, ZodISODuration, ZodISOTime, ZodInt, ZodInt32, ZodIntersection, ZodIssue, ZodIssueCode, ZodJSONSchema, ZodJSONSchemaInternals, ZodJWT, ZodKSUID, ZodLazy, ZodLiteral, ZodMap, ZodNaN, ZodNanoID, ZodNever, ZodNonOptional, ZodNull, ZodNullable, ZodNumber, ZodNumberFormat, ZodObject, ZodOptional, ZodPipe, ZodPrefault, ZodPromise, ZodRawShape, ZodReadonly, ZodRealError, ZodRecord, ZodSafeParseError, ZodSafeParseResult, ZodSafeParseSuccess, ZodSet, ZodString, ZodStringFormat, ZodSuccess, ZodSymbol, ZodTemplateLiteral, ZodTransform, ZodTuple, ZodType, ZodType as Schema, ZodType as ZodSchema, ZodType as ZodTypeAny, ZodUInt32, ZodULID, ZodURL, ZodUUID, ZodUndefined, ZodUnion, ZodUnknown, ZodVoid, ZodXID, _ZodBigInt, _ZodBoolean, _ZodDate, _ZodNumber, _ZodString, _ZodType, _catch$1 as catch, _default$48 as _default, _endsWith as endsWith, _enum$1 as enum, _function, _function as function, _gt as gt, _gte as gte, _includes as includes, _instanceof as instanceof, _length as length, _lowercase as lowercase, _lt as lt, _lte as lte, _maxLength as maxLength, _maxSize as maxSize, _mime as mime, _minLength as minLength, _minSize as minSize, _multipleOf as multipleOf, _negative as negative, _nonnegative as nonnegative, _nonpositive as nonpositive, _normalize as normalize, _null$2 as null, _overwrite as overwrite, _positive as positive, _property as property, _regex as regex, _size as size, _startsWith as startsWith, _toLowerCase as toLowerCase, _toUpperCase as toUpperCase, _trim as trim, _undefined$2 as undefined, _uppercase as uppercase, _void$1 as void, any, array, base64$1 as base64, base64url$1 as base64url, bigint$1 as bigint, boolean$1 as boolean, check, cidrv4$1 as cidrv4, cidrv6$1 as cidrv6, clone, codec, coerce, config, core, cuid$1 as cuid, cuid2$1 as cuid2, custom, date$1 as date, decode$1 as decode, decodeAsync$1 as decodeAsync, discriminatedUnion, e164$1 as e164, email$1 as email, emoji$1 as emoji, encode$1 as encode, encodeAsync$1 as encodeAsync, file, flattenError, float32, float64, formatError, getErrorMap, globalRegistry, guid$1 as guid, hash, hex$1 as hex, hostname$1 as hostname, httpUrl, inferFlattenedErrors, inferFormattedError, input, int, int32, int64, intersection, ipv4$1 as ipv4, ipv6$1 as ipv6, iso, json, jwt, keyof, ksuid$1 as ksuid, lazy, literal, locales, looseObject, map, nan, nanoid$1 as nanoid, nativeEnum, never, nonoptional, nullable, nullish$1 as nullish, number$1 as number, object, optional, output, output as Infer, output as TypeOf, output as infer, parse$1 as parse, parseAsync$1 as parseAsync, partialRecord, pipe, prefault, preprocess, prettifyError, promise, readonly, record, refine, regexes, registry, safeDecode$1 as safeDecode, safeDecodeAsync$1 as safeDecodeAsync, safeEncode$1 as safeEncode, safeEncodeAsync$1 as safeEncodeAsync, safeParse$1 as safeParse, safeParseAsync$1 as safeParseAsync, set, setErrorMap, strictObject, string$1 as string, stringFormat, stringbool, success, superRefine, symbol, templateLiteral, toJSONSchema, transform, treeifyError, tuple, uint32, uint64, ulid$1 as ulid, union, unknown, url, util, uuid$1 as uuid, uuidv4, uuidv6, uuidv7, xid$1 as xid };
}

export {
	Camera$3 as Camera,
	Feature$1 as Feature,
	FeatureCollection$1 as FeatureCollection,
	GeoJSON$1 as GeoJSON,
	Geometry$1 as Geometry,
	LocationState,
	MultiPolygon$1 as MultiPolygon,
	Node$1 as Node,
	OperationHours,
	Point$1 as Point,
	Polygon$1 as Polygon,
	SiblingGroup,
	Style$2 as Style,
	TImage3DState as TImageState,
	TImage3DUpdateState as TImageUpdateState,
	TMVF,
	TMVFLineStringStyle,
	TMVFPointStyle,
	TMVFPolygonStyle,
	TMVFStyle,
	TMVFStyleCollection,
	parseMVFv2 as parseMVF,
	unzipMVFv2 as unzipMVF,
};

export {};

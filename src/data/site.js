export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  {
    label: 'Products & Services',
    to: '/products',
    children: [
      { label: 'GeoSet AI', to: '/geoset-ai', blurb: 'Fixtureless assembly and adaptive tooling driven by priority-based math' },
      { label: 'GeoFit AI', to: '/products#geofit', blurb: 'Closures and robotics for optimal movement and position' },
      { label: 'GeoInspect AI', to: '/products#geoinspect', blurb: 'Defect detection, visual identification and processing' },
      { label: 'GeoPredict AI', to: '/products#geopredict', blurb: 'Real-time failure prediction, trending' },
      { label: 'Engineering Services', to: '/products#engineering', blurb: 'Advisory services, Smart Factory assessments, specification and validation' },
    ],
  },
  { label: 'Contact', to: '/contact' },
]

export const BENEFITS = [
  { icon: '/assets/icon-cog-orange.png', title: 'No fixtures with a high degree of flexibility', short: 'Fixtureless', glyph: 'cog' },
  { icon: '/assets/icon-worker-orange.png', title: 'Significant reduction in skilled labor', short: 'Less skilled labor', glyph: 'worker' },
  { icon: '/assets/icon-timer-orange.png', title: 'Reduction in set-up time', short: 'Faster set-up', glyph: 'timer' },
  { icon: '/assets/icon-chart-orange.png', title: 'Measurable quality improvement', short: 'Better quality', glyph: 'chart' },
  { icon: '/assets/icon-graph-orange.png', title: 'Big reduction in capital expenditures and operating costs', short: 'Lower CapEx & OpEx', glyph: 'graph' },
]

export const STEPS = [
  { n: '01', title: 'Scan critical datums', body: 'A 3D vision system inspects the incoming parts in place and captures the datums that actually define the assembly — no jig, no teach pendant, no assumption that the part arrived perfect.' },
  { n: '02', title: 'Proprietary AI analyzes sensor data and instructs robot what to do', body: 'Priority-based intelligent math algorithms weigh every critical dimension against the as-found geometry and compute a robot solution in real time.' },
  { n: '03', title: 'Optimizes positions to the critical datums', body: 'The robots move the components to the computed position and hold them there, so the critical dimensions are achieved on the assembly rather than on the tooling.' },
]

export const VIDEOS = [
  {
    id: 'lcwEN9fgieQ',
    kind: 'youtube',
    title: 'Tailgate Decking with AI',
    tag: 'Automotive',
    specimen: 'tailgate',
    note: 'A closure decked into the rear body opening, gap and flush driven to nominal.',
  },
  {
    id: '7Y2G0jbyx1Y',
    kind: 'youtube',
    title: 'AI Assembly with Welding',
    tag: 'Welding',
    specimen: 'weld',
    note: 'Two lapped panels held in free space while the spot schedule runs down the seam.',
  },
  {
    id: 'o9ebMGh5KQE',
    kind: 'youtube',
    title: 'Rib & Skin Assembly',
    tag: 'Aerospace',
    specimen: 'airframe',
    note: 'Formers and stringers located, skin offered up and pinned without a hard jig.',
  },
  {
    id: 'KeZsRgBLiqU',
    kind: 'youtube',
    title: 'AI Assembly Example for Part Insertion',
    tag: 'Assembly',
    specimen: 'insertion',
    note: 'Clearance you can see: the solver lands the part in the bore on the first try.',
  },
  {
    id: 'N_LWShXD7Pw',
    kind: 'youtube',
    title: 'Bin Picking & Precision Geo-locating',
    tag: 'Material handling',
    specimen: 'binpick',
    note: 'Unsorted tote, pose solved per part, picked and geo-located in one motion.',
  },
]

export const OVERVIEW_VIDEO = { id: '576870197', kind: 'vimeo', title: 'ProcessChamp technology overview' }

export const PRODUCTS = [
  {
    id: 'geoset',
    name: 'GeoSet AI',
    tagline: 'Fixtureless manufacturing and adaptive tooling',
    blurb:
      'Patent-pending priority-based intelligent math algorithms, supported by integrated systems and hardware for smart fixture tooling and robotic guidance. A 3D vision system inspects incoming parts, then computes a robot solution that assembles components to achieve critical dimensions.',
    to: '/geoset-ai',
    glyph: 'geoset',
  },
  {
    id: 'geofit',
    name: 'GeoFit AI',
    tagline: 'Closures and robotics for optimal movement and position',
    blurb:
      'Positional alignment for closures and moving assemblies — doors, hoods, decklids and panels — driven to their best-fit position against the surrounding body rather than a nominal that ignores build variation.',
    glyph: 'geofit',
  },
  {
    id: 'geoinspect',
    name: 'GeoInspect AI',
    tagline: 'Defect detection, visual identification and processing',
    blurb:
      'Autonomous inspection and quality reporting. Vision models identify defects and features in-line, classify them, and push the result straight into the quality record instead of a clipboard.',
    glyph: 'geoinspect',
  },
  {
    id: 'geopredict',
    name: 'GeoPredict AI',
    tagline: 'Real-time failure prediction, trending',
    blurb:
      'Predictive failure analysis across the cell. Live sensor trending surfaces drift before it becomes downtime, and feeds digital twin process optimization.',
    glyph: 'geopredict',
  },
  {
    id: 'engineering',
    name: 'Engineering Services',
    tagline: 'Advisory, assessment and validation',
    blurb:
      'Manufacturing advisory services, Smart Factory assessments, application selection and analysis, specification development, application testing and validation.',
    glyph: 'engineering',
  },
]

export const CONTACT = {
  email: 'admin@processchamp.com',
  phone: '614-778-7035',
  phoneHref: 'tel:614-778-7035',
}

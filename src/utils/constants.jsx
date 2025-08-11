export const scannerParts = [
  {
    id: 1,
    name: 'Touchscreen Interface',
    description: 'The intuitive touchscreen allows clinicians to instantly access special features such as reporting & annotation tools during surgery.',
    features: [
      'High-resolution display',
      'User-friendly interface',
      'Instant access to imaging controls',
      'Annotation and reporting tools'
    ],
    image: '/assets/images/scanner-closeup.jpg',
    position: { x: 55, y: 25 },
    labelPosition: { x: 60, y: -20 }, // label positioned slightly to the right
    labelLeft: false  // Label aligned to the right side
  },
  {
    id: 2,
    name: 'Imaging Window',
    description: 'Large 17cm² imaging window enables comprehensive specimen assessment with a single scan.',
    features: [
      '17cm² large field of view',
      'High-resolution imaging',
      'Non-destructive scanning',
      'Compatible with fresh tissue'
    ],
    image: '/assets/images/scanner-front.jpg',
    position: { x: 51, y: 39 },
    labelPosition: { x: 56, y: -20 }, // label positioned to the right of hotspot
    labelLeft: false
  },
  {
    id: 3,
    name: 'Optical System',
    description: 'Ultra-fast confocal microscopy technology provides real-time morphology information during surgery.',
    features: [
      'Confocal laser scanning microscopy',
      'Large field-of-view (4.8cm x 3.6cm)',
      '50s imaging time per surface',
      'Digital images for remote assessment'
    ],
    image: '/assets/images/scanner-angled.jpg',
    position: { x: 48, y: 40 },
    labelPosition: { x: -80, y: -20 }, // label positioned slightly left of hotspot
    labelLeft: true  // Label aligned to the left side
  }
];

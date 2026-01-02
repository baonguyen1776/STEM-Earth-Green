# 🌍 TRÁI ĐẤT XANH – HAI TƯƠNG LAI

> Dự án Website STEM tương tác 3D minh họa tác động môi trường

---

## 📑 Mục lục

- [Tổng quan](#tổng-quan)
- [Demo & Screenshots](#demo--screenshots)
- [Tính năng chính](#tính-năng-chính)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Kiến trúc dự án](#kiến-trúc-dự-án)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Cài đặt](#cài-đặt)
- [Sử dụng](#sử-dụng)
- [Phát triển](#phát-triển)
- [Roadmap](#roadmap)
- [Đóng góp](#đóng-góp)
- [License](#license)

---

## 🎯 Tổng quan

### Giới thiệu

**Trái Đất Xanh** là một ứng dụng web tương tác 3D được xây dựng nhằm mục đích giáo dục môi trường. Dự án cho phép người dùng trực quan hóa tác động của ô nhiễm lên hành tinh thông qua việc điều khiển các thông số thời gian thực.

### Mục tiêu

- **Giáo dục trực quan**: Thay thế slide tĩnh bằng trải nghiệm tương tác 3D
- **Nâng cao nhận thức**: Minh họa hậu quả của ô nhiễm môi trường
- **Dễ tiếp cận**: Chạy trực tiếp trên trình duyệt, không cần cài đặt
- **Khoa học**: Áp dụng nguyên lý STEM trong giáo dục

### Đối tượng sử dụng

- Học sinh, sinh viên (độ tuổi 10+)
- Giáo viên môn Khoa học, Địa lý
- Dự án STEM

---

## 🖼️ Demo & Screenshots

### Live Demo
**URL**: [https://baonguyen1776.github.io/STEM-Earth-Green/](https://baonguyen1776.github.io/STEM-Earth-Green/)

### Video Demo
[Link video YouTube]

### Screenshots

```
[Intro Screen]     [Earth Clean]      [Earth Polluted]     [Controls UI]
```

---

## ✨ Tính năng chính

### 1. Intro Animation (Trải nghiệm mở đầu)

**Camera Sequence**
- Camera bay từ xa (z=50) vào Trái Đất (z=15) trong 3 giây
- Smooth easing với GSAP power2.inOut
- Click anywhere để skip intro

**Visual Effects**
- Starfield background với 5000+ particles ngẫu nhiên
- Title screen "Trái Đất Xanh - Hai Tương Lai" với glow effect
- Fade in/out transitions mượt mà

**User Control**
- Auto-hide UI controls trong lúc intro
- Smooth transition sang chế độ tương tác
- One-time experience per session

---

### 2. Trái Đất 3D Tương tác

**3D Model**
- Sphere geometry với 64x64 segments cho độ mịn cao
- PBR Material (Physically Based Rendering)
- Tự động rotation với tốc độ cấu hình được

**Camera Controls**
- Orbit Controls: Xoay 360° bằng chuột/touch
- Zoom: Scroll để zoom in/out (8-30 units)
- Damping: Chuyển động mượt, realistic

**Lighting System**
- Ambient Light: Ánh sáng môi trường 60%
- Directional Light: Ánh sáng chính 80% từ góc (10,10,5)
- Back Light: Ánh sáng phụ 30% để tạo chiều sâu

---

### 3. Hệ thống ô nhiễm động

**Pollution Levels** (4 mức độ)

| Level | Range | Màu sắc | Mô tả |
|-------|-------|---------|-------|
| **Clean** | 0-20 | Xanh dương sáng (#1e90ff) | Trái Đất trong lành, không khí sạch |
| **Light** | 21-50 | Xanh xám | Bắt đầu xuất hiện ô nhiễm nhẹ |
| **Moderate** | 51-80 | Xám tối | Ô nhiễm trung bình, cần hành động |
| **Severe** | 81-100 | Xám đen (#4a4a4a) | Ô nhiễm nghiêm trọng, nguy hiểm |

**Color Transition**
- Linear interpolation (lerp) giữa clean và polluted color
- Real-time update khi kéo slider
- Smooth color blending

---

### 4. Hiệu ứng Visual

**Starfield (Nền sao)**
- 5000 particles với BufferGeometry cho performance
- Random position trong không gian 200x200x200
- Tự động quay chậm (0.0002 rad/frame)
- Opacity 80% để không át Trái Đất

**Smoke System** (Khói ô nhiễm)
- Particle system với Three.js Points
- Xuất hiện khi pollution > 50%
- Tăng dần mật độ theo pollution level
- Màu xám (#666666) với alpha blending

**Trash System** (Rác thải)
- Rác trên bề mặt Trái Đất: Small spheres
- Rác trên đại dương: Floating particles
- Số lượng tỷ lệ thuận với pollution level
- Random placement với seed-based distribution

---

### 5. UI/UX

**Pollution Slider**
- Range: 0-100
- Real-time value display
- Smooth drag interaction
- Semi-transparent dark background (rgba(0,0,0,0.7))

**Info Panel**
- Hiển thị pollution level hiện tại
- Mô tả text động theo level
- Hints/Tips về môi trường

**Responsive Design**
- Tương thích desktop, tablet, mobile
- Touch-friendly controls
- Adaptive UI sizing

---

## 🛠️ Công nghệ sử dụng

### Core Technologies

```json
{
  "runtime": "Browser (ES6+)",
  "language": "TypeScript 5.x",
  "bundler": "Vite 5.x"
}
```

### Libraries & Frameworks

| Library | Version | Mục đích |
|---------|---------|----------|
| **Three.js** | r128+ | 3D Rendering engine |
| **GSAP** | 3.x | Animation library |
| **@types/three** | Latest | TypeScript definitions |

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Vite** - Hot Module Replacement (HMR)

### Deployment

- **GitHub Pages** - Static hosting
- **Vercel/Netlify** - Alternative hosting options

---

## 🏗️ Kiến trúc dự án

### Nguyên tắc thiết kế

Dự án tuân theo **Clean Architecture** và **SOLID Principles**:

```
┌─────────────────────────────────────┐
│  UI Layer (Presentation)            │  ← HTML/CSS/DOM
├─────────────────────────────────────┤
│  Controllers (Application)          │  ← Điều phối logic
├─────────────────────────────────────┤
│  Use Cases (Business Logic)         │  ← Domain services
├─────────────────────────────────────┤
│  Domain Layer (Entities)            │  ← Core models
├─────────────────────────────────────┤
│  Infrastructure (Three.js, Utils)   │  ← Technical details
└─────────────────────────────────────┘

Dependency Rule: ↑ Layers bên trong KHÔNG biết layers bên ngoài
```

### Design Patterns

**1. Single Responsibility Principle (SRP)**
- Mỗi class chỉ có 1 lý do để thay đổi
- `Earth.ts` - Chỉ quản lý 3D mesh
- `EarthState.ts` - Chỉ quản lý state
- `PollutionController.ts` - Chỉ điều phối

**2. Dependency Injection**
- Constructor injection cho loose coupling
- Dễ test, dễ thay thế implementation

**3. Observer Pattern** (Implicit)
- UI → Controller → Domain → Infrastructure
- Event-driven updates

**4. Configuration Pattern**
- Centralized config files
- Single source of truth cho constants

---

## 📂 Cấu trúc thư mục

```
earth-green/
│
├── public/
│   └── favicon.svg
│
├── src/
│   │
│   ├── assets/                    # Tài nguyên tĩnh
│   │   ├── textures/
│   │   │   ├── earth-clean.jpg
│   │   │   └── earth-polluted.jpg
│   │   ├── models/
│   │   └── fonts/
│   │
│   ├── config/                    # Cấu hình toàn cục
│   │   ├── camera.ts              # Camera settings
│   │   ├── colors.ts              # Color palette
│   │   ├── earthConfig.ts         # Earth properties
│   │   └── pollutionThresholds.ts # Pollution ranges
│   │
│   ├── types/                     # TypeScript definitions
│   │   ├── Earth.types.ts
│   │   ├── Effects.types.ts
│   │   └── UI.types.ts
│   │
│   ├── core/                      # Hệ thống cốt lõi
│   │   ├── Renderer.ts            # WebGL renderer wrapper
│   │   ├── SceneManager.ts        # Scene + lights setup
│   │   ├── CameraManager.ts       # Camera + OrbitControls
│   │   └── PollutionController.ts # State coordinator
│   │
│   ├── domain/                    # Logic nghiệp vụ
│   │   ├── models/
│   │   │   ├── EarthState.ts      # Earth state management
│   │   │   └── PollutionLevel.ts  # Pollution logic
│   │   └── services/
│   │       └── PollutionCalculator.ts
│   │
│   ├── earth/                     # Trái Đất 3D
│   │   ├── Earth.ts               # Earth mesh + rotation
│   │   ├── EarthMaterial.ts       # Material + color lerp
│   │   └── EarthTextures.ts       # Texture loading
│   │
│   ├── effects/                   # Hiệu ứng phụ
│   │   ├── Starfield.ts           # Background stars
│   │   ├── SmokeSystem.ts         # Pollution smoke
│   │   └── TrashSystem.ts         # Trash particles
│   │
│   ├── controllers/               # Điều phối (có thể gộp vào core)
│   │   └── IntroController.ts     # Intro animation logic
│   │
│   ├── ui/                        # Giao diện người dùng
│   │   ├── PollutionSlider.ts     # Range slider control
│   │   ├── InfoPanel.ts           # Info display
│   │   └── IntroScreen.ts         # Title screen
│   │
│   ├── utils/                     # Hàm tiện ích
│   │   └── math/
│   │       ├── lerp.ts            # Linear interpolation
│   │       ├── clamp.ts           # Value clamping
│   │       ├── map.ts             # Range mapping
│   │       └── index.ts           # Barrel export
│   │
│   ├── main.ts                    # Entry point
│   └── vite-env.d.ts              # Vite types
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── README.md
```

### Giải thích cấu trúc

**`assets/`** - Tài nguyên tĩnh (textures, models, fonts)

**`config/`** - Tập trung tất cả constants, dễ thay đổi

**`types/`** - TypeScript type definitions, interfaces, enums

**`core/`** - Hạ tầng Three.js, không chứa business logic

**`domain/`** - Pure business logic, không phụ thuộc Three.js

**`earth/`** - Tất cả liên quan đến 3D model Trái Đất

**`effects/`** - Các hiệu ứng visual bổ sung

**`ui/`** - DOM manipulation, user input handling

**`utils/`** - Pure functions, reusable helpers

---

## 🚀 Cài đặt

### Yêu cầu hệ thống

- **Node.js**: >= 18.x
- **npm**: >= 9.x (hoặc yarn/pnpm)
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+

### Bước 1: Clone repository

```bash
git clone https://github.com/baonguyen1776/STEM-Earth-Green.git
cd earth-green
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Chạy development server

```bash
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

### Bước 4: Build production

```bash
npm run build
```

Output trong thư mục `dist/`

---

## 📖 Sử dụng

### Chạy dự án local

```bash
# Development mode với HMR
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Cấu hình

Chỉnh sửa các file trong `src/config/`:

```typescript
// src/config/earthConfig.ts
export const EARTH_CONFIG = {
  radius: 5,          // Thay đổi kích thước Trái Đất
  segments: 64,       // Tăng/giảm độ chi tiết
  rotationSpeed: 0.001 // Tốc độ xoay
}
```

### Thêm texture tùy chỉnh

1. Đặt file `.jpg` vào `src/assets/textures/`
2. Update `EarthTextures.ts`:

```typescript
const texture = loader.load('/assets/textures/your-texture.jpg')
```

---

## 👨‍💻 Phát triển

### Thêm feature mới

**Ví dụ: Thêm Forest Destruction Effect**

**Bước 1: Tạo file effect**

```typescript
// src/effects/ForestDestruction.ts
import * as THREE from 'three'

export class ForestDestruction {
  private trees: THREE.Group
  
  constructor() {
    this.trees = new THREE.Group()
    // Implementation...
  }
  
  update(deforestationLevel: number) {
    // Logic để giảm số cây
  }
  
  getGroup() {
    return this.trees
  }
}
```

**Bước 2: Thêm vào Controller**

```typescript
// src/core/PollutionController.ts
import { ForestDestruction } from '../effects/ForestDestruction'

export class PollutionController {
  constructor(
    private forest: ForestDestruction // Inject
  ) {}
  
  update(value: number) {
    this.forest.update(value)
  }
}
```

**Bước 3: Init trong Main**

```typescript
// src/main.ts
const forest = new ForestDestruction()
sceneManager.add(forest.getGroup())
```

### Code Style Guidelines

**Naming Conventions**
```typescript
// Classes: PascalCase
class EarthRenderer {}

// Functions/Variables: camelCase
const getPollutionLevel = () => {}

// Constants: UPPER_SNAKE_CASE
const EARTH_RADIUS = 5

// Private members: _prefix
class Earth {
  private _mesh: THREE.Mesh
}
```

**File Naming**
- Components/Classes: `PascalCase.ts` (e.g., `Earth.ts`)
- Utils: `camelCase.ts` (e.g., `lerp.ts`)
- Config: `camelCase.ts` (e.g., `earthConfig.ts`)

### Testing

```bash
# Chạy tests (cần setup)
npm run test

# Test coverage
npm run test:coverage
```

---

## 🗺️ Roadmap

### Phase 1: MVP ✅ (Đã hoàn thành)
- [x] Basic Earth 3D với rotation
- [x] Pollution slider
- [x] Color transition
- [x] Camera controls

### Phase 2: Visual Effects 🚧 (Đang làm)
- [x] Intro animation
- [x] Starfield background
- [ ] Smoke particles
- [ ] Trash particles on ocean
- [ ] Trash on land

### Phase 3: Advanced Features 📅 (Sắp tới)
- [ ] Multiple scenarios (deforestation, CO2, ocean pollution)
- [ ] Timeline slider (past → future)
- [ ] Compare mode (2 Earths side-by-side)
- [ ] Data visualization (charts, graphs)
- [ ] Sound effects & background music

### Phase 4: Education Mode 📅 (Tương lai)
- [ ] Quiz system
- [ ] Teacher dashboard
- [ ] Progress tracking
- [ ] Multiplayer mode
- [ ] AR/VR support

### Phase 5: Optimization & Polish 📅
- [ ] Performance optimization (60fps on mobile)
- [ ] PWA support (offline mode)
- [ ] Multi-language support (VI, EN, CN)
- [ ] Accessibility (WCAG 2.1 AA)

---

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp!

### Cách đóng góp

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

### Coding Guidelines

- Tuân theo TypeScript strict mode
- Viết JSDoc cho public methods
- Test trước khi commit
- Follow existing code style

### Bug Reports

Tạo issue với template:

```markdown
**Mô tả bug:**
[Mô tả chi tiết]

**Các bước tái hiện:**
1. Bước 1
2. Bước 2

**Kết quả mong đợi:**
[Nên hiển thị gì]

**Kết quả thực tế:**
[Đang hiển thị gì]

**Screenshots:**
[Nếu có]

**Môi trường:**
- Browser: Chrome 120
- OS: Windows 11
- Node: 18.x
```

---

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

## 👥 Team

# Đây là món quà dành cho *Thuý Tiên* không mang bất kì 1 giá trị thương mại nào

**Developer:** Bảo
**Email:** baogiaphuongnguyen1234@gmail.com  
**GitHub:** [@baonguyen1776](https://github.com/baonguyen1776)

---

## 🙏 Acknowledgments

- **Three.js** - Amazing 3D library
- **GSAP** - Smooth animations
- **NASA** - Earth texture references
- **Clean Architecture** - Robert C. Martin
- **Inspiration** - [Link video gốc]

---

## 📞 Liên hệ

- **Email**: baogiaphuongnguyen1234@gmail.com
- **GitHub Issues**: [Link]
- **Discussion**: [Link]

---

## 🌟 Showcase

Nếu bạn sử dụng dự án này, hãy cho chúng tôi biết!

- Thêm dự án của bạn vào [SHOWCASE.md](SHOWCASE.md)
- Tag `#TraiDatXanh` trên social media

---

**⭐ Nếu dự án hữu ích, đừng quên cho 1 star!**

---

_Last updated: December 2025_
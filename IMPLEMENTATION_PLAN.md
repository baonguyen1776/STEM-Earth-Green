# 🌍 IMPLEMENTATION PLAN — STEM Earth Green

> Kế hoạch triển khai 3D Earth Visualization với Clean Architecture

---

## 📋 Tổng quan

**Mục tiêu:** Xây dựng hệ thống 3D Earth tương tác — từ Core (Scene, Renderer, Camera) → Earth (Mesh, Material, Clouds, Atmosphere) → Effects (Starfield, Smoke, Trash) → UI (Slider, Intro) → Main entry point.

**Trạng thái hiện tại:** Project đã có sẵn config, types và utils; cần triển khai các module còn trống.

---

## 📦 Dependencies hiện có

| Package | Version | Mục đích |
|---------|---------|----------|
| **three** | ^0.182.0 | 3D graphics library |
| **@types/three** | ^0.182.0 | TypeScript types cho Three.js |
| **gsap** | ^3.14.2 | Animation library |
| **react** | ^19.2.3 | UI framework (đã cài nhưng chưa dùng) |
| **typescript** | ~5.9.3 | Type checking |
| **vite** | ^7.2.4 | Build tool |

---

## ✅ Đã hoàn thành

| Module | Files | Trạng thái |
|--------|-------|------------|
| **Config** | `camera.ts`, `colors.ts`, `earthConfig.ts`, `pollutionThresholds.ts` | ✅ Hoàn chỉnh |
| **Types** | `Earth.types.ts`, `Effect.types.ts`, `UI.types.ts` | ✅ Hoàn chỉnh |
| **Utils/Math** | `lerp.ts`, `clamp.ts`, `map.ts`, `vector.ts`, `index.ts` | ✅ Hoàn chỉnh |
| **Assets/Textures** | `2k_earth_daymap.jpg`, `2k_earth_nightmap.jpg`, `2k_earth_clouds.jpg`, `2k_earth_normal_map.tif`, `2k_earth_specular_map.tif` | ✅ Có sẵn |

---

## 🚧 Cần triển khai

### Phase 1: Core Infrastructure

| File | Mô tả | Priority |
|------|-------|----------|
| `src/core/Renderer.ts` | WebGL Renderer wrapper, resize handling, pixel ratio | 🔴 High |
| `src/core/SceneManager.ts` | Scene setup, Ambient + Directional + Back Light | 🔴 High |
| `src/core/CameraManager.ts` | PerspectiveCamera, OrbitControls với damping | 🔴 High |
| `src/core/AnimationLoop.ts` | requestAnimationFrame loop, delta time | 🔴 High |
| `src/core/index.ts` | Barrel export | 🔴 High |

### Phase 2: Domain Layer

| File | Mô tả | Priority |
|------|-------|----------|
| `src/domain/models/pollutionLevel.ts` | PollutionLevel class/interface, state management | 🔴 High |
| `src/domain/services/PollutionService.ts` | Business logic tính toán visual effects theo pollution | 🔴 High |
| `src/domain/services/index.ts` | Barrel export | 🟡 Medium |

### Phase 3: Earth Module

| File | Mô tả | Priority |
|------|-------|----------|
| `src/earth/EarthTextures.ts` | TextureLoader, load Day/Night/Clouds/Normal/Specular maps | 🔴 High |
| `src/earth/EarthMaterial.ts` | PBR Material, lerp màu sắc theo pollution, night lights intensity | 🔴 High |
| `src/earth/CloudLayer.ts` | Cloud sphere mesh, opacity theo pollution | 🟡 Medium |
| `src/earth/Atmosphere.ts` | Glow effect, Fresnel shader | 🟡 Medium |
| `src/earth/Earth.ts` | Main Earth class, quản lý mesh + rotation + update | 🔴 High |
| `src/earth/index.ts` | Barrel export | 🔴 High |

### Phase 4: Effects System

| File | Mô tả | Priority |
|------|-------|----------|
| `src/effects/Starfield.ts` | 5000+ particles BufferGeometry, slow rotation | 🟡 Medium |
| `src/effects/SmokeSystem.ts` | Particle Points, xuất hiện khi pollution > 50% | 🟡 Medium |
| `src/effects/TrashSystem.ts` | Small objects trên mặt nước/đất liền, tỷ lệ với pollution | 🟡 Medium |
| `src/effects/index.ts` | Barrel export | 🟡 Medium |

### Phase 5: UI Layer

| File | Mô tả | Priority |
|------|-------|----------|
| `src/ui/PollutionSlider.ts` | DOM slider 0-100, real-time value display | 🔴 High |
| `src/ui/InfoPanel.ts` | Hiển thị pollution level, mô tả text động | 🟡 Medium |
| `src/ui/IntroScreen.ts` | Title screen, fade in/out với GSAP | 🟡 Medium |
| `src/ui/IntroController.ts` | Camera animation z=50 → z=15 trong 3s (power2.inOut) | 🟡 Medium |
| `src/ui/index.ts` | Barrel export | 🟡 Medium |

### Phase 6: Main Entry Point

| File | Mô tả | Priority |
|------|-------|----------|
| `src/main.ts` | Khởi tạo toàn bộ hệ thống, kết nối UI ↔ Controller, chạy loop | 🔴 High |

---

## 📐 Kiến trúc

```
┌─────────────────────────────────────┐
│  UI Layer (Slider, Panel, Intro)    │  ← DOM Events
├─────────────────────────────────────┤
│  Controllers (IntroController)      │  ← Điều phối
├─────────────────────────────────────┤
│  Domain (PollutionService)          │  ← Business Logic
├─────────────────────────────────────┤
│  Earth + Effects                    │  ← 3D Visualization
├─────────────────────────────────────┤
│  Core (Scene, Renderer, Camera)     │  ← Three.js Infrastructure
└─────────────────────────────────────┘
```

**Dependency Rule:** Layers bên trong KHÔNG biết layers bên ngoài.

---

## 🎨 Pollution Levels

| Level | Range | Màu sắc | Visual Effects |
|-------|-------|---------|----------------|
| **CLEAN** | 0-20 | Xanh dương (#1e90ff) | Bầu trời trong xanh, không khói/rác |
| **LIGHT** | 21-50 | Xanh xám | Bắt đầu xuất hiện ô nhiễm nhẹ |
| **MODERATE** | 51-80 | Xám tối | Smoke system bắt đầu, mây mù nhẹ |
| **SEVERE** | 81-100 | Xám đen (#4a4a4a) | Khói dày, rác dày đặc, mây mù nặng |

---

## ⚠️ Lưu ý kỹ thuật

### 1. Texture Format
- **Vấn đề:** `normal_map.tif` và `specular_map.tif` không hỗ trợ native trong Three.js
- **Giải pháp:** Convert sang `.jpg`/`.png` hoặc dùng `TIFFLoader`

### 2. React vs DOM thuần
- **Hiện tại:** React đã install nhưng chưa dùng
- **Đề xuất:** Giữ DOM thuần cho UI slider/panel (nhẹ hơn, ít overhead)

### 3. PollutionController placement
- **README gợi ý:** `src/core/`
- **Clean Architecture:** `src/domain/services/`
- **Quyết định:** Đặt trong `src/domain/services/` theo Clean Architecture

---

## 📝 Thứ tự triển khai

```
1. src/core/Renderer.ts
2. src/core/SceneManager.ts
3. src/core/CameraManager.ts
4. src/core/AnimationLoop.ts
5. src/core/index.ts
   ↓
6. src/domain/models/pollutionLevel.ts
7. src/domain/services/PollutionService.ts
   ↓
8. src/earth/EarthTextures.ts
9. src/earth/EarthMaterial.ts
10. src/earth/CloudLayer.ts
11. src/earth/Atmosphere.ts
12. src/earth/Earth.ts
13. src/earth/index.ts
   ↓
14. src/effects/Starfield.ts
15. src/effects/SmokeSystem.ts
16. src/effects/TrashSystem.ts
17. src/effects/index.ts
   ↓
18. src/ui/PollutionSlider.ts
19. src/ui/InfoPanel.ts
20. src/ui/IntroScreen.ts
21. src/ui/IntroController.ts
22. src/ui/index.ts
   ↓
23. src/main.ts (cập nhật)
```

---

## 🔗 Tham khảo

- [Three.js Documentation](https://threejs.org/docs/)
- [GSAP Documentation](https://gsap.com/docs/)
- [SolarSystemScope Textures](https://www.solarsystemscope.com/textures/)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

_Last updated: January 2, 2026_

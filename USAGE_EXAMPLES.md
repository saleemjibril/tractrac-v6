# Image Component Usage Examples

## 🎯 **Basic Usage**

### Chakra UI Image (Default)
```typescript
import Image from "./components/Image";

<Image
  src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446531/tractor_q5dtvz.jpg"
  alt="Tractor image"
  width={400}
  height={300}
  objectFit="cover"
/>
```

### Next.js Image with layout="fill"
```typescript
<Image
  src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446531/tractor_q5dtvz.jpg"
  alt="Tractor image"
  layout="fill"
  objectFit="cover"
  priority={true}
/>
```

### Explicit Next.js Image
```typescript
<Image
  src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446531/tractor_q5dtvz.jpg"
  alt="Tractor image"
  width={400}
  height={300}
  useNextImage={true}
  objectFit="cover"
  priority={true}
/>
```

## 🚀 **Advanced Usage**

### Responsive Images
```typescript
<Image
  src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446531/tractor_q5dtvz.jpg"
  alt="Tractor image"
  width={{ base: 300, md: 600, lg: 800 }}
  height={{ base: 200, md: 400, lg: 600 }}
  objectFit="contain"
/>
```

### Custom Cloudinary Transformations
```typescript
<Image
  src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446531/tractor_q5dtvz.jpg"
  alt="Tractor image"
  width={800}
  height={600}
  crop="fill"
  transformations="g_auto" // Auto gravity
  objectFit="cover"
/>
```

### Background Images with Fill Layout
```typescript
<Box position="relative" width="100%" height="400px">
  <Image
    src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446531/hero_banner_jh5hui.jpg"
    alt="Hero banner"
    layout="fill"
    objectFit="cover"
    priority={true}
  />
  <Text position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" color="white">
    Hero Content
  </Text>
</Box>
```

### Disable Optimization for Specific Images
```typescript
<Image
  src="https://example.com/non-cloudinary-image.jpg"
  alt="Non-cloudinary image"
  width={400}
  height={300}
  disableOptimization={true}
/>
```

## 🔧 **Migration from Existing Code**

### Before (Chakra UI Image)
```typescript
import { Image } from "@chakra-ui/react";

<Image
  src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446531/tractor_q5dtvz.jpg"
  alt="Tractor image"
  width={400}
  height={300}
  objectFit="cover"
/>
```

### After (Optimized Image)
```typescript
import Image from "./components/Image";

<Image
  src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446531/tractor_q5dtvz.jpg"
  alt="Tractor image"
  width={400}
  height={300}
  objectFit="cover"
/>
```

## 📋 **Available Props**

### Common Props
- `src` - Image source URL
- `alt` - Alt text for accessibility
- `width` - Image width (number, string, or responsive object)
- `height` - Image height (number, string, or responsive object)
- `objectFit` - How the image fits in its container
- `disableOptimization` - Disable Cloudinary optimization

### Cloudinary Optimization Props
- `crop` - Crop mode: 'limit', 'fill', 'fit', 'scale', 'crop', 'thumb', 'pad'
- `transformations` - Additional Cloudinary transformations

### Next.js Image Props (when useNextImage=true or layout="fill")
- `layout` - Layout mode: 'fill', 'fixed', 'intrinsic', 'responsive'
- `priority` - Load image with high priority
- `loading` - Loading behavior: 'lazy', 'eager'
- `placeholder` - Placeholder type: 'blur', 'empty'
- `blurDataURL` - Blur placeholder data URL
- `quality` - Image quality (1-100)
- `sizes` - Responsive sizes string
- `unoptimized` - Disable Next.js optimization

### Toggle Props
- `useNextImage` - Force use of Next.js Image component

## 🎨 **Styling Integration**

The component works seamlessly with Chakra UI styling:

```typescript
<Image
  src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446531/tractor_q5dtvz.jpg"
  alt="Tractor image"
  width={400}
  height={300}
  objectFit="cover"
  borderRadius="lg"
  boxShadow="xl"
  transition="transform 0.3s"
  _hover={{ transform: "scale(1.05)" }}
/>
```

## 🔍 **Verification**

To verify optimization is working:

1. Open browser dev tools
2. Go to Network tab
3. Look for Cloudinary URLs with optimization parameters:
   - `f_auto` - Automatic format
   - `q_auto` - Automatic quality
   - `w_XXX` - Width constraint
   - `c_limit` - Crop mode

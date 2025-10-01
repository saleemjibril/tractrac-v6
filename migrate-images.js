#!/usr/bin/env node

/**
 * Migration script to update Image imports across the web-v6 project
 * This script will update files to use the optimized Image component
 */

const fs = require('fs');
const path = require('path');

// Files that need to be updated (based on the grep results)
const filesToUpdate = [
  'app/components/blogCarousel.tsx',
  'app/components/blogInner.tsx',
  'app/home/hire-tractor/page.tsx',
  'app/dashboard/tractor/page.tsx',
  'app/components/careersInner.tsx',
  'app/home/hire-tools/page.tsx',
  'app/components/signupInner.tsx',
  'app/components/sidebar.tsx',
  'app/components/navbar.tsx',
  'app/home/hire-tractor/[id]/page.tsx',
  'app/components/loginInner.tsx',
  'app/home/enlist-tractor/page.tsx',
  'app/components/AdminSidenav.tsx',
  'app/payment/tracker-payment/page.tsx',
  'app/components/Sidenav.tsx',
  'app/payment/tracker-payment/pay/page.tsx',
  'app/components/TractorCard.tsx',
  'app/dashboard/enlisted-tractors/page.tsx',
  'app/recover-password/page.tsx',
  'app/components/singleBlogPostInner.tsx',
  'app/dashboard/land-processed/page.tsx',
  'app/dashboard/serviced-hour/page.tsx',
  'app/dashboard/demand-generated/page.tsx',
  'app/dashboard/investment/page.tsx',
  'app/dashboard/revenue-generated/page.tsx',
  'app/admin/verification/page.tsx',
  'app/admin/assign/page.tsx',
  'app/payment/tracker-payment/failed/page.tsx',
  'app/payment/tracker-payment/success/page.tsx',
  'app/admin/payment/tractor/page.tsx',
  'app/admin/assign/tractor/page.tsx',
  'app/admin/verification/tractor/page.tsx',
  'app/admin/users/page.tsx',
  'app/dashboard/page.tsx',
  'app/dashboard/hired-tools/page.tsx',
  'app/payment/tools/page.tsx',
  'app/payment/page.tsx',
  'app/dashboard/hired-tractors/page.tsx',
  'app/dashboard/agent/page.tsx',
  'app/admin/payment/page.tsx',
  'app/admin/farmers/page.tsx',
  'app/payment/success/page.tsx',
  'app/home/enlist-tool/page.tsx',
  'app/components/getMobileAppComponent.tsx',
  'app/components/header.tsx',
  'app/payment/tools/failed/page.tsx',
  'app/payment/tools/success/page.tsx',
  'app/payment/tools/pay/page.tsx',
  'app/special-programs/women-in-mech/page.tsx',
  'app/special-programs/tractor-onboarding/page.tsx',
  'app/special-programs/page.tsx',
  'app/special-programs/issam/page.tsx',
  'app/special-programs/collaborate/page.tsx',
  'app/payment/pay/page.tsx',
  'app/payment/failed/page.tsx',
  'app/home/track-tractor/page.tsx',
  'app/home/register-as-vendor/page.tsx',
  'app/home/payments/pay/page.tsx',
  'app/home/payments/page.tsx',
  'app/home/payment/page.tsx',
  'app/home/page.tsx',
  'app/home/invest-in-tractor/page.tsx',
  'app/home/enlist-as-op-mech/page.tsx',
  'app/home/agent/page.tsx',
  'app/dashboard/demand-fulfilled/page.tsx',
  'app/components/preLoader.tsx',
  'app/components/outPartnersComponent.tsx',
  'app/components/howItWorks.tsx',
  'app/components/faq.tsx',
  'app/components/LoginRequiredModal.tsx',
  'app/admin/login/page.tsx',
  'app/admin/entries/women-in-mech.tsx',
  'app/admin/entries/vendors.tsx',
  'app/admin/entries/operator.tsx',
  'app/admin/entries/investments.tsx',
  'app/admin/entries/contact.tsx',
  'app/admin/entries/collaborate.tsx',
  'app/admin/entries/agents.tsx',
  'app/admin/dashboard/page.tsx'
];

function updateFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let updated = false;
  let hasImageImport = false;

  // Check if file imports Image from @chakra-ui/react
  if (content.includes('Image') && content.includes('@chakra-ui/react')) {
    hasImageImport = true;
    
    // Pattern 1: Image is in a multi-import statement
    const multiImportRegex = /import\s*{\s*([^}]*Image[^}]*)\s*}\s*from\s*["']@chakra-ui\/react["']/;
    const multiMatch = content.match(multiImportRegex);
    
    if (multiMatch) {
      // Remove Image from the import and clean up commas
      let imports = multiMatch[1]
        .split(',')
        .map(imp => imp.trim())
        .filter(imp => imp !== 'Image' && imp !== '');
      
      if (imports.length > 0) {
        // Format the remaining imports nicely
        const formattedImports = imports.map(imp => `  ${imp}`).join(',\n');
        const newImport = `import {\n${formattedImports}\n} from "@chakra-ui/react";`;
        content = content.replace(multiImportRegex, newImport);
      } else {
        // Remove the entire import if only Image was imported
        content = content.replace(multiImportRegex, '');
      }
      
      updated = true;
    }
  }

  // Add the optimized Image import if we found Image usage
  if (hasImageImport && !content.includes('import Image from')) {
    // Find the best place to add the import
    let insertPosition = 0;
    
    // Try to insert after the last @chakra-ui/react import
    const lastChakraImport = content.lastIndexOf('from "@chakra-ui/react"');
    if (lastChakraImport !== -1) {
      const endOfLine = content.indexOf('\n', lastChakraImport);
      insertPosition = endOfLine !== -1 ? endOfLine + 1 : content.length;
    } else {
      // Insert after the first import statement
      const firstImportEnd = content.indexOf('\n', content.indexOf('import'));
      insertPosition = firstImportEnd !== -1 ? firstImportEnd + 1 : content.length;
    }
    
    const optimizedImport = 'import Image from "./Image";\n';
    content = content.slice(0, insertPosition) + optimizedImport + content.slice(insertPosition);
    updated = true;
  }

  if (updated) {
    try {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Updated: ${filePath}`);
      return true;
    } catch (error) {
      console.log(`❌ Error updating ${filePath}: ${error.message}`);
      return false;
    }
  } else if (hasImageImport) {
    console.log(`⚠️  Image import found but no changes made: ${filePath}`);
  } else {
    console.log(`⏭️  No Image import found: ${filePath}`);
  }
  
  return false;
}

// Main execution
console.log('🚀 Starting image optimization migration...\n');
console.log(`📁 Found ${filesToUpdate.length} files to process\n`);

let successCount = 0;
let errorCount = 0;

filesToUpdate.forEach(filePath => {
  const success = updateFile(filePath);
  if (success) {
    successCount++;
  } else if (filePath.includes('Image')) {
    errorCount++;
  }
});

console.log('\n📊 Migration Summary:');
console.log(`✅ Successfully updated: ${successCount} files`);
console.log(`❌ Errors: ${errorCount} files`);
console.log(`⏭️  Skipped: ${filesToUpdate.length - successCount - errorCount} files`);

console.log('\n📝 Next Steps:');
console.log('1. Review the updated files');
console.log('2. Test the application in development mode');
console.log('3. Check browser dev tools Network tab to verify optimized URLs');
console.log('4. Remove this migration script after successful testing');
console.log('\n💡 The optimized Image component will automatically apply Cloudinary optimization to all Cloudinary URLs.');
console.log('🔗 See IMAGE_OPTIMIZATION_GUIDE.md for detailed usage instructions.');
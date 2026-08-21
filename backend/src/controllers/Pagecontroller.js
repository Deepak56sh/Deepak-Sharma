const Page = require('../models/Page');

// IMPORTANT: Ye woh URLs hain jo aapke Next.js app mein pehle se static routes hain
// (jaise src/app/admin, src/app/login, src/app/cart, etc.)
// Inn naamo ka slug user ko custom page ke liye NAHI dena chahiye,
// warna confusion ho sakta hai (although Next.js static route ko hi priority dega,
// par behtar hai ke shuru mein hi block kar diya jaye).
const RESERVED_SLUGS = [
  'admin',
  'login',
  'signup',
  'register',
  'cart',
  'checkout',
  'api',
  'products',
  'product',
  'about',
  'contact',
  'account',
  'profile',
  'orders',
  'wishlist',
  'search',
];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // special chars hatao
    .replace(/\s+/g, '-') // spaces ko hyphen se replace
    .replace(/-+/g, '-'); // multiple hyphens ko ek karo
}

// ---------------- ADMIN: Get all pages (draft + active) ----------------
exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- ADMIN: Get single page by id (for edit screen) ----------------
exports.getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page nahi mila' });
    }
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- PUBLIC: Get single ACTIVE page by slug (live site ke liye) ----------------
exports.getPublicPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({
      slug: req.params.slug.toLowerCase(),
      status: 'active',
    });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page nahi mila ya abhi live nahi hai' });
    }
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- ADMIN: Create new page ----------------
exports.createPage = async (req, res) => {
  try {
    const { title, slug, template, sections, seo, status, showInMenu } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title zaroori hai' });
    }

    // agar slug diya nahi to title se auto-generate karo
    let finalSlug = slug && slug.trim() ? slugify(slug) : slugify(title);

    if (!finalSlug) {
      return res.status(400).json({ success: false, message: 'Valid slug/title do' });
    }

    if (RESERVED_SLUGS.includes(finalSlug)) {
      return res.status(400).json({
        success: false,
        message: `"${finalSlug}" reserved hai (already ek app route hai). Koi aur naam try karo.`,
      });
    }

    const existing = await Page.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Ye slug/URL pehle se use ho raha hai' });
    }

    const newPage = await Page.create({
      title: title.trim(),
      slug: finalSlug,
      template: template || 'custom',
      sections: sections || [],
      seo: seo || {},
      status: status === 'active' ? 'active' : 'draft',
      showInMenu: !!showInMenu,
    });

    res.status(201).json({ success: true, data: newPage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- ADMIN: Update existing page ----------------
exports.updatePage = async (req, res) => {
  try {
    const { title, slug, template, sections, seo, status, showInMenu } = req.body;
    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page nahi mila' });
    }

    if (slug && slug.trim()) {
      const finalSlug = slugify(slug);

      if (RESERVED_SLUGS.includes(finalSlug)) {
        return res.status(400).json({
          success: false,
          message: `"${finalSlug}" reserved hai. Koi aur naam try karo.`,
        });
      }

      if (finalSlug !== page.slug) {
        const existing = await Page.findOne({ slug: finalSlug, _id: { $ne: page._id } });
        if (existing) {
          return res.status(400).json({ success: false, message: 'Ye slug/URL pehle se use ho raha hai' });
        }
        page.slug = finalSlug;
      }
    }

    if (title !== undefined) page.title = title.trim();
    if (template !== undefined) page.template = template;
    if (sections !== undefined) page.sections = sections;
    if (seo !== undefined) page.seo = seo;
    if (status !== undefined) page.status = status;
    if (showInMenu !== undefined) page.showInMenu = showInMenu;

    await page.save();
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- ADMIN: Toggle status (Draft <-> Active) ----------------
exports.togglePageStatus = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page nahi mila' });
    }
    page.status = page.status === 'active' ? 'draft' : 'active';
    await page.save();
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- ADMIN: Delete page ----------------
exports.deletePage = async (req, res) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page nahi mila' });
    }
    res.status(200).json({ success: true, message: 'Page delete ho gaya' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
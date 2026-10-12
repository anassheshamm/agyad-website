import Service from "./service.model.js";
import ServiceMigration from "./service.migration.model.js";
import mongoose from "mongoose";
const LEGACY_SERVICES = [
  {
    title: "قسم التصميم الإبداعي",
    description: "هنا يبدأ كل شيء. فريقنا من المصممين المحترفين يحول الأفكار المجردة إلى لغة بصرية مؤثرة.",
    icon: "palette",
    items: ["تصميم الشعارات والهويات البصرية الكاملة.", "تصميم المطبوعات التجارية (بروفايلات، بروشورات، كروت).", "تصميمات السوشيال ميديا والحملات الإعلانية.", "تصميم العبوات والتغليف."],
  },
  {
    title: "خدمات الطباعة",
    description: "نحول التصاميم الرقمية إلى منتجات ملموسة بألوان تنبض بالحياة.",
    icon: "printer",
    items: ["الطباعة الرقمية للكميات السريعة والمحدودة.", "طباعة الأوفست للمطبوعات التجارية والكميات الكبيرة.", "طباعة البنرات والملصقات بجودة عالية ومقاومة للعوامل الجوية.", "طباعة الكروت الشخصية والفواتير والأختام."],
  },
  {
    title: "فنون الإضاءة والإشارات والحروف البارزة",
    description: "نمنح علامتك التجارية الظهور الذي لا يمكن تجاهله، ليلاً ونهاراً.",
    icon: "billboard",
    items: ["تصنيع وتنفيذ الحروف البارزة (3D Letters) بجميع الخامات (زنكور، أكريليك، ستانلس ستيل).", "واجهات الكلادينج بتصاميم عصرية.", "لوحات النيون واللوحات المضيئة.", "لوحات الطرق والإشارات الإرشادية الداخلية والخارجية."],
  },
  {
    title: "خدمات إدارة المحتوى وتطبيقات الإنترنت",
    description: "صوتك الرقمي الذي يصل للعالم.",
    icon: "globe",
    items: ["تصميم وتطوير المواقع الإلكترونية التعريفية والمتاجر.", "إدارة حسابات التواصل الاجتماعي (Social Media Management).", "كتابة المحتوى الإبداعي والتسويقي (Copywriting).", "تحسين محركات البحث (SEO) لضمان ظهورك في المقدمة."],
  },
].map((service, order) => ({ ...service, order, isActive: true }));

const ensureLegacyServices = async () => {
  const migration = await ServiceMigration.findOne({ key: "legacy-services-v2" });
  if (!migration) {
    // Restore any original static service that was never copied to the DB,
    // even if custom services already exist there.
    for (const legacyService of LEGACY_SERVICES) {
      await Service.updateOne(
        { title: legacyService.title },
        { $setOnInsert: legacyService },
        { upsert: true },
      );
    }
    await ServiceMigration.create({ key: "legacy-services-v2" });
  }
};

export const list = async () => {
  await ensureLegacyServices();
  return Service.find({ isActive: true }).sort({ order: 1 });
};
export const listAll = async () => {
  await ensureLegacyServices();
  return Service.find().sort({ order: 1, createdAt: 1 });
};
export const get = (id) => mongoose.isValidObjectId(id) ? Service.findOne({ _id: id, isActive: true }) : null;
export const create = (data) => Service.create(data);
export const update = (id, data) =>
  mongoose.isValidObjectId(id) ? Service.findByIdAndUpdate(id, data, { new: true, runValidators: true }) : null;
export const remove = (id) => mongoose.isValidObjectId(id) ? Service.findByIdAndDelete(id) : null;

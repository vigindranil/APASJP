-- Insert sample data for Jalpaiguri district
-- Adding comprehensive sample data for all tables

-- Insert Blocks/Municipalities for Jalpaiguri district
INSERT INTO blocks (name, name_bn, name_np) VALUES
('Jalpaiguri Municipality', 'জলপাইগুড়ি পৌরসভা', 'जलपाईगुड़ी नगरपालिका'),
('Rajganj Block', 'রাজগঞ্জ ব্লক', 'राजगंज ब्लक'),
('Maynaguri Block', 'মৈনাগুড়ি ব্লক', 'मैनागुड़ी ब्लक'),
('Dhupguri Block', 'ধূপগুড়ি ব্লক', 'धूपगुड़ी ब्लक'),
('Mal Block', 'মাল ব্লক', 'माल ब्लक'),
('Matiali Block', 'মাতিয়ালি ব্লক', 'मातियाली ब्लक'),
('Nagrakata Block', 'নাগরাকাটা ব্লক', 'नागराकाटा ब्लक');

-- Insert Wards/GPs for each block
-- Jalpaiguri Municipality Wards
INSERT INTO wards (block_id, name, name_bn, name_np) VALUES
(1, 'Ward 1', 'ওয়ার্ড ১', 'वार्ड १'),
(1, 'Ward 2', 'ওয়ার্ড ২', 'वार्ड २'),
(1, 'Ward 3', 'ওয়ার্ড ৩', 'वार्ड ३'),
(1, 'Ward 4', 'ওয়ার্ড ৪', 'वार्ड ४'),
(1, 'Ward 5', 'ওয়ার্ড ৫', 'वार्ड ५');

-- Rajganj Block GPs
INSERT INTO wards (block_id, name, name_bn, name_np) VALUES
(2, 'Rajganj GP', 'রাজগঞ্জ গ্রাম পঞ্চায়েত', 'राजगंज ग्राम पंचायत'),
(2, 'Ambari Falakata GP', 'আম্বাড়ি ফালাকাটা গ্রাম পঞ্চায়েত', 'अंबारी फालाकाटा ग्राम पंचायत'),
(2, 'Binnaguri GP', 'বিন্নাগুড়ি গ্রাম পঞ্চায়েত', 'बिन्नागुड़ी ग्राम पंचायत');

-- Maynaguri Block GPs
INSERT INTO wards (block_id, name, name_bn, name_np) VALUES
(3, 'Maynaguri GP', 'মৈনাগুড়ি গ্রাম পঞ্চায়েত', 'मैनागुड़ी ग्राम पंचायत'),
(3, 'Belakoba GP', 'বেলাকোবা গ্রাম পঞ্চায়েত', 'बेलाकोबा ग्राम पंचायत'),
(3, 'Kranti GP', 'ক্রান্তি গ্রাম পঞ্চায়েত', 'क्रांति ग्राम पंचायत');

-- Insert Electoral Booths with camp details
INSERT INTO electoral_booths (ward_id, name, name_bn, name_np, camp_details, camp_details_bn, camp_details_np) VALUES
-- Ward 1 booths
(1, 'Jalpaiguri Girls High School', 'জলপাইগুড়ি গার্লস হাই স্কুল', 'जलपाईगुड़ी गर्ल्स हाई स्कूल', 
 'Camp held on 2025-08-06 at Jalpaiguri Girls High School. Total participants: 150. Services: Health checkup, Document verification, Grievance redressal.',
 'ক্যাম্প অনুষ্ঠিত হয়েছে ২০২৫-০৮-০৬ তারিখে জলপাইগুড়ি গার্লস হাই স্কুলে। মোট অংশগ্রহণকারী: ১৫০। সেবা: স্বাস্থ্য পরীক্ষা, নথি যাচাইকরণ, অভিযোগ নিষ্পত্তি।',
 'शिविर जलपाईगुड़ी गर्ल्स हाई स्कूल में 2025-08-06 को आयोजित किया गया। कुल प्रतिभागी: 150। सेवाएं: स्वास्थ्य जांच, दस्तावेज सत्यापन, शिकायत निवारण।'),

(1, 'Jalpaiguri Zilla School', 'জলপাইগুড়ি জিলা স্কুল', 'जलपाईगुड़ी जिला स्कूल',
 'Camp held on 2025-08-06 at Jalpaiguri Zilla School. Total participants: 200. Services: Vaccination drive, Ration card distribution, Employment registration.',
 'ক্যাম্প অনুষ্ঠিত হয়েছে ২০২৫-০৮-০৬ তারিখে জলপাইগুড়ি জিলা স্কুলে। মোট অংশগ্রহণকারী: ২০০। সেবা: টিকাকরণ অভিযান, রেশন কার্ড বিতরণ, কর্মসংস্থান নিবন্ধন।',
 'शिविर जलपाईगुड़ी जिला स्कूल में 2025-08-06 को आयोजित किया गया। कुल प्रतिभागी: 200। सेवाएं: टीकाकरण अभियान, राशन कार्ड वितरण, रोजगार पंजीकरण।'),

-- Ward 2 booths
(2, 'Netaji Vidyapith', 'নেতাজি বিদ্যাপীঠ', 'नेताजी विद्यापीठ',
 'Camp held on 2025-08-06 at Netaji Vidyapith. Total participants: 180. Services: Pension enrollment, Banking services, Digital literacy training.',
 'ক্যাম্প অনুষ্ঠিত হয়েছে ২০২৫-০৮-০৬ তারিখে নেতাজি বিদ্যাপীঠে। মোট অংশগ্রহণকারী: ১৮০। সেবা: পেনশন তালিকাভুক্তি, ব্যাংকিং সেবা, ডিজিটাল সাক্ষরতা প্রশিক্ষণ।',
 'शिविर नेताजी विद्यापीठ में 2025-08-06 को आयोजित किया गया। कुल प्रतिभागी: 180। सेवाएं: पेंशन नामांकन, बैंकिंग सेवाएं, डिजिटल साक्षरता प्रशिक्षण।'),

-- Rajganj GP booths
(6, 'Rajganj Primary School', 'রাজগঞ্জ প্রাথমিক বিদ্যালয়', 'राजगंज प्राथमिक विद्यालय',
 'Camp held on 2025-08-06 at Rajganj Primary School. Total participants: 120. Services: Agricultural loan assistance, Crop insurance, Fertilizer distribution.',
 'ক্যাম্প অনুষ্ঠিত হয়েছে ২০২৫-০৮-০৬ তারিখে রাজগঞ্জ প্রাথমিক বিদ্যালয়ে। মোট অংশগ্রহণকারী: ১২০। সেবা: কৃষি ঋণ সহায়তা, ফসল বীমা, সার বিতরণ।',
 'शिविर राजगंज प्राथमिक विद्यालय में 2025-08-06 को आयोजित किया गया। कुल प्रतिभागी: 120। सेवाएं: कृषि ऋण सहायता, फसल बीमा, उर्वरक वितरण।'),

-- Maynaguri GP booths
(9, 'Maynaguri High School', 'মৈনাগুড়ি হাই স্কুল', 'मैनागुड़ी हाई स्कूल',
 'Camp held on 2025-08-06 at Maynaguri High School. Total participants: 160. Services: Skill development training, Self-help group formation, Microfinance assistance.',
 'ক্যাম্প অনুষ্ঠিত হয়েছে ২০২৫-০৮-০৬ তারিখে মৈনাগুড়ি হাই স্কুলে। মোট অংশগ্রহণকারী: ১৬০। সেবা: দক্ষতা উন্নয়ন প্রশিক্ষণ, স্বনির্ভর গোষ্ঠী গঠন, ক্ষুদ্রঋণ সহায়তা।',
 'शिविर मैनागुड़ी हाई स्कूल में 2025-08-06 को आयोजित किया गया। कुल प्रतिभागी: 160। सेवाएं: कौशल विकास प्रशिक्षण, स्वयं सहायता समूह गठन, माइक्रोफाइनेंस सहायता।');

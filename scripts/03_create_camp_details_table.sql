-- Create camp_details table for storing camp information
CREATE TABLE IF NOT EXISTS `camp_details` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `block_id` INT NOT NULL,
    `ward_id` INT NOT NULL,
    `electoral_booth_id` INT NOT NULL,
    `camp_date` DATE NOT NULL,
    `venue` VARCHAR(500) NOT NULL,
    `venue_bn` VARCHAR(500),
    `venue_np` VARCHAR(500),
    `habitation` VARCHAR(255) NOT NULL,
    `habitation_bn` VARCHAR(255),
    `habitation_np` VARCHAR(255),
    `ac` VARCHAR(100) NOT NULL COMMENT 'Assembly Constituency',
    `ac_bn` VARCHAR(100),
    `ac_np` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (`block_id`) REFERENCES `blocks`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`ward_id`) REFERENCES `wards`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`electoral_booth_id`) REFERENCES `electoral_booths`(`id`) ON DELETE CASCADE,
    
    -- Indexes for better performance
    INDEX `idx_block_ward_booth` (`block_id`, `ward_id`, `electoral_booth_id`),
    INDEX `idx_camp_date` (`camp_date`),
    INDEX `idx_electoral_booth` (`electoral_booth_id`)
);

-- Insert sample camp details data for Jalpaiguri district
INSERT INTO `camp_details` (`block_id`, `ward_id`, `electoral_booth_id`, `camp_date`, `venue`, `venue_bn`, `venue_np`, `habitation`, `habitation_bn`, `habitation_np`, `ac`, `ac_bn`, `ac_np`) VALUES

-- Rajganj Block camps
(1, 1, 1, '2025-09-15', 'Rajganj Primary School', 'রাজগঞ্জ প্রাথমিক বিদ্যালয়', 'राजगंज प्राथमिक विद्यालय', 'Rajganj Center', 'রাজগঞ্জ কেন্দ্র', 'राजगंज केंद्र', 'Rajganj (SC)', 'রাজগঞ্জ (তফসিলি)', 'राजगंज (अनुसूचित)'),
(1, 1, 2, '2025-09-15', 'Rajganj High School', 'রাজগঞ্জ উচ্চ বিদ্যালয়', 'राजगंज उच्च विद्यालय', 'Rajganj Center', 'রাজগঞ্জ কেন্দ্র', 'राजगंज केंद्र', 'Rajganj (SC)', 'রাজগঞ্জ (তফসিলি)', 'राजगंज (अनुसूचित)'),
(1, 2, 3, '2025-09-16', 'Belakoba Community Hall', 'বেলাকোবা কমিউনিটি হল', 'बेलाकोबा सामुदायिक हॉल', 'Belakoba', 'বেলাকোবা', 'बेलाकोबा', 'Rajganj (SC)', 'রাজগঞ্জ (তফসিলি)', 'राजगंज (अनुसूचित)'),

-- Maynaguri Block camps
(2, 3, 4, '2025-09-17', 'Maynaguri Block Office', 'ময়নাগুড়ি ব্লক অফিস', 'मैनागुड़ी ब्लॉक कार्यालय', 'Maynaguri Town', 'ময়নাগুড়ি শহর', 'मैनागुड़ी शहर', 'Maynaguri', 'ময়নাগুড়ি', 'मैनागुड़ी'),
(2, 3, 5, '2025-09-17', 'Maynaguri High School', 'ময়নাগুড়ি উচ্চ বিদ্যালয়', 'मैनागुड़ी उच्च विद्यालय', 'Maynaguri Town', 'ময়নাগুড়ি শহর', 'मैनागुड़ी शहर', 'Maynaguri', 'ময়নাগুড়ি', 'मैनागुड़ी'),
(2, 4, 6, '2025-09-18', 'Dhupguri Primary School', 'ধূপগুড়ি প্রাথমিক বিদ্যালয়', 'धूपगुड़ी प्राथमिक विद्यालय', 'Dhupguri', 'ধূপগুড়ি', 'धूपगुड़ी', 'Maynaguri', 'ময়নাগুড়ি', 'मैनागुड़ी'),

-- Jalpaiguri Sadar Block camps
(3, 5, 7, '2025-09-19', 'Jalpaiguri District Collectorate', 'জলপাইগুড়ি জেলা কালেক্টরেট', 'जलपाईगुड़ी जिला कलेक्टरेट', 'Jalpaiguri Town', 'জলপাইগুড়ি শহর', 'जलपाईगुड़ी शहर', 'Jalpaiguri', 'জলপাইগুড়ি', 'जलपाईगुड़ी'),
(3, 5, 8, '2025-09-19', 'Jalpaiguri Government College', 'জলপাইগুড়ি সরকারি কলেজ', 'जलपाईगुड़ी सरकारी कॉलेज', 'Jalpaiguri Town', 'জলপাইগুড়ি শহর', 'जलपाईगुड़ी शहर', 'Jalpaiguri', 'জলপাইগুড়ি', 'जलपाईगुड़ी'),
(3, 6, 9, '2025-09-20', 'Kadamtala Community Center', 'কদমতলা কমিউনিটি সেন্টার', 'कदमतला सामुदायिक केंद्र', 'Kadamtala', 'কদমতলা', 'कदमतला', 'Jalpaiguri', 'জলপাইগুড়ি', 'जलपाईगुड़ी'),

-- Mal Block camps
(4, 7, 10, '2025-09-21', 'Mal Block Development Office', 'মাল ব্লক উন্নয়ন অফিস', 'माल ब्लॉक विकास कार्यालय', 'Mal Town', 'মাল শহর', 'माल शहर', 'Mal (ST)', 'মাল (তফসিলি উপজাতি)', 'माल (अनुसूचित जनजाति)'),
(4, 7, 11, '2025-09-21', 'Mal High School', 'মাল উচ্চ বিদ্যালয়', 'माल उच्च विद्यालय', 'Mal Town', 'মাল শহর', 'माल शहर', 'Mal (ST)', 'মাল (তফসিলি উপজাতি)', 'माल (अनुसूचित जनजाति)'),
(4, 8, 12, '2025-09-22', 'Matiali Primary School', 'মাতিয়ালি প্রাথমিক বিদ্যালয়', 'मातियाली प्राथमिक विद्यालय', 'Matiali', 'মাতিয়ালি', 'मातियाली', 'Mal (ST)', 'মাল (তফসিলি উপজাতি)', 'माल (अनुसूचित जनजाति)'),

-- Nagrakata Block camps
(5, 9, 13, '2025-09-23', 'Nagrakata Block Office', 'নাগরাকাটা ব্লক অফিস', 'नागराकाटा ब्लॉक कार्यालय', 'Nagrakata Town', 'নাগরাকাটা শহর', 'नागराकाटा शहर', 'Nagrakata (ST)', 'নাগরাকাটা (তফসিলি উপজাতি)', 'नागराकाटा (अनुसूचित जनजाति)'),
(5, 9, 14, '2025-09-23', 'Nagrakata High School', 'নাগরাকাটা উচ্চ বিদ্যালয়', 'नागराकाटा उच्च विद्यालय', 'Nagrakata Town', 'নাগরাকাটা শহর', 'नागराकाटा शहर', 'Nagrakata (ST)', 'নাগরাকাটা (তফসিলি উপজাতি)', 'नागराकाटा (अनुसूचित जनजाति)'),
(5, 10, 15, '2025-09-24', 'Birpara Community Hall', 'বীরপাড়া কমিউনিটি হল', 'बीरपाड़ा सामुदायिक हॉल', 'Birpara', 'বীরপাড়া', 'बीरपाड़ा', 'Nagrakata (ST)', 'নাগরাকাটা (তফসিলি উপজাতি)', 'नागराकाटा (अनुसूचित जनजाति)');

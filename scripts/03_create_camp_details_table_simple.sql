-- Create camp_details table without foreign key constraints
-- (Database user doesn't have REFERENCES privileges)

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
    
    -- Indexes for better performance (no foreign keys due to permission restrictions)
    INDEX `idx_block_ward_booth` (`block_id`, `ward_id`, `electoral_booth_id`),
    INDEX `idx_camp_date` (`camp_date`),
    INDEX `idx_electoral_booth` (`electoral_booth_id`)
);

-- Insert sample camp details data for Jalpaiguri district
INSERT INTO `camp_details` (
    `block_id`, `ward_id`, `electoral_booth_id`, `camp_date`, 
    `venue`, `venue_bn`, `venue_np`,
    `habitation`, `habitation_bn`, `habitation_np`,
    `ac`, `ac_bn`, `ac_np`
) VALUES
-- Sample data for different electoral booths
(1, 1, 1, '2025-09-15', 'Jalpaiguri Primary School', 'জলপাইগুড়ি প্রাথমিক বিদ্যালয়', 'जलपाईगुड़ी प्राथमिक विद्यालय', 'Jalpaiguri Town', 'জলপাইগুড়ি শহর', 'जलपाईगुड़ी शहर', 'Jalpaiguri AC', 'জলপাইগুড়ি বিধানসভা', 'जलपाईगुड़ी विधानसभा'),
(1, 1, 2, '2025-09-16', 'Community Hall, Ward 2', 'কমিউনিটি হল, ওয়ার্ড ২', 'सामुदायिक हॉल, वार्ड २', 'Central Jalpaiguri', 'কেন্দ্রীয় জলপাইগুড়ি', 'केंद्रीय जलपाईगुड़ी', 'Jalpaiguri AC', 'জলপাইগুড়ি বিধানসভা', 'जलपाईगुड़ी विधानसभा'),
(2, 3, 3, '2025-09-17', 'Maynaguri High School', 'ময়নাগুড়ি উচ্চ বিদ্যালয়', 'मैनागुड़ी उच्च विद्यालय', 'Maynaguri Center', 'ময়নাগুড়ি কেন্দ্র', 'मैनागुड़ी केंद्र', 'Maynaguri AC', 'ময়নাগুড়ি বিধানসভা', 'मैनागुड़ी विधानसभा'),
(2, 4, 4, '2025-09-18', 'Village Panchayat Office', 'গ্রাম পঞ্চায়েত অফিস', 'ग्राम पंचायत कार्यालय', 'Maynaguri Rural', 'ময়নাগুড়ি গ্রামীণ', 'मैनागुड़ी ग्रामीण', 'Maynaguri AC', 'ময়নাগুড়ি বিধানসভা', 'मैनागुड़ी विधानसभा'),
(3, 5, 5, '2025-09-19', 'Dhupguri Government School', 'ধূপগুড়ি সরকারি বিদ্যালয়', 'धूपगुड़ी सरकारी विद्यालय', 'Dhupguri Town', 'ধূপগুড়ি শহর', 'धूपगुड़ी शहर', 'Dhupguri AC', 'ধূপগুড়ি বিধানসভা', 'धूपगुड़ी विधानसभा'),
(3, 6, 6, '2025-09-20', 'Block Development Office', 'ব্লক উন্নয়ন অফিস', 'ब्लॉक विकास कार्यालय', 'Dhupguri Block', 'ধূপগুড়ি ব্লক', 'धूपगुड़ी ब्लॉक', 'Dhupguri AC', 'ধূপগুড়ি বিধানসভা', 'धूपगुड़ी विधानसभा'),
(4, 7, 7, '2025-09-21', 'Rajganj Community Center', 'রাজগঞ্জ কমিউনিটি সেন্টার', 'राजगंज सामुदायिक केंद्र', 'Rajganj Center', 'রাজগঞ্জ কেন্দ্র', 'राजगंज केंद्र', 'Rajganj AC', 'রাজগঞ্জ বিধানসভা', 'राजगंज विधानसभा'),
(4, 8, 8, '2025-09-22', 'Primary Health Center', 'প্রাথমিক স্বাস্থ্য কেন্দ্র', 'प्राथमिक स्वास्थ्य केंद्र', 'Rajganj PHC Area', 'রাজগঞ্জ পিএইচসি এলাকা', 'राजगंज पीएचसी क्षेत्र', 'Rajganj AC', 'রাজগঞ্জ বিধানসভা', 'राजगंज विधानसभा'),
(5, 9, 9, '2025-09-23', 'Mal Subdivision Office', 'মাল মহকুমা অফিস', 'माल उपखंड कार्यालय', 'Mal Town', 'মাল শহর', 'माल शहर', 'Mal AC', 'মাল বিধানসভা', 'माल विधानसभा'),
(5, 10, 10, '2025-09-24', 'Mal High School', 'মাল উচ্চ বিদ্যালয়', 'माल उच्च विद्यालय', 'Mal Educational Area', 'মাল শিক্ষা এলাকা', 'माल शिक्षा क्षेत्र', 'Mal AC', 'মাল বিধানসভা', 'माल विधानसभा');

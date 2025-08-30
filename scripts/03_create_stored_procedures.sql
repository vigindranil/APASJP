-- Create stored procedures for the WhatsApp Chat Bot
-- Creating all necessary stored procedures for API endpoints

-- Stored procedure to get all blocks
CREATE OR REPLACE FUNCTION get_blocks()
RETURNS TABLE(
    id INTEGER,
    name VARCHAR(255),
    name_bn VARCHAR(255),
    name_np VARCHAR(255)
) AS $$
BEGIN
    RETURN QUERY
    SELECT b.id, b.name, b.name_bn, b.name_np
    FROM blocks b
    ORDER BY b.name;
END;
$$ LANGUAGE plpgsql;

-- Stored procedure to get wards by block_id
CREATE OR REPLACE FUNCTION get_wards_by_block(p_block_id INTEGER)
RETURNS TABLE(
    id INTEGER,
    name VARCHAR(255),
    name_bn VARCHAR(255),
    name_np VARCHAR(255)
) AS $$
BEGIN
    RETURN QUERY
    SELECT w.id, w.name, w.name_bn, w.name_np
    FROM wards w
    WHERE w.block_id = p_block_id
    ORDER BY w.name;
END;
$$ LANGUAGE plpgsql;

-- Stored procedure to get electoral booths by ward_id
CREATE OR REPLACE FUNCTION get_booths_by_ward(p_ward_id INTEGER)
RETURNS TABLE(
    id INTEGER,
    name VARCHAR(255),
    name_bn VARCHAR(255),
    name_np VARCHAR(255)
) AS $$
BEGIN
    RETURN QUERY
    SELECT eb.id, eb.name, eb.name_bn, eb.name_np
    FROM electoral_booths eb
    WHERE eb.ward_id = p_ward_id
    ORDER BY eb.name;
END;
$$ LANGUAGE plpgsql;

-- Stored procedure to save user data and return camp details
CREATE OR REPLACE FUNCTION save_user_data_and_get_camp(
    p_name VARCHAR(255),
    p_phone VARCHAR(20),
    p_block_id INTEGER,
    p_ward_id INTEGER,
    p_booth_id INTEGER,
    p_language VARCHAR(10) DEFAULT 'en'
)
RETURNS TABLE(
    user_id INTEGER,
    camp_details TEXT,
    camp_details_bn TEXT,
    camp_details_np TEXT,
    block_name VARCHAR(255),
    ward_name VARCHAR(255),
    booth_name VARCHAR(255)
) AS $$
DECLARE
    v_user_id INTEGER;
BEGIN
    -- Insert user data
    INSERT INTO user_data (name, phone, block_id, ward_id, booth_id, language)
    VALUES (p_name, p_phone, p_block_id, p_ward_id, p_booth_id, p_language)
    RETURNING id INTO v_user_id;
    
    -- Return user data with camp details
    RETURN QUERY
    SELECT 
        v_user_id,
        eb.camp_details,
        eb.camp_details_bn,
        eb.camp_details_np,
        b.name as block_name,
        w.name as ward_name,
        eb.name as booth_name
    FROM electoral_booths eb
    JOIN wards w ON eb.ward_id = w.id
    JOIN blocks b ON w.block_id = b.id
    WHERE eb.id = p_booth_id;
END;
$$ LANGUAGE plpgsql;

-- Stored procedure to save user experience
CREATE OR REPLACE FUNCTION save_user_experience(
    p_name VARCHAR(255),
    p_phone VARCHAR(20),
    p_experience TEXT,
    p_language VARCHAR(10) DEFAULT 'en'
)
RETURNS TABLE(
    experience_id INTEGER,
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    v_experience_id INTEGER;
BEGIN
    -- Insert user experience
    INSERT INTO user_experiences (name, phone, experience, language)
    VALUES (p_name, p_phone, p_experience, p_language)
    RETURNING id INTO v_experience_id;
    
    -- Return success response
    RETURN QUERY
    SELECT 
        v_experience_id,
        TRUE as success,
        'Experience saved successfully' as message;
        
EXCEPTION
    WHEN OTHERS THEN
        -- Return error response
        RETURN QUERY
        SELECT 
            NULL::INTEGER as experience_id,
            FALSE as success,
            'Error saving experience: ' || SQLERRM as message;
END;
$$ LANGUAGE plpgsql;

-- Stored procedure to get user statistics (optional - for admin purposes)
CREATE OR REPLACE FUNCTION get_user_statistics()
RETURNS TABLE(
    total_users INTEGER,
    total_experiences INTEGER,
    users_by_language JSON,
    popular_blocks JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM user_data) as total_users,
        (SELECT COUNT(*)::INTEGER FROM user_experiences) as total_experiences,
        (SELECT json_object_agg(language, count) 
         FROM (SELECT language, COUNT(*) as count FROM user_data GROUP BY language) lang_stats) as users_by_language,
        (SELECT json_object_agg(block_name, count)
         FROM (SELECT b.name as block_name, COUNT(*) as count 
               FROM user_data ud 
               JOIN blocks b ON ud.block_id = b.id 
               GROUP BY b.name 
               ORDER BY count DESC 
               LIMIT 5) block_stats) as popular_blocks;
END;
$$ LANGUAGE plpgsql;

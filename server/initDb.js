const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

const initializeDatabase = async () => {
  try {
    // First check if the database is already initialized by checking if users table exists
    try {
      const checkResult = await pool.query('SELECT COUNT(*) FROM users');
      console.log('Database already initialized with users table, skipping import');
      return;
    } catch (err) {
      // If the query fails, the table doesn't exist yet, so we'll proceed with initialization
      console.log('Users table does not exist yet, will initialize database');
    }

    console.log('Starting database initialization...');

    // Create the tables structure
    console.log('Creating tables...');
    await pool.query(`
      -- Create users table
      CREATE TABLE IF NOT EXISTS public.users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP WITH TIME ZONE
      );

      -- Create achievements table
      CREATE TABLE IF NOT EXISTS public.achievements (
        achievement_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        points_required INTEGER NOT NULL,
        badge_icon TEXT NOT NULL
      );

      -- Create game_sessions table
      CREATE TABLE IF NOT EXISTS public.game_sessions (
        session_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES public.users(user_id) ON DELETE CASCADE,
        started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP WITH TIME ZONE,
        problems_attempted INTEGER DEFAULT 0,
        problems_correct INTEGER DEFAULT 0,
        points_earned INTEGER DEFAULT 0,
        game_mode VARCHAR(20) DEFAULT 'normal'
      );

      -- Create levels table
      CREATE TABLE IF NOT EXISTS public.levels (
        level_id SERIAL PRIMARY KEY,
        level_name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        required_points INTEGER NOT NULL,
        category VARCHAR(50) NOT NULL,
        max_difficulty INTEGER NOT NULL
      );

      -- Create problems table
      CREATE TABLE IF NOT EXISTS public.problems (
        problem_id SERIAL PRIMARY KEY,
        category VARCHAR(50) NOT NULL,
        difficulty_level INTEGER NOT NULL,
        question TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        options TEXT[],
        points INTEGER DEFAULT 10 NOT NULL,
        problem_type VARCHAR(50) DEFAULT 'standard'
      );

      -- Create user_achievements table
      CREATE TABLE IF NOT EXISTS public.user_achievements (
        user_id INTEGER REFERENCES public.users(user_id) ON DELETE CASCADE,
        achievement_id INTEGER REFERENCES public.achievements(achievement_id) ON DELETE CASCADE,
        earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, achievement_id)
      );

      -- Create user_profiles table
      CREATE TABLE IF NOT EXISTS public.user_profiles (
        profile_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES public.users(user_id) ON DELETE CASCADE,
        avatar VARCHAR(50) DEFAULT 'default',
        username_color VARCHAR(20) DEFAULT '#FFFFFF',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Create user_progress table
      CREATE TABLE IF NOT EXISTS public.user_progress (
        progress_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES public.users(user_id) ON DELETE CASCADE,
        current_level INTEGER DEFAULT 1,
        total_points INTEGER DEFAULT 0,
        problems_solved INTEGER DEFAULT 0,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Create user_records table
      CREATE TABLE IF NOT EXISTS public.user_records (
        record_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES public.users(user_id) ON DELETE CASCADE,
        record_type VARCHAR(50) NOT NULL,
        record_value NUMERIC NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_record_type UNIQUE (user_id, record_type)
      );

      -- Create index for user profiles
      CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
    `);
    
    console.log('Tables created successfully');

    // Insert achievements data
    console.log('Inserting achievements data...');
    await pool.query(`
      INSERT INTO public.achievements (achievement_id, name, description, points_required, badge_icon) VALUES
      (4, 'Math Novice', 'Solve your first 5 math problems', 10, 'novice_badge.png'),
      (5, 'Math Explorer', 'Accumulate 200 total points', 50, 'explorer_badge.png'),
      (6, 'Math Wizard', 'Solve 50 math problems', 100, 'wizard_badge.png'),
      (7, 'Math Master', 'Solve 100 math problems', 250, 'master_badge.png'),
      (8, 'Math Genius', 'Accumulate 500 total points', 500, 'genius_badge.png'),
      (9, 'Perfect Streak', 'Complete a game with 100% correct answers', 75, 'perfect_streak_badge.png'),
      (10, 'Speed Demon', 'Complete a game in under 1 minute with at least 5 correct problems', 90, 'speed_demon_badge.png'),
      (11, 'Precision Pro', 'Complete 5 games with 90% or higher accuracy', 150, 'precision_badge.png'),
      (12, 'Lightning Learner', 'Complete 10 timed challenges successfully', 200, 'lightning_badge.png'),
      (13, 'Blitz Champion', 'Score 20 points in Blitz Mode', 100, 'blitz_champion_badge.png'),
      (14, 'All-Types Conqueror', 'Complete an All Types mode game', 125, 'all_types_badge.png'),
      (15, 'Practice Perfectionist', 'Complete 5 practice sessions in different categories', 175, 'practice_badge.png'),
      (16, 'Beginner Breaker', 'Complete all Beginner level problems', 50, 'beginner_badge.png'),
      (17, 'Intermediate Innovator', 'Complete all Intermediate level problems', 150, 'intermediate_badge.png'),
      (18, 'Advanced Achiever', 'Complete all Advanced level problems', 300, 'advanced_badge.png'),
      (19, 'Addition Ace', 'Master all Addition problems', 100, 'addition_badge.png'),
      (20, 'Subtraction Strategist', 'Master all Subtraction problems', 100, 'subtraction_badge.png'),
      (21, 'Multiplication Maestro', 'Master all Multiplication problems', 100, 'multiplication_badge.png'),
      (22, 'Division Dynamo', 'Master all Division problems', 100, 'division_badge.png'),
      (23, 'Fraction Fantastic', 'Master all Fraction problems', 150, 'fraction_badge.png'),
      (24, 'Consistent Learner', 'Play 10 consecutive days', 200, 'consistency_badge.png'),
      (25, 'Problem Solving Pro', 'Solve 500 total problems', 400, 'pro_badge.png'),
      (26, 'Point Collector', 'Accumulate 1000 total points', 500, 'collector_badge.png'),
      (27, 'Jack of All Trades', 'Complete problems in all categories', 250, 'jack_of_all_trades_badge.png'),
      (28, 'Versatile Virtuoso', 'Complete problems at all difficulty levels', 300, 'versatile_badge.png');
    `);

    // Insert levels data
    console.log('Inserting levels data...');
    await pool.query(`
      INSERT INTO public.levels (level_id, level_name, description, required_points, category, max_difficulty) VALUES
      (1, 'Addition Beginner', 'Simple addition with numbers 1-10', 0, 'Addition', 1),
      (2, 'Addition Intermediate', 'Addition with numbers up to 20', 100, 'Addition', 2),
      (3, 'Addition Advanced', 'Multi-digit addition and word problems', 250, 'Addition', 3),
      (4, 'Subtraction Beginner', 'Simple subtraction with numbers 1-10', 400, 'Subtraction', 1),
      (5, 'Subtraction Intermediate', 'Subtraction with numbers up to 20', 600, 'Subtraction', 2),
      (6, 'Subtraction Advanced', 'Multi-digit subtraction and word problems', 850, 'Subtraction', 3),
      (7, 'Multiplication Beginner', 'Simple multiplication with numbers 1-5', 1100, 'Multiplication', 1),
      (8, 'Multiplication Intermediate', 'Multiplication with numbers up to 10', 1400, 'Multiplication', 2),
      (9, 'Multiplication Advanced', 'Multi-digit multiplication and word problems', 1700, 'Multiplication', 3),
      (10, 'Division Beginner', 'Simple division with numbers 1-10', 2000, 'Division', 1),
      (11, 'Division Intermediate', 'Division with remainders', 2350, 'Division', 2),
      (12, 'Division Advanced', 'Multi-digit division and word problems', 2700, 'Division', 3),
      (13, 'Fraction Basics', 'Introduction to fractions with simple operations', 3100, 'Fractions', 2),
      (14, 'Fraction Operations', 'Advanced operations with fractions', 3500, 'Fractions', 3);
    `);

    // Insert problems data (full dataset)
    console.log('Inserting problems data...');
    await pool.query(`
      INSERT INTO public.problems (problem_id, category, difficulty_level, question, correct_answer, options, points, problem_type) VALUES
      (81, 'Addition', 1, '2 + 3 = ?', '5', '{4,5,6,7}', 10, 'basic'),
      (82, 'Addition', 1, '1 + 7 = ?', '8', '{7,8,9,10}', 10, 'basic'),
      (83, 'Addition', 1, '4 + 5 = ?', '9', '{8,9,10,11}', 10, 'basic'),
      (84, 'Addition', 1, '6 + 2 = ?', '8', '{7,8,9,10}', 10, 'basic'),
      (85, 'Addition', 1, '3 + 6 = ?', '9', '{8,9,10,11}', 10, 'basic'),
      (86, 'Addition', 1, '5 + 4 = ?', '9', '{8,9,10,11}', 10, 'basic'),
      (87, 'Addition', 1, '7 + 1 = ?', '8', '{7,8,9,10}', 10, 'basic'),
      (88, 'Addition', 1, '2 + 7 = ?', '9', '{8,9,10,11}', 10, 'basic'),
      (89, 'Addition', 1, '3 + 5 = ?', '8', '{7,8,9,10}', 10, 'basic'),
      (90, 'Addition', 1, '4 + 3 = ?', '7', '{6,7,8,9}', 10, 'basic'),
      (91, 'Addition', 1, '0 + 6 = ?', '6', '{5,6,7,8}', 10, 'zero'),
      (92, 'Addition', 1, '8 + 0 = ?', '8', '{7,8,9,10}', 10, 'zero'),
      (93, 'Addition', 1, '5 + 0 = ?', '5', '{4,5,6,7}', 10, 'zero'),
      (94, 'Addition', 2, '12 + 14 = ?', '26', '{24,25,26,27}', 15, 'multi-digit'),
      (95, 'Addition', 2, '23 + 45 = ?', '68', '{66,67,68,69}', 15, 'multi-digit'),
      (96, 'Addition', 2, '37 + 26 = ?', '63', '{61,62,63,64}', 15, 'multi-digit'),
      (97, 'Addition', 2, '54 + 39 = ?', '93', '{91,92,93,94}', 15, 'multi-digit'),
      (98, 'Addition', 2, '18 + 47 = ?', '65', '{63,64,65,66}', 15, 'multi-digit'),
      (99, 'Addition', 2, '62 + 29 = ?', '91', '{89,90,91,92}', 15, 'multi-digit'),
      (100, 'Addition', 2, '45 + 38 = ?', '83', '{81,82,83,84}', 15, 'multi-digit'),
      (101, 'Addition', 2, '27 + 56 = ?', '83', '{81,82,83,84}', 15, 'multi-digit'),
      (102, 'Addition', 2, '39 + 44 = ?', '83', '{81,82,83,84}', 15, 'multi-digit'),
      (103, 'Addition', 2, '56 + 27 = ?', '83', '{81,82,83,84}', 15, 'multi-digit'),
      (104, 'Addition', 3, '123 + 456 = ?', '579', '{577,578,579,580}', 20, 'multi-digit'),
      (105, 'Addition', 3, '247 + 365 = ?', '612', '{610,611,612,613}', 20, 'multi-digit'),
      (106, 'Addition', 3, '519 + 237 = ?', '756', '{754,755,756,757}', 20, 'multi-digit'),
      (107, 'Addition', 3, '386 + 472 = ?', '858', '{856,857,858,859}', 20, 'multi-digit'),
      (108, 'Addition', 3, '645 + 289 = ?', '934', '{932,933,934,935}', 20, 'multi-digit'),
      (109, 'Subtraction', 1, '8 - 3 = ?', '5', '{3,4,5,6}', 10, 'basic'),
      (110, 'Subtraction', 1, 'What is 7 - 4?', '3', '{1,2,3,4}', 10, 'basic'),
      (111, 'Subtraction', 1, '6 - 2 = ?', '4', '{2,3,4,5}', 10, 'basic'),
      (112, 'Subtraction', 2, '45 - 27 = ?', '18', '{8,18,28,38}', 15, 'multi-digit'),
      (113, 'Subtraction', 2, 'What is 63 - 45?', '18', '{8,18,28,38}', 15, 'multi-digit'),
      (114, 'Subtraction', 2, '82 - 53 = ?', '29', '{19,29,39,49}', 15, 'multi-digit'),
      (115, 'Subtraction', 3, '456 - 289 = ?', '167', '{157,167,177,187}', 20, 'multi-digit'),
      (116, 'Subtraction', 3, '732 - 456 = ?', '276', '{266,276,286,296}', 20, 'multi-digit'),
      (117, 'Multiplication', 1, '4 × 3 = ?', '12', '{9,10,11,12}', 10, 'basic'),
      (118, 'Multiplication', 1, 'What is 5 × 2?', '10', '{8,9,10,11}', 10, 'basic'),
      (119, 'Multiplication', 1, '6 × 2 = ?', '12', '{10,11,12,13}', 10, 'basic'),
      (120, 'Multiplication', 2, '12 × 5 = ?', '60', '{50,55,60,65}', 15, 'multi-digit'),
      (121, 'Multiplication', 2, 'What is 14 × 4?', '56', '{46,56,66,76}', 15, 'multi-digit'),
      (122, 'Multiplication', 2, '17 × 3 = ?', '51', '{41,51,61,71}', 15, 'multi-digit'),
      (123, 'Multiplication', 3, '24 × 17 = ?', '408', '{398,408,418,428}', 20, 'multi-digit'),
      (124, 'Multiplication', 3, '36 × 25 = ?', '900', '{890,900,910,920}', 20, 'multi-digit'),
      (125, 'Division', 1, '12 ÷ 3 = ?', '4', '{2,3,4,5}', 10, 'basic'),
      (126, 'Division', 1, 'What is 15 ÷ 5?', '3', '{2,3,4,5}', 10, 'basic'),
      (127, 'Division', 1, '10 ÷ 2 = ?', '5', '{3,4,5,6}', 10, 'basic'),
      (128, 'Division', 2, '48 ÷ 6 = ?', '8', '{6,7,8,9}', 15, 'multi-digit'),
      (129, 'Division', 2, 'What is 72 ÷ 9?', '8', '{6,7,8,9}', 15, 'multi-digit'),
      (130, 'Division', 2, '56 ÷ 7 = ?', '8', '{6,7,8,9}', 15, 'multi-digit'),
      (131, 'Division', 3, '144 ÷ 12 = ?', '12', '{10,11,12,13}', 20, 'multi-digit'),
      (132, 'Division', 3, '360 ÷ 36 = ?', '10', '{8,9,10,11}', 20, 'multi-digit'),
      (133, 'Fractions', 1, 'What is 1/2 + 1/2?', '1', '{0,1/2,1,2}', 10, 'basic'),
      (134, 'Fractions', 1, '1/4 of 8 = ?', '2', '{1,2,3,4}', 10, 'basic'),
      (135, 'Fractions', 1, 'What is 1/3 of 9?', '3', '{2,3,4,5}', 10, 'basic'),
      (136, 'Fractions', 2, '1/4 + 1/4 = ?', '1/2', '{1/3,1/2,2/3,3/4}', 15, 'addition'),
      (137, 'Fractions', 2, '3/4 - 1/4 = ?', '1/2', '{1/3,1/2,2/3,3/4}', 15, 'subtraction'),
      (138, 'Fractions', 2, '1/2 × 6 = ?', '3', '{2,3,4,5}', 15, 'multiplication'),
      (139, 'Fractions', 3, '2/3 ÷ 1/2 = ?', '4/3', '{2/3,3/4,4/3,5/3}', 20, 'complex'),
      (140, 'Fractions', 3, '3/4 + 1/6 = ?', '11/12', '{5/6,7/12,11/12,13/12}', 20, 'complex'),
      (141, 'Decimals', 1, '0.5 + 0.5 = ?', '1', '{0.5,0.75,1,1.5}', 10, 'basic'),
      (142, 'Decimals', 1, 'What is 0.2 × 5?', '1', '{0.5,0.75,1,1.5}', 10, 'basic'),
      (143, 'Decimals', 1, '0.3 + 0.4 = ?', '0.7', '{0.5,0.6,0.7,0.8}', 10, 'basic'),
      (144, 'Decimals', 2, '1.5 + 2.3 = ?', '3.8', '{3.6,3.7,3.8,3.9}', 15, 'multi-digit'),
      (145, 'Decimals', 2, '4.2 ÷ 2 = ?', '2.1', '{1.9,2.0,2.1,2.2}', 15, 'multi-digit'),
      (146, 'Decimals', 2, '0.6 × 3 = ?', '1.8', '{1.6,1.7,1.8,1.9}', 15, 'multi-digit'),
      (147, 'Decimals', 3, '2.5 + 1.75 = ?', '4.25', '{4.05,4.15,4.25,4.35}', 20, 'complex'),
      (148, 'Decimals', 3, '3.6 ÷ 1.2 = ?', '3', '{2.8,2.9,3,3.1}', 20, 'complex'),
      (149, 'Geometry', 1, 'A square has sides of 3 cm. What is its perimeter?', '12', '{9,10,12,15}', 10, 'perimeter'),
      (150, 'Geometry', 1, 'A rectangle is 4 cm long and 3 cm wide. What is its area?', '12', '{10,11,12,13}', 10, 'area'),
      (151, 'Geometry', 1, 'How many sides does a triangle have?', '3', '{2,3,4,5}', 10, 'basic'),
      (152, 'Geometry', 2, 'A rectangle is 5 cm long and 4 cm wide. What is its perimeter?', '18', '{16,17,18,19}', 15, 'perimeter'),
      (153, 'Geometry', 2, 'A square has a side length of 6 cm. What is its area?', '36', '{30,33,36,39}', 15, 'area'),
      (154, 'Geometry', 2, 'What is the sum of angles in a triangle?', '180', '{90,120,180,360}', 15, 'angles'),
      (155, 'Geometry', 3, 'A circle has a radius of 7 cm. What is its circumference? (π ≈ 3.14)', '44', '{40,42,44,46}', 20, 'complex'),
      (156, 'Geometry', 3, 'A triangle has sides 5 cm, 6 cm, and 7 cm. What is its perimeter?', '18', '{16,17,18,19}', 20, 'complex'),
      (157, 'Word Problems', 1, 'Sarah has 5 stickers. Her friend gives her 3 more. How many stickers does she have?', '8', '{6,7,8,9}', 10, 'addition'),
      (158, 'Word Problems', 1, 'Tom has 10 cookies. He eats 4. How many cookies are left?', '6', '{4,5,6,7}', 10, 'subtraction'),
      (159, 'Word Problems', 1, 'A box has 3 rows of 4 candies. How many candies are in the box?', '12', '{10,11,12,13}', 10, 'multiplication'),
      (160, 'Word Problems', 2, 'A bakery sells 12 muffins in the morning and 18 in the afternoon. How many muffins did they sell in total?', '30', '{28,29,30,31}', 15, 'mixed'),
      (161, 'Word Problems', 2, 'John has 24 stickers and wants to share them equally among 6 friends. How many stickers will each friend get?', '4', '{3,4,5,6}', 15, 'division'),
      (162, 'Word Problems', 2, 'Lisa ate 1/4 of a pizza. Her brother ate 1/2 of the same pizza. How much of the pizza is left?', '1/4', '{1/3,1/4,1/2,2/3}', 15, 'fractions'),
      (163, 'Word Problems', 3, 'A school has 156 students in the morning and 187 students in the afternoon. How many students are there in total?', '343', '{333,343,353,363}', 20, 'complex'),
      (164, 'Word Problems', 3, 'A farmer has chickens and cows. If the total number of animal heads is 80 and the total number of legs is 260, how many chickens does the farmer have?', '60', '{50,55,60,65}', 20, 'complex'),
      (165, 'Addition', 1, 'What is 2 + 6?', '8', '{7,8,9,10}', 10, 'basic'),
      (166, 'Addition', 1, '5 + 4 = ?', '9', '{8,9,10,11}', 10, 'basic'),
      (167, 'Addition', 1, 'Add 3 and 7', '10', '{9,10,11,12}', 10, 'basic'),
      (168, 'Addition', 2, 'What is 35 + 46?', '81', '{71,81,91,101}', 15, 'multi-digit'),
      (169, 'Addition', 2, '58 + 29 = ?', '87', '{77,87,97,107}', 15, 'multi-digit'),
      (170, 'Addition', 2, 'Solve 64 + 18', '82', '{72,82,92,102}', 15, 'multi-digit'),
      (171, 'Addition', 3, 'Calculate 312 + 489', '801', '{791,801,811,821}', 20, 'multi-digit'),
      (172, 'Addition', 3, '678 + 345 = ?', '1023', '{1013,1023,1033,1043}', 20, 'multi-digit'),
      (173, 'Subtraction', 1, '9 - 4 = ?', '5', '{4,5,6,7}', 10, 'basic'),
      (174, 'Subtraction', 1, 'What is 6 - 2?', '4', '{3,4,5,6}', 10, 'basic'),
      (175, 'Subtraction', 1, '7 - 5 = ?', '2', '{1,2,3,4}', 10, 'basic'),
      (176, 'Subtraction', 2, '54 - 28 = ?', '26', '{24,25,26,27}', 15, 'multi-digit'),
      (177, 'Subtraction', 2, 'What is 73 - 39?', '34', '{33,34,35,36}', 15, 'multi-digit'),
      (178, 'Subtraction', 2, '91 - 47 = ?', '44', '{43,44,45,46}', 15, 'multi-digit'),
      (179, 'Subtraction', 3, '523 - 278 = ?', '245', '{235,245,255,265}', 20, 'multi-digit'),
      (180, 'Subtraction', 3, '845 - 396 = ?', '449', '{439,449,459,469}', 20, 'multi-digit'),
      (181, 'Multiplication', 1, '3 × 4 = ?', '12', '{11,12,13,14}', 10, 'basic'),
      (182, 'Multiplication', 1, 'What is 6 × 2?', '12', '{10,11,12,13}', 10, 'basic'),
      (183, 'Multiplication', 1, '5 × 3 = ?', '15', '{14,15,16,17}', 10, 'basic'),
      (184, 'Multiplication', 2, '13 × 6 = ?', '78', '{76,77,78,79}', 15, 'multi-digit'),
      (185, 'Multiplication', 2, 'What is 15 × 4?', '60', '{58,59,60,61}', 15, 'multi-digit'),
      (186, 'Multiplication', 2, '18 × 5 = ?', '90', '{88,89,90,91}', 15, 'multi-digit'),
      (187, 'Multiplication', 3, '27 × 19 = ?', '513', '{503,513,523,533}', 20, 'multi-digit'),
      (188, 'Multiplication', 3, '42 × 23 = ?', '966', '{956,966,976,986}', 20, 'multi-digit'),
      (189, 'Division', 1, '16 ÷ 4 = ?', '4', '{3,4,5,6}', 10, 'basic'),
      (190, 'Division', 1, 'What is 20 ÷ 5?', '4', '{3,4,5,6}', 10, 'basic'),
      (191, 'Division', 1, '18 ÷ 3 = ?', '6', '{5,6,7,8}', 10, 'basic'),
      (192, 'Division', 2, '64 ÷ 8 = ?', '8', '{7,8,9,10}', 15, 'multi-digit'),
      (193, 'Division', 2, 'What is 81 ÷ 9?', '9', '{8,9,10,11}', 15, 'multi-digit'),
      (194, 'Division', 2, '72 ÷ 6 = ?', '12', '{11,12,13,14}', 15, 'multi-digit'),
      (195, 'Division', 3, '156 ÷ 12 = ?', '13', '{12,13,14,15}', 20, 'multi-digit'),
      (196, 'Division', 3, '432 ÷ 36 = ?', '12', '{11,12,13,14}', 20, 'multi-digit'),
      (197, 'Fractions', 1, 'What is 1/3 + 1/3?', '2/3', '{1/3,2/3,3/3,4/3}', 10, 'basic'),
      (198, 'Fractions', 1, '1/2 of 10 = ?', '5', '{4,5,6,7}', 10, 'basic'),
      (199, 'Fractions', 1, 'What is 1/5 of 15?', '3', '{2,3,4,5}', 10, 'basic'),
      (200, 'Fractions', 2, 'What is 3/4 - 1/2?', '1/4', '{1/4,1/2,2/4,3/4}', 15, 'operations'),
      (201, 'Fractions', 2, 'Add: 2/5 + 1/5', '3/5', '{2/5,3/5,4/5,5/5}', 15, 'operations'),
      (202, 'Fractions', 2, 'Multiply: 2/3 × 3/4', '1/2', '{1/2,2/3,3/4,5/6}', 15, 'operations'),
      (203, 'Fractions', 3, 'Divide: (3/5) ÷ (2/3)', '9/10', '{6/8,9/10,10/9,8/9}', 20, 'operations'),
      (204, 'Fractions', 3, 'Simplify: (8/12)', '2/3', '{2/3,4/5,3/4,1/2}', 20, 'operations'),
      (205, 'Fractions', 3, 'John ate 3/8 of a pie and Mary ate 1/4. How much did they eat together?', '5/8', '{1/2,5/8,6/8,3/4}', 20, 'word'),
      (206, 'Geometry', 1, 'How many sides does a triangle have?', '3', '{3,4,5,6}', 10, 'shapes'),
      (207, 'Geometry', 1, 'How many corners does a square have?', '4', '{3,4,5,6}', 10, 'shapes'),
      (208, 'Geometry', 1, 'How many sides does a rectangle have?', '4', '{3,4,5,6}', 10, 'shapes'),
      (209, 'Geometry', 2, 'What is the area of a rectangle with length 5 and width 3?', '15', '{8,15,18,20}', 15, 'area'),
      (210, 'Geometry', 2, 'Perimeter of a square with side 6?', '24', '{18,20,24,26}', 15, 'perimeter'),
      (211, 'Geometry', 2, 'How many degrees in a right angle?', '90', '{45,90,180,360}', 15, 'angles'),
      (212, 'Geometry', 3, 'Volume of a cube with side 4?', '64', '{16,32,64,128}', 20, 'volume'),
      (213, 'Geometry', 3, 'Area of a triangle with base 10 and height 4?', '20', '{10,20,30,40}', 20, 'area'),
      (214, 'Geometry', 3, 'How many degrees in a triangle?', '180', '{90,180,270,360}', 20, 'angles'),
      (215, 'Word Problems', 1, 'Tom has 3 apples and buys 2 more. How many does he have?', '5', '{4,5,6,7}', 10, 'basic'),
      (216, 'Word Problems', 1, 'Sara has 10 candies and gives 4 away. How many left?', '6', '{5,6,7,8}', 10, 'basic'),
      (217, 'Word Problems', 2, 'Alex buys 3 pens at $2 each. What is the total cost?', '6', '{5,6,7,8}', 15, 'multi-step'),
      (218, 'Word Problems', 2, 'A bag holds 8 balls. How many in 4 bags?', '32', '{30,32,34,36}', 15, 'multi-step'),
      (219, 'Word Problems', 3, 'If a train travels 60 km in 1 hour, how far in 2.5 hours?', '150', '{100,120,150,180}', 20, 'logic'),
      (220, 'Word Problems', 3, 'A box contains 5 red, 3 blue, and 2 green balls. What is the probability of picking a red one?', '0.5', '{0.3,0.5,0.6,0.7}', 20, 'logic');
    `);

    // Insert some sample users data
    console.log('Inserting sample users data...');
    await pool.query(`
      INSERT INTO public.users (user_id, username, password, email, created_at, last_login) VALUES
      (1, 'KarimMenem', '$2b$10$AcZVXYH0j9Pq45RfPFTkuOyQ04vVmUUW0RE6j3.vig5mF12sEyG3O', 'karimmenem2@hotmail.com', '2025-04-20 18:57:29.875165+03', '2025-04-21 11:42:26.270825+03'),
      (2, 'TestUser', '$2b$10$vNKnNTf6KRLHJD53ROvtWukuv7jIlAFzx/OqOjqNGmcCfvyK.BMAS', 'testuser@gmail.com', '2025-04-21 11:44:07.507695+03', '2025-04-21 11:57:34.458716+03');
    `);

    // Insert some sample user_progress data
    console.log('Inserting sample user_progress data...');
    await pool.query(`
      INSERT INTO public.user_progress (progress_id, user_id, current_level, total_points, problems_solved, last_updated) VALUES
      (1, 1, 3, 125, 12, '2025-04-20 18:57:29.877482+03'),
      (2, 2, 5, 252, 21, '2025-04-21 11:44:07.510487+03');
    `);

    // Insert some sample user_profiles data
    console.log('Inserting sample user_profiles data...');
    await pool.query(`
      INSERT INTO public.user_profiles (profile_id, user_id, avatar, username_color, created_at, updated_at) VALUES
      (1, 1, 'avatar4', '#9C27B0', '2025-04-20 19:12:38.880961+03', '2025-04-20 19:12:38.880961+03');
    `);

    // Set sequence values after direct inserts
    console.log('Setting sequence values...');
    await pool.query(`
      SELECT setval('public.achievements_achievement_id_seq', 28, true);
      SELECT setval('public.levels_level_id_seq', 14, true);
      SELECT setval('public.problems_problem_id_seq', 220, true);
      SELECT setval('public.users_user_id_seq', 2, true);
      SELECT setval('public.user_profiles_profile_id_seq', 1, true);
      SELECT setval('public.user_progress_progress_id_seq', 2, true);
    `);

    console.log('Database initialized successfully with all tables and sample data');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error; // Rethrow to be caught by the caller
  }
};

module.exports = initializeDatabase;
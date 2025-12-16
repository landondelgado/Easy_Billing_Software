-- AUTO-GENERATED THERAPIST RATE SEED FILE


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('First', 'Last', 'Role', 'Location')
ON CONFLICT DO NOTHING;


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Nicole', 'Acker', 'ST', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Nicole'
  AND t.last_name = 'Acker'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Nicole'
  AND t.last_name = 'Acker'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Nicole'
  AND t.last_name = 'Acker'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Nicole'
  AND t.last_name = 'Acker'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Nicole'
  AND t.last_name = 'Acker'
  AND t.role = 'ST';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Renee', 'Addington', 'OT', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  70
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Renee'
  AND t.last_name = 'Addington'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  70
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Renee'
  AND t.last_name = 'Addington'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  70
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Renee'
  AND t.last_name = 'Addington'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Renee'
  AND t.last_name = 'Addington'
  AND t.role = 'OT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Susan', 'Arrington', 'PTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Susan'
  AND t.last_name = 'Arrington'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Taylor', 'Autrey', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Taylor'
  AND t.last_name = 'Autrey'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  10
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Taylor'
  AND t.last_name = 'Autrey'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Crystal', 'Backus', 'PT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  70
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Crystal'
  AND t.last_name = 'Backus'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  70
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Crystal'
  AND t.last_name = 'Backus'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  70
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Crystal'
  AND t.last_name = 'Backus'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Crystal'
  AND t.last_name = 'Backus'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Sumer', 'Bennett', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  42
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Sumer'
  AND t.last_name = 'Bennett'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  3
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Sumer'
  AND t.last_name = 'Bennett'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Mechelle', 'Bill', 'PTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Mechelle'
  AND t.last_name = 'Bill'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Mechelle'
  AND t.last_name = 'Bill'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Tina', 'Bittmann', 'PTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Tina'
  AND t.last_name = 'Bittmann'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Tina'
  AND t.last_name = 'Bittmann'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('David', 'Brock', 'PT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'David'
  AND t.last_name = 'Brock'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'David'
  AND t.last_name = 'Brock'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'David'
  AND t.last_name = 'Brock'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'David'
  AND t.last_name = 'Brock'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'David'
  AND t.last_name = 'Brock'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  25
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EXTENDED'
WHERE
  t.first_name = 'David'
  AND t.last_name = 'Brock'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Jake', 'Broscha', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Jake'
  AND t.last_name = 'Broscha'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Esther', 'Brown', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Esther'
  AND t.last_name = 'Brown'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Esther'
  AND t.last_name = 'Brown'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('James', 'Buie', 'PTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  48
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'James'
  AND t.last_name = 'Buie'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Renne', 'Butcher', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Renne'
  AND t.last_name = 'Butcher'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Renne'
  AND t.last_name = 'Butcher'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Kirah', 'Calhoun', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  42
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Kirah'
  AND t.last_name = 'Calhoun'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Kirah'
  AND t.last_name = 'Calhoun'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Michal', 'Carthel', 'OT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Michal'
  AND t.last_name = 'Carthel'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Michal'
  AND t.last_name = 'Carthel'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Michal'
  AND t.last_name = 'Carthel'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Michal'
  AND t.last_name = 'Carthel'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Michal'
  AND t.last_name = 'Carthel'
  AND t.role = 'OT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Margaret', 'Castilleja', 'PTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Margaret'
  AND t.last_name = 'Castilleja'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  2
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Margaret'
  AND t.last_name = 'Castilleja'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Oscar', 'Castillo', 'OT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  48
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Oscar'
  AND t.last_name = 'Castillo'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  48
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Oscar'
  AND t.last_name = 'Castillo'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  48
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Oscar'
  AND t.last_name = 'Castillo'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  48
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Oscar'
  AND t.last_name = 'Castillo'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  22
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EXTENDED'
WHERE
  t.first_name = 'Oscar'
  AND t.last_name = 'Castillo'
  AND t.role = 'OT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Chase', 'Christy', 'PT', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Chase'
  AND t.last_name = 'Christy'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Chase'
  AND t.last_name = 'Christy'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Chase'
  AND t.last_name = 'Christy'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Chase'
  AND t.last_name = 'Christy'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Chase'
  AND t.last_name = 'Christy'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Sheridan', 'Clark', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Sheridan'
  AND t.last_name = 'Clark'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Paige', 'Cleveland', 'PTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Paige'
  AND t.last_name = 'Cleveland'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Paige'
  AND t.last_name = 'Cleveland'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Paige'
  AND t.last_name = 'Cleveland'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Thomas', 'Collier', 'PT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Thomas'
  AND t.last_name = 'Collier'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Thomas'
  AND t.last_name = 'Collier'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Thomas'
  AND t.last_name = 'Collier'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Thomas'
  AND t.last_name = 'Collier'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Thomas'
  AND t.last_name = 'Collier'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Crystal', 'Combs', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Crystal'
  AND t.last_name = 'Combs'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Crystal'
  AND t.last_name = 'Combs'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Kesha', 'Daniels', 'OTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  43
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Kesha'
  AND t.last_name = 'Daniels'
  AND t.role = 'OTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Kesha'
  AND t.last_name = 'Daniels'
  AND t.role = 'OTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Ruben', 'De Santiago', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  38
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Ruben'
  AND t.last_name = 'De Santiago'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  4
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Ruben'
  AND t.last_name = 'De Santiago'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Samantha', 'Delgado', 'PT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Samantha'
  AND t.last_name = 'Delgado'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Samantha'
  AND t.last_name = 'Delgado'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Samantha'
  AND t.last_name = 'Delgado'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Samantha'
  AND t.last_name = 'Delgado'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Buffy', 'Dempsey', 'PTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Buffy'
  AND t.last_name = 'Dempsey'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Buffy'
  AND t.last_name = 'Dempsey'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  15
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EXTENDED'
WHERE
  t.first_name = 'Buffy'
  AND t.last_name = 'Dempsey'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Jeff', 'Denton', 'PT', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  70
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Jeff'
  AND t.last_name = 'Denton'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  70
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Jeff'
  AND t.last_name = 'Denton'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  70
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Jeff'
  AND t.last_name = 'Denton'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  70
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Jeff'
  AND t.last_name = 'Denton'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Hector', 'DeSantiago', 'PTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Hector'
  AND t.last_name = 'DeSantiago'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Hector'
  AND t.last_name = 'DeSantiago'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Jara', 'Dubose', 'PT', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  70
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Jara'
  AND t.last_name = 'Dubose'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  70
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Jara'
  AND t.last_name = 'Dubose'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  70
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Jara'
  AND t.last_name = 'Dubose'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Jara'
  AND t.last_name = 'Dubose'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Jara'
  AND t.last_name = 'Dubose'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Tammy', 'Eastland', 'OT', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Tammy'
  AND t.last_name = 'Eastland'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Tammy'
  AND t.last_name = 'Eastland'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Tammy'
  AND t.last_name = 'Eastland'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Tammy'
  AND t.last_name = 'Eastland'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Tammy'
  AND t.last_name = 'Eastland'
  AND t.role = 'OT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Lisa', 'Espe', 'OT', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Lisa'
  AND t.last_name = 'Espe'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Lisa'
  AND t.last_name = 'Espe'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Lisa'
  AND t.last_name = 'Espe'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Lisa'
  AND t.last_name = 'Espe'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Lisa'
  AND t.last_name = 'Espe'
  AND t.role = 'OT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Susan', 'Flagg', 'OTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Susan'
  AND t.last_name = 'Flagg'
  AND t.role = 'OTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Susan'
  AND t.last_name = 'Flagg'
  AND t.role = 'OTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Tonya', 'Flores', 'ST', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Tonya'
  AND t.last_name = 'Flores'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Tonya'
  AND t.last_name = 'Flores'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Tonya'
  AND t.last_name = 'Flores'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Tonya'
  AND t.last_name = 'Flores'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Tonya'
  AND t.last_name = 'Flores'
  AND t.role = 'ST';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Reagan', 'Frye', 'PT', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  68
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Reagan'
  AND t.last_name = 'Frye'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  68
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Reagan'
  AND t.last_name = 'Frye'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  68
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Reagan'
  AND t.last_name = 'Frye'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  63
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Reagan'
  AND t.last_name = 'Frye'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Reagan'
  AND t.last_name = 'Frye'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('David', 'Fulkerson', 'PT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'David'
  AND t.last_name = 'Fulkerson'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'David'
  AND t.last_name = 'Fulkerson'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'David'
  AND t.last_name = 'Fulkerson'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'David'
  AND t.last_name = 'Fulkerson'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'David'
  AND t.last_name = 'Fulkerson'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Nicholas', 'Gassett', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Nicholas'
  AND t.last_name = 'Gassett'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Nicholas'
  AND t.last_name = 'Gassett'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('John', 'Glover', 'PT', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'John'
  AND t.last_name = 'Glover'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'John'
  AND t.last_name = 'Glover'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'John'
  AND t.last_name = 'Glover'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'John'
  AND t.last_name = 'Glover'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'John'
  AND t.last_name = 'Glover'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Kelli', 'Godwin', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  35
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Kelli'
  AND t.last_name = 'Godwin'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Kelli'
  AND t.last_name = 'Godwin'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Kassandra', 'Gomez', 'PTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Kassandra'
  AND t.last_name = 'Gomez'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Kassandra'
  AND t.last_name = 'Gomez'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Kimberly', 'Gomez', 'ST', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Kimberly'
  AND t.last_name = 'Gomez'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Kimberly'
  AND t.last_name = 'Gomez'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Kimberly'
  AND t.last_name = 'Gomez'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Kimberly'
  AND t.last_name = 'Gomez'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Kimberly'
  AND t.last_name = 'Gomez'
  AND t.role = 'ST';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Kasi', 'Henderson', 'OTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  47
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Kasi'
  AND t.last_name = 'Henderson'
  AND t.role = 'OTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  6
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Kasi'
  AND t.last_name = 'Henderson'
  AND t.role = 'OTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  20
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EXTENDED'
WHERE
  t.first_name = 'Kasi'
  AND t.last_name = 'Henderson'
  AND t.role = 'OTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Chrissy', 'Herrera', 'PTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Chrissy'
  AND t.last_name = 'Herrera'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Chrissy'
  AND t.last_name = 'Herrera'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Pam', 'Jackson', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Pam'
  AND t.last_name = 'Jackson'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Kandi', 'Johnson', 'OT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Kandi'
  AND t.last_name = 'Johnson'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Kandi'
  AND t.last_name = 'Johnson'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Kandi'
  AND t.last_name = 'Johnson'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Kandi'
  AND t.last_name = 'Johnson'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Kandi'
  AND t.last_name = 'Johnson'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  20
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EXTENDED'
WHERE
  t.first_name = 'Kandi'
  AND t.last_name = 'Johnson'
  AND t.role = 'OT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Kelly', 'Jones', 'PT', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Kelly'
  AND t.last_name = 'Jones'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Kelly'
  AND t.last_name = 'Jones'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Kelly'
  AND t.last_name = 'Jones'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Kelly'
  AND t.last_name = 'Jones'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Kelly'
  AND t.last_name = 'Jones'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Rachel', 'Keesee', 'OTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  47
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Rachel'
  AND t.last_name = 'Keesee'
  AND t.role = 'OTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Brooke', 'Ledwig', 'OTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Brooke'
  AND t.last_name = 'Ledwig'
  AND t.role = 'OTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Brooke'
  AND t.last_name = 'Ledwig'
  AND t.role = 'OTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Kristal', 'Little', 'OT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  58
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Kristal'
  AND t.last_name = 'Little'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  58
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Kristal'
  AND t.last_name = 'Little'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  58
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Kristal'
  AND t.last_name = 'Little'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  53
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Kristal'
  AND t.last_name = 'Little'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Kristal'
  AND t.last_name = 'Little'
  AND t.role = 'OT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Renita', 'Logan', 'ST', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Renita'
  AND t.last_name = 'Logan'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Renita'
  AND t.last_name = 'Logan'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Renita'
  AND t.last_name = 'Logan'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Renita'
  AND t.last_name = 'Logan'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Renita'
  AND t.last_name = 'Logan'
  AND t.role = 'ST';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Jennifer', 'Lucero', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Jennifer'
  AND t.last_name = 'Lucero'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Jennifer'
  AND t.last_name = 'Lucero'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Stacey', 'Mansell', 'OTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Stacey'
  AND t.last_name = 'Mansell'
  AND t.role = 'OTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Stacey'
  AND t.last_name = 'Mansell'
  AND t.role = 'OTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Nick', 'Mataska', 'PT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Nick'
  AND t.last_name = 'Mataska'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Nick'
  AND t.last_name = 'Mataska'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Nick'
  AND t.last_name = 'Mataska'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Nick'
  AND t.last_name = 'Mataska'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Nick'
  AND t.last_name = 'Mataska'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Terrie', 'Matthews', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Terrie'
  AND t.last_name = 'Matthews'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Terrie'
  AND t.last_name = 'Matthews'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Christine', 'May', 'PT', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  70
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Christine'
  AND t.last_name = 'May'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  70
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Christine'
  AND t.last_name = 'May'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  70
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Christine'
  AND t.last_name = 'May'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  70
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Christine'
  AND t.last_name = 'May'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  10
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Christine'
  AND t.last_name = 'May'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  15
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EXTENDED'
WHERE
  t.first_name = 'Christine'
  AND t.last_name = 'May'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Michele', 'McCollum', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Michele'
  AND t.last_name = 'McCollum'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Michele'
  AND t.last_name = 'McCollum'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Robin', 'McCormack', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Robin'
  AND t.last_name = 'McCormack'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  30
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EXTENDED'
WHERE
  t.first_name = 'Robin'
  AND t.last_name = 'McCormack'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Bryant', 'McNutt', 'PT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  70
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Bryant'
  AND t.last_name = 'McNutt'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Bryant'
  AND t.last_name = 'McNutt'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Bryant'
  AND t.last_name = 'McNutt'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Bryant'
  AND t.last_name = 'McNutt'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Donna', 'Mercer', 'PT', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  68
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Donna'
  AND t.last_name = 'Mercer'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  68
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Donna'
  AND t.last_name = 'Mercer'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  68
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Donna'
  AND t.last_name = 'Mercer'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  68
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Donna'
  AND t.last_name = 'Mercer'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Tom', 'Meyer', 'OT', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Tom'
  AND t.last_name = 'Meyer'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Tom'
  AND t.last_name = 'Meyer'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Tom'
  AND t.last_name = 'Meyer'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Tom'
  AND t.last_name = 'Meyer'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Tom'
  AND t.last_name = 'Meyer'
  AND t.role = 'OT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Larry', 'Mobley', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Larry'
  AND t.last_name = 'Mobley'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Larry'
  AND t.last_name = 'Mobley'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Mathew', 'Molina', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Mathew'
  AND t.last_name = 'Molina'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Mathew'
  AND t.last_name = 'Molina'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Tenisha', 'Montague', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Tenisha'
  AND t.last_name = 'Montague'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Amy', 'Moore', 'PTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  47
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Amy'
  AND t.last_name = 'Moore'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  6
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Amy'
  AND t.last_name = 'Moore'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  20
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EXTENDED'
WHERE
  t.first_name = 'Amy'
  AND t.last_name = 'Moore'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Justin', 'Moore', 'PT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Justin'
  AND t.last_name = 'Moore'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Justin'
  AND t.last_name = 'Moore'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Justin'
  AND t.last_name = 'Moore'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Justin'
  AND t.last_name = 'Moore'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Justin'
  AND t.last_name = 'Moore'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  20
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EXTENDED'
WHERE
  t.first_name = 'Justin'
  AND t.last_name = 'Moore'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Karla', 'Moore', 'ST', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  75
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Karla'
  AND t.last_name = 'Moore'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  75
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Karla'
  AND t.last_name = 'Moore'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  75
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Karla'
  AND t.last_name = 'Moore'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  75
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Karla'
  AND t.last_name = 'Moore'
  AND t.role = 'ST';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Mickey', 'Munoz', 'OTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  35
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Mickey'
  AND t.last_name = 'Munoz'
  AND t.role = 'OTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Mickey'
  AND t.last_name = 'Munoz'
  AND t.role = 'OTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Kellie', 'O''Connor', 'OT', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Kellie'
  AND t.last_name = 'O''Connor'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Kellie'
  AND t.last_name = 'O''Connor'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Kellie'
  AND t.last_name = 'O''Connor'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Kellie'
  AND t.last_name = 'O''Connor'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  15
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Kellie'
  AND t.last_name = 'O''Connor'
  AND t.role = 'OT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Val', 'Parales', 'PT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  95
FROM therapists t
JOIN billing_areas a ON a.area_name = 'New Mexico'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Val'
  AND t.last_name = 'Parales'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  95
FROM therapists t
JOIN billing_areas a ON a.area_name = 'New Mexico'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Val'
  AND t.last_name = 'Parales'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  95
FROM therapists t
JOIN billing_areas a ON a.area_name = 'New Mexico'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Val'
  AND t.last_name = 'Parales'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  95
FROM therapists t
JOIN billing_areas a ON a.area_name = 'New Mexico'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Val'
  AND t.last_name = 'Parales'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'New Mexico'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Val'
  AND t.last_name = 'Parales'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Raeanna', 'Parker', 'OT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Raeanna'
  AND t.last_name = 'Parker'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Raeanna'
  AND t.last_name = 'Parker'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Raeanna'
  AND t.last_name = 'Parker'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Raeanna'
  AND t.last_name = 'Parker'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Raeanna'
  AND t.last_name = 'Parker'
  AND t.role = 'OT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Letty', 'Pehl', 'ST', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  63
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Letty'
  AND t.last_name = 'Pehl'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  63
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Letty'
  AND t.last_name = 'Pehl'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  63
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Letty'
  AND t.last_name = 'Pehl'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  63
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Letty'
  AND t.last_name = 'Pehl'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  2
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Letty'
  AND t.last_name = 'Pehl'
  AND t.role = 'ST';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Britney', 'Pinkerton', 'PTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Britney'
  AND t.last_name = 'Pinkerton'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Britney'
  AND t.last_name = 'Pinkerton'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Amanda', 'Pinkston', 'OT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Amanda'
  AND t.last_name = 'Pinkston'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Amanda'
  AND t.last_name = 'Pinkston'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Amanda'
  AND t.last_name = 'Pinkston'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Amanda'
  AND t.last_name = 'Pinkston'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  75
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EXTENDED'
WHERE
  t.first_name = 'Amanda'
  AND t.last_name = 'Pinkston'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Amanda'
  AND t.last_name = 'Pinkston'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Amanda'
  AND t.last_name = 'Pinkston'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Amanda'
  AND t.last_name = 'Pinkston'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Amanda'
  AND t.last_name = 'Pinkston'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'New Mexico'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Amanda'
  AND t.last_name = 'Pinkston'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'New Mexico'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Amanda'
  AND t.last_name = 'Pinkston'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'New Mexico'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Amanda'
  AND t.last_name = 'Pinkston'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'New Mexico'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Amanda'
  AND t.last_name = 'Pinkston'
  AND t.role = 'OT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Elizabeth', 'Rainbolt', 'OT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Elizabeth'
  AND t.last_name = 'Rainbolt'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Elizabeth'
  AND t.last_name = 'Rainbolt'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Elizabeth'
  AND t.last_name = 'Rainbolt'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Elizabeth'
  AND t.last_name = 'Rainbolt'
  AND t.role = 'OT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Amy', 'Ray', 'ST', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Amy'
  AND t.last_name = 'Ray'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Amy'
  AND t.last_name = 'Ray'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Amy'
  AND t.last_name = 'Ray'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Amy'
  AND t.last_name = 'Ray'
  AND t.role = 'ST';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Danielle', 'Rendon', 'PTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Danielle'
  AND t.last_name = 'Rendon'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Danielle'
  AND t.last_name = 'Rendon'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  15
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EXTENDED'
WHERE
  t.first_name = 'Danielle'
  AND t.last_name = 'Rendon'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Taylor', 'Rendon', 'PT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Taylor'
  AND t.last_name = 'Rendon'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Taylor'
  AND t.last_name = 'Rendon'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Taylor'
  AND t.last_name = 'Rendon'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Taylor'
  AND t.last_name = 'Rendon'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Taylor'
  AND t.last_name = 'Rendon'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Cheryl', 'Rigler', 'OTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  35
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Cheryl'
  AND t.last_name = 'Rigler'
  AND t.role = 'OTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Cheryl'
  AND t.last_name = 'Rigler'
  AND t.role = 'OTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Joy', 'Ritchie', 'ST', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Joy'
  AND t.last_name = 'Ritchie'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  47
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Joy'
  AND t.last_name = 'Ritchie'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  47
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Joy'
  AND t.last_name = 'Ritchie'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  47
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Joy'
  AND t.last_name = 'Ritchie'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Joy'
  AND t.last_name = 'Ritchie'
  AND t.role = 'ST';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  20
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EXTENDED'
WHERE
  t.first_name = 'Joy'
  AND t.last_name = 'Ritchie'
  AND t.role = 'ST';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Natalie', 'Rix', 'OT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Natalie'
  AND t.last_name = 'Rix'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Natalie'
  AND t.last_name = 'Rix'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Natalie'
  AND t.last_name = 'Rix'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Natalie'
  AND t.last_name = 'Rix'
  AND t.role = 'OT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Andrew', 'Roach', 'PTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Andrew'
  AND t.last_name = 'Roach'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Andrew'
  AND t.last_name = 'Roach'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  25
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EXTENDED'
WHERE
  t.first_name = 'Andrew'
  AND t.last_name = 'Roach'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  100
FROM therapists t
JOIN billing_areas a ON a.area_name = 'New Mexico'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Andrew'
  AND t.last_name = 'Roach'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Kim', 'Rose', 'OTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Kim'
  AND t.last_name = 'Rose'
  AND t.role = 'OTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Tiffany', 'Schulte', 'OT', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Tiffany'
  AND t.last_name = 'Schulte'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Tiffany'
  AND t.last_name = 'Schulte'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Tiffany'
  AND t.last_name = 'Schulte'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  65
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Tiffany'
  AND t.last_name = 'Schulte'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Tiffany'
  AND t.last_name = 'Schulte'
  AND t.role = 'OT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Jennifer', 'Seay', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Jennifer'
  AND t.last_name = 'Seay'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Jennifer'
  AND t.last_name = 'Seay'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Cliff', 'Shiller', 'PT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  75
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Cliff'
  AND t.last_name = 'Shiller'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  75
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Cliff'
  AND t.last_name = 'Shiller'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  75
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Cliff'
  AND t.last_name = 'Shiller'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  75
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Cliff'
  AND t.last_name = 'Shiller'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Missy', 'Shipley', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  46
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Missy'
  AND t.last_name = 'Shipley'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Tyler', 'Sikes', 'PT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Tyler'
  AND t.last_name = 'Sikes'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Tyler'
  AND t.last_name = 'Sikes'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Tyler'
  AND t.last_name = 'Sikes'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Tyler'
  AND t.last_name = 'Sikes'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Tyler'
  AND t.last_name = 'Sikes'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Jeanette', 'Silva', 'OTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Jeanette'
  AND t.last_name = 'Silva'
  AND t.role = 'OTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'New Mexico'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Jeanette'
  AND t.last_name = 'Silva'
  AND t.role = 'OTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Tanya', 'Smith', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Tanya'
  AND t.last_name = 'Smith'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Tanya'
  AND t.last_name = 'Smith'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Tish', 'Stovall', 'OT', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Tish'
  AND t.last_name = 'Stovall'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Tish'
  AND t.last_name = 'Stovall'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Tish'
  AND t.last_name = 'Stovall'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Tish'
  AND t.last_name = 'Stovall'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Tish'
  AND t.last_name = 'Stovall'
  AND t.role = 'OT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Jacob', 'Stowe', 'OT', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  75
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Jacob'
  AND t.last_name = 'Stowe'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  75
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Jacob'
  AND t.last_name = 'Stowe'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  75
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Jacob'
  AND t.last_name = 'Stowe'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  75
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Jacob'
  AND t.last_name = 'Stowe'
  AND t.role = 'OT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Tyler', 'Sutton', 'PT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Tyler'
  AND t.last_name = 'Sutton'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Tyler'
  AND t.last_name = 'Sutton'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Tyler'
  AND t.last_name = 'Sutton'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Tyler'
  AND t.last_name = 'Sutton'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Tyler'
  AND t.last_name = 'Sutton'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('David', 'Taylor', 'PTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'David'
  AND t.last_name = 'Taylor'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  25
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EXTENDED'
WHERE
  t.first_name = 'David'
  AND t.last_name = 'Taylor'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Bailey', 'Thiel', 'PT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Bailey'
  AND t.last_name = 'Thiel'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Bailey'
  AND t.last_name = 'Thiel'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Bailey'
  AND t.last_name = 'Thiel'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Bailey'
  AND t.last_name = 'Thiel'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Bailey'
  AND t.last_name = 'Thiel'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Katie Jo', 'Tipton', 'OT', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Katie Jo'
  AND t.last_name = 'Tipton'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Katie Jo'
  AND t.last_name = 'Tipton'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Katie Jo'
  AND t.last_name = 'Tipton'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Katie Jo'
  AND t.last_name = 'Tipton'
  AND t.role = 'OT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Katie Jo'
  AND t.last_name = 'Tipton'
  AND t.role = 'OT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Debbra', 'Torres', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Debbra'
  AND t.last_name = 'Torres'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Debbra'
  AND t.last_name = 'Torres'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Joe', 'Viles', 'PT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Joe'
  AND t.last_name = 'Viles'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Joe'
  AND t.last_name = 'Viles'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Joe'
  AND t.last_name = 'Viles'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Joe'
  AND t.last_name = 'Viles'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  3
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Joe'
  AND t.last_name = 'Viles'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  17
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EXTENDED'
WHERE
  t.first_name = 'Joe'
  AND t.last_name = 'Viles'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Sarah', 'Ward', 'PT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Sarah'
  AND t.last_name = 'Ward'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Sarah'
  AND t.last_name = 'Ward'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  50
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Sarah'
  AND t.last_name = 'Ward'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Sarah'
  AND t.last_name = 'Ward'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Shawna', 'Watts', 'PT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  60
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Shawna'
  AND t.last_name = 'Watts'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Shawna'
  AND t.last_name = 'Watts'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Shawna'
  AND t.last_name = 'Watts'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  55
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Shawna'
  AND t.last_name = 'Watts'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Shawna'
  AND t.last_name = 'Watts'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Faith', 'Weavers', 'PTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Faith'
  AND t.last_name = 'Weavers'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Faith'
  AND t.last_name = 'Weavers'
  AND t.role = 'PTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Jennifer L', 'Westall', 'OTA', 'Amarillo')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  40
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Jennifer L'
  AND t.last_name = 'Westall'
  AND t.role = 'OTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Amarillo'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Jennifer L'
  AND t.last_name = 'Westall'
  AND t.role = 'OTA';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Sarah', 'Wilson', 'PT', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EVAL'
WHERE
  t.first_name = 'Sarah'
  AND t.last_name = 'Wilson'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'RE_EVAL'
WHERE
  t.first_name = 'Sarah'
  AND t.last_name = 'Wilson'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'DISCHARGE'
WHERE
  t.first_name = 'Sarah'
  AND t.last_name = 'Wilson'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Sarah'
  AND t.last_name = 'Wilson'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Sarah'
  AND t.last_name = 'Wilson'
  AND t.role = 'PT';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  20
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'EXTENDED'
WHERE
  t.first_name = 'Sarah'
  AND t.last_name = 'Wilson'
  AND t.role = 'PT';


INSERT INTO therapists (first_name, last_name, role, home_location)
VALUES ('Tara', 'Young', 'PTA', 'Lubbock')
ON CONFLICT DO NOTHING;


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  45
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'VISIT'
WHERE
  t.first_name = 'Tara'
  AND t.last_name = 'Young'
  AND t.role = 'PTA';


INSERT INTO therapist_rates (therapist_id, billing_area_id, visit_type_id, rate)
SELECT
  t.therapist_id,
  a.billing_area_id,
  vt.visit_type_id,
  5
FROM therapists t
JOIN billing_areas a ON a.area_name = 'Lubbock'
JOIN visit_types vt ON vt.visit_code = 'OOT'
WHERE
  t.first_name = 'Tara'
  AND t.last_name = 'Young'
  AND t.role = 'PTA';


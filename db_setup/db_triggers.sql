DROP FUNCTION IF EXISTS increment_user_comments(INT, TEXT);
DROP FUNCTION IF EXISTS get_category_descendant_tree(INT);
DROP FUNCTION IF EXISTS get_category_tree(INT);
DROP FUNCTION IF EXISTS get_category_recursive_properties(INT);
DROP FUNCTION IF EXISTS get_item_category_independent_properties(INT);
DROP FUNCTION IF EXISTS get_item_new_properties_dynamic_cat(INT, INT);
DROP FUNCTION IF EXISTS get_category_change_unused_properties(INT, INT);
DROP FUNCTION IF EXISTS get_category_change_new_properties(INT, INT);
DROP FUNCTION IF EXISTS update_item_category_properties();
DROP TRIGGER IF EXISTS trigger_update_item_category ON item;

-- TRIGGER PROCEDURES AND FUNCTIONS
CREATE OR REPLACE FUNCTION increment_user_comments(_item_id INT, _new_comment TEXT)
RETURNS void AS $$

	UPDATE item
	  SET user_comments = user_comments ||
                        CASE WHEN user_comments = '' THEN ''
                        ELSE '<br>' || E'\n'
                        END
                        || _new_comment
	  WHERE id = _item_id;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_category_descendant_tree(_main_category_id INT)
RETURNS TABLE(id INT, name TEXT) AS $$

	WITH RECURSIVE recur_categories (id, name) AS (
      SELECT category.id, category.name
      FROM category
      WHERE category.id_parent = _main_category_id
      UNION ALL
      SELECT category.id, category.name
      FROM recur_categories, category
      WHERE category.id_parent = recur_categories.id
    )
    SELECT id, name FROM recur_categories;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_category_tree(_main_category_id INT)
RETURNS TABLE(id INT, name TEXT) AS $$

	WITH RECURSIVE recur_categories (id, name, id_parent) AS (
      SELECT category.id, category.name, category.id_parent
      FROM category
      WHERE category.id = _main_category_id
      UNION ALL
      SELECT category.id, category.name, category.id_parent
      FROM recur_categories, category
      WHERE category.id = recur_categories.id_parent
    )

    SELECT id, name FROM recur_categories;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_category_recursive_properties(_main_category_id INT)
RETURNS TABLE(recursive_property_id INT) AS $$

	WITH RECURSIVE recur_categories (id, id_parent) AS (
      SELECT category.id, category.id_parent
      FROM category
      WHERE category.id = _main_category_id
      UNION ALL
      SELECT category.id, category.id_parent
      FROM recur_categories,category
      WHERE category.id = recur_categories.id_parent
    )

    SELECT DISTINCT property_id
    FROM category_property
    WHERE category_id IN (SELECT id FROM recur_categories);

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_item_category_independent_properties(_item_id INT)
RETURNS TABLE(category_independent_property_id INT) AS $$
    DECLARE
		item_category_id INT;
	BEGIN

		SELECT item.category_id
		INTO item_category_id
		FROM item
		WHERE item.id = _item_id;

		RETURN QUERY
		SELECT DISTINCT property_id
		FROM item_property
		WHERE item_id = _item_id AND property_id NOT IN (SELECT * FROM get_category_recursive_properties(item_category_id));
	END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_item_new_properties_dynamic_cat(_item_id INT, _dynamic_category_id INT)
RETURNS TABLE(property_id INT) AS $$

    SELECT * FROM get_item_category_independent_properties(_item_id)
    UNION
    SELECT * FROM get_category_recursive_properties(_dynamic_category_id);

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_category_change_unused_properties(_old_category_id INT, _new_category_id INT)
RETURNS TABLE(unused_property_id INT) AS $$

	SELECT * FROM get_category_recursive_properties(_old_category_id)
	EXCEPT
	SELECT * FROM get_category_recursive_properties(_new_category_id);

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_category_change_new_properties(_old_category_id INT, _new_category_id INT)
RETURNS TABLE(new_property_id INT) AS $$

	SELECT * FROM get_category_recursive_properties(_new_category_id)
	EXCEPT
	SELECT * FROM get_category_recursive_properties(_old_category_id);

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION update_item_category_properties() RETURNS TRIGGER AS $$

BEGIN
		DELETE FROM item_property
			WHERE item_id = NEW.id; --delete unused properties belonging to the old category family
		RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_item_category
BEFORE UPDATE ON item
FOR EACH ROW
EXECUTE PROCEDURE update_item_category_properties();

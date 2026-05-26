--liquibase formatted sql

--changeset rkrisztian:1
--comment Initial changeset for test data for manual testing
INSERT INTO "tree_node" ("id", "name", "content", "parent_id") VALUES
	(1, 'Root node', 'Root node content', NULL),

	(2, '1. Hierarchy test', 'Also for testing node relocation', 1),
	(3, 'Child node 1', 'Child node 1 content', 2),
	(4, 'Child node 2', 'Child node 2 content', 2),
	(5, 'Child node 3', 'Child node 3 content', 2),
	(6, 'Grandchild node 1', 'Grandchild node 1 content', 3),
	(7, 'Grandchild node 2', 'Grandchild node 2 content', 3),
	(8, 'Grandchild node 3', 'Grandchild node 3 content', 3),
	(9, 'Great grandchild', 'Great grandchild content', 6),

	(10, '2. Deepness test', 'Deepness test', 1),
	(11, 'Deep node 01', 'Deep node 01 content', 10),
	(12, 'Deep node 02', 'Deep node 02 content', 11),
	(13, 'Deep node 03', 'Deep node 03 content', 12),
	(14, 'Deep node 04', 'Deep node 04 content', 13),
	(15, 'Deep node 05', 'Deep node 05 content', 14),
	(16, 'Deep node 06', 'Deep node 06 content', 15),
	(17, 'Deep node 07', 'Deep node 07 content', 16),
	(18, 'Deep node 08', 'Deep node 08 content', 17),
	(19, 'Deep node 09', 'Deep node 09 content', 18),
	(20, 'Deep node 10', 'Deep node 10 content', 19),
	(21, 'Deep node 11', 'Deep node 11 content', 20),
	(22, 'Deep node 12', 'Deep node 12 content', 21),
	(23, 'Deep node 13', 'Deep node 13 content', 22),
	(24, 'Deep node 14', 'Deep node 14 content', 23),
	(25, 'Deep node 15', 'Deep node 15 content', 24),
	(26, 'Deep node 16', 'Deep node 16 content', 25),
	(27, 'Deep node 17', 'Deep node 17 content', 26),
	(28, 'Deep node 18', 'Deep node 18 content', 27),
	(29, 'Deep node 19', 'Deep node 19 content', 28),

	(30, '3. Deletion test', 'Deletion test', 1),
	(31, 'To delete 1', 'To delete 1 content', 30),
	(32, 'To delete 2', 'To delete 2 content', 31),
	(33, 'To delete 3', 'To delete 3 content', 31),
	(34, 'To delete 4', 'To delete 4 content', 33),
	(35, 'To delete 5', 'To delete 5 content', 34),
	(36, 'To delete 6', 'To delete 6 content', 34),
	(37, 'To delete 7', 'To delete 7 content', 34),

	(38, '4. Long name test', 'Long name test', 1),
	(39, 'Add depth 1', 'Add depth 1 content', 38),
	(40, 'Add depth 2', 'Add depth 2 content', 39),
	(41, 'Add depth 3', 'Add depth 3 content', 40),
	(42, 'Add depth 4', 'Add depth 4 content', 41),
	(43, 'Add depth 5', 'Add depth 5 content', 42),
	(44, 'This node has a very long name, this node has a very long name', 'Node content', 43),

	(45, '5. Long content test',
		'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
Aenean commodo ligula eget dolor. Aenean massa.
Cum sociis natoque penatibus et magnis dis parturient
montes, nascetur ridiculus mus. Donec quam felis,
ultricies nec, pellentesque eu, pretium quis, sem. Nulla
consequat massa quis enim. Donec pede justo, fringilla
vel, aliquet nec, vulputate eget, arcu. In enim justo,
rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam
dictum felis eu pede mollis pretium. Integer tincidunt.
Cras dapibus. Vivamus elementum semper nisi. Aenean
vulputate eleifend tellus. Aenean leo ligula, porttitor
eu, consequat vitae, eleifend ac, enim. Aliquam lorem
ante, dapibus in, viverra quis, feugiat a, tellus.
Phasellus viverra nulla ut metus varius laoreet. Quisque
rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue.
Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam
rhoncus. Maecenas tempus, tellus eget condimentum rhoncus,
sem quam semper libero, sit amet adipiscing sem neque sed
ipsum. Nam quam nunc, blandit vel, luctus pulvinar,
hendrerit id, lorem. Maecenas nec odio et ante tincidunt
tempus. Donec vitae sapien ut libero venenatis faucibus.
Nullam quis ante. Etiam sit amet orci eget eros faucibus
tincidunt. Duis leo. Sed fringilla mauris sit amet nibh.
Donec sodales sagittis magna. Sed consequat, leo eget
bibendum sodales, augue velit cursus nunc, quis gravida
magna mi a libero. Fusce vulputate eleifend sapien.
Vestibulum purus quam, scelerisque ut, mollis sed, nonummy
id, metus. Nullam accumsan lorem in dui. Cras ultricies mi
eu turpis hendrerit fringilla. Vestibulum ante ipsum
primis in faucibus orci luctus et ultrices posuere cubilia
Curae; In ac dui quis mi consectetuer lacinia. Nam pretium
turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet
nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris.
Integer ante arcu, accumsan a, consectetuer eget, posuere
ut, mauris. Praesent adipiscing. Phasellus ullamcorper
ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat
pretium libero. Cras id dui. Aenean ut'
	, 1),

	(46, '6. Ordering test', 'Ordering test', 1),
	(47, 'Garlic', 'Node content 1', 46),
	(48, 'Pineapple', 'Node content 2', 46),
	(49, 'Apple', 'Node content 3', 46),
	(50, 'Spinach', 'Node content 4', 46),
	(51, 'Carrot', 'Node content 5', 46),
	(52, 'Banana', 'Node content 6', 46),

	(53, '7. Special characters test', '
test&param=1
first%20second
', 1);

SELECT setval('public.tree_node_seq', 54);

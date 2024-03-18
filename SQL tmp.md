___
To code

```SQL
WITH correctassignment AS (
	SELECT DISTINCT programming_assignment_id
	FROM programming_assignment_submissions
	WHERE user_uuid = ${user_uuid}
	AND correct = true
)

SELECT COUNT(*) FROM correctassignment;
```

To terminal

```SQL
WITH correctassignment AS (
	SELECT DISTINCT programming_assignment_id
	FROM programming_assignment_submissions
	WHERE user_uuid = '769c86d3-812a-48ac-ad27-5af983265610'
	AND correct = true
)

SELECT COUNT(*) FROM correctassignment;
```
<?php

require_once __DIR__ . '/../db.php';

class ChannelDataService {
    private $tgStatToken;

    public function __construct($tgStatToken = '0101847a8c43e26ffde4d45ac2566e63') {
        $this->tgStatToken = $tgStatToken;
    }

    /**
     * Основная функция для получения и сохранения данных канала
     *
     * @param int $channel_id ID канала
     * @param int $owner_id ID владельца
     * @return array Результат операции
     */
    public function getAndSaveChannelData(int $channel_id, int $owner_id): array
    {
        if ($channel_id <= 0 || $owner_id <= 0) {
            return [
                'status' => false,
                'error' => 'Bad request',
            ];
        }

        // Получение инфо канала от TGStat
        $channelInfo = $this->getTgStatChannelData($channel_id, 'info');

        // Проверка результата запроса к API
        if (!$channelInfo['status']) {
            return [
                'status' => false,
                'error' => $channelInfo['error'],
                'raw' => $channelInfo['raw'] ?? null,
            ];
        }

        // Сохранение данных в базу
        $channelInfoData = $this->saveChannelInfo($channelInfo['data'], $owner_id);

        // Получение метрик канала от TGStat
        $channelMetrics = $this->getTgStatChannelData($channel_id, 'metrics');

        // Проверка результата запроса к API
        if (!$channelMetrics['status']) {
            return [
                'status' => false,
                'error' => $channelMetrics['error'],
                'raw' => $channelMetrics['raw'] ?? null,
            ];
        }

        // Сохранение данных в базу
        $channelMetricsData =  $this->saveChannelMetrics($channelMetrics['data'], $owner_id);


        // Получение подписчиков канала от TGStat
        $channelFollowers = $this->getTgStatChannelData($channel_id, 'followers', 'hour');

        // Проверка результата запроса к API
        if (!$channelFollowers['status']) {
            return [
                'status' => false,
                'error' => $channelFollowers['error'],
                'raw' => $channelFollowers['raw'] ?? null,
            ];
        }

        // Сохранение данных в базу
        $channelFollowersData =  $this->saveChannelFollowers($channel_id, $channelFollowers['data']);


        // Получение подписчиков канала от TGStat
        $channelViews = $this->getTgStatChannelData($channel_id, 'views', 'day');

        // Проверка результата запроса к API
        if (!$channelViews['status']) {
            return [
                'status' => false,
                'error' => $channelViews['error'],
                'raw' => $channelViews['raw'] ?? null,
            ];
        }

        // Сохранение данных в базу
        $channelViewsData =  $this->saveChannelViews($channel_id, $channelViews['data']);

        // Получение подписчиков канала от TGStat
        $channelPosts = $this->getTgStatChannelData($channel_id, 'posts');

        // Проверка результата запроса к API
        if (!$channelPosts['status']) {
            return [
                'status' => false,
                'error' => $channelPosts['error'],
                'raw' => $channelPosts['raw'] ?? null,
            ];
        }

        // Сохранение данных в базу
        $channelPostsData =  $this->saveChannelPosts($channel_id, $channelPosts['data']);


        return [
            'status' => true,
            'channelInfoData' => $channelInfoData,
            'channelMetricsData' => $channelMetricsData,
            'channelFollowersData' => $channelFollowersData,
            'channelViewsData' => $channelViewsData,
            'channelPostsData' => $channelPostsData
        ];
    }

    /**
     * Функция для обращения к API TGStat
     *
     * @param int $channel_id ID канала для поиска
     * @param string $type Тип запроса: 'info', 'metrics', 'followers
     * @param string|null $group Группировка подписчиков: 'hour' (только для типа 'followers')
     * @return array Массив с данными ответа или ошибкой
     */
    public function getTgStatChannelData(int $channel_id, string $type, ?string $group = null): array
    {
        $channel_info = sprintf('https://api.tgstat.ru/channels/get?token=%s&channelId=%s', urlencode($this->tgStatToken), urlencode($channel_id));
        $channel_metrics = sprintf('https://api.tgstat.ru/channels/stat?token=%s&channelId=%s', urlencode($this->tgStatToken), urlencode($channel_id));
        
        // Формируем URL для подписчиков только если тип 'followers'
        $channel_followers = null;
        if ($type === 'followers' && $group) {
            $now = time();
            $startDate = $now - (24 * 60 * 60); // 1 день назад
            $endDate = $now;
            $channel_followers = sprintf(
                'https://api.tgstat.ru/channels/subscribers?token=%s&channelId=%s&startDate=%d&endDate=%d&group=%s',
                urlencode($this->tgStatToken),
                urlencode($channel_id),
                $startDate,
                $endDate,
                urlencode($group)
            );
        }

        // Формируем URL для просмотров только если тип 'views'
        $channel_views = null;
        if ($type === 'views' && $group) {
            $now = time();
            $startDate = $now - (7 * 24 * 60 * 60); // 7 день назад
            $endDate = $now;
            $channel_views = sprintf(
                'https://api.tgstat.ru/channels/views?token=%s&channelId=%s&startDate=%d&endDate=%d&group=%s',
                urlencode($this->tgStatToken),
                urlencode($channel_id),
                $startDate,
                $endDate,
                urlencode($group)
            );
        }

        $channel_posts = sprintf('https://api.tgstat.ru/channels/posts?token=%s&channelId=%s', urlencode($this->tgStatToken), urlencode($channel_id));


        $urls = [
            'info' => $channel_info,
            'followers' => $channel_followers,
            'metrics' => $channel_metrics,
            'views' => $channel_views,
            'posts' => $channel_posts
        ];

        // Проверяем, что для типа 'followers' указан group
        if ($type === 'followers' && !$group) {
            return [
                'status' => false,
                'error' => 'group parameter is required for followers type',
            ];
        }

        // Проверяем, что для типа 'followers' указан group
        if ($type === 'views' && !$group) {
            return [
                'status' => false,
                'error' => 'group parameter is required for views type',
            ];
        }

        $tg_stat_url = $urls[$type] ?? $channel_info;
        
        // Если URL не найден (например, followers без group), возвращаем ошибку
        if ($tg_stat_url === null) {
            return [
                'status' => false,
                'error' => 'Invalid request type or missing parameters',
            ];
        }

        // Initialize curl
        $ch = curl_init($tg_stat_url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT => 20,
        ]);

        // Execute request
        $resp = curl_exec($ch);
        $curlErr = curl_error($ch);
        $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);

        // Clean up
        curl_close($ch);

        // Check response
        if ($resp === false || $httpCode >= 400) {
            return [
                'status' => false,
                'error' => 'TGStat request failed: ' . ($curlErr ?: ('HTTP ' . $httpCode)),
                'http_code' => $httpCode
            ];
        }

        $payload = json_decode($resp, true);
        if (!is_array($payload) || !isset($payload['status']) || $payload['status'] !== 'ok' || !isset($payload['response'])) {
            return [
                'status' => false,
                'error' => 'Unexpected TGStat response',
                'raw' => $payload,
            ];
        }

        return [
            'status' => true,
            'data' => $payload['response']
        ];
    }

    /**
     * Функция для сохранения данных канала в базу данных
     *
     * @param array $data Данные канала от TGStat
     * @param int $owner_id ID владельца
     * @return array Результат операции
     */
    public function saveChannelInfo(array $data, int $owner_id, array $fields = []): array
    {
        $FIELDS = [
            'channel_id' => [
                'type' => 'int',
                'source' => 'id',
                'required' => true
            ],
            'tg_id' => [
                'type' => 'int',
                'source' => 'tg_id',
                'required' => false
            ],
            'link' => [
                'type' => 'string',
                'source' => 'link',
                'required' => false
            ],
            'peer_type' => [
                'type' => 'string',
                'source' => 'peer_type',
                'required' => false
            ],
            'username' => [
                'type' => 'string',
                'source' => 'username',
                'required' => false
            ],
            'active_usernames' => [
                'type' => 'json',
                'source' => 'active_usernames',
                'required' => false
            ],
            'title' => [
                'type' => 'string',
                'source' => 'title',
                'required' => false
            ],
            'about' => [
                'type' => 'string',
                'source' => 'about',
                'required' => false
            ],
            'category' => [
                'type' => 'string',
                'source' => 'category',
                'required' => false
            ],
            'country' => [
                'type' => 'string',
                'source' => 'country',
                'required' => false
            ],
            'language' => [
                'type' => 'string',
                'source' => 'language',
                'required' => false
            ],
            'image100' => [
                'type' => 'string',
                'source' => 'image100',
                'required' => false
            ],
            'image640' => [
                'type' => 'string',
                'source' => 'image640',
                'required' => false
            ],
            'participants_count' => [
                'type' => 'int',
                'source' => 'participants_count',
                'required' => false
            ],
            'tgstat_restrictions' => [
                'type' => 'json',
                'source' => 'tgstat_restrictions',
                'required' => false
            ],
            'ci_index' => [
                'type' => 'mixed',
                'source' => 'ci_index',
                'required' => false
            ],
            'rkn_verification' => [
                'type' => 'json',
                'source' => 'rkn_verification',
                'required' => false
            ],
            'created_at' => [
                'type' => 'string',
                'source' => 'created_at',
                'required' => false
            ]
        ];

        // Helper getters
        $g = static function(array $arr, string $key, $default = null) {
            return array_key_exists($key, $arr) ? $arr[$key] : $default;
        };

        // Подготавливаем данные на основе конфигурации
        $preparedData = ['owner_id' => $owner_id];

        foreach ($FIELDS as $dbField => $config) {
            $sourceField = $config['source'];
            $fieldType = $config['type'];

            // Получаем значение из исходных данных
            $value = $g($data, $sourceField);

            // Обрабатываем значение в зависимости от типа
            switch ($fieldType) {
                case 'int':
                    $preparedData[$dbField] = (int)$value;
                    break;
                case 'string':
                    $preparedData[$dbField] = (string)$value;
                    break;
                case 'json':
                    $preparedData[$dbField] = is_array($value) ? $value : [];
                    break;
                case 'mixed':
                    $preparedData[$dbField] = $value;
                    break;
                default:
                    $preparedData[$dbField] = $value;
            }

            // если нет username
            if ($preparedData['username'] === '') $preparedData['username'] = basename($preparedData['link']);
        }

        // Если указаны конкретные поля - фильтруем
        if (!empty($fields)) {
            $filteredData = ['owner_id' => $owner_id];

            // Всегда добавляем обязательные поля
            foreach ($FIELDS as $dbField => $config) {
                if ($config['required'] || in_array($dbField, $fields) || $dbField === 'channel_id') {
                    $filteredData[$dbField] = $preparedData[$dbField];
                }
            }
            $preparedData = $filteredData;
        }

        try {
            $pdo = getPdoConnection();

            // Динамическое построение SQL запроса
            $columns = implode(', ', array_keys($preparedData));
            $placeholders = ':' . implode(', :', array_keys($preparedData));

            // Динамическое построение части ON DUPLICATE KEY UPDATE
            $updateParts = [];
            foreach (array_keys($preparedData) as $column) {
                if ($column !== 'channel_id' && $column !== 'owner_id') {
                    $updateParts[] = "{$column} = VALUES({$column})";
                }
            }
            $updateClause = implode(', ', $updateParts);

            $sql = "INSERT INTO channels ({$columns}) 
                VALUES ({$placeholders}) 
                ON DUPLICATE KEY UPDATE {$updateClause}";

            $stmt = $pdo->prepare($sql);

            // Привязка значений с учетом типов из конфигурации
            foreach ($preparedData as $key => $value) {
                $paramType = PDO::PARAM_STR;

                // Определяем тип параметра на основе конфигурации
                if (isset($FIELDS[$key])) {
                    $fieldConfig = $FIELDS[$key];

                    switch ($fieldConfig['type']) {
                        case 'int':
                            $paramType = PDO::PARAM_INT;
                            break;
                        case 'json':
                            $value = json_encode(array_values((array)$value), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                            break;
                        case 'mixed':
                            if ($value === null) {
                                $paramType = PDO::PARAM_NULL;
                            }
                            break;
                    }
                } elseif ($key === 'owner_id') {
                    $paramType = PDO::PARAM_INT;
                }

                $stmt->bindValue(":{$key}", $value, $paramType);
            }

            $stmt->execute();

            // Fetch saved channel data
            $selectStmt = $pdo->prepare('SELECT * FROM channels WHERE channel_id = :channel_id and owner_id = :owner_id');
            $selectStmt->bindValue(':channel_id', $preparedData['channel_id'], PDO::PARAM_INT);
            $selectStmt->bindValue(':owner_id', $owner_id, PDO::PARAM_INT);
            $selectStmt->execute();
            $channelData = $selectStmt->fetch();

            if (!$channelData) {
                return [
                    'status' => false,
                    'error' => 'Failed to retrieve saved channel data',
                ];
            }

            return [
                'status' => true,
                'message' => 'Channel upserted',
                'data' => $channelData,
            ];
        } catch (Throwable $e) {
            return [
                'status' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Функция для сохранения метрик канала в базу данных
     *
     * @param array $data Данные канала от TGStat
     * @param int $owner_id ID владельца
     * @return array Результат операции
     */
    public function saveChannelMetrics(array $data, int $owner_id, array $fields = []): array
    {
        $FIELDS = [
            'channel_id' => [
                'type' => 'int',
                'source' => 'id',
                'required' => true
            ],
            'title' => [
                'type' => 'string',
                'source' => 'title',
                'required' => false
            ],
            'username' => [
                'type' => 'string',
                'source' => 'username',
                'required' => false
            ],
            'peer_type' => [
                'type' => 'string',
                'source' => 'peer_type',
                'required' => false
            ],
            'participants_count' => [
                'type' => 'int',
                'source' => 'participants_count',
                'required' => false
            ],
            'avg_post_reach' => [
                'type' => 'int',
                'source' => 'avg_post_reach',
                'required' => false
            ],
            'adv_post_reach_12h' => [
                'type' => 'int',
                'source' => 'adv_post_reach_12h',
                'required' => false
            ],
            'adv_post_reach_24h' => [
                'type' => 'int',
                'source' => 'adv_post_reach_24h',
                'required' => false
            ],
            'adv_post_reach_48h' => [
                'type' => 'int',
                'source' => 'adv_post_reach_48h',
                'required' => false
            ],
            'err_percent' => [
                'type' => 'int',
                'source' => 'err_percent',
                'required' => false
            ],
            'err24_percent' => [
                'type' => 'int',
                'source' => 'err24_percent',
                'required' => false
            ],
            'er_percent' => [
                'type' => 'int',
                'source' => 'er_percent',
                'required' => false
            ],
            'daily_reach' => [
                'type' => 'int',
                'source' => 'daily_reach',
                'required' => false
            ],
            'ci_index' => [
                'type' => 'int',
                'source' => 'ci_index',
                'required' => false
            ],
            'mentions_count' => [
                'type' => 'int',
                'source' => 'mentions_count',
                'required' => false
            ],
            'forwards_count' => [
                'type' => 'int',
                'source' => 'forwards_count',
                'required' => false
            ],
            'mentioning_channels_count' => [
                'type' => 'int',
                'source' => 'mentioning_channels_count',
                'required' => false
            ],
            'posts_count' => [
                'type' => 'int',
                'source' => 'posts_count',
                'required' => false
            ]
        ];

        // Helper getters
        $g = static function(array $arr, string $key, $default = null) {
            return array_key_exists($key, $arr) ? $arr[$key] : $default;
        };

        // Подготавливаем данные на основе конфигурации
        $preparedData = ['owner_id' => $owner_id];

        foreach ($FIELDS as $dbField => $config) {
            $sourceField = $config['source'];
            $fieldType = $config['type'];

            // Получаем значение из исходных данных
            $value = $g($data, $sourceField);

            // Обрабатываем значение в зависимости от типа
            switch ($fieldType) {
                case 'int':
                    $preparedData[$dbField] = (int)$value;
                    break;
                case 'string':
                    $preparedData[$dbField] = (string)$value;
                    break;
                default:
                    $preparedData[$dbField] = $value;
            }
        }

        // Если указаны конкретные поля - фильтруем
        if (!empty($fields)) {
            $filteredData = ['owner_id' => $owner_id];

            // Всегда добавляем обязательные поля
            foreach ($FIELDS as $dbField => $config) {
                if ($config['required'] || in_array($dbField, $fields) || $dbField === 'channel_id') {
                    $filteredData[$dbField] = $preparedData[$dbField];
                }
            }
            $preparedData = $filteredData;
        }

        try {
            $pdo = getPdoConnection();

            // Динамическое построение SQL запроса
            $columns = implode(', ', array_keys($preparedData));
            $placeholders = ':' . implode(', :', array_keys($preparedData));

            // Динамическое построение части ON DUPLICATE KEY UPDATE
            $updateParts = [];
            foreach (array_keys($preparedData) as $column) {
                if ($column !== 'channel_id' && $column !== 'owner_id') {
                    $updateParts[] = "{$column} = VALUES({$column})";
                }
            }
            $updateClause = implode(', ', $updateParts);

            $sql = "INSERT INTO channel_statistics ({$columns}) 
                VALUES ({$placeholders}) 
                ON DUPLICATE KEY UPDATE {$updateClause}";

            $stmt = $pdo->prepare($sql);

            // Привязка значений с учетом типов из конфигурации
            foreach ($preparedData as $key => $value) {
                $paramType = PDO::PARAM_STR;

                // Определяем тип параметра на основе конфигурации
                if (isset($FIELDS[$key])) {
                    $fieldConfig = $FIELDS[$key];

                    switch ($fieldConfig['type']) {
                        case 'int':
                            $paramType = PDO::PARAM_INT;
                            break;
                    }
                } elseif ($key === 'owner_id') {
                    $paramType = PDO::PARAM_INT;
                }

                $stmt->bindValue(":{$key}", $value, $paramType);
            }

            $stmt->execute();

            // Fetch saved channel data
            $selectStmt = $pdo->prepare('SELECT * FROM channel_statistics WHERE channel_id = :channel_id and owner_id = :owner_id');
            $selectStmt->bindValue(':channel_id', $preparedData['channel_id'], PDO::PARAM_INT);
            $selectStmt->bindValue(':owner_id', $owner_id, PDO::PARAM_INT);
            $selectStmt->execute();
            $channelData = $selectStmt->fetch();

            if (!$channelData) {
                return [
                    'status' => false,
                    'error' => 'Failed to retrieve saved channel data',
                ];
            }

            return [
                'status' => true,
                'message' => 'Channel metrics added',
                'data' => $channelData,
            ];
        } catch (Throwable $e) {
            return [
                'status' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Функция для сохранения данных подписчиков канала в базу данных
     *
     * @param int $channel_id ID канала
     * @param array $data Массив данных с period и participants_count
     * @param string $type Тип данных (по умолчанию 'hour')
     * @return array Результат операции
     */
    public function saveChannelFollowers(int $channel_id, array $data, string $type = 'hour'): array
    {
        if ($channel_id <= 0) {
            return [
                'status' => false,
                'error' => 'Bad request',
            ];
        }

        if (empty($data) || !is_array($data)) {
            return [
                'status' => false,
                'error' => 'data must be a non-empty array',
            ];
        }

        // Валидация данных
        $validatedData = [];
        foreach ($data as $item) {
            if (!is_array($item)) {
                continue;
            }

            $period = $item['period'] ?? null;
            $participantsCount = $item['participants_count'] ?? null;

            if ($period && $participantsCount !== null) {
                // Проверяем формат даты: YYYY-MM-DD или YYYY-MM-DD HH:MM
                if (preg_match('/^\d{4}-\d{2}-\d{2}(\s+\d{2}:\d{2})?$/', $period)) {
                    $validatedData[] = [
                        'period' => $period,
                        'participants_count' => (int)$participantsCount,
                    ];
                }
            }
        }

        if (empty($validatedData)) {
            return [
                'status' => false,
                'error' => 'No valid data to save',
            ];
        }

        try {
            $pdo = getPdoConnection();

            // Подготавливаем JSON данные
            $jsonData = json_encode($validatedData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

            // SQL запрос для вставки данных
            $sql = "INSERT INTO channels_folowers (channel_id, type, followers) 
                    VALUES (:channel_id, :type, :data)";

            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':channel_id', $channel_id, PDO::PARAM_INT);
            $stmt->bindValue(':type', $type, PDO::PARAM_STR);
            $stmt->bindValue(':data', $jsonData, PDO::PARAM_STR);
            $stmt->execute();

            // Получаем сохраненную запись
            $insertId = (int)$pdo->lastInsertId();
            $selectStmt = $pdo->prepare('SELECT * FROM channels_folowers WHERE id = :id');
            $selectStmt->bindValue(':id', $insertId, PDO::PARAM_INT);
            $selectStmt->execute();
            $savedData = $selectStmt->fetch(PDO::FETCH_ASSOC);

            if (!$savedData) {
                return [
                    'status' => false,
                    'error' => 'Failed to retrieve saved data',
                ];
            }

            return [
                'status' => true,
                'message' => 'Channel followers data saved successfully',
                'data' => $savedData,
            ];
        } catch (Throwable $e) {
            return [
                'status' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Функция для сохранения данных подписчиков канала в базу данных
     *
     * @param int $channel_id ID канала
     * @param array $data Массив данных с period и participants_count
     * @param string $type Тип данных (по умолчанию 'hour')
     * @return array Результат операции
     */
    public function saveChannelViews(int $channel_id, array $data, string $type = 'day'): array
    {
        if ($channel_id <= 0) {
            return [
                'status' => false,
                'error' => 'Bad request',
            ];
        }

        if (empty($data) || !is_array($data)) {
            return [
                'status' => false,
                'error' => 'data must be a non-empty array',
            ];
        }

        // Валидация данных
        $validatedData = [];
        foreach ($data as $item) {
            if (!is_array($item)) {
                continue;
            }

            $period = $item['period'] ?? null;
            $pviews = $item['views_count'] ?? null;

            if ($period && $pviews !== null) {
                // Проверяем формат даты: YYYY-MM-DD или YYYY-MM-DD HH:MM
                if (preg_match('/^\d{4}-\d{2}-\d{2}(\s+\d{2}:\d{2})?$/', $period)) {
                    $validatedData[] = [
                        'period' => $period,
                        'views_count' => (int)$pviews,
                    ];
                }
            }
        }

        if (empty($validatedData)) {
            return [
                'status' => false,
                'error' => 'No valid data to save',
            ];
        }

        try {
            $pdo = getPdoConnection();

            // Подготавливаем JSON данные
            $jsonData = json_encode($validatedData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

            // SQL запрос для вставки данных
            $sql = "INSERT INTO channels_views (channel_id, type, views) 
                    VALUES (:channel_id, :type, :data)";

            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':channel_id', $channel_id, PDO::PARAM_INT);
            $stmt->bindValue(':type', $type, PDO::PARAM_STR);
            $stmt->bindValue(':data', $jsonData, PDO::PARAM_STR);
            $stmt->execute();

            // Получаем сохраненную запись
            $insertId = (int)$pdo->lastInsertId();
            $selectStmt = $pdo->prepare('SELECT * FROM channels_views WHERE id = :id');
            $selectStmt->bindValue(':id', $insertId, PDO::PARAM_INT);
            $selectStmt->execute();
            $savedData = $selectStmt->fetch(PDO::FETCH_ASSOC);

            if (!$savedData) {
                return [
                    'status' => false,
                    'error' => 'Failed to retrieve saved data',
                ];
            }

            return [
                'status' => true,
                'message' => 'Channel views data saved successfully',
                'data' => $savedData,
            ];
        } catch (Throwable $e) {
            return [
                'status' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Функция для сохранения данных подписчиков канала в базу данных
     *
     * @param int $channel_id ID канала
     * @param array $data Массив данных с period и participants_count
     * @return array Результат операции
     */
    public function saveChannelPosts(int $channel_id, array $data): array
    {
        if ($channel_id <= 0) {
            return [
                'status' => false,
                'error' => 'Bad request',
            ];
        }

        if (empty($data) || !is_array($data['items'])) {
            return [
                'status' => false,
                'error' => 'data must be a non-empty array',
            ];
        }

        try {
            $pdo = getPdoConnection();

            // Подготавливаем JSON данные
            $jsonData = json_encode($data['items'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

            // SQL запрос для вставки данных
            $sql = "INSERT INTO channels_posts (channel_id, posts) 
                    VALUES (:channel_id, :data)";

            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':channel_id', $channel_id, PDO::PARAM_INT);
            $stmt->bindValue(':data', $jsonData, PDO::PARAM_STR);
            $stmt->execute();

            // Получаем сохраненную запись
            $insertId = (int)$pdo->lastInsertId();
            $selectStmt = $pdo->prepare('SELECT * FROM channels_posts WHERE id = :id');
            $selectStmt->bindValue(':id', $insertId, PDO::PARAM_INT);
            $selectStmt->execute();
            $savedData = $selectStmt->fetch(PDO::FETCH_ASSOC);

            if (!$savedData) {
                return [
                    'status' => false,
                    'error' => 'Failed to retrieve saved data',
                ];
            }

            return [
                'status' => true,
                'message' => 'Channel views data saved successfully',
                'data' => $savedData,
            ];
        } catch (Throwable $e) {
            return [
                'status' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}


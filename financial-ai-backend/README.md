# Financial AI Backend 開發規範

## 專案架構說明

### 目錄結構與職責

#### config
- 用途：配置類目錄，存放 Spring Boot 的全局配置
- 規範：
- 所有配置類以 `Config` 結尾，如 `SecurityConfig`
- 需加上適當的配置註解，如 `@Configuration`


#### Controller
- 用途：控制器層，處理 HTTP 請求，定義 API 接口
- 規範：
- 類名以 `Controller` 結尾
- 必須添加 `@RestController` 註解
- API 路徑需遵循 RESTFul 設計原
- 統一使用 ResponseEntity 封装響應數據

#### Dao
- 用途：自定義數據訪問層，執行原生 SQL 或 JDBC 操作
- 規範：
- 類名以 `Dao` 結尾
- SQL 語句需使用常量定義，便於維護
- 接口類以 `Dao` 結尾
- 實現類以 `DaoImpl` 結尾


#### Entity
- 用途：JPA 實體類，定義資料庫表映射
- 規範：
- 類名與資料表名對應
- 必須包含 ID 欄位作為主鍵
- 所有欄位添加合適的 JPA 註解
- 實現序列化接口
- 使用 Lombok 簡化程式碼

#### Enums
- 用途：存放枚舉類，定義固定常量
- 規範：
- 類名以具體用途命名，如 `StatusEnum`
- 提供從代碼轉換為描述的方法

#### Repository
- 用途：Spring Data JPA 數據訪問層
- 規範：
- 接口名以 `Repository` 結尾
- 繼承 JpaRepository
- 自定義查詢方法遵循命名規範

#### Dto
- 用途：API 請求的 DTO 類 （數據傳輸類）
- 規範：
- 類名以 `Request` 或 `Response` 結尾
- 添加參數驗證註解

#### Bl
- 用途：業務邏輯層
- 規範：
- 接口類以 `Bl` 結尾
- 統一的異常處理
- 關鍵方法需添加日誌

#### Utils
- 用途：通用工具類
- 規範：
- 類名以 `Utils` 結尾
- 工具方法使用 static 修飾
- 完整的方法註解
- 異常處理與日誌記錄

#### 程式碼風格
- 類、方法、變量採用有意義的命名
- 保持適當的註解比例
- 避免魔法數字，使用常量定義





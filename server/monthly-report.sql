-- Install after database.sql. Captures inventory from installation onward.
CREATE TABLE IF NOT EXISTS inventory_baselines (
  productId VARCHAR(100) PRIMARY KEY,
  quantity INT NOT NULL,
  capturedAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);
-- statement-break
CREATE TABLE IF NOT EXISTS inventory_movements (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  productId VARCHAR(100) NOT NULL,
  delta INT NOT NULL,
  occurredAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  INDEX idx_inventory_product_date (productId, occurredAt)
);
-- statement-break
CREATE TRIGGER report_stock_update AFTER UPDATE ON products FOR EACH ROW
INSERT INTO inventory_movements (productId, delta)
SELECT NEW.id, COALESCE(NEW.stock, 0) - COALESCE(OLD.stock, 0)
WHERE COALESCE(NEW.stock, 0) != COALESCE(OLD.stock, 0);
-- statement-break
CREATE TRIGGER report_stock_insert AFTER INSERT ON products FOR EACH ROW
INSERT IGNORE INTO inventory_baselines (productId, quantity) VALUES (NEW.id, COALESCE(NEW.stock, 0));
-- statement-break
INSERT IGNORE INTO inventory_baselines (productId, quantity) SELECT id, COALESCE(stock, 0) FROM products;
-- statement-break
CREATE TABLE IF NOT EXISTS monthly_inventory_openings (
  month CHAR(7) NOT NULL,
  productId VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  note VARCHAR(255) NOT NULL,
  updatedBy INT NULL,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (month, productId)
);

/**
 * Script: update-product-images.js
 * Cập nhật ảnh sản phẩm trong MySQL — mỗi sản phẩm ảnh unique, đúng danh mục
 */

require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

const IMAGE_POOLS = {
  laptop: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1611186871525-d91b8e007c6e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1504707748692-419802cf939d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1544099858-75a7b1b60ab2?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555617981-dac3772ef3c2?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1574155376612-bfa4ed8aabfd?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1640161704729-cbe966a08476?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1566296440929-a5e0b8dc7b38?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1546302915-a2a86fb6f02c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555617748-45abb7be4e2a?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1536148935331-408321065b18?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1455945609732-5a6e62dbccc5?auto=format&fit=crop&w=800&q=85',
  ],
  'gaming-pc': [
    'https://images.unsplash.com/photo-1587202372583-49330a15584d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1616711906333-870826ae33e5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1601314167099-232775b3d6fd?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1560089000-7433a4ebbd64?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1574197443271-df23cad2f21b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1594842208736-f6b0edbbf0f3?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1619788429396-7b66e47c10c6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555618565-72523b773df2?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1606318313647-13e6c5bc8a5a?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1542144582-1ba00456b5e3?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1548690596-f1722c190938?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1589803571775-dc375714c8d6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1627386900767-37c0c90e5f6d?auto=format&fit=crop&w=800&q=85',
  ],
  'office-pc': [
    'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1589752015014-58f0b82891b5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1455894127589-22f75500213a?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1591799265444-d66432b91588?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1537498425277-c283d32ef9db?auto=format&fit=crop&w=800&q=85',
  ],
  cpu: [
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1546953304-5d96f43c2e94?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1547560882-b9bde26e5484?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1511839686938-a5afe1b6c8d5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1606318313647-13e6c5bc8a5a?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1624571409009-9c0cfb6b90b4?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1616711906333-870826ae33e5?auto=format&fit=crop&w=800&q=85',
  ],
  gpu: [
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600348712270-5af9e3590b42?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1624571409009-9c0cfb6b90b4?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1616711906333-870826ae33e5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1569396116180-210c182bedb8?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1605134513573-384dcf99a44c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1559032604-def9efef00bb?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1628815113969-0487917e8b76?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=85',
  ],
  ram: [
    'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1543966888-7c1dc482a810?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1546953304-5d96f43c2e94?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1547560882-b9bde26e5484?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1606318313647-13e6c5bc8a5a?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600348712270-5af9e3590b42?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1624571409009-9c0cfb6b90b4?auto=format&fit=crop&w=800&q=85',
  ],
  ssd: [
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1511839686938-a5afe1b6c8d5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1543966888-7c1dc482a810?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1546953304-5d96f43c2e94?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1547560882-b9bde26e5484?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1606318313647-13e6c5bc8a5a?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1624571409009-9c0cfb6b90b4?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1627386900767-37c0c90e5f6d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1612201143263-e96bd7fbe9a8?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600348712270-5af9e3590b42?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=85',
  ],
  monitor: [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593642532781-03e79bf5bec2?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555617748-45abb7be4e2a?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1536148935331-408321065b18?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1612201143263-e96bd7fbe9a8?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1617471346061-5d329ab9c574?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1601049676869-702ea24cfd58?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1484704324500-528d0ae4dc7d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1615551043360-33de8b5f410c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1617375739345-b6c26c0ccde4?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1543966888-7c1dc482a810?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1608022702099-8c3e1a9d5ce7?auto=format&fit=crop&w=800&q=85',
  ],
  keyboard: [
    'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1570534735197-3e12bce21aba?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1529312419855-704f6fc6c8f2?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1642683078226-8fe5f9f0f1e8?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1584829678-09c10614e6c7?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593152167544-085d3b9c4938?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1548680551-1718b0869a38?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1494435223942-fc07b3a08c1d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1636225898622-3a3deda88c34?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=85',
  ],
  mouse: [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1629429407759-01cd490cadd6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1623520853802-47fe07a8cef0?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1634979149798-e9a118734e93?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1609840113373-5b8b56ded73c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600348712270-5af9e3590b42?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=85',
  ],
  headset: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1585298723682-7115561c51b7?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600086827875-a63b01f1335c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=85',
  ],
  mainboard: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1571737026956-55d45d83d9ff?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1568585219565-3c9f5ee05de7?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1499374412-af3e98b0b4a7?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1591799265444-d66432b91588?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1547560882-b9bde26e5484?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1546953304-5d96f43c2e94?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1543966888-7c1dc482a810?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1624571409009-9c0cfb6b90b4?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1606318313647-13e6c5bc8a5a?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1619785292559-a15caa28bde4?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=85',
  ],
  psu: [
    'https://images.unsplash.com/photo-1602526212974-d1a473bf4f69?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600348712270-5af9e3590b42?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1543966888-7c1dc482a810?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1546953304-5d96f43c2e94?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1619785292559-a15caa28bde4?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1616711906333-870826ae33e5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1571737026956-55d45d83d9ff?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1574197443271-df23cad2f21b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1580740128433-f86e6a2a1a7c?auto=format&fit=crop&w=800&q=85',
  ],
  case: [
    'https://images.unsplash.com/photo-1548690596-f1722c190938?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587202372583-49330a15584d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1619785292559-a15caa28bde4?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1616711906333-870826ae33e5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1601314167099-232775b3d6fd?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1560089000-7433a4ebbd64?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1574197443271-df23cad2f21b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1594842208736-f6b0edbbf0f3?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1589803571775-dc375714c8d6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1542144582-1ba00456b5e3?auto=format&fit=crop&w=800&q=85',
  ],
  cooling: [
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1568585219565-3c9f5ee05de7?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1569396116180-210c182bedb8?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1580740128433-f86e6a2a1a7c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1617471346061-5d329ab9c574?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1559032604-def9efef00bb?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1602526214648-e8c3dfcbad2d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1616711906333-870826ae33e5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1620120966883-d977b57a96ec?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1594842208736-f6b0edbbf0f3?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1627386900767-37c0c90e5f6d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1615551043360-33de8b5f410c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600348712270-5af9e3590b42?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1543966888-7c1dc482a810?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1619788429396-7b66e47c10c6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555618565-72523b773df2?auto=format&fit=crop&w=800&q=85',
  ],
  apple: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1611186871525-d91b8e007c6e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1606107537532-ff23f3ec6cf7?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1628815113969-0487917e8b76?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1575695342520-46e84a92609c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1468436385273-8abca6dfd8d3?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1507822334025-d8f70fe2a3fd?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=85',
  ],
  accessories: [
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1596989985452-d30f7e2c72ab?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1630789002997-5fc4de07dab1?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1534802046520-4f27db7f3ae5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1535380440168-4a7cfd91a91c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1594759845218-8afb4e5f8d95?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1622980713968-38b74d365e7f?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1612539465154-a1d4fd096df5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1608022702099-8c3e1a9d5ce7?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1534534573898-db5148bc8b0c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1510136952726-b86bbf313a14?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1619519358649-42e3d67fcfed?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1510511233900-1982d92bd835?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1612612219264-00a3dfda4e17?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1563520239648-5a09b069c263?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?auto=format&fit=crop&w=800&q=85',
  ],
};

// Default fallback
IMAGE_POOLS.default = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1504707748692-419802cf939d?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=800&q=85',
];

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'maytinh',
  });

  console.log('Connected to MySQL!');

  const [products] = await conn.execute('SELECT id, name, category_id FROM products ORDER BY category_id, id');
  console.log(`Total products: ${products.length}`);

  const usedImages = new Set();
  const categoryCounters = {};
  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const cat = (product.category_id || 'default').toLowerCase().replace(/[^a-z-]/g, '');
    const pool = IMAGE_POOLS[cat] || IMAGE_POOLS.default;

    if (!categoryCounters[cat]) categoryCounters[cat] = 0;

    let selectedImage = null;
    const startIdx = categoryCounters[cat];

    for (let i = 0; i < pool.length; i++) {
      const idx = (startIdx + i) % pool.length;
      const candidate = pool[idx];
      if (!usedImages.has(candidate)) {
        selectedImage = candidate;
        categoryCounters[cat] = (idx + 1) % pool.length;
        break;
      }
    }

    if (!selectedImage) {
      const baseImg = pool[categoryCounters[cat] % pool.length];
      // Add unique query param to avoid duplicate URL
      selectedImage = `${baseImg}&uid=${product.id}`;
      categoryCounters[cat] = (categoryCounters[cat] + 1) % pool.length;
    }

    usedImages.add(selectedImage);

    try {
      await conn.execute('UPDATE products SET image = ? WHERE id = ?', [selectedImage, product.id]);
      updated++;
      if (updated % 20 === 0) console.log(`  Updated ${updated}/${products.length}...`);
    } catch (err) {
      console.error(`Error updating ${product.id}:`, err.message);
      skipped++;
    }
  }

  await conn.end();
  console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}, Unique images: ${usedImages.size}`);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});

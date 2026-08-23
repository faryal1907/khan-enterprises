import { PrismaService } from "../prisma/prisma.service";

/**
 * Generate sequential order number in format: PREFIX-YYYYMMDDXXXX
 * Uses SystemSetting to track daily sequence counter
 * @param prefix - Order type prefix (e.g., "ORD" for bikes, "PART" for parts)
 * @param prisma - PrismaService instance for database access
 * @returns Object with orderNumber and sequence (sequence should be saved after successful transaction)
 */
export async function generateSequentialOrderNumber(
  prefix: string,
  prisma: PrismaService
): Promise<{ orderNumber: string; sequence: number }> {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  const sequenceKey = `ORDER_SEQUENCE_${dateStr}`;

  // Use system setting as primary source for performance
  let sequence = 1;
  const setting = await prisma.client.systemSetting.findUnique({
    where: { key: sequenceKey }
  });

  if (setting) {
    const currentSequence = parseInt(setting.value, 10);
    // Only validate if sequence seems unreasonably high (more than 100 orders today)
    if (currentSequence > 100) {
      // Validate by checking if order actually exists
      const existingOrder = await prisma.client.order.findFirst({
        where: {
          orderNumber: {
            endsWith: currentSequence.toString().padStart(4, '0')
          }
        }
      });
      if (!existingOrder) {
        // Reset to 1 if no order exists with this sequence
        sequence = 1;
      } else {
        sequence = currentSequence + 1;
      }
    } else {
      sequence = currentSequence + 1;
    }
  }

  // Pad sequence to at least 4 digits (e.g., 1 -> 0001, 12 -> 0012, 12345 -> 12345)
  const paddedSequence = sequence.toString().padStart(4, '0');
  return { orderNumber: `${prefix}-${dateStr}${paddedSequence}`, sequence };
}

/**
 * @deprecated Use generateSequentialOrderNumber instead
 * Generate order number in format: ORD-YYYYMMDD-XXXXXX
 * @returns Order number string
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${dateStr}-${randomStr}`;
}

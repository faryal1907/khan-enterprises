import { PrismaService } from "../prisma/prisma.service";

/**
 * Generate sequential order number in format: PREFIX-YYYYMMDDXXXX
 * Uses SystemSetting to track daily sequence counter
 * @param prefix - Order type prefix (e.g., "ORD" for bikes, "PART" for parts)
 * @param prisma - PrismaService instance for database access
 * @returns Sequential order number string
 */
export async function generateSequentialOrderNumber(
  prefix: string,
  prisma: PrismaService
): Promise<string> {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  const sequenceKey = `ORDER_SEQUENCE_${dateStr}`;

  // Use transaction to ensure atomic read-increment-update
  const result = await prisma.client.$transaction(async (tx) => {
    // Get all orders for today to find the actual highest sequence
    const todayOrders = await tx.order.findMany({
      where: {
        orderNumber: {
          startsWith: `${prefix}-${dateStr}`
        }
      },
      select: {
        orderNumber: true
      }
    });

    // Extract sequence numbers from existing orders
    const existingSequences = todayOrders
      .map(order => {
        const match = order.orderNumber.match(new RegExp(`${prefix}-${dateStr}(\\d+)$`));
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(seq => seq > 0);

    // Find the highest existing sequence
    const highestSequence = existingSequences.length > 0 ? Math.max(...existingSequences) : 0;

    // Next sequence is highest + 1
    const sequence = highestSequence + 1;

    // Update the system setting with the new sequence
    await tx.systemSetting.upsert({
      where: { key: sequenceKey },
      create: {
        key: sequenceKey,
        value: sequence.toString()
      },
      update: {
        value: sequence.toString()
      }
    });

    return sequence;
  });

  // Pad sequence to at least 4 digits (e.g., 1 -> 0001, 12 -> 0012, 12345 -> 12345)
  const paddedSequence = result.toString().padStart(4, '0');
  return `${prefix}-${dateStr}${paddedSequence}`;
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

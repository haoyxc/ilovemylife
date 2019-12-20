import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;


public class DiffMapper extends Mapper<LongWritable, Text, Text,Text>
{
	public void map(LongWritable key, Text value,Context context)  throws IOException,InterruptedException
	{
		String line = value.toString();
		String[] parts = line.split("\t");
		String[] dataParts = parts[1].split(";");
		String ranks = dataParts[0];
		
		context.write(new Text(parts[0]),new Text(ranks));	
	}
}